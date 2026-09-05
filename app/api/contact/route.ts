import { Resend } from "resend";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { translations } from "@/lib/translations";

const EMAIL_RE = /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;

/** Sallitut palveluvalinnat johdetaan käännöksistä, jotta lista pysyy lomakkeen mukana. */
const ALLOWED_SERVICES = new Set<string>(
  (["fi", "pt-br"] as const).flatMap((locale) => {
    const c = translations[locale].contact;
    return [c.option1, c.option2, c.option3, c.option4];
  })
);

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;

/**
 * Ensisijainen lähetysraja: Upstash Redis. Pitää laskurin yli serverless-instanssien,
 * joten raja on oikeasti sitova. Käytössä vain jos ympäristömuuttujat on asetettu.
 */
const upstashRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(RATE_MAX, "1 h"),
        prefix: "contact-form",
      })
    : null;

/**
 * Varajärjestelmä ilman Upstashia (paikallinen kehitys). Muistinvarainen laskuri
 * nollaantuu instanssin vaihtuessa, eli hidaste eikä sitova raja.
 */
const hits = new Map<string, number[]>();

function isRateLimitedInMemory(ip: string) {
  const now = Date.now();

  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.set(ip, recent);

  if (recent.length >= RATE_MAX) return true;

  recent.push(now);
  return false;
}

async function isRateLimited(ip: string) {
  if (!upstashRatelimit) return isRateLimitedInMemory(ip);

  try {
    const { success } = await upstashRatelimit.limit(ip);
    return !success;
  } catch (err) {
    // Redis pois pelistä: älä kaada lomaketta, mutta älä myöskään jätä rajaa pois.
    console.error("[contact] Upstash-virhe, käytetään muistinvaraista rajaa:", err);
    return isRateLimitedInMemory(ip);
  }
}

/** Selain lähettää Origin-headerin POST-pyynnöissä; curl ei oletuksena. Väärennettävissä. */
function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const recipient = process.env.CONTACT_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!recipient || !apiKey) {
    console.error(
      "[contact] Puuttuva ympäristömuuttuja: CONTACT_EMAIL ja/tai RESEND_API_KEY on asetettava."
    );
    return NextResponse.json(
      { error: "Lomake ei ole juuri nyt käytössä. Ota yhteyttä sähköpostitse." },
      { status: 503 }
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Virheellinen pyyntö." }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Liikaa yhteydenottoja. Yritä myöhemmin uudelleen." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Virheellinen pyyntö." }, { status: 400 });
  }

  const { name, email, service, message, company } = body as Record<string, unknown>;

  if (typeof company === "string" && company.trim()) {
    return NextResponse.json({ success: true });
  }

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !EMAIL_RE.test(email) ||
    typeof message !== "string" || !message.trim()
  ) {
    return NextResponse.json({ error: "Pakolliset kentät puuttuvat tai virheellisiä." }, { status: 400 });
  }

  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Kenttä ylittää sallitun pituuden." }, { status: 400 });
  }

  // Otsikkoriville päätyvät arvot: rivinvaihdot pois, ja palvelu vain sallituista vaihtoehdoista.
  const cleanName = name.trim().replace(/[\r\n]+/g, " ");
  const serviceStr =
    typeof service === "string" && ALLOWED_SERVICES.has(service) ? service : "Yleinen";

  // Resend-client luodaan vasta tässä: sen konstruktori heittää poikkeuksen ilman
  // avainta, ja moduulitasolla se kaataisi koko reitin ennen 503-tarkistusta.
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Yhteydenottolomake <onboarding@resend.dev>",
    to: recipient,
    replyTo: email,
    subject: `Yhteydenotto: ${serviceStr} — ${cleanName}`,
    text: `Nimi: ${cleanName}\nSähköposti: ${email}\nPalvelu: ${serviceStr}\n\n${message.trim()}`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ error: "Lähetys epäonnistui. Yritä myöhemmin uudelleen." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { translations } from "@/lib/translations";

const { sendMock, limitMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  limitMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: vi.fn(function () {
    return { emails: { send: sendMock } };
  }),
}));

vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: vi.fn(() => ({})) },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(
    vi.fn(function () {
      return { limit: limitMock };
    }),
    { slidingWindow: vi.fn(() => "sliding-window") }
  ),
}));

const VALID_BODY = {
  name: "Testi Testaaja",
  email: "testi@example.com",
  service: translations.fi.contact.option3, // "Tulkkaus"
  message: "Tarvitsen käännöksen.",
};

type RequestOptions = {
  origin?: string | null;
  host?: string | null;
  ip?: string | null;
  invalidJson?: boolean;
};

/**
 * Kevyt Request-tuplaus. Oikeaa Request-oliota ei voi käyttää, koska fetch-spesifikaatio
 * kieltää Host-headerin asettamisen — ja juuri sitä same-origin-tarkistus vertaa.
 */
function makeRequest(body: unknown, options: RequestOptions = {}) {
  const {
    origin = "https://kaannos.example",
    host = "kaannos.example",
    ip = "203.0.113.10",
    invalidJson = false,
  } = options;

  const headers = new Map<string, string>();
  if (origin) headers.set("origin", origin);
  if (host) headers.set("host", host);
  if (ip) headers.set("x-forwarded-for", ip);

  return {
    headers: { get: (key: string) => headers.get(key.toLowerCase()) ?? null },
    json: async () => {
      if (invalidJson) throw new SyntaxError("Unexpected token");
      return body;
    },
  } as unknown as Request;
}

/** Reitti luetaan uudestaan joka testissä, jotta muistinvarainen laskuri ei vuoda testien välillä. */
async function loadRoute() {
  vi.resetModules();
  const mod = await import("@/app/api/contact/route");
  return mod.POST;
}

beforeEach(() => {
  vi.clearAllMocks();
  sendMock.mockResolvedValue({ error: null });
  limitMock.mockResolvedValue({ success: true });

  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("CONTACT_EMAIL", "vastaanottaja@example.com");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("ympäristömuuttujat", () => {
  it("vastaa 503 jos CONTACT_EMAIL puuttuu", async () => {
    vi.stubEnv("CONTACT_EMAIL", "");
    const POST = await loadRoute();

    const res = await POST(makeRequest(VALID_BODY));

    expect(res.status).toBe(503);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("vastaa 503 jos RESEND_API_KEY puuttuu", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const POST = await loadRoute();

    const res = await POST(makeRequest(VALID_BODY));

    expect(res.status).toBe(503);
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe("same-origin-tarkistus", () => {
  it("estää pyynnön ilman Origin-headeria", async () => {
    const POST = await loadRoute();

    const res = await POST(makeRequest(VALID_BODY, { origin: null }));

    expect(res.status).toBe(403);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("estää pyynnön vieraasta originista", async () => {
    const POST = await loadRoute();

    const res = await POST(makeRequest(VALID_BODY, { origin: "https://hyokkaaja.example" }));

    expect(res.status).toBe(403);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("päästää läpi kun origin vastaa hostia", async () => {
    const POST = await loadRoute();

    const res = await POST(makeRequest(VALID_BODY));

    expect(res.status).toBe(200);
  });
});

describe("syötteen validointi", () => {
  it("vastaa 400 rikkinäiselle JSONille", async () => {
    const POST = await loadRoute();

    const res = await POST(makeRequest(null, { invalidJson: true }));

    expect(res.status).toBe(400);
  });

  it("vastaa 400 kun pakollinen kenttä puuttuu", async () => {
    const POST = await loadRoute();

    const res = await POST(makeRequest({ ...VALID_BODY, message: "   " }));

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("vastaa 400 virheelliselle sähköpostiosoitteelle", async () => {
    const POST = await loadRoute();

    const res = await POST(makeRequest({ ...VALID_BODY, email: "ei-sahkoposti" }));

    expect(res.status).toBe(400);
  });

  it("torjuu sähköpostiosoitteen jossa on rivinvaihto (header-injektio)", async () => {
    const POST = await loadRoute();

    const res = await POST(
      makeRequest({ ...VALID_BODY, email: "testi@example.com\r\nBcc: uhri@example.com" })
    );

    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("vastaa 400 liian pitkälle viestille", async () => {
    const POST = await loadRoute();

    const res = await POST(makeRequest({ ...VALID_BODY, message: "x".repeat(5001) }));

    expect(res.status).toBe(400);
  });
});

describe("honeypot", () => {
  it("hyväksyy hiljaa mutta ei lähetä, kun piilokenttä on täytetty", async () => {
    const POST = await loadRoute();

    const res = await POST(makeRequest({ ...VALID_BODY, company: "Spam Oy" }));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe("sähköpostin lähetys", () => {
  it("lähettää oikealle vastaanottajalle ja asettaa replyTo:n lähettäjään", async () => {
    const POST = await loadRoute();

    await POST(makeRequest(VALID_BODY));

    expect(sendMock).toHaveBeenCalledTimes(1);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.to).toBe("vastaanottaja@example.com");
    expect(payload.replyTo).toBe("testi@example.com");
    expect(payload.subject).toBe("Yhteydenotto: Tulkkaus — Testi Testaaja");
  });

  it("hyväksyy palveluvalinnan myös portugalinkielisestä lomakkeesta", async () => {
    const POST = await loadRoute();

    await POST(makeRequest({ ...VALID_BODY, service: translations["pt-br"].contact.option3 }));

    const payload = sendMock.mock.calls[0][0];
    expect(payload.subject).toContain(translations["pt-br"].contact.option3);
  });

  it("ei päästä hyökkääjän tekstiä otsikkoriville sallimattoman palveluarvon kautta", async () => {
    const POST = await loadRoute();

    await POST(
      makeRequest({
        ...VALID_BODY,
        service: "VAROITUS: tilisi suljetaan, vahvista tästä",
      })
    );

    const payload = sendMock.mock.calls[0][0];
    expect(payload.subject).toBe("Yhteydenotto: Yleinen — Testi Testaaja");
    expect(payload.subject).not.toContain("VAROITUS");
  });

  it("poistaa rivinvaihdot nimestä otsikkoriviltä", async () => {
    const POST = await loadRoute();

    await POST(makeRequest({ ...VALID_BODY, name: "Testi\r\nX-Injected: paha" }));

    const payload = sendMock.mock.calls[0][0];
    expect(payload.subject).not.toMatch(/[\r\n]/);
    expect(payload.subject).toBe("Yhteydenotto: Tulkkaus — Testi X-Injected: paha");
  });

  it("vastaa 500 kun Resend palauttaa virheen", async () => {
    sendMock.mockResolvedValue({ error: { message: "boom" } });
    const POST = await loadRoute();

    const res = await POST(makeRequest(VALID_BODY));

    expect(res.status).toBe(500);
  });
});

describe("lähetysraja ilman Upstashia (muistinvarainen)", () => {
  it("estää kuudennen lähetyksen samasta IP:stä", async () => {
    const POST = await loadRoute();

    for (let i = 0; i < 5; i++) {
      const ok = await POST(makeRequest(VALID_BODY));
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(makeRequest(VALID_BODY));

    expect(blocked.status).toBe(429);
    expect(sendMock).toHaveBeenCalledTimes(5);
  });

  it("laskee rajan IP-kohtaisesti", async () => {
    const POST = await loadRoute();

    for (let i = 0; i < 5; i++) {
      await POST(makeRequest(VALID_BODY, { ip: "203.0.113.10" }));
    }

    const otherIp = await POST(makeRequest(VALID_BODY, { ip: "198.51.100.7" }));

    expect(otherIp.status).toBe(200);
  });
});

describe("lähetysraja Upstashilla", () => {
  beforeEach(() => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
  });

  it("käyttää Upstashia ja estää kun raja ylittyy", async () => {
    limitMock.mockResolvedValue({ success: false });
    const POST = await loadRoute();

    const res = await POST(makeRequest(VALID_BODY));

    expect(limitMock).toHaveBeenCalledWith("203.0.113.10");
    expect(res.status).toBe(429);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("palaa muistinvaraiseen rajaan jos Redis kaatuu, eikä hylkää aitoa yhteydenottoa", async () => {
    limitMock.mockRejectedValue(new Error("redis down"));
    const POST = await loadRoute();

    const res = await POST(makeRequest(VALID_BODY));

    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});

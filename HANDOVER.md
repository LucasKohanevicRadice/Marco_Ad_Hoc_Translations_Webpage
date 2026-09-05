# Handover — Marco Izaac Ad Hoc Käännöspalvelut

Last updated: 2026-09-04

Tarkoitus: pitää kirjaa mitä on tehty ja mitä puuttuu ennen tuotantojulkaisua. Päivitä tätä tiedostoa sitä mukaa kun asioita hoidetaan pois listalta.

## Tehty

- **Stack**: Next.js 16.2.6 (App Router) + React 19.2.4 + Tailwind CSS v4, TypeScript.
- **Sivurakenne** (`app/page.tsx`): Navbar → Hero → Services → lippu-tekstuuri-divider → Disclaimer → Contact → Footer.
- **Design-järjestelmä**: `DESIGN.md` spec ("Nordic-Tropical Precision") toteutettu `app/globals.css`:n `@theme`-tokeneina.
- **Komponentit** (`components/`): Navbar, Hero, Services, Disclaimer, Contact, Footer, ObfuscatedEmail.
- **i18n**: `lib/LanguageContext.tsx` + `lib/translations.ts` — täysi fi/pt-br-käännös.
- **Yhteydenottolomake**: `Contact.tsx` → `/api/contact` → validointi → Resend-lähetys.
- **Kuvat**: Marco-muotokuva, Suomi-Brasilia-lippukuvat lisätty `public/`-kansioon.
- **`next.config.ts` korjattu** — `output: "export"` + `images.unoptimized` poistettu, API-reitti toimii nyt.
- **Tietosuojaseloste** — `app/tietosuoja/page.tsx`, linkitetty Footeriin.
- **CLAUDE.md ja README.md päivitetty** vastaamaan nykyistä stackia.
- **Sähköpostiosoitteet ympäristömuuttujiin** — `CONTACT_EMAIL` (vastaanottaja, vain palvelin) ja `NEXT_PUBLIC_CONTACT_EMAIL` (näytettävä), arvot `.env.local`:ssa. Osoitetta ei ole lähdekoodissa, dokumenteissa eikä git-historiassa. `.env.example` lisätty malliksi.
- **Väärinkäytön esto** (`app/api/contact/route.ts`), tehty 2026-09-04 turvakatselmuksen pohjalta:
  - **Honeypot** — piilotettu `company`-kenttä, palvelin hylkää täytetyt hiljaa.
  - **Rate limit** — 5 lähetystä/tunti per IP **Upstash Redisillä**, joka pitää laskurin yli serverless-instanssien eli raja on oikeasti sitova. Jos Upstash-muuttujia ei ole asetettu (paikallinen kehitys) tai Redis ei vastaa, käytössä on muistinvarainen varajärjestelmä.
  - **Same-origin-tarkistus** — `Origin`-header verrataan pyynnön `Host`-headeriin. Estää suoran curl-kutsun (header on väärennettävissä, joten suodatin eikä turvaraja).
  - **`service`-kentän whitelist** — arvo hyväksytään vain jos se on käännöstiedoston sallituissa vaihtoehdoissa. Estää hyökkääjää kirjoittamasta sähköpostin otsikkoriviä (phishing-vektori).
  - **`name`-kentän puhdistus** — rivinvaihdot pois otsikkoriviltä.
  - **Eksplisiittinen env-tarkistus** — puuttuva `CONTACT_EMAIL`/`RESEND_API_KEY` → `503` + selkeä lokiviesti aiemman ajonaikaisen kaatumisen sijaan.
  - **Osoitteen keräyssuoja** — `ObfuscatedEmail` renderöi osoitteen vasta selaimessa. Varmistettu buildista: osoitetta ei ole `index.html`:ssä eikä `tietosuoja.html`:ssä. Jäännösriski: osoite on JS-bundlessa, joten headless-selainta käyttävä kerääjä saa sen.
- **Testit** (`tests/contact-route.test.ts`, Vitest) — 20 testiä jotka kattavat kaikki yllä olevat suojaukset: env-tarkistus, same-origin, validointi, honeypot, otsikkorivi-injektio, rate limit (muisti + Upstash + Redis-katkos). Aja `npm test`. **Näiden pitää pysyä vihreinä jos reittiä muutetaan.**
- **Redundantit tiedostot poistettu** — `code.html` (design-työkalun prototyyppi, jonka tokenit ovat nyt globals.css:ssä), `screen.png`, juuren kaksoiskappaleet lippukuvista (identtiset `public/`-kopioiden kanssa, 2,5 MB), create-next-app:n käyttämättömät SVG:t ja vanhentunut `out/`-kansio.
- **Next.js päivitetty 16.2.6 → 16.3.4** — vanhassa versiossa oli yhdeksän korkean vakavuuden advisorya (mm. cache confusion POST-pyynnöille). `npm audit`: 0 haavoittuvuutta.

- **Julkaistu Verceliin 2026-09-05** — projekti `lucas-vercel3/marco-ad-hoc-translations`, tuotanto-osoite **https://marco-ad-hoc-translations.vercel.app**. GitHub-repo yhdistetty (`vercel link` teki sen CLI:n kautta, koska web-UI temppuili), joten jokainen push `main`-branchiin deployaa automaattisesti. `CONTACT_EMAIL` ja `NEXT_PUBLIC_CONTACT_EMAIL` asetettu Vercelin Production- ja Preview-ympäristöihin.
- **Korjattu tuotannon kaatava bugi** — Resend-client luotiin moduulitasolla, mutta sen konstruktori heittää poikkeuksen ilman API-avainta. Ilman avainta reitti olisi kaatunut 500:aan siistin 503:n sijaan. Client luodaan nyt vasta env-tarkistuksen jälkeen; regressiotesti lisätty ja todennettu (kaatuu jos bugi palautetaan).

## Kesken / Puuttuu ennen deployta

### 🔴 Estää julkaisun

1. **RESEND_API_KEY puuttuu tuotannosta** — sivusto on pystyssä, mutta yhteydenottolomake vastaa `503 Lomake ei ole juuri nyt käytössä` kunnes oikea avain on olemassa. Luo tili resend.com:iin, kopioi avain, ja aja repon juuressa:
   `printf '%s' 're_oikea_avain' | vercel env add RESEND_API_KEY production`
   Sama `preview`-ympäristöön. Muutos tulee voimaan seuraavassa deployssa (`vercel --prod` tai uusi push).
2. **Upstash-tietokanta luomatta** — luo ilmainen Redis console.upstash.com:issa ja lisää `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` samalla tavalla. Ilman näitä lomake toimii, mutta rate limit on vain muistinvarainen (ei sitova tuotannossa).

### 🟡 Kannattaa hoitaa ennen julkaisua

3. **Lomakkeen testaus tuotannossa** — oikealla API-avaimella: lähetä testiviesti ja varmista että se saapuu `CONTACT_EMAIL`-osoitteeseen (tarkista myös roskapostikansio, koska `from` on `onboarding@resend.dev`).

### 🟢 Nice-to-have

4. **Cloudflare Turnstile** jos roskapostia alkaa silti tulla — ilmainen, näkymätön useimmille käyttäjille, pysäyttää botit lomaketasolla ennen rate limitiä.
5. Ei robots.txt/sitemap.xml/OG-kuvaa — vaikuttaa hakukonenäkyvyyteen ja linkin esikatselukuvaan jaettaessa.
6. Isot kuvat `public/`-kansiossa (~1.2–1.3MB/kpl) — kannattaa pakata.
7. Tietosuojaseloste on vain suomeksi, vaikka sivustolla on pt-br-käännös.
8. Testit kattavat vain API-reitin. Komponenttitestejä (Hero, Contact-lomakkeen UI) ei ole.
9. **Oma domain** — nyt käytössä `marco-ad-hoc-translations.vercel.app`. Oikea domain lisätään Vercelin projektiasetuksista tai `vercel domains add`.
10. `Marco izaac.jpeg` (repon juuressa) on muotokuvan alkuperäistiedosto, josta `public/marco-izaac.png` on muokattu. Ei käytössä sivustolla. Päätä säilytetäänkö se repossa vai siirretäänkö talteen repon ulkopuolelle — sitä ei ole koskaan committoitu, joten poisto olisi lopullinen.

## Avoimet kysymykset asiakkaalle (Marco/setä)

- Halutaanko ostaa oma domain sivustolle ja/tai Resendin lähettäjäosoitteelle, vai riittääkö alkuun ilmainen `*.vercel.app` + `onboarding@resend.dev`?
- Onko `CONTACT_EMAIL`-osoite sellainen jota hän seuraa aktiivisesti?

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

- **Siirretty Netlifyyn 2026-09-05** — tuotanto-osoite **https://marco-ad-hoc-translations.netlify.app**, GitHub-repo kytketty (automaattinen deploy `main`-branchista), `netlify.toml` ohjaa build-asetukset. Syy siirtoon: Vercelin Hobby-taso **kieltää kaupallisen käytön** ("Advertising the sale of a product or service"), joten sivusto olisi vaatinut Pro-tason $20/kk. Netlifyn käyttöehdoissa eikä Acceptable Use Policyssä ole vastaavaa kieltoa, ja ilmaistaso (100 GB siirtoa, 300 buildminuuttia, 125 000 funktiokutsua/kk) riittää moninkertaisesti. Säästö ~$240/vuosi.
  - Huom: paikallinen `netlify deploy --build` **ei toimi tässä ympäristössä** — `@netlify/plugin-nextjs` kaatuu Windowsilla ("Failed publishing static content"), todennäköisesti polun `ä`-kirjaimen ja kenoviivojen takia. Deployaa aina gitin kautta, jolloin Netlify rakentaa Linux-buildereillaan. Se toimii.
  - Sivustolla oli aluksi Netlify SSO päällä (`sso_login: true`) → kaikki sivut 401. Poistettu.
- **Todennettu tuotannosta (Netlify)**: etusivu ja `/tietosuoja` 200; sähköpostiosoitetta ei löydy HTML:stä; API-reitti 403 ilman Originia, 403 vieraasta originista, 400 puutteellisesta syötteestä, 200 + ei lähetystä honeypotista, 429 kuudennesta pyynnöstä.
- **Vercel-projekti poistettu 2026-09-05** — sivusto oli ensin Vercelissä, mutta se siirrettiin Netlifyyn kaupallisen käytön ehtojen takia. Projekti, sen deployt ja `.vercel`-kansio poistettu; vanha osoite palauttaa 404.
- **Korjattu tuotannon kaatava bugi** — Resend-client luotiin moduulitasolla, mutta sen konstruktori heittää poikkeuksen ilman API-avainta. Ilman avainta reitti olisi kaatunut 500:aan siistin 503:n sijaan. Client luodaan nyt vasta env-tarkistuksen jälkeen; regressiotesti lisätty ja todennettu (kaatuu jos bugi palautetaan).

## Kesken / Puuttuu ennen deployta

### 🔴 Estää julkaisun

1. **Sähköposti ei mene perille ilman verifioitua domainia.** `RESEND_API_KEY` on asetettu (Production + Preview) ja koodi toimii, mutta Resend palauttaa `403`:
   > "You can only send testing emails to your own email address (lucas.kohanevicradice@hotmail.com). To send emails to other recipients, please verify a domain at resend.com/domains, and change the `from` address to an email using this domain."

   Eli ilman omaa domainia lomake lähettää vain Resend-tilin omistajan osoitteeseen — ei asiakkaan. Vaihtoehdot:
   - **A: osta domain** (~10–15 €/v; `.com` sopii, koska asiakas asuu Brasiliassa). Verifioi se resend.com/domains-sivulla (SPF/DKIM-tietueet DNS:ään) ja vaihda `from` osoitteeksi tuolla domainilla (esim. `lomake@domain.com`). **Sama domain, yksi ostos**, hoitaa sekä sivuston osoitteen että sähköpostin lähettäjän — eri DNS-tietuetyypit osoittavat eri palvelut. Osta setäsi nimiin, ei omiisi. Vapaana tarkistettu: `marcoizaac.com`, `izaactranslations.com`, `izaackaannos.com`.
   - **B: vaihda palveluntarjoajaa** — esim. Formspree (alkuperäinen suunnitelma) toimittaa mihin tahansa vahvistettuun osoitteeseen ilman omaa domainia, ilmaistasolla ~50 lähetystä/kk.
2. **Upstash-tietokanta luomatta** — luo ilmainen Redis console.upstash.com:issa ja lisää `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (`netlify env:set`). Ilman näitä rate limit on vain muistinvarainen. Tuotantotestissä se piti (429 kuudennesta pyynnöstä), koska sama funktioinstanssi palveli kaikki pyynnöt — mutta se ei ole taattua instanssien välillä.

### 🟡 Kannattaa hoitaa ennen julkaisua

4. **Lomakkeen päästä päähän -testi** — kun domain on verifioitu: lähetä testiviesti ja varmista että se saapuu `CONTACT_EMAIL`-osoitteeseen (tarkista myös roskapostikansio). Tähän asti ketju on todennettu Resendiin asti, mutta ei perille.

### 🟢 Nice-to-have

4. **Cloudflare Turnstile** jos roskapostia alkaa silti tulla — ilmainen, näkymätön useimmille käyttäjille, pysäyttää botit lomaketasolla ennen rate limitiä.
5. Ei robots.txt/sitemap.xml/OG-kuvaa — vaikuttaa hakukonenäkyvyyteen ja linkin esikatselukuvaan jaettaessa.
6. Isot kuvat `public/`-kansiossa (~1.2–1.3MB/kpl) — kannattaa pakata.
7. Tietosuojaseloste on vain suomeksi, vaikka sivustolla on pt-br-käännös.
8. Testit kattavat vain API-reitin. Komponenttitestejä (Hero, Contact-lomakkeen UI) ei ole.
9. **Oma domain** — nyt käytössä `marco-ad-hoc-translations.netlify.app`. Oikea domain lisätään Netlifyn projektiasetuksista (Domain management).
10. `Marco izaac.jpeg` (repon juuressa) on muotokuvan alkuperäistiedosto, josta `public/marco-izaac.png` on muokattu. Ei käytössä sivustolla. Päätä säilytetäänkö se repossa vai siirretäänkö talteen repon ulkopuolelle — sitä ei ole koskaan committoitu, joten poisto olisi lopullinen.

## Avoimet kysymykset asiakkaalle (Marco/setä)

- **Oma domain on nyt pakollinen, ei valinnainen** (ks. estävä kohta 1). Halutaanko ostaa domain, ja mikä nimi?
- Onko `CONTACT_EMAIL`-osoite sellainen jota hän seuraa aktiivisesti?

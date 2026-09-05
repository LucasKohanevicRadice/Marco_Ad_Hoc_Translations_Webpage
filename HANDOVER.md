# Handover — Marco Izaac Ad Hoc Käännöspalvelut

Last updated: 2026-09-05

Asiakastyö: Lucas rakentaa sivuston sedälleen Marco Izaacille, joka asuu Brasiliassa ja
tekee portugali–suomi-käännöksiä. Tämä tiedosto on luovutuspiste seuraavalle
istunnolle. **Päivitä se aina kun jotain valmistuu.**

**Tuotanto:** https://marco-ad-hoc-translations.netlify.app
**Repo:** https://github.com/LucasKohanevicRadice/Marco_Ad_Hoc_Translations_Webpage (julkinen)

Sivusto on pystyssä ja toimii. **Yhteydenottolomake ei kuitenkaan vielä toimita
viestejä perille** — se on ainoa varsinainen este, ja sen ratkaisu on huomisen työ.

---

## SEURAAVA ISTUNTO: domain

Sovittu jatko: domainin vuokraus ja käyttöönotto. Yksi domain hoitaa sekä sivuston
osoitteen että sähköpostin lähettäjän — eri DNS-tietuetyypit osoittavat eri palvelut,
joten **kyse on yhdestä ostoksesta, ei kahdesta**.

### Miksi tämä on pakollinen, ei kosmeettinen

Resend palauttaa nyt `403`, kun lomake yrittää lähettää:

> "You can only send testing emails to your own email address (\<Resend-tilin oma
> osoite\>). To send emails to other recipients, please verify a domain at
> resend.com/domains, and change the `from` address to an email using this domain."

Ilman verifioitua domainia viesti menee siis vain Resend-tilin omistajalle, ei
asiakkaalle. Koodi on kunnossa — este on tilin puolella.

### Vaiheet järjestyksessä

1. **Valitse nimi.** Vapaana tarkistettu 2026-09-05: `marcoizaac.com`,
   `izaactranslations.com`, `izaackaannos.com`. (`adhoctranslations.com` on varattu.)
   `.com` on oikea pääte, koska asiakas on Brasiliassa — `.com.br` vaatisi
   brasilialaisen CPF/CNPJ-tunnuksen.
2. **Osta se.** Uusintahinnat 2026-09: Cloudflare ~$10.46/v, Porkbun ~$11/v,
   Netlify/Vercel ~$11.25/v, Namecheap ~$18.48/v. **Vertaa uusintahintaa, älä
   ensimmäisen vuoden tarjousta.** Cloudflare pakottaa käyttämään omaa DNS:ään;
   Porkbun ei. Domain ei ole kertaostos vaan määräaikainen vuokra — laita
   automaattinen uusinta päälle.
   **Osta setäsi nimiin ja hänen kortillaan**, ei Lucaksen. Domain on hänen
   yrityksensä identiteetti; jos se on kehittäjän tilillä, hän on riippuvainen
   tästä joka vuosi.
3. **Liitä Netlifyyn** — Netlify-projekti → Domain management → Add custom domain.
   Netlify kertoo tarvittavat `A`/`CNAME`-tietueet.
4. **Verifioi Resendissä** — resend.com/domains → Add domain → kopioi SPF- ja
   DKIM-tietueet rekisteröijän DNS-hallintaan → odota verifiointia.
   MX-tietueita **ei tarvita**: lähettäjäosoite ei vastaanota mitään, koska reitti
   asettaa `replyTo`-kentäksi vierailijan osoitteen ja setä vastaa omasta Gmailistaan.
5. **Vaihda `from`-osoite koodissa** — `app/api/contact/route.ts`, rivi jossa lukee
   `from: "Yhteydenottolomake <onboarding@resend.dev>"` → esim.
   `lomake@valittudomain.com`. Harkitse samalla osoitteen siirtoa
   ympäristömuuttujaan, jotta se ei ole kovakoodattu.
6. **Päästä päähän -testi** — lähetä lomakkeella oikea viesti ja varmista että se
   saapuu `CONTACT_EMAIL`-osoitteeseen. **Tarkista myös roskapostikansio.** Tähän asti
   ketju on todennettu Resendiin asti mutta ei perille.

---

## Muut avoimet asiat

### 🔴 Estää julkaisun

1. **Domain + Resend-verifiointi** — yllä.

### 🟡 Kannattaa hoitaa

2. **Upstash-tietokanta luomatta.** Luo ilmainen Redis console.upstash.com:issa ja
   lisää tunnukset: `netlify env:set UPSTASH_REDIS_REST_URL "..."` ja
   `netlify env:set UPSTASH_REDIS_REST_TOKEN "..."`. Ilman näitä rate limit on vain
   muistinvarainen. Tuotantotestissä se piti (429 kuudennesta pyynnöstä), mutta vain
   koska sama funktioinstanssi palveli kaikki pyynnöt — se ei ole taattua.
3. **Setäsi suostumus julkiseen repoon.** Repo sisältää hänen kuvansa, nimensä ja
   liiketoimintatietonsa. Tekninen puoli on kunnossa (ei salaisuuksia, historia
   puhdas), mutta lupaa ei ole kysytty. `gh repo edit --visibility private` kääntää
   sen takaisin sekunnissa.

### 🟢 Nice-to-have

4. **Cloudflare Turnstile** jos roskapostia alkaa tulla — ilmainen, näkymätön
   useimmille, pysäyttää botit ennen rate limitiä.
5. Ei robots.txt/sitemap.xml/OG-kuvaa — vaikuttaa hakukonenäkyvyyteen ja linkin
   esikatselukuvaan jaettaessa.
6. Lippukuvat `public/`-kansiossa ovat ~1,2–1,3 MB/kpl. Ei kaada mitään rajaa, mutta
   on hidas mobiilissa — erityisesti brasilialaisille kävijöille.
7. Tietosuojaseloste on vain suomeksi, vaikka sivustolla on pt-br-käännös.
8. Testit kattavat vain API-reitin. Komponenttitestejä ei ole.
9. Mobiilissa (<420 px) navbarin brändi rivittyy kahdelle riville. Mahtuu palkkiin
   eikä leikkaudu. Korjaus vaatisi lyhyemmän bränditekstin (= copy-muutos, vaatii
   asiakkaan hyväksynnän) tai pienemmän fonttikoon mobiilissa.
10. `Marco izaac.jpeg` repon juuressa on muotokuvan alkuperäistiedosto, josta
    `public/marco-izaac.png` on muokattu. Ei käytössä sivustolla. Lucas päätti
    säilyttää sen.

---

## Mitä ympäristöstä pitää tietää

- **Deployaa vain gitin kautta.** Push `main`-branchiin → Netlify rakentaa ja julkaisee
  automaattisesti (~30–40 s). Paikallinen `netlify deploy --build` **kaatuu tässä
  ympäristössä**: `@netlify/plugin-nextjs` ei selviä Windows-poluista, joissa on
  `ä`-kirjain ("Failed publishing static content"). Netlifyn Linux-builderit
  rakentavat saman projektin ongelmitta.
- **`npm test` (21 testiä) pitää pysyä vihreänä.** Ne kattavat yhteydenottoreitin
  turvalogiikan, ja yksi niistä on regressiotesti bugille joka olisi kaatanut
  tuotannon. Todennettu että se oikeasti kaatuu jos bugi palautetaan.
- **CLAUDE.md on pidettävä alle 70 rivissä** (Lucaksen globaali sääntö). Se on nyt 69
  rivissä, joten uusi rivi vaatii toisen poistamista.
- **Kirjautumiset kunnossa:** `gh`, `netlify` (GitHub-kirjautumisella) ja `vercel`
  (kirjautunut, mutta Verceliä ei enää käytetä). Tarkista tarvittaessa
  `netlify status` ja `gh auth status`.
- **Netlify MCP -palvelin on asennettu** (`cmd /c npx -y @netlify/mcp`), mutta sen
  työkalut tulevat käyttöön vasta Claude Coden uudelleenkäynnistyksen jälkeen.
  Windowsilla `cmd /c` -etuliite on pakollinen, ja `claude mcp add` pitää ajaa
  PowerShellistä — Git Bash muuntaa `/c`:n muotoon `C:/`.
- **Vercel on poistettu.** Sivusto oli siellä ensin, mutta Hobby-taso kieltää
  kaupallisen käytön ("Advertising the sale of a product or service"), ja Pro maksaa
  $20/kk. Netlifyn ehdoissa vastaavaa kieltoa ei ole. Älä siirrä takaisin.

---

## Tehty

**Sivusto**
- Next.js 16.3.4 (App Router) + React 19 + Tailwind v4, TypeScript.
- Osiot: Navbar → Hero → Services → lippuväliosio → Disclaimer → Contact → Footer.
- i18n `lib/`-kansiossa: täysi fi/pt-br-käännös, kielivalitsin navbarissa.
- Tietosuojaseloste `/tietosuoja`, linkitetty footeriin (GDPR: lomake kerää
  henkilötietoja ja välittää ne Resendin kautta EU:n ulkopuolelle).
- Teemat: **tumma oletuksena**, vaalea jos käyttäjä on sen valinnut tai hänen
  järjestelmänsä on vaalea. Vaihtonappi navbarissa. Yksityiskohdat ja kolme
  tarkoituksellista suunnittelupäätöstä: `DESIGN.md` → Themes.
- Navbarin katkaisukohta on `xl` eikä `md`, koska suomenkielinen brändi vie yksin
  466 px. Perustelu on kommenttina `Navbar.tsx`:ssä.

**Yhteydenottolomake ja sen suojaukset** (`app/api/contact/route.ts`)
- Honeypot-kenttä, hylätään hiljaa.
- Rate limit 5/h per IP, Upstash Redis + muistinvarainen varajärjestelmä.
- Same-origin-tarkistus (suodatin, ei turvaraja — header on väärennettävissä).
- `service`-kentän whitelist → hyökkääjä ei voi kirjoittaa sähköpostin otsikkoriviä.
- `name`-kentän rivinvaihdot pois otsikkoriviltä.
- Puuttuva env-muuttuja → `503` selkeällä viestillä.
- Sähköpostiosoitteet vain ympäristömuuttujissa; `ObfuscatedEmail` renderöi näytettävän
  osoitteen vasta selaimessa, joten sitä ei ole palvelimen HTML:ssä.

**Infra**
- Netlify, GitHub-repo kytketty, env-muuttujat asetettu (`RESEND_API_KEY`,
  `CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_EMAIL`).
- Next.js päivitetty 16.2.6 → 16.3.4; `npm audit` 0 haavoittuvuutta.
- Vitest, 21 testiä.

---

## Avoimet kysymykset asiakkaalle (Marco/setä)

- Mikä domain-nimi? Kuka maksaa ja kenen nimiin se rekisteröidään?
- Onko `CONTACT_EMAIL`-osoite sellainen jota hän seuraa aktiivisesti?
- Saako sivuston koodi, hänen kuvansa ja nimensä olla julkisessa portfoliorepossa?

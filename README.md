# Marco Izaac — Ad Hoc Käännöspalvelut

Yksisivuinen sivusto Brasilia-Suomi ad hoc -käännöspalvelulle. Next.js 16 (App Router),
React 19, Tailwind CSS v4, yhteydenottolomake Resendin kautta.

**Tuotanto:** https://marco-ad-hoc-translations.netlify.app

## Kehitys

```bash
npm install
npm run dev      # http://localhost:3000
```

## Ympäristömuuttujat

Kopioi [.env.example](./.env.example) tiedostoksi `.env.local` ja täytä arvot:

```
RESEND_API_KEY=re_xxxxxxxx        # resend.com → API Keys
CONTACT_EMAIL=...                 # lomakkeen vastaanottaja, vain palvelimella
NEXT_PUBLIC_CONTACT_EMAIL=...     # sivulla näytettävä osoite
UPSTASH_REDIS_REST_URL=...        # rate limit; ilman näitä muistinvarainen varajärjestelmä
UPSTASH_REDIS_REST_TOKEN=...
```

Tuotannossa samat muuttujat asetetaan Netlifyyn (`netlify env:set NIMI arvo`, tai
Project configuration → Environment variables) — `.env.local` ei mene gittiin.

## Testit

```bash
npm test         # Vitest: yhteydenottoreitin turvalogiikka
npm run test:watch
```

## Build & Deploy

```bash
npm run build    # tuotantobuild (.next)
git push         # deploy: Netlify rakentaa main-branchin automaattisesti
```

Sivusto ajetaan **Netlifyssä** täydellä Next.js-runtimella (ei staattista exportia —
yhteydenottolomake tarvitsee palvelinreitin `/api/contact`). Build-asetukset ovat
[netlify.toml](./netlify.toml):ssa.

Deployaa vain gitin kautta. Paikallinen `netlify deploy --build` kaatuu Windowsilla:
`@netlify/plugin-nextjs` ei selviä tästä polusta ("Failed publishing static content").
Netlifyn omat Linux-builderit rakentavat projektin ongelmitta.

## Dokumentaatio

- [CLAUDE.md](./CLAUDE.md) — projektin rakenne ja säännöt
- [DESIGN.md](./DESIGN.md) — design-järjestelmän spesifikaatio
- [HANDOVER.md](./HANDOVER.md) — tehdyt ja jäljellä olevat tehtävät ennen julkaisua

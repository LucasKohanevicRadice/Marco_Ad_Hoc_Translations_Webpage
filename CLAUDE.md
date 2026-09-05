# Marco Izaac — Ad Hoc Käännöspalvelut

Single-page client website. Brazilian-Finnish translation service for Marco Izaac.
Built by Lucas for the client. Live at marco-ad-hoc-translations.netlify.app.

> This file may run to **100 lines** in this project — Lucas approved the exception
> to his global 70-line rule on 2026-09-05. Don't trim it back to 70.

## Stack

Next.js 16 · React 19 · Tailwind v4 · Resend · Upstash Redis · Vitest · Netlify

## Key Files

| File                       | Purpose                                                |
| --------------------------- | ------------------------------------------------------- |
| app/page.tsx                | Page assembly — imports all section components          |
| app/layout.tsx              | Fonts, metadata, and the inline theme script             |
| app/globals.css             | Design tokens for both themes + custom CSS classes       |
| app/api/contact/route.ts    | Server route — validates form, sends email via Resend    |
| app/tietosuoja/page.tsx     | Privacy policy page (GDPR notice for the contact form)   |
| components/                 | Navbar, Hero, Services, Disclaimer, Contact, Footer       |
| components/ObfuscatedEmail  | Renders the address client-side only (anti-harvesting)   |
| components/ThemeToggle      | Light/dark switch in the navbar; dark is the default      |
| lib/                        | LanguageContext + translations.ts (fi / pt-br i18n)      |
| tests/                      | Vitest suite for the contact route (security behaviour)  |
| DESIGN.md                   | Full design system spec — read before any UI work        |
| HANDOVER.md                 | **Read first** — status, next steps, environment gotchas |
| netlify.toml                | Build command + Next.js plugin for Netlify                |
| .env.example                | Required env vars, no real values (.env.local is gitignored) |

## Design Rules (read DESIGN.md for full spec)

- All color/spacing tokens in globals.css; never a raw hex in a component
- No heavy shadows (tonal layers + 1px borders); 8px spacing base, all multiples
- Dark is default; light overrides `:root[data-theme="light"]`. `text-primary` is
  near-white in dark, so buttons use `bg-primary-surface` instead
- Custom classes exist where a token alone breaks in one theme — prefer them over
  raw utilities: `.hero-scrim`, `.footer-surface`, `.flag-divider`,
  `.border-left-brazil` / `-finland` / `-warning`
- The navbar's desktop breakpoint is `xl`, not `md`: the Finnish brand string is
  466px wide alone, and below ~1150px the bar wrapped onto two lines

## Copy

- Primary language: Finnish, secondary: Portuguese (pt-br) via lib/translations.ts
- Do not change pricing, phone, or email without client approval
- Email addresses live in env vars (.env.example); display via ObfuscatedEmail
- Keep both locales in sync: the contact route whitelists the service dropdown
  against `translations`, so a new option must be added to both

## Environment Variables

| Name                        | Scope       | Notes                                  |
| --------------------------- | ----------- | -------------------------------------- |
| RESEND_API_KEY              | server      | resend.com → API Keys                  |
| CONTACT_EMAIL               | server      | Where the form delivers                |
| NEXT_PUBLIC_CONTACT_EMAIL   | public      | Shown on the page; may differ          |
| UPSTASH_REDIS_REST_URL      | server      | Optional — falls back to in-memory     |
| UPSTASH_REDIS_REST_TOKEN    | server      | Optional                               |

`.env.local` for dev; `netlify env:set` for production.

## Dev Commands

```
npm run dev      # localhost:3000
npm run build    # production build (.next)
npm test         # vitest — contact route security tests (tests/)
git push         # deploys: Netlify builds main automatically
```

**Deploy only through git.** `netlify deploy --build` fails in this environment:
@netlify/plugin-nextjs errors with "Failed publishing static content" on Windows
paths containing `ä`. Netlify's own Linux builders handle the same commit fine.

## Contact Form / Resend Setup

1. Create account at resend.com, copy API key
2. Set env vars in .env.local (dev) and on Netlify (`netlify env:set`) — see
   .env.example. Without the Upstash vars the rate limiter is in-memory only.
3. `from` is Resend's sandbox address: it ONLY delivers to the Resend account
   owner. Reaching the client needs a verified domain at resend.com/domains.

Abuse protections in route.ts, all covered by tests — rationale in HANDOVER.md:
honeypot field, same-origin check, 5 sends/hour per IP via Upstash, service value
whitelisted against translations, CRLF stripped from the name, explicit 503 when
env vars are missing.

**Keep `npm test` green.** One of the 21 tests guards a bug that would have crashed
production: the Resend client must stay below the env check, because its
constructor throws without an API key.

## NEXTJS RULES

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

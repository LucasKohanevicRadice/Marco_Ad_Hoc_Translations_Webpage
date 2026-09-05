# Marco Izaac — Ad Hoc Käännöspalvelut

Single-page client website. Brazilian-Finnish translation service for Marco Izaac.
Built by Lucas for the client.

## Stack

Next.js 16 · React 19 · Tailwind CSS v4 · Resend (contact form) · Deploy on Vercel

## Key Files

| File                       | Purpose                                                |
| --------------------------- | ------------------------------------------------------- |
| app/page.tsx                | Page assembly — imports all section components          |
| app/layout.tsx              | Fonts (next/font), metadata, html wrapper                |
| app/globals.css             | All design tokens via @theme + custom CSS classes        |
| app/api/contact/route.ts    | Server route — validates form, sends email via Resend    |
| app/tietosuoja/page.tsx     | Privacy policy page                                      |
| components/                 | Navbar, Hero, Services, Disclaimer, Contact, Footer       |
| components/ObfuscatedEmail  | Renders the address client-side only (anti-harvesting)   |
| lib/                        | LanguageContext + translations.ts (fi / pt-br i18n)      |
| tests/                      | Vitest suite for the contact route (security behaviour)  |
| DESIGN.md                   | Full design system spec — read before any UI work        |
| HANDOVER.md                 | Launch checklist — done / remaining tasks                |
| .env.local                  | RESEND_API_KEY, CONTACT_EMAIL, NEXT_PUBLIC_CONTACT_EMAIL  |
| .env.example                | Template of required env vars (committed, no real values) |

## Design Rules (read DESIGN.md for full spec)

- All color/spacing tokens defined in globals.css @theme block
- Use CSS vars: `var(--color-primary)` not raw hex in components
- Custom classes: `.border-left-brazil`, `.border-left-finland`
- No heavy shadows — use tonal layers + 1px borders
- Spacing base: 8px unit — all multiples of 8

## Copy

- Primary language: Finnish, secondary: Portuguese (pt-br) via lib/translations.ts
- Do not change pricing, phone, or email without client approval
- Email addresses live in env vars (.env.example); display via ObfuscatedEmail

## Dev Commands

```
npm run dev      # localhost:3000
npm run build    # production build (.next), deployed on Vercel
npm test         # vitest — contact route security tests (tests/)
vercel           # deploy to production
```

## Contact Form / Resend Setup

1. Create account at resend.com, copy API key
2. Set env vars in .env.local (dev) and Vercel project env vars (prod) — see
   .env.example. Upstash vars are optional; without them the rate limiter falls
   back to an in-memory counter that resets per instance.
3. `from` is Resend's sandbox address, which ONLY delivers to the Resend
   account owner's own email. Reaching the client's inbox requires a verified
   domain at resend.com/domains and a `from` address on it.

Abuse protections in route.ts (rationale in HANDOVER.md, covered by tests):
honeypot field, same-origin check, 5 sends/hour per IP via Upstash Redis,
service value whitelisted against translations, CRLF stripped from name.
Any change to these must keep `npm test` green.

## NEXTJS RULES

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---
name: Nordic-Tropical Precision
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#434750'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#747781'
  outline-variant: '#c4c6d2'
  surface-tint: '#3c5d9c'
  primary: '#001b44'
  on-primary: '#ffffff'
  primary-container: '#002f6c'
  on-primary-container: '#7999dc'
  inverse-primary: '#aec6ff'
  secondary: '#006e27'
  on-secondary: '#ffffff'
  secondary-container: '#7ff98d'
  on-secondary-container: '#007329'
  tertiary: '#6d5e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c4ab00'
  on-tertiary-container: '#493f00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#224583'
  secondary-fixed: '#81fc90'
  secondary-fixed-dim: '#65df76'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#00531c'
  tertiary-fixed: '#ffe243'
  tertiary-fixed-dim: '#e3c600'
  on-tertiary-fixed: '#211b00'
  on-tertiary-fixed-variant: '#524700'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-xs:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

This design system centers on the intersection of Finnish reliability and Brazilian vibrancy, filtered through a lens of high-end professional services. The brand personality is authoritative yet accessible, positioning the service as a bridge between two distinct cultures. 

The aesthetic follows a **Corporate / Modern** direction with heavy influence from **Minimalism**. It prioritizes legibility and structural clarity to reflect the accuracy required in translation. By utilizing a "less is more" approach, the design system ensures that the information—the translated word—remains the protagonist. The interface should feel like a premium consultancy: organized, quiet, and dependable.

## Colors

The palette is anchored by a deep **Finnish Navy Blue**, which serves as the primary brand identifier for trust and institutional stability. **Brazilian Green and Yellow** are used strictly as functional accents—green for success states or subtle call-outs, and yellow for high-importance highlights or warnings—to ensure the interface remains professional rather than festive.

The background uses a crisp off-white to reduce eye strain during long reading sessions, while the typography utilizes a near-black navy to maintain softer contrast than pure black.

## Themes

**Dark is the default.** The `@theme` block in `app/globals.css` holds the dark
values; the light palette documented above is an override on
`:root[data-theme="light"]`. Components reference only variables, so they carry no
theme logic.

The `data-theme` attribute is set by an inline script in `app/layout.tsx` before the
first paint, which avoids a flash of the wrong theme. Precedence: the visitor's own
choice (stored in `localStorage`) wins; otherwise the system setting decides; with no
JavaScript the page stays dark. `components/ThemeToggle.tsx` in the navbar flips it at
runtime.

Three decisions are deliberate and should not be "corrected" without thought:

- **`primary` is a text colour, not a button colour.** It appears in 39 places as
  `text-primary` (headings, icons, focus rings) against 3 as a button background.
  So in dark it is near-white, and buttons use separate tokens —
  `--color-primary-surface` / `--color-on-primary-surface` — which stay navy with
  white text in both themes. Headings must never render in the accent blue.
- **`primary-surface-hover` is lighter than `primary-surface` in both themes**, so
  the submit button brightens on hover either way.
- **The footer and the flag divider have their own classes** (`.footer-surface`,
  `.flag-divider`) instead of a primary utility. The footer stays a dark navy anchor
  in both themes — driven by a token it would have become the brightest element on the
  dark page — and the divider darkens rather than washes out the flag image.

## Typography

This design system uses a dual-font strategy. **Hanken Grotesk** is used for headlines to provide a contemporary, sharp, and engineered feel. Its geometric precision echoes Nordic design principles. 

**Inter** is utilized for all body copy and UI elements. As a highly functional, systematic typeface, it ensures maximum readability for complex translation documents across all screen sizes. Letter spacing is slightly tightened on large headings for a premium "editorial" look, while UI labels receive a touch of extra tracking to improve glanceability.

## Layout & Spacing

The layout employs a **fixed grid** approach for desktop environments, centering content within a 1200px container to maintain an organized, document-like feel. 

- **Desktop:** 12-column grid with 24px gutters.
- **Tablet:** 8-column grid with 24px gutters and 32px side margins.
- **Mobile:** 4-column fluid grid with 16px gutters and 16px side margins.

A strict 8px base unit (the "spacing base") governs all padding and margins, ensuring vertical rhythm. Use larger 'xl' gaps between major sections to emphasize the minimalist aesthetic and give the content room to breathe.

## Elevation & Depth

To maintain a "clear and professional" atmosphere, this design system avoids heavy shadows. Instead, it utilizes **Tonal Layers** and **Low-contrast outlines**. 

Surface depth is communicated through subtle shifts in background color (e.g., a slightly darker gray for a sidebar) and 1px borders in a soft neutral-cool hex. When a shadow is strictly necessary to indicate interactivity (like a floating action button or a modal), use an "ambient shadow": a very high blur radius (16px+) with very low opacity (5-8%) using the primary navy color as the shadow tint.

## Shapes

The shape language is **Soft**. A 0.25rem (4px) corner radius is applied to standard buttons and input fields, providing just enough approachability without losing the "serious" edge of a professional service. Larger components like cards or modal containers may use the `rounded-lg` (8px) token to soften the overall layout.

## Components

### Buttons
- **Primary:** Solid Navy Blue (#002F6C) with White text. High-contrast, sharp, and authoritative.
- **Secondary:** Outlined Navy Blue with a 1px border. Used for less critical actions.
- **Ghost:** No border or background; uses Navy Blue text. Used for navigation or cancel actions.

### Input Fields
Inputs must prioritize clarity. Use a white background with a 1px border (#D1D5DB). On focus, the border should transition to Primary Navy with a subtle 2px outer glow in the same color (20% opacity). Labels are always persistent above the field in `label-sm` weight.

### Cards
Cards are flat with a 1px `border_subtle` and no shadow. For a "premium" variant (e.g., service tiers), use a 2px left-border accent in Brazilian Green (#009739) or Yellow (#FFDF00) to categorize the content.

### Chips & Tags
Used for indicating language pairs (e.g., PT-BR → FI). These should use a light version of the neutral color with navy text, keeping them unobtrusive but clearly defined.

### Document Preview
As a translation service, a specialized "Side-by-Side" component is recommended. This uses a split-screen layout with a vertical divider to show source and target text in perfect alignment, utilizing the `body-md` typography.
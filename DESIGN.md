---
name: "ModularStep Design System"
version: "1.1.0"
colors:
  bg_main: "#ffffff"
  bg_surface: "#f8fafc"
  text_primary: "#0f172a"
  text_secondary: "#475569"
  accent: "#f97316"
  border: "#e2e8f0"
  error: "#ef4444"
spacing:
  scale: "8px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
shapes:
  radius_sm: "4px"
  radius_md: "8px"
  radius_lg: "12px"
typography:
  fonts:
    sans: "Inter, sans-serif"
    mono: "JetBrains Mono, monospace"
    display: "Space Grotesk, sans-serif"
  h1:
    fontFamily: "Space Grotesk"
    fontSize: "2.25rem"
    fontWeight: "700"
  body:
    fontFamily: "Inter"
    fontSize: "0.95rem"
    fontWeight: "400"
---

# Design System Specification & Token Contract

This document outlines the visual logic and component layout rules for ModularStep.com.

---

## 1. Color Pairing & Accessibility Logic

All interface elements must map their visual properties to the semantic variables defined in the frontmatter:

*   `--color-bg-main`: `#ffffff` (Pure White) - primary background canvas for B2B industrial trust.
*   `--color-bg-surface`: `#f8fafc` (Light Slate Gray) - used for card containers, configurator panels, and secondary text blocks.
*   `--color-text-primary`: `#0f172a` (Deep Slate Blue) - high contrast text for authoritative headers.
*   `--color-text-secondary`: `#475569` (Cool Slate) - readable body columns.
*   `--color-accent`: `#f97316` (OSHA/Safety High-Visibility Orange) - highlights, links, buttons, and handrails.
*   `--color-border`: `#e2e8f0` (Slate joints) - thin joints representing technical structural lines.
*   `--color-error`: `#ef4444` (Safety Red) - warning states and error validations.

### Accessibility Rules
*   All color pairings must meet WCAG AA standards (minimum contrast ratio of 4.5:1).
*   No hardcoded hex or rgb values in any CSS stylesheet.

---

## 2. Spacing & Grid Geometry

Layouts must maintain logical alignment and alignment scales.

### The Scale Principle
All spacing (margins, paddings, gaps) must be multiples of the base 8px scale grid.
*   `--spacing-xs` (xs): 4px
*   `--spacing-sm` (sm): 8px
*   `--spacing-md` (md): 16px
*   `--spacing-lg` (lg): 24px
*   `--spacing-xl` (xl): 32px

### Layout Safety
*   **Fluid Padding:** Section blocks must use fluid vertical spacing:
    `padding-block: clamp(var(--spacing-lg), 5vw, var(--spacing-xl));`
*   **Flex Wrapping:** All flexbox row layouts must specify `flex-wrap: wrap` to prevent horizontal overflows on narrow screens.
*   **Auto-fit Grids:** Card lists must utilize auto-fitting grid templates:
    `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`

---

## 3. Shapes & Rounding Logic

Rounding standards define the visual signature of the application.

*   `--radius-sm` (4px): Used for buttons, inputs, tags, and badge indicators.
*   `--radius-md` (8px): Used for cards, list items, alert boxes, and dropdown menus.
*   `--radius-lg` (12px): Used for dialog modals, bottom sheets, and main section panels.

### Geometric Consistency
*   Components must never mix rounded and sharp corners arbitrarily.
*   Avoid fully-rounded pill shapes (`9999px`) unless configuring a standard circular icon button.

---

## 4. Elevation & Z-Indexing

Depth layers convey semantic hierarchy.

### Elevation via Borders
*   Prioritize thin, clean borders (`1px solid var(--color-border)`) over drop shadows to maintain high-contrast clarity.
*   When using shadows, apply a single, unified elevation key on hover states:
    `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);`

### Z-Index Layers
To prevent overlap conflicts, all z-index properties must map to these exact steps:
*   Content / Base: `0`
*   Sticky Header / Navbar: `100`
*   Dropdown Menus / Popovers: `500`
*   Modals / Overlays: `1000`
*   Toast Alerts / Notifications: `9999`

---

## 5. Component States & Lifecycle

Every interactive element (buttons, form inputs, list items) must define its full visual lifecycle states:

1.  **Default:** Clean layout, styled using standard variables.
2.  **Hover:** Triggers subtle background change, border shifts to `--color-accent` (use `transition: all 0.2s ease`).
3.  **Active (Click):** Triggers `transform: scale(0.98);` for tactile physical feedback.
4.  **Focus-visible:** Outline highlight visible for keyboard accessibility navigation:
    `outline: 2px solid var(--color-accent); outline-offset: 2px;`
5.  **Disabled:** Opacity reduced to `0.6`, click interactions disabled:
    `pointer-events: none; cursor: not-allowed;`

---

## 6. Design Discovery & Competitor Reference Protocol

### Identified Competitors & Benchmarks
Our design features and layouts are inspired by industry leaders in access platforms and climbing equipment:

1.  **Zarges (zarges.com):**
    *   *UX Pattern:* Direct online configurators for fixed ladders and access stairs with standards compliance (EN 14122).
    *   *Aesthetic:* Clean aluminum grey, high contrast borders, clear input parameters.
2.  **Çağsan Merdiven (cagsanmerdiven.com):**
    *   *UX Pattern:* Clear sector pathways (Aviation, Industrial, Scaffolding, Mobile Scaffolding) to segment business buyers.
    *   *Aesthetic:* Strong technical grids and model-by-model specification tables.
3.  **WernerCo (wernerco.com):**
    *   *UX Pattern:* Clear vertical height dimensions display (reach height vs clearance vs platform height).
    *   *Aesthetic:* Safety icons and certifications placed directly adjacent to CTA forms to establish B2B credibility.

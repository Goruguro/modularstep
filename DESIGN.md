---
name: ModularStep Design System
version: 1.1.0
colors:
  bg_main: "#ffffff"      # Pure White for high-contrast B2B trust
  bg_surface: "#f8fafc"   # Light Slate Gray for content sections
  text_primary: "#0f172a" # Deep Slate Blue for authoritative headers
  text_secondary: "#475569" # Cool Slate for legible body columns
  accent: "#f97316"       # OSHA/Safety High-Visibility Orange
  accent_hover: "#ea580c" # Darker Orange for hover indications
  border: "#e2e8f0"       # Thin Slate gray joints
  success: "#16a34a"      # Safety compliant green
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
    display: "Space Grotesk, sans-serif"
---

## Overview
This document serves as the project-specific design system contract for **ModularStep.com**. It dictates the visual tokens, layout patterns, and component styling rules to ensure the web application feels professional, cohesive, and aligned with industrial engineering standards.

The visual identity of ModularStep is designed to evoke a sense of structural engineering, heavy-duty safety, and technical precision. We achieve this by pairing a clean, white background with safety orange highlights, slate-gray borders, and micro-grid patterns.

## Lessons from WernerCo & Çağsan Merdiven
Our design system implements the following lessons gathered from researching industry leaders:

### 1. Sizing and Height Clarifications (WernerCo)
*   **Clear Sizing Columns:** When displaying climbing equipment, always specify the different heights (e.g., Step Height, Clearance, Footprint) separately. Users must immediately understand how much space is needed.
*   **Trust Badge Proximity:** Always place compliance badges (OSHA 1910.25, EN 131) close to quote submission forms and call-to-actions to maximize conversion and B2B credibility.

### 2. B2B Sector Pathways (Çağsan Merdiven)
*   **Industrial Categorization:** Divide access solutions by clear sectors (e.g., Industrial, Mobile Scaffolding, Warehouse, Aviation) to let procurement agents navigate directly to their specific requirements.
*   **Detailed Specifications Grids:** Every product catalog page must feature a model-by-model technical specs grid, containing load ratings, dimensions, weights, and configuration triggers.

## Colors
The system enforces theme-driven variables instead of hardcoded hex values.

### Active Palette
- **Primary Background (`bg_main`):** `#ffffff` (Pure White) provides a clean, trustworthy background.
- **Surface Background (`bg_surface`):** `#f8fafc` (Light Slate) used to group configurator inputs and product modules.
- **Accent Color (`accent`):** `#f97316` (Safety Orange) acts as the high-visibility highlight for interactive states, handrails, and critical actions.
- **Borders (`border`):** `#e2e8f0` represents structural steel joints.

## Typography
Typography must provide clear visual hierarchy, avoiding flat, hard-to-read text columns.

### Font Stacks
*   **Display/Headers:** `Space Grotesk` - used to convey technical and industrial precision.
*   **Body/Labels:** `Inter` - optimized for legibility at small sizes.

### Type Scale Rules
*   **H1 Title:** `3.5rem` (Hero), bold, with letter-spacing of `-0.02em` for punchy headers.
*   **H2 Subtitle:** `2.25rem` (Sections), semi-bold.
*   **H3 Section:** `1.25rem`, semi-bold.
*   **Body:** `0.95rem`, normal, line-height `1.6`.

## Layout
Responsive layout safety prevents breaking elements on varied screen sizes.

### Grids & Flexboxes
*   **Base Spacing:** All padding, margins, and gaps must follow the `8px` grid scale.
*   **Flex Wrap:** All flex containers must include `flex-wrap: wrap` to allow items to stack gracefully on narrow mobile viewports.
*   **Auto-fit Grid:** CSS Grid templates for card listings must use:
  ```css
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  ```

## Shapes
Shapes define the product's visual identity.

### Rounding Standards
*   **Small Components (Buttons, Badges, Inputs):** `8px` (`radius_md`). Rounding must look crisp and industrial. Banned: Fully rounded pill buttons (`border-radius: 9999px`) as they look generic and lack a precise tech feel.
*   **Containers (Cards, Modals, Panels):** `12px` (`radius_lg`).

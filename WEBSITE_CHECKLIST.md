# WEBSITE_CHECKLIST.md - ModularStep.com Setup Guide

This document defines the development roadmap and quality standards for **ModularStep.com**. Follow this checklist step-by-step to build a production-ready, highly optimized B2B industrial website.

---

## 🟢 PHASE 0: Discovery, Competitor Benchmarking & Design Bootstrapping

*   [x] **Identify 3 Competitors:** Benchmark industry leaders in industrial access solutions.
    *   *Competitor 1 Name:* Zarges (zarges.com) - Key UX observation: Interactive access configurators with live standards verification (EN 14122) and CAD outputs.
    *   *Competitor 2 Name:* Çağsan Merdiven (cagsanmerdiven.com) - Key UX observation: Sector classifications (Industrial, Aviation, Scaffolding) to funnel B2B procurement agents.
    *   *Competitor 3 Name:* WernerCo (wernerco.com) - Key UX observation: Clear separation of height dimensions (footprint vs clearance vs reach height) and trust compliance badges next to forms.
*   [x] **Bootstrap DESIGN.md:** Copied `%USERPROFILE%\.gemini\config\DESIGN.template.md` to project root and adapted it with ModularStep's specific safety orange, slate, and Pure White tokens.
*   [ ] **Configure variables.css:** Establish design tokens under `:root` in `dist/index.css` (mapping to `--color-bg-main`, `--color-accent`, `--radius-md`, `--spacing-sm`, etc.).

---

## 🟢 PHASE 1: Backend API & Database Architecture

*   [x] **Express.js Server Setup:** `server.js` configured with CORS, JSON body parsing, and serving static files from the `dist/` directory on port 3006.
*   [x] **SQLite3 Database Integration:** Connected to SQLite database file `presets.db`.
*   [x] **Database Schema:** Created table `presets` supporting `id`, `name`, `steps`, `platform_length`, `step_width`, `has_handrails`, `load_capacity`.
*   [x] **Seeding Routine:** Auto-seeds database on startup with 3 default configurator presets (Esperon 3-Step, Esperon 5-Step, Ruton Compact Platform) if table is empty.
*   [ ] **Refactor with Shared SQL Helper:** Upgrade raw `sqlite3` driver queries to use the promise-based `sqlite-helper` class pulled from the shared code pool.

---

## 🟢 PHASE 2: Administrative Control Panel

*   [x] **Administrative Auth Route:** Secure `/api/login` credentials check on backend (`username === 'admin' && password === 'tgnc2000'`).
*   [x] **Admin Page HTML/JS:** Built `admin.html` and `admin.js` in `/dist` supporting:
    *   Secure admin login overlay when token is absent/invalid.
    *   Dynamic fetch and render of current custom configurator presets.
    *   CRUD Actions: Dynamic delete capability for presets.
*   [ ] **CRUD Extension:** Add preset creation form directly inside the admin panel to allow admins to create new custom specifications.

---

## 🟢 PHASE 3: Core Page Templates & Submenus

*   [ ] **Required Page Set:** Compile and structure these pages in the `/dist` directory:
    *   [x] `index.html` (Landing / Configurator Home)
    *   [x] `about.html` (Hakkımızda)
    *   [x] `contact.html` (İletişime Geç)
    *   [ ] `privacy.html` (Gizlilik İlkesi) - *[NEW]* Add policy documentation.
    *   [ ] `faq.html` (SSS - Sıkça Sorulan Sorular) - *[NEW]* Add FAQ collapse section.
*   [ ] **Dynamic Navigation Submenus:** The global header navigation must support submenus:
    *   *Desktop:* Hover reveals nested dropdowns (e.g. Products -> Fixed Stairs, Work Platforms, Scaffolding) with smooth CSS transitions.
    *   *Mobile:* Toggle submenus on click/tap using a hamburger button.
    *   *Escape key:* Close open menus on Escape key presses.
*   [x] **Global Footer:** Unified footer with copyright, links, and contact parameters on all pages.

---

## 🟢 PHASE 4: Performance & Optimization

*   [ ] **Critical CSS Inlining:** Extract and inline critical layout styles in the `<head>` of all HTML files for fast First Contentful Paint (FCP).
*   [ ] **Lazy Loading:** Pull `lazy-load` intersection observer script from the shared pool and integrate it on all non-above-the-fold product images.
*   [ ] **Font Optimization:** Load Space Grotesk and Inter fonts using `.woff2` format with `font-display: swap`.
*   [ ] **Zero-Bloat Rule:** Verify all animations and configurator calculations utilize native Web APIs. No third-party bundlers or heavy libraries.

---

## 🟢 PHASE 5: SEO (Search Engine Optimization)

*   [ ] **SEO Meta Tags:** Every HTML template must contain descriptive `<title>` and `<meta name="description">` tags matching the specific page context.
*   [ ] **Semantic Markup:** Utilize clean HTML5 semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`).
*   [ ] **Heading Hierarchy:** Enforce a strict hierarchy (one `<h1>` per page, sequential `<h2>` and `<h3>` tags).

---

## 🟢 PHASE 6: Automated Verification & Smoke Testing

*   [ ] **Local Verification:** Run the validation command `node validate-workspace.js` to ensure zero compilation or linter warnings.
*   [ ] **Smoke Testing:** Execute E2E headless Chrome CDP tests locally (`node test_cdp.js`) to verify all pages load without console exceptions.

# Decision Log

## 2026-07-03: Multi-Page B2B Access Site Expansion
- **Decision:** Split the initial single-page app into 5 distinct pages (`index.html`, `products.html`, `about.html`, `safety.html`, `contact.html`).
- **Rationale:** Better SEO, clearer B2B sector pathways inspired by WernerCo and Çağsan Merdiven, and better page-by-page modularity.

## 2026-07-03: SQLite Database Backend & PM2 Integration
- **Decision:** Create a lightweight Node.js Express server with SQLite3, listening on port `3006`, and proxying requests via Nginx.
- **Rationale:** Allowed the administrator to add/remove presets that dynamically load into the 3D configurator, replacing mock configurations with dynamic databound options.

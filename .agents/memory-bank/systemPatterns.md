# System Patterns & Architecture

## Architecture Overview
ModularStep is a lightweight Vanilla JS B2B web application backed by a Node.js Express API and SQLite database:
- **Frontend:** Pure HTML5, ES6 JavaScript modules, and Vanilla CSS. Three.js handles WebGL rendering.
- **Backend:** Express API server (`server.js`) listening on port `3006`. Presets database is stored in a local SQLite file (`presets.db`).
- **Nginx Reverse Proxy:** Proxies `/api/*` requests on port 80 to `http://127.0.0.1:3006`.
- **PM2 Daemon:** Keeps `server.js` running continuously under the process name `modularstep-api`.

## Code Modularity Limits
- **JavaScript & CSS files:** Must stay under **400 lines** per file to prevent file bloat.
- **HTML templates:** Allowed up to **1000 lines**.
- **Window bindings:** Module functions needed in HTML must be bound to the global `window` object at the bottom of the module file.

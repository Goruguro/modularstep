# Progress & Backlog

## Completed Tasks (Milestones)
- **Multi-page Architecture:** Initialized 5 B2B web pages with custom meta headers, clear sector path cards, and specs matrices.
- **3D Stair visualizer:** Dynamic WebGL crossover builder using Three.js and OrbitControls.
- **Admin Dashboard:** Password-protected CRUD editor (`admin.html`) enabling preset creation, listing, deletion, and real-time 3D previewing.
- **API & Database Server:** Node.js Express server + SQLite database running under PM2, proxied via Nginx.
- **Git & GitHub deployment:** Setup git locally and pushed the repository to `github.com/Goruguro/modularstep`.

## Pending Backlog (Next Steps)
1. **Dynamic Quote pre-fill:** Connect the "Lock In Configuration" button in `index.html` to direct the user to `contact.html?preset_id=N` (or query string parameters) to automatically pre-fill the custom steps/height details in the contact form.
2. **Preset Edit Mode:** Add an "Edit" button next to presets in the admin dashboard table to let administrators load existing presets back into the form, modify them, and save updates.
3. **Multi-Language Support (TR/EN):** Set up a localization switch to translate the product specs and corporate info into Turkish.
4. **Security Hardening:** Add JSON Web Token (JWT) session signatures on API routes and secure admin session checks.

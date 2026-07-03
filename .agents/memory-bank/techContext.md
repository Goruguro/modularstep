# Technical Context

## Tech Stack
- **Frontend Core:** HTML5, CSS3, ES6 JavaScript
- **3D Graphics:** Three.js (v128) via CDN + OrbitControls
- **Backend API:** Node.js, Express, CORS
- **Database:** SQLite3
- **Server Deployment:** Ubuntu, Nginx, PM2, systemd, aaPanel on Paris VCN (`89.168.52.188`)
- **Remote Access:** SSH key at `C:\Users\Administrator\.ssh\paris_yeni`

## Build and Deploy
- **Local Dev:** Edit files inside `dist/` or project root.
- **Deploy Command:** Run `node deploy.js` to package files into `dist.tar.gz`, copy via SCP, extract on VCN, run production npm install, and reload PM2.

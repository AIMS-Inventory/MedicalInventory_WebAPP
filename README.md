# AstroMed - Visual Inventory Tracking System

## Overview
AstroMed is a browser interface for viewing shelf inventory and audit activity from the kiosk/backend stack.

The Settings page is the connection bridge between this web app and the kiosk/backend service, using host and port configuration persisted in localStorage.

## Current Features
- Login screen for prototype access flow
- Dashboard with live shelf inventory table
- Stats cards (total, occupied, empty, backend health)
- System Logs view for audit entries
- Settings page for backend host/port connection

## Run Locally
1. Open `index.html` directly, or
2. Serve the folder with a local static server (recommended):

```bash
python3 -m http.server 5500
```

Then open `http://127.0.0.1:5500/index.html`.

Default password: `67`

## Architecture Notes
- Frontend: HTML, CSS, vanilla JavaScript
- Backend integration: REST endpoints configured through Settings
- Connection configuration: localStorage key `astroMedBackendUrl`

## Design Principles
- Keep interaction functional and immediate (no decorative typing delays)
- Use one primary accent color consistently
- Reserve strong visual effects for key hero components only
- Keep supporting UI clean and readable for operations use

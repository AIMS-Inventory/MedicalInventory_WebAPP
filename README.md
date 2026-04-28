# AIMS - Visual Inventory Tracking System

## Overview
AIMS is a browser interface for viewing shelf inventory and audit activity from the C++ backend stack.

The Settings page connects the web app to the backend via WebSocket, using a host and port persisted in `localStorage`.

## Features
- Login screen with session-based auth (sessionStorage, SHA-256 hashed password)
- Dashboard with live shelf inventory table, search/filter, and expandable row details
- Stats cards: total shelves, occupied, empty, backend health
- System Logs view for audit entries
- AIMS Agent: generate and download a formatted inventory report
- Settings page for WebSocket host/port configuration


## Run Locally
1. Open `index.html` directly, or
2. Serve with a local static server (recommended to avoid CORS on assets):

```bash
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

## Architecture
- Frontend: HTML, CSS, vanilla JavaScript — no build step, no dependencies
- Backend integration: WebSocket (`ws://`)
- Connection config persisted in: `localStorage` key `astroMedBackendUrl`
- Auth session persisted in: `sessionStorage` key `astroMedAuth`

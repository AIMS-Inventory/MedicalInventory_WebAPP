# Visual Inventory Tracking System
**NASA HUNCH 2025-2026 Prototype**

This is a **web-based user interface** for a Visual Inventory Tracking System designed for the International Space Station (ISS). The system uses a Jetson Nano camera to automatically detect when medical supplies are removed, and this web interface displays the data in real-time.

## Project Overview

**The Problem:** On long-duration space missions, tracking medication and medical supplies manually is time-consuming and error-prone. Astronauts need a system that automatically detects when items are removed and provides real-time inventory status.

**The Solution:** A Jetson Nano camera system detects item removal using computer vision, logs usage data, and generates AI predictions. This web interface displays all that information in a clean, medical-grade dashboard.

**Your Component:** This web UI is the frontend that astronauts use to:
- View live camera feed from the Jetson Nano
- Monitor current inventory status
- Review usage logs (when items were removed, by whom)
- See AI predictions for supply depletion
- Add new items using OCR text extraction

### Key Features

1.  **Login System:** Simple password authentication (password: `67` for prototype) to protect the dashboard
2.  **Dashboard:** Main control center with:
    - Live video stream placeholder (for Jetson Nano camera feed)
    - Real-time inventory table with auto-alerting for Expired or Low Stock items
3.  **Inventory Log:** Displays usage history from `logs.json` (simulates Jetson Nano SD card output)
    - Shows: timestamp, item name, quantity removed, astronaut name, location
4.  **AI Predictions:** Displays supply depletion forecasts from `predictions.json`
    - Color-coded urgency: Green (OK), Yellow (Warning), Red (Critical)
    - Shows days until depletion and usage rates
5.  **Smart Scan (OCR):** Simulates optical character recognition
    - Paste medication label text → automatically extracts dates, dosages, quantities
    - Uses Regular Expressions (Regex) for pattern matching
6.  **Offline Capable:** Uses `localStorage` for data persistence. Works without internet, simulating Deep Space Network blackouts.
7.  **Medical-Grade UI:** Dark theme with high contrast, clear fonts, designed for space station displays

---

## How to Run (Development)

This project uses **Vanilla JavaScript**, so it requires no complex installation.

1.  **Download** the code.
2.  **Open** the `index.html` file in any modern web browser (Chrome, Edge, Firefox).
3.  **Use** the app!

## File Structure
*   `index.html`: The main structure of the website.
*   `style.css`: The "Future Interface" design and colors.
*   `script.js`: The brain of the application (Database logic, Extraction logic, Search logic).

## [TODO: Technical Description / For Judges]
The "Smart Scan" feature uses **Regular Expressions (Regex)** to parse text patterns. This mimics how a backend AI server would process Optical Character Recognition (OCR) data. 

*   **Dates:** It looks for patterns like `YYYY-MM-DD` or `MM/YYYY`.
*   **Dosage:** It looks for numbers followed by medical units (mg, ml, g).
*   **Quantity:** It looks for keywords like "Qty", "Count", or "#".

---
*Created by [TODO: Team Name] for NASA HUNCH 2026*
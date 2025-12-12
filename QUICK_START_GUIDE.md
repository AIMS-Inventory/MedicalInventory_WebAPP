# 🚀 NASA HUNCH Quick Start Guide
## Visual Inventory Tracking System - Get Up to Speed FAST

---

## **🎯 What Is This Project? (30-Second Pitch)**

**"We built a Visual Inventory Tracking System for the ISS that uses a Jetson Nano camera to automatically detect when medical supplies are removed. The web interface displays real-time inventory, usage logs, and AI predictions for supply depletion. This solves the problem of manual tracking in space missions where time is critical."**

---

## **🔗 How Everything Connects**

### **The Big Picture:**

```
Jetson Nano (Hardware)
    ↓
Camera detects item removal
    ↓
Logs data to SD card (logs.json)
    ↓
AI Model analyzes usage patterns
    ↓
Generates predictions (predictions.json)
    ↓
Web UI (This Prototype) displays everything
```

### **Your Role: The Web UI**

You built the **web interface** that:
- ✅ Displays live camera feed (placeholder for now)
- ✅ Shows current inventory status
- ✅ Displays usage logs from the Jetson Nano
- ✅ Shows AI predictions for supply depletion
- ✅ Provides a clean, medical-grade interface for astronauts

---

## **📋 System Components Explained**

### **1. Jetson Nano (Hardware - Your Team's Other Component)**
- **What it does:** Runs a camera that watches the medical supply storage
- **How it works:** Uses computer vision to detect when items are removed
- **Output:** Writes usage data to `logs.json` on SD card
- **Your connection:** The web UI reads this `logs.json` file to display usage history

### **2. Web UI (Your Prototype - What You Built)**
- **What it does:** Provides a dashboard for astronauts to view inventory
- **Files:**
  - `index.html` - The webpage structure
  - `style.css` - Medical/aerospace styling (dark theme, high contrast)
  - `script.js` - All the logic (login, data loading, display)
- **Features:**
  - Login system (password: `67`)
  - Dashboard with video stream placeholder
  - Inventory log (reads from `logs.json`)
  - AI predictions (reads from `predictions.json`)
  - Smart scanner (OCR simulation)

### **3. Data Flow**
- **logs.json** → Simulates what Jetson Nano writes when items are detected
- **predictions.json** → Simulates AI model output predicting supply depletion
- **LocalStorage** → Browser storage for current inventory (works offline)

---

## **🎤 Presentation Script (2-3 Minutes)**

### **Opening (30 seconds)**
*"Good [morning/afternoon]. I'm [Your Name], and I'm presenting the web interface component of our NASA HUNCH Visual Inventory Tracking System. This system addresses a critical need: tracking medical supplies on the ISS without manual logging, which saves valuable astronaut time."*

### **Problem Statement (20 seconds)**
*"On long-duration space missions, tracking medication and medical supplies manually is time-consuming and error-prone. Our solution uses computer vision on a Jetson Nano to automatically detect when items are removed, and this web interface displays that data in real-time."*

### **Demo Flow (90 seconds)**

1. **Show Login** (10 sec)
   - *"The system requires authentication for security"*
   - Enter password: `67`
   - *"Password is hardcoded for prototype demonstration"*

2. **Dashboard** (20 sec)
   - *"This is the main control center"*
   - Point to video placeholder: *"This is where the live Jetson Nano camera feed will appear"*
   - Show inventory table: *"Current stock levels with automatic alerts for expired or low-stock items"*

3. **Inventory Log** (20 sec)
   - Click "Inventory Log" tab
   - *"This shows usage history - when items were removed, by which astronaut, and when"*
   - *"The data comes from logs.json, which simulates what the Jetson Nano writes to the SD card"*

4. **AI Predictions** (20 sec)
   - Click "AI Predictions" tab
   - *"This simulates AI predictions for when supplies will run out"*
   - *"Color-coded: Green = OK, Yellow = Warning, Red = Critical"*
   - *"In full implementation, a machine learning model on the Jetson analyzes usage patterns"*

5. **Smart Scanner** (20 sec)
   - Click "Smart Scan (OCR)" tab
   - *"This simulates optical character recognition for adding new items"*
   - Paste sample text, show auto-extraction
   - *"Uses pattern matching to extract dates, dosages, and quantities"*

### **Technical Highlights (30 seconds)**
*"The web interface is built with vanilla JavaScript, HTML, and CSS - no complex frameworks. This makes it easy to maintain and explain. It works offline using browser storage, simulating operation during Deep Space Network blackouts. The Flask backend is included for future integration with the Jetson Nano."*

### **Closing (10 seconds)**
*"This prototype demonstrates the user interface astronauts would use to monitor medical supplies. The next step is full integration with the Jetson Nano camera system. Thank you. Questions?"*

---

## **❓ Common Questions & Your Answers**

### **Q: "What's your specific role in this project?"**
**A:** *"I built the web user interface - the dashboard that astronauts use to view inventory data, usage logs, and predictions. The interface reads data from JSON files that simulate what the Jetson Nano camera system generates."*

### **Q: "How does this connect to the Jetson Nano?"**
**A:** *"The Jetson Nano runs a camera that detects when medical supplies are removed. It logs this data to an SD card as logs.json. The web UI reads this file to display usage history. In full implementation, we'd connect via HTTP API to the Jetson."*

### **Q: "What technologies did you use?"**
**A:** *"Vanilla JavaScript, HTML, and CSS - no frameworks. This keeps the code simple and explainable. I also included a Python Flask backend for future integration, but the current prototype works client-side only."*

### **Q: "How does the AI prediction work?"**
**A:** *"Currently simulated with hardcoded data in predictions.json. In full implementation, a machine learning model on the Jetson Nano would analyze historical usage patterns and predict when supplies will run out based on removal frequency."*

### **Q: "What's the biggest challenge you faced?"**
**A:** *"Creating a user interface that's both functional and appropriate for a medical/aerospace environment - high contrast, clear fonts, and intuitive navigation. Also ensuring the system works offline since space missions can't always rely on constant connectivity."*

### **Q: "What would you improve next?"**
**A:** *"Full integration with the Jetson Nano camera feed, real-time data updates via WebSocket, and implementing the actual machine learning prediction model instead of simulated data."*

---

## **🔧 Technical Details (If Asked Deeply)**

### **File Structure:**
- `index.html` - Webpage structure (210 lines)
- `style.css` - Styling (555 lines) - Dark theme, medical/aerospace aesthetic
- `script.js` - All logic (470 lines) - Login, data loading, table rendering
- `logs.json` - Sample usage data (simulates Jetson output)
- `predictions.json` - Sample AI predictions
- `app.py` - Flask backend (optional, for future integration)

### **Key Functions:**
- `handleLogin()` - Password authentication (line 55)
- `loadUsageLogs()` - Reads logs.json (line 280)
- `loadPredictions()` - Reads predictions.json (line 330)
- `renderTable()` - Displays inventory (line 170)
- `runExtraction()` - OCR simulation (line 123)

### **Data Storage:**
- **sessionStorage** - Remembers login state
- **localStorage** - Stores inventory data (works offline)
- **JSON files** - Simulate Jetson Nano data output

---

## **🚨 Emergency Troubleshooting**

**Login doesn't work?**
- Password is: `67`
- Check browser console (F12) for errors
- Hard refresh: Ctrl+Shift+R

**JSON files don't load?**
- Must run a local server (not open file directly)
- Use: `npx http-server -p 8000`
- Then go to: `http://localhost:8000`

**Something looks broken?**
- Check browser console (F12)
- Make sure all files are in same folder
- Try different browser (Chrome/Edge recommended)

---

## **📝 Key Talking Points**

✅ **Beginner-Friendly Code** - No frameworks, easy to explain  
✅ **Functional Security** - Login system protects dashboard  
✅ **Offline Capable** - Works without internet (simulates space)  
✅ **Medical-Grade UI** - High contrast, clear fonts, intuitive  
✅ **Production-Ready Structure** - Can be extended with real hardware  

---

## **🎯 Remember These Numbers**

- **Password:** `67`
- **Port (if using server):** `8000`
- **Files:** 3 main files (HTML, CSS, JS) + 2 JSON data files
- **Lines of code:** ~1,200 total (very manageable to explain)
- **Features:** 5 main features (Login, Dashboard, Log, Predictions, Scanner)

---

**You've got this! 🚀**


// --- ASTROMED INVENTORY SYSTEM ---
// Written for NASA HUNCH 2026 Prototype

// 1. STATE MANAGEMENT
// We keep the list of items in this global variable so we can access it anywhere.
let inventory = [];

// When the app starts, run these functions immediately
window.onload = function() {
    loadData();      // Load from LocalStorage
    renderTable();   // Draw the table
    updateStats();   // Update sidebar numbers
};

// --- CORE FUNCTIONS (DATABASE) ---

// Load from LocalStorage (Simulates a database in the browser)
function loadData() {
    const storedData = localStorage.getItem('astroMedInventory');
    
    if (storedData) {
        // If we have data saved, use it
        inventory = JSON.parse(storedData);
    } else {
        // If it's the first time running, load some Mock Data so judges see something
        inventory = [
            { id: 1, name: 'Ibuprofen', dosage: '200mg', qty: 150, expiry: '2027-05-15', lot: 'IB-99' },
            { id: 2, name: 'Epinephrine', dosage: '0.3mg', qty: 2, expiry: '2024-12-01', lot: 'EPI-1' },
            { id: 3, name: 'Bandages', dosage: 'N/A', qty: 50, expiry: '2030-01-01', lot: 'BND-5' }
        ];
        saveData(); // Save this mock data
    }
}

// Save current state to LocalStorage
function saveData() {
    localStorage.setItem('astroMedInventory', JSON.stringify(inventory));
    updateStats();
}

// --- EXTRACTION ENGINE (THE "SMART SCAN" LOGIC) ---
// This function mimics OCR (Optical Character Recognition).
// It looks for patterns in the text to "guess" the data.
function runExtraction() {
    const rawText = document.getElementById('raw-text-input').value;
    const btn = document.querySelector('.btn-action');
    const statusMsg = document.getElementById('scan-status');

    // 1. Visual Feedback (Make it look like it's processing)
    btn.innerHTML = "SCANNING...";
    btn.style.backgroundColor = "#999";
    
    setTimeout(() => {
        // 2. REGEX LOGIC (Pattern Matching)
        
        // Find Date (Looks for YYYY-MM-DD)
        // Explanation: \d{4} is 4 digits, \d{2} is 2 digits
        const dateMatch = rawText.match(/(\d{4}-\d{2}-\d{2})/);
        
        // Find Quantity (Looks for "Qty: 50" or "Count 50")
        const qtyMatch = rawText.match(/(?:Qty|Count|Quantity)[:\s]*(\d+)/i);
        
        // Find Dosage (Looks for number followed by mg/ml/g)
        const doseMatch = rawText.match(/(\d+(?:\.\d+)?)\s?(mg|ml|mcg|g)/i);

        // Find Name (Rough guess: takes the first line of text)
        let nameGuess = "";
        const lines = rawText.split('\n');
        if(lines.length > 0 && lines[0].trim() !== "") {
            nameGuess = lines[0].trim();
        }

        // 3. Fill the form fields automatically
        if (dateMatch) document.getElementById('field-date').value = dateMatch[0];
        if (qtyMatch) document.getElementById('field-qty').value = qtyMatch[1];
        if (doseMatch) document.getElementById('field-dosage').value = doseMatch[0];
        if (nameGuess) document.getElementById('field-name').value = nameGuess;

        // Reset Button
        btn.innerHTML = "Run Extraction Protocol";
        btn.style.backgroundColor = ""; // Reset color
        statusMsg.innerText = "Data Extracted Successfully.";
        statusMsg.style.color = "#26de81"; // Green
        
    }, 800); // 0.8 second delay to simulate computer thinking
}

// --- ADD ITEM LOGIC ---
function saveItem(event) {
    event.preventDefault(); // Prevents the page from refreshing

    // Create a new item object
    const newItem = {
        id: Date.now(), // Uses current time as a unique ID
        name: document.getElementById('field-name').value,
        dosage: document.getElementById('field-dosage').value,
        qty: parseInt(document.getElementById('field-qty').value),
        expiry: document.getElementById('field-date').value,
        lot: document.getElementById('field-lot').value
    };

    inventory.unshift(newItem); // Add to the top of the array
    saveData(); // Save to browser memory
    
    // Clear the form and go back to dashboard
    document.getElementById('add-item-form').reset();
    document.getElementById('raw-text-input').value = '';
    document.getElementById('scan-status').innerText = '';
    
    alert("Item added to Mainframe Inventory.");
    showView('dashboard');
    renderTable();
}

// --- DELETE LOGIC ---
function deleteItem(id) {
    if(confirm("WARNING: Are you sure you want to remove this item?")) {
        // Keep everything EXCEPT the item with this ID
        inventory = inventory.filter(item => item.id !== id);
        saveData();
        renderTable();
    }
}

// --- SEARCH/FILTER LOGIC ---
function filterInventory() {
    const term = document.getElementById('search-bar').value.toLowerCase();
    renderTable(term); // Re-draw table with only matching items
}

// --- RENDER UI (Drawing the table) ---
function renderTable(searchTerm = "") {
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = ''; // Clear current table

    inventory.forEach(item => {
        // If searching, skip items that don't match
        if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) return;

        // Status Logic (The "Smart" Alert System)
        const today = new Date();
        const expDate = new Date(item.expiry);
        let statusLabel = 'OK';
        let statusClass = 'status-ok';

        // Check Expiry
        if (expDate < today) {
            statusLabel = 'EXPIRED';
            statusClass = 'status-crit';
        } 
        // Check Stock Levels
        else if (item.qty < 15) {
            statusLabel = 'LOW STOCK';
            statusClass = 'status-warn';
        }

        // Create the HTML row
        const row = `
            <tr>
                <td class="med-name">${item.name}</td>
                <td>${item.dosage}</td>
                <td style="font-family:'Space Mono'">${item.qty}</td>
                <td>${item.expiry}</td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td>
                    <button class="btn-delete" onclick="deleteItem(${item.id})">REMOVE</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// --- NAVIGATION (Switching Screens) ---
function showView(viewName) {
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    
    // Remove 'active' class from buttons
    document.querySelectorAll('.nav-buttons button').forEach(el => el.classList.remove('active'));

    // Show the requested section
    document.getElementById(viewName + '-view').classList.remove('hidden');
    document.getElementById('btn-' + viewName).classList.add('active');
}

// Update the counters in the sidebar
function updateStats() {
    document.getElementById('total-count').innerText = inventory.length;
}

// --- EXPORT TO CSV (Mission Report) ---
function exportCSV() {
    // Create the CSV content
    let csv = "Name,Dosage,Quantity,Expiry,Lot\n";
    inventory.forEach(item => {
        csv += `${item.name},${item.dosage},${item.qty},${item.expiry},${item.lot}\n`;
    });

    // Create a fake invisible link to download the file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mission_Inventory_Report.csv';
    a.click();
}
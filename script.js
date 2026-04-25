// AstroMed - Visual Inventory Tracking System
// NASA HUNCH | PCTI STEM - Team Lakind

const CORRECT_PASSWORD = "67";
let isAuthenticated = false;

// Live shelf data from backend
let shelfData = [];
// Live audit logs from backend
let auditLogs = [];

// Backend base URL — persisted in localStorage
function getBackendUrl() {
    return localStorage.getItem('astroMedBackendUrl') || '';
}

window.onload = function () {
    initializeLoginBeamBackground();
    checkAuth();
    if (isAuthenticated) {
        initializeApp();
    }
};

// --- AUTHENTICATION ---

function checkAuth() {
    if (sessionStorage.getItem('astroMedAuth') === 'true') {
        isAuthenticated = true;
        showApp();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('login-view').classList.remove('hidden');
    document.getElementById('app-container').classList.add('hidden');
}

function showApp() {
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
}

function handleLogin(event) {
    if (event) event.preventDefault();
    const passwordInput = document.getElementById('password-input');
    const errorMsg = document.getElementById('login-error');
    if (!passwordInput) return;

    if (passwordInput.value === CORRECT_PASSWORD) {
        isAuthenticated = true;
        sessionStorage.setItem('astroMedAuth', 'true');
        showApp();
        initializeApp();
    } else {
        if (errorMsg) {
            errorMsg.textContent = "Invalid password. Access denied.";
            errorMsg.style.display = 'block';
        }
        passwordInput.value = '';
    }
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        isAuthenticated = false;
        sessionStorage.removeItem('astroMedAuth');
        showLogin();
        document.getElementById('password-input').value = '';
        document.getElementById('login-error').style.display = 'none';
    }
}

// --- INIT ---

function initializeApp() {
    loadSettingsUI();
    refreshData();
}

// --- SETTINGS ---

function loadSettingsUI() {
    const url = getBackendUrl();
    if (url) {
        try {
            const u = new URL(url);
            document.getElementById('setting-host').value = u.hostname;
            document.getElementById('setting-port').value = u.port;
        } catch (_) {}
        document.getElementById('current-backend-url').textContent = url;
    }
}

function saveSettings() {
    return saveSettingsAsync();
}

async function saveSettingsAsync() {
    const host = document.getElementById('setting-host').value.trim();
    const port = document.getElementById('setting-port').value.trim();
    const statusEl = document.getElementById('settings-status');

    if (!host || !port) {
        statusEl.textContent = 'Please enter both host and port.';
        statusEl.style.color = 'var(--alert-red)';
        return;
    }

    const url = `http://${host}:${port}`;
    localStorage.setItem('astroMedBackendUrl', url);
    document.getElementById('current-backend-url').textContent = url;
    statusEl.textContent = 'Saved. Connecting...';
    statusEl.style.color = 'var(--highlight-cyan)';

    try {
        const verifyRes = await fetch(`${url}/systemHealth`, { signal: AbortSignal.timeout(5000) });
        if (!verifyRes.ok) throw new Error(`HTTP ${verifyRes.status}`);
        const verifyJson = await verifyRes.json();
        if (verifyJson.status !== 'ok') throw new Error('Bad backend status');

        statusEl.textContent = '✓ Connected successfully.';
        statusEl.style.color = 'var(--safe-green)';

        try {
            await runBackendConnectScan();
        } catch (_) {
            // Failsafe: continue directly to dashboard load if animation fails.
        }

        showView('dashboard');
        await refreshData();
    } catch (err) {
        setHealthOffline('Unreachable');
        statusEl.textContent = '✗ Could not reach backend. Check host/port.';
        statusEl.style.color = 'var(--alert-red)';
    }
}

function runBackendConnectScan() {
    return new Promise((resolve, reject) => {
        try {
            const existing = document.getElementById('backend-scan-overlay');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'backend-scan-overlay';
            overlay.className = 'backend-scan-overlay';

            const panel = document.createElement('div');
            panel.className = 'backend-scan-panel';
            panel.innerHTML = `
                <div class="backend-scan-title">ESTABLISHING BACKEND CONNECTION... SCANNING</div>
                <div class="backend-scan-track">
                    <div class="backend-scan-bar"></div>
                </div>
            `;

            overlay.appendChild(panel);
            document.body.appendChild(overlay);

            window.setTimeout(() => {
                overlay.remove();
                resolve();
            }, 1900);
        } catch (err) {
            reject(err);
        }
    });
}

// --- BACKEND FETCH ---

async function fetchSystemHealth() {
    const base = getBackendUrl();
    const healthEl = document.getElementById('health-status');
    const cardHealth = document.getElementById('card-health');

    if (!base) {
        setHealthOffline('Not configured');
        return false;
    }

    try {
        const res = await fetch(`${base}/systemHealth`, { signal: AbortSignal.timeout(4000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.status === 'ok') {
            healthEl.textContent = 'ONLINE';
            healthEl.className = 'status-online';
            if (cardHealth) { cardHealth.textContent = 'OK'; cardHealth.style.color = 'var(--safe-green)'; }
            return true;
        } else {
            throw new Error('Bad status');
        }
    } catch (err) {
        setHealthOffline('Unreachable');
        return false;
    }
}

function setHealthOffline(reason) {
    const healthEl = document.getElementById('health-status');
    const cardHealth = document.getElementById('card-health');
    if (healthEl) { healthEl.textContent = 'OFFLINE'; healthEl.className = 'status-offline'; }
    if (cardHealth) { cardHealth.textContent = reason; cardHealth.style.color = 'var(--alert-red)'; }
}

async function fetchShelves() {
    const base = getBackendUrl();
    if (!base) {
        showError('Backend not configured. Go to Settings and enter the host and port.');
        return;
    }

    try {
        const res = await fetch(`${base}/getShelves`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
        const json = await res.json();
        shelfData = json.shelves || [];
        hideError();
        renderShelfTable();
        updateStats();
    } catch (err) {
        shelfData = [];
        showError(`Failed to fetch shelf data: ${err.message}. Is the backend running at ${base}?`);
        renderShelfTable();
        updateStats();
    }
}

async function fetchAuditLogs() {
    const base = getBackendUrl();
    if (!base) return;

    try {
        const res = await fetch(`${base}/getAuditLog`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
        const json = await res.json();
        auditLogs = json.entries || [];
        renderLogs();
    } catch (err) {
        auditLogs = [];
        console.error("Failed to fetch logs:", err);
        renderLogs(true);
    }
}

function renderLogs(error = false) {
    const list = document.getElementById('audit-log-list');
    if (!list) return;

    list.innerHTML = '';
    if (error) {
        list.innerHTML = `<li class="log-entry error-msg">Failed to load logs.</li>`;
        return;
    }
    
    if (auditLogs.length === 0) {
        list.innerHTML = `<li class="log-entry table-msg">No entries found.</li>`;
        return;
    }

    auditLogs.forEach((entry) => {
        const li = document.createElement('li');
        li.className = 'log-entry';
        li.textContent = entry;
        list.appendChild(li);
    });
}


// --- REFRESH ---

async function refreshData() {
    const btn = document.getElementById('btn-refresh');
    if (btn) { btn.textContent = '⟳ Refreshing...'; btn.disabled = true; }

    await fetchSystemHealth();
    await Promise.all([fetchShelves(), fetchAuditLogs()]);

    if (btn) { btn.innerHTML = '&#8635; Refresh'; btn.disabled = false; }
}

// --- ERROR BANNER ---

function showError(msg) {
    const banner = document.getElementById('error-banner');
    const text = document.getElementById('error-banner-text');
    if (banner && text) {
        text.textContent = '⚠ ' + msg;
        banner.classList.remove('hidden');
    }
}

function hideError() {
    const banner = document.getElementById('error-banner');
    if (banner) banner.classList.add('hidden');
}

// --- RENDER TABLE ---

function renderShelfTable(searchTerm = '') {
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = '';

    const filtered = shelfData.filter(shelf => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
            shelf.tag?.toLowerCase().includes(q) ||
            String(shelf.box_id).includes(q) ||
            shelf.box_pretty_name?.toLowerCase().includes(q) ||
            shelf.registrant?.toLowerCase().includes(q)
        );
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="table-msg">${
            shelfData.length === 0
                ? 'No shelf data received. Check backend connection in Settings.'
                : 'No results match your search.'
        }</td></tr>`;
        return;
    }

    filtered.forEach((shelf, index) => {
        const occupied = shelf.box_id !== -1 && shelf.box_id !== null && shelf.box_id !== undefined;
        const statusLabel = occupied ? 'OCCUPIED' : 'STANDBY';
        const statusColor = occupied ? 'var(--safe-green, var(--accent))' : 'var(--warn-yellow, var(--accent-dim))';
        const boxIdDisplay = occupied ? String(shelf.box_id) : '—';
        const boxNameDisplay = (occupied && shelf.box_pretty_name) ? shelf.box_pretty_name : '—';
        const registrantDisplay = (occupied && shelf.registrant) ? shelf.registrant : '—';

        const shelfTag = String(shelf.tag ?? `shelf-${index + 1}`);
        const detailId = `detail-${shelfTag}`.replace(/[^a-zA-Z0-9_-]/g, '-');

        const mainRow = document.createElement('tr');
        mainRow.className = 'shelf-row';
        mainRow.innerHTML = `
            <td class="med-name"><span class="expand-indicator">[+]</span>${shelfTag}</td>
            <td style="font-family: 'Space Mono', monospace;">${boxIdDisplay}</td>
            <td>${boxNameDisplay}</td>
            <td>${registrantDisplay}</td>
            <td style="color: ${statusColor}; font-family: 'Space Mono', monospace;">${statusLabel}</td>
            <td>${occupied ? '<button class="btn-delete" type="button">CLEAR</button>' : '—'}</td>
        `;

        const detailRow = document.createElement('tr');
        detailRow.className = 'shelf-detail-row';
        detailRow.id = detailId;
        detailRow.innerHTML = `
            <td colspan="6" style="padding: 0;">
                <div class="detail-grid">
                    <div class="detail-data-block">CONTENTS:<span>${shelf.box_pretty_name || shelf.contents || 'N/A'}</span></div>
                    <div class="detail-data-block">LAST SCANNED:<span>${shelf.last_scan_time || '--:--:--'}</span></div>
                    <div class="detail-data-block">SYS NOTES:<span>${shelf.notes || 'NOMINAL'}</span></div>
                </div>
            </td>
        `;

        const clearButton = mainRow.querySelector('.btn-delete');
        if (clearButton && occupied) {
            clearButton.onclick = (event) => {
                event.stopPropagation();
                clearShelf(shelfTag);
            };
        }

        mainRow.onclick = () => {
            const indicator = mainRow.querySelector('.expand-indicator');
            const isOpen = detailRow.classList.toggle('is-open');
            if (indicator) {
                indicator.textContent = isOpen ? '[–]' : '[+]';
            }
        };
        tbody.appendChild(mainRow);
        tbody.appendChild(detailRow);
    });
}

function initializeLoginBeamBackground() {
    const bg = document.getElementById('login-beam-bg');
    if (!bg) return;

    const rebuild = () => {
        bg.innerHTML = '';

        const columnsWrap = document.createElement('div');
        columnsWrap.className = 'beam-columns';

        const columnSpacing = 40;
        const columnCount = Math.ceil(window.innerWidth / columnSpacing) + 8;

        for (let index = 0; index < columnCount; index += 1) {
            const column = document.createElement('div');
            column.className = 'beam-column';
            column.style.left = `${index * columnSpacing}px`;

            if (index % 4 === 0) {
                const beam = document.createElement('div');
                beam.className = 'beam-fall';
                beam.style.height = index % 8 === 0 ? '32px' : '48px';
                beam.style.animationDuration = index % 8 === 0 ? '7s' : '11s';
                beam.style.animationDelay = `${index * 0.5}s`;
                column.appendChild(beam);
            }

            columnsWrap.appendChild(column);
        }

        bg.appendChild(columnsWrap);
    };

    rebuild();
    window.addEventListener('resize', rebuild);
}

function filterShelves() {
    renderShelfTable(document.getElementById('search-bar').value.toLowerCase());
}

// --- STATS ---

function updateStats() {
    const total = shelfData.length;
    const occupied = shelfData.filter(s => s.box_id !== -1 && s.box_id !== null && s.box_id !== undefined).length;
    const empty = total - occupied;

    const formatStat = (value) => Number.isFinite(value) ? String(value) : '—';

    document.getElementById('total-shelves').textContent = formatStat(total);
    document.getElementById('boxes-on-shelves').textContent = formatStat(occupied);
    document.getElementById('card-total-shelves').textContent = formatStat(total);
    document.getElementById('card-occupied').textContent = formatStat(occupied);
    document.getElementById('card-empty').textContent = formatStat(empty);
}

// --- CLEAR SHELF ---

async function clearShelf(shelfTag) {
    if (!confirm(`Clear shelf "${shelfTag}"?\nThis will remove the box record from this shelf.`)) return;

    const base = getBackendUrl();
    if (!base) {
        showError('Backend not configured. Go to Settings and enter the host and port.');
        return;
    }

    try {
        const res = await fetch(`${base}/clearShelf?shelf_id=${encodeURIComponent(shelfTag)}`, {
            method: 'DELETE',
            signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
        const json = await res.json();
        if (json.status !== 'ok') throw new Error('Unexpected response from server.');
        hideError();
        await fetchShelves(); // refresh table after clearing
    } catch (err) {
        showError(`Failed to clear shelf "${shelfTag}": ${err.message}`);
    }
}

// --- NAVIGATION ---

function showView(viewName) {
    if (!isAuthenticated) { showLogin(); return; }

    document.getElementById('app-container')
        .querySelectorAll('.view-section')
        .forEach(el => el.classList.add('hidden'));

    document.querySelectorAll('.nav-buttons button')
        .forEach(el => el.classList.remove('active'));

    const view = document.getElementById(viewName + '-view');
    if (view) {
        view.classList.remove('hidden');
        document.getElementById('btn-' + viewName)?.classList.add('active');
    }
}

// Global exports for inline HTML event handlers
window.handleLogin     = handleLogin;
window.logout          = logout;
window.showView        = showView;
window.filterShelves   = filterShelves;
window.refreshData     = refreshData;
window.saveSettings    = saveSettings;
window.clearShelf      = clearShelf;

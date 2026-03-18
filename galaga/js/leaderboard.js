// Shared online leaderboard using jsonblob.com (free, no auth)
// Falls back to localStorage if offline

const BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019d0340-5818-71bd-b88d-8a7f732ed2a4';
const LOCAL_KEY = 'galaga_leaderboard';

let cachedBoard = [];

// --- Online ---

async function fetchOnline() {
    try {
        const res = await fetch(BLOB_URL, {
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return null;
    }
}

async function saveOnline(board) {
    try {
        await fetch(BLOB_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(board)
        });
    } catch {
        // silently fail — local backup handles it
    }
}

// --- Local fallback ---

function loadLocal() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    } catch { return []; }
}

function saveLocal(board) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(board));
}

// --- Public API ---

export async function refreshLeaderboard() {
    const online = await fetchOnline();
    if (online !== null) {
        cachedBoard = online.sort((a, b) => b.score - a.score).slice(0, 10);
        // Sync local with online
        saveLocal(cachedBoard);
    } else {
        cachedBoard = loadLocal();
    }
    return cachedBoard;
}

export function getLeaderboard() {
    return cachedBoard;
}

export function getHighScore() {
    return cachedBoard.length > 0 ? cachedBoard[0].score : 0;
}

export async function saveScore(name, score, wave) {
    const entry = { name, score, wave, ts: Date.now() };

    // Get current online board, add entry, save back
    let board = await fetchOnline();
    if (board !== null) {
        board.push(entry);
        board.sort((a, b) => b.score - a.score);
        if (board.length > 50) board.length = 50; // keep top 50 online
        await saveOnline(board);
    }

    // Also save locally
    const local = loadLocal();
    local.push(entry);
    local.sort((a, b) => b.score - a.score);
    if (local.length > 10) local.length = 10;
    saveLocal(local);

    // Refresh cache
    await refreshLeaderboard();
}

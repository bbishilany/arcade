// Shared online leaderboard using jsonblob.com (free, no auth)
// Falls back to localStorage if offline
// Separate blob from Galaga

const BLOB_URL = 'https://jsonblob.com/api/jsonBlob';
const LOCAL_KEY = 'baseball_leaderboard';

let blobId = null;
let cachedBoard = [];

async function ensureBlob() {
    // Check localStorage for existing blob ID
    const stored = localStorage.getItem('baseball_blob_id');
    if (stored) {
        blobId = stored;
        return;
    }

    // Create new blob
    try {
        const res = await fetch(BLOB_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([])
        });
        if (res.ok) {
            const loc = res.headers.get('Location') || res.headers.get('location');
            if (loc) {
                blobId = loc.split('/').pop();
                localStorage.setItem('baseball_blob_id', blobId);
            }
        }
    } catch {
        // Offline — use local only
    }
}

async function fetchOnline() {
    if (!blobId) return null;
    try {
        const res = await fetch(`${BLOB_URL}/${blobId}`, {
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
    if (!blobId) return;
    try {
        await fetch(`${BLOB_URL}/${blobId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(board)
        });
    } catch {}
}

function loadLocal() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    } catch { return []; }
}

function saveLocal(board) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(board));
}

export async function refreshLeaderboard() {
    await ensureBlob();
    const online = await fetchOnline();
    if (online !== null) {
        cachedBoard = online.sort((a, b) => b.score - a.score).slice(0, 10);
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

export async function saveScore(name, score) {
    const entry = { name, score, ts: Date.now() };

    let board = await fetchOnline();
    if (board !== null) {
        board.push(entry);
        board.sort((a, b) => b.score - a.score);
        if (board.length > 50) board.length = 50;
        await saveOnline(board);
    }

    const local = loadLocal();
    local.push(entry);
    local.sort((a, b) => b.score - a.score);
    if (local.length > 10) local.length = 10;
    saveLocal(local);

    await refreshLeaderboard();
}

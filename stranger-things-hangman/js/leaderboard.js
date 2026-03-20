// Shared online leaderboard using Supabase (was localStorage-only)
// Falls back to localStorage if offline

// ---- Supabase config (anon key is designed to be public; RLS controls access) ----
const SUPABASE_URL = 'https://gmeuqeiqrudbtxmhshdm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZXVxZWlxcnVkYnR4bWhzaGRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzM4NTEsImV4cCI6MjA4OTYwOTg1MX0.06Kb0UdNtkeeJOSaFgEAZqhdrV3cjccHtY5uwizJFD4';
const TABLE = 'arcade_scores';
const GAME = 'hangman';

const LOCAL_KEY = 'hangman_st_leaderboard';
const REST = `${SUPABASE_URL}/rest/v1/${TABLE}`;
const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
};

let cachedBoard = [];

// --- Online (Supabase) ---

async function fetchOnline() {
    try {
        const url = `${REST}?select=name,score,difficulty,ts,created_at&game=eq.${GAME}&order=score.desc&limit=25`;
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

async function insertOnline(entry) {
    try {
        await fetch(REST, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({ game: GAME, ...entry })
        });
    } catch {
        // offline — local fallback handles it
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

// --- Public API (same signatures as before) ---

export async function loadLeaderboard() {
    const online = await fetchOnline();
    if (online !== null) {
        cachedBoard = online;
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

export async function submitScore(name, score, difficulty) {
    const entry = { name, score, difficulty, ts: Date.now() };

    // Atomic INSERT — now shared online instead of localStorage-only
    await insertOnline(entry);

    // Also save locally
    const local = loadLocal();
    local.push(entry);
    local.sort((a, b) => b.score - a.score);
    if (local.length > 25) local.length = 25;
    saveLocal(local);

    // Refresh cache from server
    await loadLeaderboard();
}

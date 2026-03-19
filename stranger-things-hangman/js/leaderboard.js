const LOCAL_KEY = 'hangman_st_leaderboard';

let cachedBoard = [];

function loadLocal() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    } catch { return []; }
}

function saveLocal(board) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(board));
}

export async function loadLeaderboard() {
    cachedBoard = loadLocal();
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

    const local = loadLocal();
    local.push(entry);
    local.sort((a, b) => b.score - a.score);
    if (local.length > 10) local.length = 10;
    saveLocal(local);

    cachedBoard = local;
}

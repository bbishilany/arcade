// Local storage leaderboard

const STORAGE_KEY = 'angrybirds_leaderboard';
const MAX_ENTRIES = 10;

export function getLeaderboard() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function addScore(name, score) {
    const board = getLeaderboard();
    board.push({ name: name.toUpperCase(), score, date: Date.now() });
    board.sort((a, b) => b.score - a.score);
    board.splice(MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    return board;
}

export function isHighScore(score) {
    const board = getLeaderboard();
    if (board.length < MAX_ENTRIES) return true;
    return score > board[board.length - 1].score;
}

import { GAME_WIDTH, COLORS, WORD_Y, CATEGORY_Y } from './constants.js';

export function drawHUD(ctx, score, difficulty, wrongCount, wordsCompleted, streak) {
    ctx.font = '10px "Press Start 2P", monospace';

    // Score (top left)
    ctx.textAlign = 'left';
    ctx.fillStyle = COLORS.TEXT;
    ctx.fillText('SCORE', 10, 20);
    ctx.fillStyle = COLORS.SCORE;
    ctx.fillText(score.toString().padStart(6, '0'), 10, 36);

    // Difficulty badge (top right)
    if (difficulty) {
        ctx.textAlign = 'right';
        let badgeColor;
        if (difficulty.name === 'EASY') badgeColor = COLORS.EERIE_GREEN;
        else if (difficulty.name === 'MEDIUM') badgeColor = COLORS.SCORE;
        else badgeColor = COLORS.TITLE_RED;

        ctx.fillStyle = badgeColor;
        ctx.fillText(difficulty.name, GAME_WIDTH - 10, 20);

        // Wrong count
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = wrongCount > 0 ? COLORS.WRONG : '#888';
        ctx.fillText(wrongCount + '/' + difficulty.maxWrong + ' WRONG', GAME_WIDTH - 10, 36);
    }

    // Words completed (top center)
    ctx.textAlign = 'center';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#888';
    ctx.fillText('WORDS: ' + wordsCompleted, GAME_WIDTH / 2, 20);

    // Streak
    if (streak > 1) {
        ctx.fillStyle = COLORS.SCORE;
        ctx.fillText('STREAK x' + streak, GAME_WIDTH / 2, 36);
    }
}

export function drawWord(ctx, word, guessedLetters, category) {
    // Category label
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.CATEGORY;
    ctx.fillText(category, GAME_WIDTH / 2, CATEGORY_Y);

    // Word display
    const chars = word.split('');
    const spacing = Math.min(28, (GAME_WIDTH - 60) / chars.length);
    const startX = (GAME_WIDTH - chars.length * spacing) / 2 + spacing / 2;

    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = 'center';

    for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const x = startX + i * spacing;

        if (ch === ' ') {
            // Space — no underscore, just gap
            continue;
        }

        if (guessedLetters.has(ch)) {
            // Revealed letter with glow
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 8;
            ctx.fillStyle = COLORS.TEXT;
            ctx.fillText(ch, x, WORD_Y);
            ctx.shadowBlur = 0;
        } else {
            // Blank underscore
            ctx.fillStyle = COLORS.BLANK;
            ctx.fillRect(x - spacing / 2 + 3, WORD_Y + 4, spacing - 6, 3);
        }
    }

    // Draw word separators (small dots for spaces)
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === ' ') {
            const x = startX + i * spacing;
            ctx.fillStyle = '#333';
            ctx.fillRect(x - 1, WORD_Y + 4, 2, 2);
        }
    }
}

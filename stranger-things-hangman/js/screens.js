import { GAME_WIDTH, GAME_HEIGHT, COLORS, TITLE_BLINK_RATE } from './constants.js';

export function drawTitleScreen(ctx, drawFrame, leaderboard) {
    // Title - "STRANGER THINGS" with glitch effect
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.textAlign = 'center';

    // Glitch offset
    const glitchX = (drawFrame % 120 < 3) ? (Math.random() * 4 - 2) : 0;
    const glitchY = (drawFrame % 180 < 2) ? (Math.random() * 3 - 1) : 0;

    // Red shadow
    ctx.fillStyle = '#880000';
    ctx.fillText('STRANGER', GAME_WIDTH / 2 + 2, 222);
    ctx.fillText('THINGS', GAME_WIDTH / 2 + 2, 252);

    // Main title
    ctx.fillStyle = COLORS.TITLE_RED;
    ctx.fillText('STRANGER', GAME_WIDTH / 2 + glitchX, 220 + glitchY);
    ctx.fillText('THINGS', GAME_WIDTH / 2 + glitchX, 250 + glitchY);

    // Subtitle
    ctx.font = '24px "Press Start 2P", monospace';
    ctx.fillStyle = COLORS.TEXT;
    ctx.fillText('HANGMAN', GAME_WIDTH / 2, 300);

    // Blinking prompt
    if (Math.floor(drawFrame / TITLE_BLINK_RATE) % 2 === 0) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('TAP OR PRESS ENTER', GAME_WIDTH / 2, 370);
    }

    // Leaderboard
    if (leaderboard && leaderboard.length > 0) {
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = COLORS.TITLE_RED;
        ctx.fillText('HIGH SCORES', GAME_WIDTH / 2, 420);

        ctx.font = '7px "Press Start 2P", monospace';
        const top = leaderboard.slice(0, 10);
        for (let i = 0; i < top.length; i++) {
            const entry = top[i];
            const rank = String(i + 1).padStart(2, ' ') + '.';
            const name = entry.name.padEnd(8, ' ');
            const pts = entry.score.toString().padStart(6, '0');
            const date = entry.created_at
                ? new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '';

            if (i === 0) ctx.fillStyle = '#ffdd00';
            else if (i === 1) ctx.fillStyle = '#cccccc';
            else if (i === 2) ctx.fillStyle = '#cc8844';
            else ctx.fillStyle = '#888888';

            ctx.fillText(`${rank} ${name} ${pts}  ${date}`, GAME_WIDTH / 2, 438 + i * 16);
        }
    }

    // Footer
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillStyle = '#444';
    ctx.fillText('THE UPSIDE DOWN AWAITS', GAME_WIDTH / 2, 600);
}

export function drawDifficultySelect(ctx, drawFrame) {
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.TITLE_RED;
    ctx.fillText('SELECT DIFFICULTY', GAME_WIDTH / 2, 200);

    const options = [
        { key: '1', name: 'EASY', desc: '10 GUESSES', desc2: 'SIMPLE WORDS', color: COLORS.EERIE_GREEN },
        { key: '2', name: 'MEDIUM', desc: '8 GUESSES', desc2: 'MORE WORDS', color: COLORS.SCORE },
        { key: '3', name: 'HARD', desc: '6 GUESSES', desc2: 'ALL WORDS', color: COLORS.TITLE_RED },
    ];

    for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        const y = 280 + i * 100;

        // Highlight box
        const pulse = Math.sin(drawFrame * 0.05 + i) * 0.1 + 0.9;
        ctx.strokeStyle = opt.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = pulse;
        ctx.strokeRect(GAME_WIDTH / 2 - 140, y - 25, 280, 70);
        ctx.globalAlpha = 1;

        // Key number
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.fillStyle = opt.color;
        ctx.fillText(`[${opt.key}] ${opt.name}`, GAME_WIDTH / 2, y);

        // Description
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#888';
        ctx.fillText(opt.desc + '  -  ' + opt.desc2, GAME_WIDTH / 2, y + 22);
    }

    // ESC hint
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillStyle = '#444';
    ctx.fillText('ESC TO GO BACK', GAME_WIDTH / 2, 600);
}

export function drawWinScreen(ctx, drawFrame, score) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.textAlign = 'center';

    // Flashing "WORD COMPLETE!"
    if (Math.floor(drawFrame / 10) % 2 === 0) {
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.fillStyle = COLORS.EERIE_GREEN;
        ctx.fillText('WORD COMPLETE!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
    }

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = COLORS.SCORE;
    ctx.fillText('SCORE: ' + score.toString().padStart(6, '0'), GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
}

export function drawGameOverScreen(ctx, drawFrame, score) {
    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.textAlign = 'center';

    ctx.font = '24px "Press Start 2P", monospace';
    ctx.fillStyle = COLORS.TITLE_RED;
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = COLORS.TEXT;
    ctx.fillText('SCORE: ' + score.toString().padStart(6, '0'), GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);

    if (Math.floor(drawFrame / 20) % 2 === 0) {
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = COLORS.TITLE_RED;
        ctx.fillText('THE DEMOGORGON GOT YOU', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
    }
}

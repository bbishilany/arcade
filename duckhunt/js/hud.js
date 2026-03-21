// Duck Hunt — Bottom HUD bar rendering
// Shows: round number, score, ammo bullets, duck hit/miss indicators

import {
    GAME_WIDTH, GAME_HEIGHT, HUD_TOP, HUD_BG, HUD_TEXT,
    SHOTS_PER_ATTEMPT, DUCKS_PER_ROUND
} from './constants.js';
import { drawSprite, BULLET } from './sprites.js';

export function drawHUD(ctx, state) {
    const { round, score, shotsLeft, duckResults, currentDuckIndex } = state;

    // Black HUD background
    ctx.fillStyle = HUD_BG;
    ctx.fillRect(0, HUD_TOP, GAME_WIDTH, GAME_HEIGHT - HUD_TOP);

    // Top border line
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, HUD_TOP, GAME_WIDTH, 2);

    const hudMid = HUD_TOP + (GAME_HEIGHT - HUD_TOP) / 2;
    const textY = HUD_TOP + 18;

    // --- Round indicator (top-left) ---
    ctx.fillStyle = HUD_TEXT;
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`R=${round}`, 10, textY);

    // --- Score (top-right) ---
    ctx.textAlign = 'right';
    ctx.fillText(score.toString().padStart(8, '0'), GAME_WIDTH - 10, textY);

    // --- Ammo bullets (middle-left) ---
    const bulletY = HUD_TOP + 30;
    for (let i = 0; i < SHOTS_PER_ATTEMPT; i++) {
        if (i < shotsLeft) {
            // Active bullet
            drawSprite(ctx, BULLET, 18 + i * 16, bulletY + 10, 2);
        } else {
            // Empty slot
            ctx.fillStyle = '#333333';
            ctx.fillRect(12 + i * 16, bulletY + 2, 8, 16);
        }
    }

    ctx.fillStyle = '#888888';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SHOT', 10, HUD_TOP + 62);

    // --- Duck indicators (bottom row, centered) ---
    const indicatorY = HUD_TOP + 48;
    const indicatorW = 10;
    const indicatorGap = 2;
    const totalW = DUCKS_PER_ROUND * (indicatorW + indicatorGap) - indicatorGap;
    const startX = (GAME_WIDTH - totalW) / 2;

    for (let i = 0; i < DUCKS_PER_ROUND; i++) {
        const ix = startX + i * (indicatorW + indicatorGap);
        let color;
        if (i < duckResults.length) {
            color = duckResults[i] === 'hit' ? '#ff4444' : '#ffffff';
        } else if (i === currentDuckIndex) {
            color = '#ffff00'; // current duck
        } else {
            color = '#333333'; // pending
        }
        ctx.fillStyle = color;
        ctx.fillRect(ix, indicatorY, indicatorW, indicatorW);
    }

    // Label
    ctx.fillStyle = '#888888';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HIT', GAME_WIDTH / 2, HUD_TOP + 72);
}

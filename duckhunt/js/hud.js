// Duck Hunt — Bottom HUD bar rendering
// Shows: round number, score, ammo bullets, duck hit/miss indicators

import {
    GAME_WIDTH, GAME_HEIGHT, HUD_TOP, HUD_BG, HUD_TEXT
} from './constants.js';
import { drawSprite, BULLET } from './sprites.js';

export function drawHUD(ctx, state) {
    const { round, score, shotsLeft, duckResults, currentDuckIndex, totalDucks } = state;
    const maxShots = state.shotsLeft + (state.duckResults.length > 0 ? 0 : 0); // just use shotsLeft for display

    // Black HUD background
    ctx.fillStyle = HUD_BG;
    ctx.fillRect(0, HUD_TOP, GAME_WIDTH, GAME_HEIGHT - HUD_TOP);

    // Top border line
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, HUD_TOP, GAME_WIDTH, 2);

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
    const maxBullets = Math.max(shotsLeft, 4); // show up to 4 slots
    for (let i = 0; i < maxBullets; i++) {
        if (i < shotsLeft) {
            drawSprite(ctx, BULLET, 18 + i * 16, bulletY + 10, 2);
        } else {
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
    const duckCount = totalDucks || 10;
    // Scale indicator size to fit — smaller for 12 ducks
    const indicatorW = duckCount > 10 ? 8 : 10;
    const indicatorGap = 2;
    const totalW = duckCount * (indicatorW + indicatorGap) - indicatorGap;
    const startX = (GAME_WIDTH - totalW) / 2;

    for (let i = 0; i < duckCount; i++) {
        const ix = startX + i * (indicatorW + indicatorGap);
        let color;
        if (i < duckResults.length) {
            color = duckResults[i] === 'hit' ? '#ff4444' : '#ffffff';
        } else if (i >= currentDuckIndex && i < currentDuckIndex + 3) {
            color = '#ffff00'; // current batch
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

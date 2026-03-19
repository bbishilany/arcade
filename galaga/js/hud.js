import { GAME_WIDTH, GAME_HEIGHT, COLORS } from './constants.js';
import { drawSprite, PLAYER_SPRITE } from './sprites.js';
import { isCheatActive, isDualFighterActive, isFreeMovementActive } from './input.js';

export function drawHUD(ctx, score, highScore, lives, wave) {
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'left';

    // Score
    ctx.fillStyle = COLORS.HUD_TEXT;
    ctx.fillText('SCORE', 10, 20);
    ctx.fillStyle = '#ffff00';
    ctx.fillText(score.toString().padStart(6, '0'), 10, 38);

    // High score
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.HUD_TEXT;
    ctx.fillText('HIGH SCORE', GAME_WIDTH / 2, 20);
    ctx.fillStyle = '#ffff00';
    ctx.fillText(highScore.toString().padStart(6, '0'), GAME_WIDTH / 2, 38);

    // Wave
    ctx.textAlign = 'right';
    ctx.fillStyle = COLORS.HUD_TEXT;
    ctx.fillText('WAVE ' + wave, GAME_WIDTH - 10, 20);

    // Lives (draw small ship icons)
    ctx.textAlign = 'left';
    for (let i = 0; i < lives - 1; i++) {
        drawSprite(ctx, PLAYER_SPRITE, 20 + i * 25, GAME_WIDTH > 400 ? 620 : 600, 1);
    }

    // Active cheat indicators (right side, bottom)
    const cheats = [];
    if (isCheatActive()) cheats.push({ label: 'RAPID', color: '#00ff44' });
    if (isDualFighterActive()) cheats.push({ label: 'DUAL', color: '#00ccff' });
    if (isFreeMovementActive()) cheats.push({ label: 'FREE', color: '#ff44ff' });

    if (cheats.length > 0) {
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'right';
        for (let i = 0; i < cheats.length; i++) {
            ctx.fillStyle = cheats[i].color;
            ctx.fillText(cheats[i].label, GAME_WIDTH - 10, GAME_HEIGHT - 8 - i * 14);
        }
    }
}

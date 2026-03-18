import { GAME_WIDTH, COLORS } from './constants.js';
import { drawSprite, PLAYER_SPRITE } from './sprites.js';

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
}

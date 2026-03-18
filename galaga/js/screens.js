import { GAME_WIDTH, GAME_HEIGHT, COLORS } from './constants.js';

export function drawTitleScreen(ctx, frameCount) {
    // Title
    ctx.font = '36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.TITLE_TEXT;
    ctx.fillText('GALAGA', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80);

    // Subtitle
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = COLORS.TITLE_SUB;
    ctx.fillText('SPACE ARCADE', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 45);

    // Blinking "PRESS ENTER"
    if (Math.floor(frameCount / 30) % 2 === 0) {
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('PRESS ENTER TO START', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);
    }

    // Controls
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#666666';
    ctx.fillText('ARROW KEYS / A,D - MOVE', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80);
    ctx.fillText('SPACE - SHOOT', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100);

    // Score table
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ff88';
    ctx.fillText('COMMANDER  - 150 PTS', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 140);
    ctx.fillStyle = '#ff44ff';
    ctx.fillText('BUTTERFLY  -  80 PTS', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 158);
    ctx.fillStyle = '#ffff00';
    ctx.fillText('BEE        -  50 PTS', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 176);
}

export function drawWaveIntro(ctx, wave, frameCount) {
    ctx.font = '20px "Press Start 2P", monospace';
    ctx.textAlign = 'center';

    // Fade in effect
    const alpha = Math.min(frameCount / 30, 1);
    ctx.fillStyle = `rgba(0, 204, 255, ${alpha})`;
    ctx.fillText('WAVE ' + wave, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillText('GET READY!', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 25);
}

export function drawGameOver(ctx, score, highScore, frameCount) {
    ctx.font = '28px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.TITLE_TEXT;
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SCORE: ' + score.toString().padStart(6, '0'), GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);

    if (score >= highScore && score > 0) {
        ctx.fillStyle = '#ffff00';
        ctx.fillText('NEW HIGH SCORE!', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35);
    }

    if (Math.floor(frameCount / 30) % 2 === 0) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('PRESS ENTER TO CONTINUE', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80);
    }
}

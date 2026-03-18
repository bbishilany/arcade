import { GAME_WIDTH, GAME_HEIGHT, COLORS } from './constants.js';

export function drawTitleScreen(ctx, drawFrame, leaderboard) {
    // Title
    ctx.font = '36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.TITLE_TEXT;
    ctx.fillText('GALAGA', GAME_WIDTH / 2, 120);

    // Subtitle
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = COLORS.TITLE_SUB;
    ctx.fillText('SPACE ARCADE', GAME_WIDTH / 2, 155);

    // Blinking "PRESS ENTER" / "TAP TO START"
    if (Math.floor(drawFrame / 30) % 2 === 0) {
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('TAP OR PRESS ENTER', GAME_WIDTH / 2, 210);
    }

    // Score table
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ff88';
    ctx.fillText('COMMANDER  - 150 PTS', GAME_WIDTH / 2, 260);
    ctx.fillStyle = '#ff44ff';
    ctx.fillText('BUTTERFLY  -  80 PTS', GAME_WIDTH / 2, 278);
    ctx.fillStyle = '#ffff00';
    ctx.fillText('BEE        -  50 PTS', GAME_WIDTH / 2, 296);

    // Leaderboard
    if (leaderboard && leaderboard.length > 0) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffff00';
        ctx.fillText('- TOP SCORES -', GAME_WIDTH / 2, 345);

        ctx.font = '8px "Press Start 2P", monospace';
        const top = leaderboard.slice(0, 5);
        for (let i = 0; i < top.length; i++) {
            const entry = top[i];
            const rank = (i + 1) + '.';
            const name = entry.name.padEnd(8, ' ');
            const pts = entry.score.toString().padStart(6, '0');

            // Gold, silver, bronze for top 3
            if (i === 0) ctx.fillStyle = '#ffdd00';
            else if (i === 1) ctx.fillStyle = '#cccccc';
            else if (i === 2) ctx.fillStyle = '#cc8844';
            else ctx.fillStyle = '#888888';

            ctx.fillText(
                `${rank} ${name} ${pts}`,
                GAME_WIDTH / 2, 370 + i * 20
            );
        }
    }
}

export function drawNameSelect(ctx, drawFrame, names, selectedIndex, confirmed) {
    ctx.textAlign = 'center';

    // Header
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ccff';
    ctx.fillText('WHO ARE YOU?', GAME_WIDTH / 2, 150);

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#888888';
    ctx.fillText('PICK YOUR NAME', GAME_WIDTH / 2, 180);

    // Name list
    ctx.font = '16px "Press Start 2P", monospace';
    for (let i = 0; i < names.length; i++) {
        const y = 240 + i * 50;
        const isSelected = i === selectedIndex;

        if (isSelected) {
            // Highlight box
            const textWidth = ctx.measureText(names[i]).width;
            ctx.fillStyle = 'rgba(0, 200, 255, 0.15)';
            ctx.fillRect(GAME_WIDTH / 2 - textWidth / 2 - 15, y - 16, textWidth + 30, 30);

            // Blinking arrows
            if (Math.floor(drawFrame / 20) % 2 === 0) {
                ctx.fillStyle = '#00ccff';
                ctx.font = '12px "Press Start 2P", monospace';
                ctx.fillText('\u25B6', GAME_WIDTH / 2 - 90, y + 2);
                ctx.fillText('\u25C0', GAME_WIDTH / 2 + 90, y + 2);
            }

            ctx.font = '16px "Press Start 2P", monospace';
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = '#555555';
        }

        ctx.fillText(names[i], GAME_WIDTH / 2, y);
    }

    // Instructions
    if (Math.floor(drawFrame / 20) % 2 === 0) {
        ctx.font = '8px "Press Start 2P", monospace';
        if (confirmed) {
            ctx.fillStyle = '#00ff88';
            ctx.fillText('TAP AGAIN TO PLAY!', GAME_WIDTH / 2, 480);
        } else {
            ctx.fillStyle = '#ffff00';
            ctx.fillText('TAP TO PICK YOUR NAME', GAME_WIDTH / 2, 480);
        }
    }
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

export function drawGameOver(ctx, score, highScore, drawFrame, playerName, leaderboard) {
    ctx.textAlign = 'center';

    ctx.font = '28px "Press Start 2P", monospace';
    ctx.fillStyle = COLORS.TITLE_TEXT;
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, 100);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ccff';
    ctx.fillText(playerName, GAME_WIDTH / 2, 140);

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SCORE: ' + score.toString().padStart(6, '0'), GAME_WIDTH / 2, 170);

    if (score >= highScore && score > 0) {
        ctx.fillStyle = '#ffff00';
        ctx.fillText('NEW HIGH SCORE!', GAME_WIDTH / 2, 200);
    }

    // Leaderboard
    if (leaderboard && leaderboard.length > 0) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffff00';
        ctx.fillText('- LEADERBOARD -', GAME_WIDTH / 2, 250);

        ctx.font = '8px "Press Start 2P", monospace';
        for (let i = 0; i < leaderboard.length; i++) {
            const entry = leaderboard[i];
            const rank = (i + 1).toString().padStart(2, ' ') + '.';
            const name = entry.name.padEnd(8, ' ');
            const pts = entry.score.toString().padStart(6, '0');
            const wv = 'W' + entry.wave;

            if (i === 0) ctx.fillStyle = '#ffdd00';
            else if (i === 1) ctx.fillStyle = '#cccccc';
            else if (i === 2) ctx.fillStyle = '#cc8844';
            else ctx.fillStyle = '#888888';

            ctx.fillText(
                `${rank} ${name} ${pts} ${wv}`,
                GAME_WIDTH / 2, 275 + i * 18
            );
        }
    }

    if (Math.floor(drawFrame / 30) % 2 === 0) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('TAP OR PRESS ENTER', GAME_WIDTH / 2, 500);
    }
}

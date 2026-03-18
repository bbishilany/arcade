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

    // Blinking "TAP TO START"
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

export function drawGameOver(ctx, score, highScore, drawFrame) {
    ctx.textAlign = 'center';

    ctx.font = '28px "Press Start 2P", monospace';
    ctx.fillStyle = COLORS.TITLE_TEXT;
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SCORE: ' + score.toString().padStart(6, '0'), GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);

    if (score >= highScore && score > 0) {
        if (Math.floor(drawFrame / 20) % 2 === 0) {
            ctx.fillStyle = '#ffff00';
            ctx.fillText('NEW HIGH SCORE!', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
        }
    }
}

export function drawNameEntry(ctx, score, wave, drawFrame, currentName, letterIndex, alphabet) {
    ctx.textAlign = 'center';

    // Header
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ccff';
    ctx.fillText('ENTER YOUR NAME', GAME_WIDTH / 2, 80);

    // Score display
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SCORE: ' + score.toString().padStart(6, '0') + '  WAVE: ' + wave, GAME_WIDTH / 2, 110);

    // Current name (big, with cursor blink)
    ctx.font = '24px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffff00';
    const displayName = currentName + (Math.floor(drawFrame / 20) % 2 === 0 ? '_' : ' ');
    ctx.fillText(displayName, GAME_WIDTH / 2, 170);

    // Letter picker — show 3 rows of letters
    const totalItems = alphabet.length + 2; // letters + DEL + OK
    const cols = 9;
    const rows = Math.ceil(totalItems / cols);
    const cellW = 42;
    const cellH = 36;
    const startX = GAME_WIDTH / 2 - (cols * cellW) / 2 + cellW / 2;
    const startY = 220;

    ctx.font = '10px "Press Start 2P", monospace';

    for (let i = 0; i < totalItems; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * cellW;
        const y = startY + row * cellH;

        let label;
        if (i < alphabet.length) {
            label = alphabet[i];
        } else if (i === alphabet.length) {
            label = 'DEL';
        } else {
            label = 'OK';
        }

        const isSelected = i === letterIndex;

        if (isSelected) {
            // Highlight box
            ctx.fillStyle = 'rgba(0, 200, 255, 0.3)';
            ctx.fillRect(x - cellW / 2 + 2, y - cellH / 2 + 2, cellW - 4, cellH - 4);

            // Blinking border
            if (Math.floor(drawFrame / 15) % 2 === 0) {
                ctx.strokeStyle = '#00ccff';
                ctx.lineWidth = 2;
                ctx.strokeRect(x - cellW / 2 + 2, y - cellH / 2 + 2, cellW - 4, cellH - 4);
            }

            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = '#888888';
        }

        // Color DEL red, OK green
        if (i === alphabet.length && isSelected) ctx.fillStyle = '#ff4444';
        if (i === alphabet.length + 1 && isSelected) ctx.fillStyle = '#00ff88';

        ctx.fillText(label, x, y + 4);
    }

    // Instructions
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#555555';
    ctx.fillText('USE ARROWS TO PICK, TAP/ENTER TO SELECT', GAME_WIDTH / 2, startY + rows * cellH + 20);

    // Touch-friendly: show big highlight of current selection
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ccff';
    let currentLabel;
    if (letterIndex < alphabet.length) {
        currentLabel = alphabet[letterIndex];
    } else if (letterIndex === alphabet.length) {
        currentLabel = 'DELETE';
    } else {
        currentLabel = 'DONE!';
    }
    ctx.fillText('> ' + currentLabel + ' <', GAME_WIDTH / 2, startY + rows * cellH + 60);
}

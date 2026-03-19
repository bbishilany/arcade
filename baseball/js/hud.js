import { GAME_WIDTH, COLORS } from './constants.js';

export function drawHUD(ctx, gameState) {
    const {
        homeScore, awayScore, inning, halfInning,
        outs, balls, strikes, arcadeScore, isMultiplayer,
        playerTeam
    } = gameState;

    ctx.font = '10px "Press Start 2P", monospace';

    // Top bar background
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, GAME_WIDTH, 44);

    // Score
    ctx.textAlign = 'left';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText('AWAY', 10, 14);
    ctx.fillStyle = halfInning === 'top' ? '#ffff00' : '#ffffff';
    ctx.fillText(String(awayScore), 80, 14);

    ctx.fillStyle = '#aaaaaa';
    ctx.fillText('HOME', 10, 30);
    ctx.fillStyle = halfInning === 'bottom' ? '#ffff00' : '#ffffff';
    ctx.fillText(String(homeScore), 80, 30);

    // Inning
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00ccff';
    const arrow = halfInning === 'top' ? '\u25B2' : '\u25BC';
    ctx.fillText(arrow + ' ' + inning, 150, 22);

    // Count (B-S-O)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#888888';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('B', 220, 14);
    ctx.fillText('S', 260, 14);
    ctx.fillText('O', 300, 14);

    // Count values
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#44ff44';
    ctx.fillText(String(balls), 220, 30);
    ctx.fillStyle = '#ff4444';
    ctx.fillText(String(strikes), 260, 30);
    ctx.fillStyle = '#ffff00';
    ctx.fillText(String(outs), 300, 30);

    // Arcade score
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('PTS', GAME_WIDTH - 10, 14);
    ctx.fillStyle = '#ffff00';
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(arcadeScore.toString().padStart(6, '0'), GAME_WIDTH - 10, 30);
}

// Draw base indicator diamonds (small visual in corner)
export function drawBaseIndicator(ctx, runners) {
    const cx = 380;
    const cy = 56;
    const s = 8;

    // Diamond outline
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 1;

    // 1st base
    ctx.beginPath();
    ctx.moveTo(cx + s, cy);
    ctx.lineTo(cx, cy - s);
    ctx.stroke();
    // 2nd base
    ctx.beginPath();
    ctx.moveTo(cx, cy - s);
    ctx.lineTo(cx - s, cy);
    ctx.stroke();
    // 3rd base
    ctx.beginPath();
    ctx.moveTo(cx - s, cy);
    ctx.lineTo(cx, cy + s);
    ctx.stroke();
    // home
    ctx.beginPath();
    ctx.moveTo(cx, cy + s);
    ctx.lineTo(cx + s, cy);
    ctx.stroke();

    // Lit bases
    if (runners[0]) {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(cx + s, cy, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    if (runners[1]) {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(cx, cy - s, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    if (runners[2]) {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(cx - s, cy, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

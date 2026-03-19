import { GAME_WIDTH, GAME_HEIGHT, COLORS } from './constants.js';

export function drawTitleScreen(ctx, drawFrame, leaderboard) {
    // Title
    ctx.font = '28px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.TITLE_MAIN;
    ctx.fillText('BASEBALL', GAME_WIDTH / 2, 120);

    // Subtitle
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = COLORS.TITLE_SUB;
    ctx.fillText('ARCADE SLUGGER', GAME_WIDTH / 2, 148);

    // Blinking prompt
    if (Math.floor(drawFrame / 30) % 2 === 0) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('TAP OR PRESS ENTER', GAME_WIDTH / 2, 200);
    }

    // Scoring info
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillStyle = '#ff4444';
    ctx.fillText('SINGLE 100  DOUBLE 250', GAME_WIDTH / 2, 250);
    ctx.fillStyle = '#ffff00';
    ctx.fillText('TRIPLE 500  HR 1000', GAME_WIDTH / 2, 268);
    ctx.fillStyle = '#00ff88';
    ctx.fillText('RBI 200  K PITCHED 150', GAME_WIDTH / 2, 286);

    // Leaderboard
    if (leaderboard && leaderboard.length > 0) {
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffff00';
        ctx.fillText('- TOP SLUGGERS -', GAME_WIDTH / 2, 330);

        ctx.font = '7px "Press Start 2P", monospace';
        const top = leaderboard.slice(0, 5);
        for (let i = 0; i < top.length; i++) {
            const entry = top[i];
            const rank = (i + 1) + '.';
            const name = entry.name.padEnd(8, ' ');
            const pts = entry.score.toString().padStart(6, '0');

            if (i === 0) ctx.fillStyle = '#ffdd00';
            else if (i === 1) ctx.fillStyle = '#cccccc';
            else if (i === 2) ctx.fillStyle = '#cc8844';
            else ctx.fillStyle = '#888888';

            ctx.fillText(`${rank} ${name} ${pts}`, GAME_WIDTH / 2, 355 + i * 18);
        }
    }

    // Controls hint
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillStyle = '#555555';
    ctx.fillText('SPACE = SWING/PITCH   ARROWS = SELECT', GAME_WIDTH / 2, GAME_HEIGHT - 30);
}

export function drawModeSelect(ctx, drawFrame, selection) {
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.TITLE_SUB;
    ctx.fillText('SELECT MODE', GAME_WIDTH / 2, 180);

    const modes = ['VS CPU', 'VS FRIEND'];
    for (let i = 0; i < modes.length; i++) {
        const y = 260 + i * 60;
        const selected = i === selection;

        if (selected) {
            const blink = Math.floor(drawFrame / 15) % 2 === 0;
            ctx.fillStyle = blink ? '#ffff00' : '#ffffff';
            ctx.font = '14px "Press Start 2P", monospace';
            ctx.fillText('> ' + modes[i] + ' <', GAME_WIDTH / 2, y);
        } else {
            ctx.fillStyle = '#666666';
            ctx.font = '12px "Press Start 2P", monospace';
            ctx.fillText(modes[i], GAME_WIDTH / 2, y);
        }
    }

    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillStyle = '#555555';
    ctx.fillText('UP/DOWN TO SELECT  ENTER TO CONFIRM', GAME_WIDTH / 2, 420);
}

export function drawLobby(ctx, drawFrame, lobbyAction, lobbySelection, roomCode, status, codeInput) {
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.TITLE_SUB;
    ctx.fillText('VS FRIEND', GAME_WIDTH / 2, 150);

    if (lobbyAction === 'pick') {
        // Choose create or join
        const options = ['CREATE ROOM', 'JOIN ROOM'];
        for (let i = 0; i < options.length; i++) {
            const y = 260 + i * 60;
            const selected = i === lobbySelection;
            if (selected) {
                const blink = Math.floor(drawFrame / 15) % 2 === 0;
                ctx.fillStyle = blink ? '#ffff00' : '#ffffff';
                ctx.font = '12px "Press Start 2P", monospace';
                ctx.fillText('> ' + options[i] + ' <', GAME_WIDTH / 2, y);
            } else {
                ctx.fillStyle = '#666666';
                ctx.font = '10px "Press Start 2P", monospace';
                ctx.fillText(options[i], GAME_WIDTH / 2, y);
            }
        }
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillStyle = '#555555';
        ctx.fillText('ESC TO GO BACK', GAME_WIDTH / 2, 420);
    } else if (lobbyAction === 'create') {
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('YOUR ROOM CODE:', GAME_WIDTH / 2, 230);

        ctx.font = '36px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffff00';
        ctx.fillText(roomCode || '....', GAME_WIDTH / 2, 290);

        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#888888';
        ctx.fillText('TEXT THIS CODE TO YOUR FRIEND', GAME_WIDTH / 2, 330);

        if (Math.floor(drawFrame / 30) % 2 === 0) {
            ctx.font = '8px "Press Start 2P", monospace';
            ctx.fillStyle = '#00ff88';
            ctx.fillText('WAITING FOR FRIEND...', GAME_WIDTH / 2, 380);
        }
    } else if (lobbyAction === 'join') {
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('ENTER ROOM CODE:', GAME_WIDTH / 2, 230);

        ctx.font = '36px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffff00';
        const display = codeInput.padEnd(4, '_');
        ctx.fillText(display, GAME_WIDTH / 2, 290);

        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#888888';
        ctx.fillText('TYPE THE 4-DIGIT CODE', GAME_WIDTH / 2, 330);
        ctx.fillText('PRESS ENTER TO CONNECT', GAME_WIDTH / 2, 350);
    } else if (lobbyAction === 'connecting') {
        if (Math.floor(drawFrame / 20) % 2 === 0) {
            ctx.font = '10px "Press Start 2P", monospace';
            ctx.fillStyle = '#ffff00';
            ctx.fillText('CONNECTING...', GAME_WIDTH / 2, 300);
        }
    }

    // Status
    if (status) {
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = status.includes('CONNECTED') ? '#00ff88' : '#ff8844';
        ctx.fillText(status, GAME_WIDTH / 2, 430);
    }

    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillStyle = '#555555';
    ctx.fillText('ESC TO GO BACK', GAME_WIDTH / 2, 480);
}

export function drawInningStart(ctx, inning, halfInning, frame) {
    const alpha = Math.min(frame / 30, 1);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(0, 204, 255, ${alpha})`;
    ctx.fillText(halfInning === 'top' ? 'TOP OF' : 'BOTTOM OF', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);

    ctx.font = '28px "Press Start 2P", monospace';
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillText('INNING ' + inning, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);

    // Role indicator — tell the player what they'll do
    if (frame > 40) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        // Solo: top = you pitch, bottom = you bat
        const role = halfInning === 'top' ? 'YOU PITCH' : 'YOU BAT';
        ctx.fillText(role, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 55);
    }
}

export function drawResultFlash(ctx, text, subtext, frame) {
    if (frame > 60) return;
    const alpha = frame < 10 ? frame / 10 : frame > 45 ? 1 - (frame - 45) / 15 : 1;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';

    // Main result
    ctx.font = '18px "Press Start 2P", monospace';
    let color = '#ffffff';
    if (text === 'HOME RUN!') color = '#ffff00';
    else if (text === 'TRIPLE!') color = '#ff8800';
    else if (text === 'DOUBLE!') color = '#00ff88';
    else if (text === 'SINGLE!') color = '#00ccff';
    else if (text === 'STRIKE OUT!') color = '#ff4444';
    else if (text.includes('OUT')) color = '#ff4444';

    ctx.fillStyle = color;
    ctx.fillText(text, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);

    if (subtext) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(subtext, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 15);
    }

    ctx.restore();
}

export function drawGameOver(ctx, homeScore, awayScore, arcadeScore, drawFrame) {
    ctx.textAlign = 'center';

    ctx.font = '24px "Press Start 2P", monospace';
    ctx.fillStyle = COLORS.TITLE_MAIN;
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, 180);

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('FINAL SCORE', GAME_WIDTH / 2, 240);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText('AWAY: ' + awayScore, GAME_WIDTH / 2, 275);
    ctx.fillText('HOME: ' + homeScore, GAME_WIDTH / 2, 300);

    const winner = homeScore > awayScore ? 'HOME WINS!' :
                   awayScore > homeScore ? 'AWAY WINS!' : 'TIE GAME!';

    if (Math.floor(drawFrame / 20) % 2 === 0) {
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffff00';
        ctx.fillText(winner, GAME_WIDTH / 2, 350);
    }

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ccff';
    ctx.fillText('ARCADE: ' + arcadeScore.toString().padStart(6, '0'), GAME_WIDTH / 2, 400);
}

export function drawSideChange(ctx, frame, nextHalf, nextInning) {
    const alpha = Math.min(frame / 20, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#00ccff';
    ctx.fillText('SIDE RETIRED', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = '#ffffff';
    const text = nextHalf === 'bottom' ?
        'BOTTOM ' + nextInning :
        'TOP ' + nextInning;
    ctx.fillText(text, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 15);

    ctx.restore();
}

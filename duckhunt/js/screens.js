// Duck Hunt — Title, mode select, round intro, game over screens

import { GAME_WIDTH, GAME_HEIGHT, SKY_COLOR, GRASS_TOP } from './constants.js';
import { getLeaderboard, getHighScore } from './leaderboard.js';
import { DUCK_SPRITES, drawSprite, CROSSHAIR } from './sprites.js';
import { getIsTouch } from './input.js';

// --- Title Screen ---
export function drawTitleScreen(ctx, frame) {
    // Sky background
    ctx.fillStyle = SKY_COLOR;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Grass
    ctx.fillStyle = '#38b838';
    ctx.fillRect(0, GRASS_TOP, GAME_WIDTH, GAME_HEIGHT - GRASS_TOP);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '28px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DUCK', GAME_WIDTH / 2, 120);
    ctx.fillText('HUNT', GAME_WIDTH / 2, 160);

    // Decorative flying duck
    const duckX = 120 + (frame % 300) * 0.8;
    const duckY = 220 + Math.sin(frame * 0.05) * 20;
    const wingIdx = Math.floor(frame / 8) % 3;
    const sprite = DUCK_SPRITES.black.fly[wingIdx];
    drawSprite(ctx, sprite, duckX, duckY, 3);

    // Crosshair near duck
    drawSprite(ctx, CROSSHAIR, duckX + 30, duckY - 10, 2);

    // Start prompt
    const blink = Math.floor(frame / 30) % 2;
    if (blink) {
        ctx.fillStyle = '#ffff00';
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillText(getIsTouch() ? 'TAP TO START' : 'PRESS ENTER', GAME_WIDTH / 2, 320);
    }

    // High score
    const hi = getHighScore();
    if (hi > 0) {
        ctx.fillStyle = '#00ccff';
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillText('HIGH SCORE', GAME_WIDTH / 2, 370);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(hi.toString(), GAME_WIDTH / 2, 390);
    }

    // Leaderboard
    const board = getLeaderboard();
    if (board.length > 0) {
        ctx.fillStyle = '#888888';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText('TOP SCORES', GAME_WIDTH / 2, 430);

        const maxShow = Math.min(board.length, 5);
        for (let i = 0; i < maxShow; i++) {
            const entry = board[i];
            const y = 452 + i * 18;
            ctx.textAlign = 'left';
            ctx.fillStyle = i === 0 ? '#ffff00' : '#aaaaaa';
            ctx.fillText(`${(i + 1)}.`, 100, y);
            ctx.fillText(entry.name || '???', 130, y);
            ctx.textAlign = 'right';
            ctx.fillText(entry.score.toString(), 380, y);
        }
    }

    ctx.textAlign = 'center';
}

// --- Mode Select Screen ---
export function drawModeSelect(ctx, selectedMode, frame) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = '#00ccff';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SELECT GAME', GAME_WIDTH / 2, 180);

    // Game A
    const aColor = selectedMode === 'A' ? '#ffff00' : '#888888';
    ctx.fillStyle = aColor;
    ctx.font = '12px "Press Start 2P", monospace';
    const aPrefix = selectedMode === 'A' ? '> ' : '  ';
    ctx.textAlign = 'center';
    ctx.fillText(`${aPrefix}GAME A`, GAME_WIDTH / 2, 280);
    ctx.fillStyle = selectedMode === 'A' ? '#ffffff' : '#666666';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('2 DUCKS', GAME_WIDTH / 2, 305);

    // Game B
    const bColor = selectedMode === 'B' ? '#ffff00' : '#888888';
    ctx.fillStyle = bColor;
    ctx.font = '12px "Press Start 2P", monospace';
    const bPrefix = selectedMode === 'B' ? '> ' : '  ';
    ctx.fillText(`${bPrefix}GAME B`, GAME_WIDTH / 2, 370);
    ctx.fillStyle = selectedMode === 'B' ? '#ffffff' : '#666666';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText('3 DUCKS', GAME_WIDTH / 2, 395);

    // Instructions
    const blink = Math.floor(frame / 30) % 2;
    if (blink) {
        ctx.fillStyle = '#555555';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText(getIsTouch() ? 'TAP TO SELECT' : 'ARROWS + ENTER', GAME_WIDTH / 2, 480);
    }
}

// --- Round Intro Screen ---
export function drawRoundIntro(ctx, round, frame) {
    // Drawn ON TOP of the game scene (semi-transparent)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, GAME_WIDTH, GRASS_TOP);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`ROUND ${round}`, GAME_WIDTH / 2, GRASS_TOP / 2 - 10);

    const blink = Math.floor(frame / 15) % 2;
    if (blink) {
        ctx.fillStyle = '#ffff00';
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillText('GET READY!', GAME_WIDTH / 2, GRASS_TOP / 2 + 30);
    }
}

// --- Game Over Screen ---
export function drawGameOver(ctx, score, frame) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = '#ff4444';
    ctx.font = '24px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, 240);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText('FINAL SCORE', GAME_WIDTH / 2, 310);

    ctx.fillStyle = '#ffff00';
    ctx.font = '20px "Press Start 2P", monospace';
    ctx.fillText(score.toString(), GAME_WIDTH / 2, 350);

    // Check if new high score
    if (score > getHighScore() && score > 0) {
        const blink = Math.floor(frame / 20) % 2;
        if (blink) {
            ctx.fillStyle = '#00ccff';
            ctx.font = '10px "Press Start 2P", monospace';
            ctx.fillText('NEW HIGH SCORE!', GAME_WIDTH / 2, 400);
        }
    }

    // Continue prompt
    const blink2 = Math.floor(frame / 30) % 2;
    if (blink2) {
        ctx.fillStyle = '#888888';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText(getIsTouch() ? 'TAP TO CONTINUE' : 'PRESS ENTER', GAME_WIDTH / 2, 480);
    }
}

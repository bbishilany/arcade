import { GAME_WIDTH, GAME_HEIGHT, ALIEN_WIDTH, ALIEN_HEIGHT, DIVE_SPEED,
         ALIEN_FIRE_CHANCE } from './constants.js';
import { drawSprite, getAlienSprite } from './sprites.js';
import { createAlienBullet } from './bullet.js';

export function createAlien(col, row, type) {
    return {
        col,
        row,
        type,         // 'commander', 'butterfly', 'bee'
        alive: true,
        diving: false,
        divePath: null,
        diveIndex: 0,
        formX: 0,     // position in formation (set by formation)
        formY: 0,
        x: 0,
        y: 0,
        width: ALIEN_WIDTH,
        height: ALIEN_HEIGHT,
        animFrame: 0,
        points: type === 'commander' ? 150 : type === 'butterfly' ? 80 : 50
    };
}

export function getAlienType(row) {
    if (row === 0) return 'commander';
    if (row <= 2) return 'butterfly';
    return 'bee';
}

export function startDive(alien, playerX) {
    alien.diving = true;
    alien.diveIndex = 0;

    // Generate a Bezier dive path toward the player, then loop back off-screen
    const startX = alien.x;
    const startY = alien.y;
    const targetX = playerX + (Math.random() - 0.5) * 100;
    const midX = startX + (Math.random() - 0.5) * 200;

    alien.divePath = generateDivePath(startX, startY, midX, targetX);
}

function generateDivePath(startX, startY, midX, targetX) {
    const points = [];
    const steps = 120;

    // Control points for a swooping dive
    const cp1x = midX;
    const cp1y = startY + 150;
    const cp2x = targetX;
    const cp2y = GAME_HEIGHT - 80;
    const endX = startX + (Math.random() - 0.5) * 100;
    const endY = -40; // loop back off top

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // Cubic bezier
        const u = 1 - t;
        const x = u*u*u*startX + 3*u*u*t*cp1x + 3*u*t*t*cp2x + t*t*t*endX;
        const y = u*u*u*startY + 3*u*u*t*cp1y + 3*u*t*t*cp2y + t*t*t*endY;
        points.push({ x, y });
    }
    return points;
}

export function updateAlien(alien, bullets, playerX) {
    if (!alien.alive) return;

    if (alien.diving && alien.divePath) {
        if (alien.diveIndex < alien.divePath.length) {
            const pt = alien.divePath[alien.diveIndex];
            alien.x = pt.x;
            alien.y = pt.y;
            alien.diveIndex++;

            // Fire while diving
            if (Math.random() < ALIEN_FIRE_CHANCE) {
                bullets.push(createAlienBullet(alien.x, alien.y + alien.height / 2));
            }
        } else {
            // Dive complete — return to formation
            alien.diving = false;
            alien.divePath = null;
        }
    } else {
        // In formation — position set by formation.js
        alien.x = alien.formX;
        alien.y = alien.formY;
    }
}

export function drawAlien(ctx, alien, frameCount) {
    if (!alien.alive) return;

    const animFrame = alien.noAnim ? 0 : Math.floor(frameCount / 30) % 2;
    const sprite = getAlienSprite(alien.type, animFrame);
    drawSprite(ctx, sprite, alien.x, alien.y, 2);
}

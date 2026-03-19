import { PLAYER_BULLET_SPEED, ALIEN_BULLET_SPEED, BULLET_WIDTH, BULLET_HEIGHT,
         GAME_HEIGHT, COLORS } from './constants.js';
import { isCheatActive } from './input.js';

const FAST_BULLET_COLOR = '#00ff44';

export function createPlayerBullet(x, y) {
    const fast = isCheatActive();
    return {
        x,
        y,
        width: fast ? BULLET_WIDTH + 4 : BULLET_WIDTH,
        height: fast ? BULLET_HEIGHT + 6 : BULLET_HEIGHT,
        speed: fast ? PLAYER_BULLET_SPEED * 10 : PLAYER_BULLET_SPEED,
        isPlayer: true,
        isFast: fast
    };
}

export function createMissile(x, y) {
    return {
        x,
        y,
        width: 16,
        height: 24,
        speed: 12,
        isPlayer: true,
        isMissile: true,
        killsLeft: 10
    };
}

export function createAlienBullet(x, y) {
    return {
        x,
        y,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT + 2,
        speed: ALIEN_BULLET_SPEED,
        isPlayer: false
    };
}

export function updateBullets(bullets) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        if (b.isPlayer) {
            b.y -= b.speed;
        } else {
            b.y += b.speed;
        }
        // Remove off-screen
        if (b.y < -10 || b.y > GAME_HEIGHT + 10) {
            bullets.splice(i, 1);
        }
    }
}

export function drawBullets(ctx, bullets) {
    for (const b of bullets) {
        if (b.isMissile) {
            // Big red missile with orange glow
            ctx.fillStyle = '#ff2200';
            ctx.fillRect(b.x - b.width / 2, b.y - b.height / 2, b.width, b.height);
            // Pointed tip
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(b.x - 4, b.y - b.height / 2 - 6, 8, 6);
            // White core
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(b.x - 2, b.y - b.height / 2 - 4, 4, 4);
            // Engine flame — big and flickering
            const flameH = 10 + Math.random() * 8;
            ctx.fillStyle = '#ff6600';
            ctx.fillRect(b.x - 6, b.y + b.height / 2, 12, flameH);
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(b.x - 3, b.y + b.height / 2, 6, flameH - 2);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(b.x - 1, b.y + b.height / 2, 2, 4);
            // Outer glow
            ctx.fillStyle = 'rgba(255, 100, 0, 0.35)';
            ctx.fillRect(b.x - b.width, b.y - b.height, b.width * 2, b.height * 3);
        } else if (b.isPlayer) {
            if (b.isFast) {
                // Fast cheat bullet — bright green with long trail
                ctx.fillStyle = FAST_BULLET_COLOR;
                ctx.fillRect(b.x - 4, b.y - b.height / 2, 8, b.height);
                ctx.fillStyle = 'rgba(0, 255, 68, 0.5)';
                ctx.fillRect(b.x - 6, b.y - b.height / 2 - 2, 12, b.height + 20);
                ctx.fillStyle = 'rgba(0, 255, 68, 0.2)';
                ctx.fillRect(b.x - 2, b.y, 4, 40);
            } else {
                // Normal bullet — bright bolt
                ctx.fillStyle = COLORS.PLAYER_BULLET;
                ctx.fillRect(b.x - 3, b.y - b.height / 2, 6, b.height);
                // Glow
                ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
                ctx.fillRect(b.x - 5, b.y - b.height / 2 - 1, 10, b.height + 2);
            }
        } else {
            ctx.fillStyle = COLORS.ALIEN_BULLET;
            ctx.fillRect(b.x - b.width / 2, b.y - b.height / 2, b.width, b.height);
            // Trail
            ctx.fillStyle = 'rgba(255, 68, 68, 0.4)';
            ctx.fillRect(b.x - 1, b.y - b.height, 2, b.height);
        }
    }
}

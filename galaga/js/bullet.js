import { PLAYER_BULLET_SPEED, ALIEN_BULLET_SPEED, BULLET_WIDTH, BULLET_HEIGHT,
         GAME_HEIGHT, COLORS } from './constants.js';
import { isCheatActive } from './input.js';

export function createPlayerBullet(x, y) {
    return {
        x,
        y,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        speed: isCheatActive() ? PLAYER_BULLET_SPEED * 10 : PLAYER_BULLET_SPEED,
        isPlayer: true
    };
}

export function createMissile(x, y) {
    return {
        x,
        y,
        width: 12,
        height: 20,
        speed: 5,
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
            ctx.fillRect(b.x - 3, b.y - b.height / 2 - 4, 6, 4);
            // Engine flame
            ctx.fillStyle = '#ff6600';
            ctx.fillRect(b.x - 4, b.y + b.height / 2, 8, 6 + Math.random() * 4);
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(b.x - 2, b.y + b.height / 2, 4, 4 + Math.random() * 3);
            // Glow
            ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
            ctx.fillRect(b.x - b.width, b.y - b.height, b.width * 2, b.height * 2);
        } else if (b.isPlayer) {
            // Draw bullet as a bright bolt
            ctx.fillStyle = COLORS.PLAYER_BULLET;
            ctx.fillRect(b.x - 3, b.y - b.height / 2, 6, b.height);
            // Glow
            ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
            ctx.fillRect(b.x - 5, b.y - b.height / 2 - 1, 10, b.height + 2);
        } else {
            ctx.fillStyle = COLORS.ALIEN_BULLET;
            ctx.fillRect(b.x - b.width / 2, b.y - b.height / 2, b.width, b.height);
            // Trail
            ctx.fillStyle = 'rgba(255, 68, 68, 0.4)';
            ctx.fillRect(b.x - 1, b.y - b.height, 2, b.height);
        }
    }
}

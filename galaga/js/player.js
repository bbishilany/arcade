import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SPEED, PLAYER_WIDTH, PLAYER_HEIGHT,
         PLAYER_Y_OFFSET, FIRE_COOLDOWN, MAX_PLAYER_BULLETS, MAX_LIVES } from './constants.js';
import { isHeld, isFreeMovementActive, consumeMissile } from './input.js';
import { drawSprite, PLAYER_SPRITE } from './sprites.js';
import { createPlayerBullet, createMissile } from './bullet.js';

export function createPlayer() {
    return {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT - PLAYER_Y_OFFSET,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        lives: MAX_LIVES,
        fireCooldown: 0,
        alive: true,
        respawnTimer: 0,
        blinkTimer: 0
    };
}

export function updatePlayer(player, bullets) {
    if (!player.alive) return;

    // Movement
    if (isHeld('ArrowLeft') || isHeld('KeyA')) {
        player.x -= PLAYER_SPEED;
    }
    if (isHeld('ArrowRight') || isHeld('KeyD')) {
        player.x += PLAYER_SPEED;
    }

    // Free movement cheat (67) — up and down
    if (isFreeMovementActive()) {
        if (isHeld('ArrowUp') || isHeld('KeyW')) {
            player.y -= PLAYER_SPEED;
        }
        if (isHeld('ArrowDown') || isHeld('KeyS')) {
            player.y += PLAYER_SPEED;
        }
        // Clamp vertical
        const halfH = player.height / 2;
        if (player.y < halfH) player.y = halfH;
        if (player.y > GAME_HEIGHT - halfH) player.y = GAME_HEIGHT - halfH;
    }

    // Clamp to screen
    const halfW = player.width / 2;
    if (player.x < halfW) player.x = halfW;
    if (player.x > GAME_WIDTH - halfW) player.x = GAME_WIDTH - halfW;

    // Fire cooldown
    if (player.fireCooldown > 0) {
        player.fireCooldown--;
    }

    // Blink timer (invincibility after respawn)
    if (player.blinkTimer > 0) {
        player.blinkTimer--;
    }

    // Check for missile cheat
    if (consumeMissile()) {
        bullets.push(createMissile(player.x, player.y - player.height / 2));
        return true;
    }

    // Shoot
    if (isHeld('Space') && player.fireCooldown === 0) {
        const playerBullets = bullets.filter(b => b.isPlayer);
        if (playerBullets.length < MAX_PLAYER_BULLETS) {
            bullets.push(createPlayerBullet(player.x, player.y - player.height / 2));
            player.fireCooldown = FIRE_COOLDOWN;
            return true; // signal: played shoot sound
        }
    }
    return false;
}

export function drawPlayer(ctx, player, frameCount) {
    if (!player.alive) return;

    // Blink effect during invincibility
    if (player.blinkTimer > 0 && Math.floor(frameCount / 4) % 2 === 0) return;

    drawSprite(ctx, PLAYER_SPRITE, player.x, player.y, 2);

    // Engine glow
    const glowIntensity = 0.5 + Math.sin(frameCount * 0.3) * 0.3;
    ctx.fillStyle = `rgba(255, 102, 0, ${glowIntensity})`;
    ctx.fillRect(player.x - 3, player.y + 10, 6, 4 + Math.random() * 3);
}

export function killPlayer(player) {
    player.alive = false;
    player.lives--;
}

export function respawnPlayer(player) {
    player.x = GAME_WIDTH / 2;
    player.y = GAME_HEIGHT - PLAYER_Y_OFFSET;
    player.alive = true;
    player.fireCooldown = 0;
    player.blinkTimer = 120; // 2 seconds of invincibility
}

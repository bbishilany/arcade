// Duck Hunt — Duck entity: create, fly, bounce, hit, fall, escape

import {
    GAME_WIDTH, SKY_HEIGHT, GRASS_TOP,
    DUCK_FLY_FRAMES, DUCK_HIT_FLASH, DUCK_FALL_SPEED,
    DIR_CHANGE_MIN, DIR_CHANGE_MAX, WING_ANIM_SPEED,
    DUCK_SCALE, duckSpeed
} from './constants.js';
import { DUCK_SPRITES, drawSprite, drawSpriteFlipped } from './sprites.js';

const DUCK_COLORS_LIST = ['black', 'blue', 'red'];
const HIT_RADIUS = 24; // pixels in game coords for hit detection

export function createDuck(round) {
    const color = DUCK_COLORS_LIST[Math.floor(Math.random() * 3)];
    const speed = duckSpeed(round);

    // Spawn from grass line at random x
    const x = 60 + Math.random() * (GAME_WIDTH - 120);
    const y = GRASS_TOP - 20;

    // Random upward angle (30° to 150°)
    const angle = (30 + Math.random() * 120) * Math.PI / 180;
    const vx = Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1);
    const vy = -Math.abs(Math.sin(angle) * speed);

    return {
        x, y, vx, vy,
        speed,
        color,
        wingFrame: 0,
        wingTimer: 0,
        flyTimer: 0,
        dirChangeTimer: randDirChange(),
        state: 'flying', // flying | hit | falling | escaped | gone
        hitFlashTimer: 0,
        facingRight: vx > 0
    };
}

function randDirChange() {
    return DIR_CHANGE_MIN + Math.floor(Math.random() * (DIR_CHANGE_MAX - DIR_CHANGE_MIN));
}

export function updateDuck(duck) {
    if (duck.state === 'flying') {
        duck.flyTimer++;
        duck.wingTimer++;

        // Wing animation cycling: 0→1→2→1→0...
        if (duck.wingTimer >= WING_ANIM_SPEED) {
            duck.wingTimer = 0;
            duck.wingFrame = (duck.wingFrame + 1) % 4; // 0,1,2,3 maps to 0,1,2,1
        }

        // Escape after timeout
        if (duck.flyTimer >= DUCK_FLY_FRAMES) {
            duck.vy = -duck.speed * 2.5;
            duck.vx = 0;
            duck.x += duck.vx;
            duck.y += duck.vy;
            if (duck.y < -60) {
                duck.state = 'escaped';
            }
            return;
        }

        // Random direction perturbation
        duck.dirChangeTimer--;
        if (duck.dirChangeTimer <= 0) {
            const angle = Math.random() * Math.PI; // 0 to 180 degrees
            duck.vx = Math.cos(angle) * duck.speed * (Math.random() < 0.5 ? 1 : -1);
            duck.vy = -Math.abs(Math.sin(angle) * duck.speed) * (Math.random() < 0.3 ? -1 : 1);
            duck.dirChangeTimer = randDirChange();
        }

        // Move
        duck.x += duck.vx;
        duck.y += duck.vy;

        // Bounce off walls
        if (duck.x < 20) { duck.x = 20; duck.vx = Math.abs(duck.vx); }
        if (duck.x > GAME_WIDTH - 20) { duck.x = GAME_WIDTH - 20; duck.vx = -Math.abs(duck.vx); }
        if (duck.y < 20) { duck.y = 20; duck.vy = Math.abs(duck.vy); }
        if (duck.y > SKY_HEIGHT - 30) { duck.y = SKY_HEIGHT - 30; duck.vy = -Math.abs(duck.vy); }

        // Update facing direction
        if (duck.vx > 0.1) duck.facingRight = true;
        if (duck.vx < -0.1) duck.facingRight = false;

    } else if (duck.state === 'hit') {
        duck.hitFlashTimer--;
        if (duck.hitFlashTimer <= 0) {
            duck.state = 'falling';
        }
    } else if (duck.state === 'falling') {
        duck.y += DUCK_FALL_SPEED;
        if (duck.y > GRASS_TOP + 20) {
            duck.state = 'gone';
        }
    }
}

export function hitTestDuck(duck, shotX, shotY) {
    if (duck.state !== 'flying') return false;
    const dx = duck.x - shotX;
    const dy = duck.y - shotY;
    return (dx * dx + dy * dy) < (HIT_RADIUS * HIT_RADIUS);
}

export function shootDuck(duck) {
    duck.state = 'hit';
    duck.hitFlashTimer = DUCK_HIT_FLASH;
    duck.vx = 0;
    duck.vy = 0;
}

export function drawDuck(ctx, duck, frame) {
    const sprites = DUCK_SPRITES[duck.color];
    let sprite;

    if (duck.state === 'hit') {
        // Flash white periodically during hit
        if (duck.hitFlashTimer % 4 < 2) {
            sprite = sprites.hit;
        } else {
            // White flash — draw a white rectangle
            const s = DUCK_SCALE;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(duck.x - 20, duck.y - 15, 40, 30);
            return;
        }
    } else if (duck.state === 'falling') {
        sprite = sprites.fall;
    } else {
        // Wing frame mapping: 0→0, 1→1, 2→2, 3→1
        const wingIdx = duck.wingFrame === 3 ? 1 : duck.wingFrame;
        sprite = sprites.fly[wingIdx];
    }

    if (duck.facingRight) {
        drawSprite(ctx, sprite, duck.x, duck.y, DUCK_SCALE);
    } else {
        drawSpriteFlipped(ctx, sprite, duck.x, duck.y, DUCK_SCALE);
    }
}

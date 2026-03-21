// Duck Hunt — Dog animation state machine

import { GAME_WIDTH, GRASS_TOP, DOG_SCALE, DOG_POPUP_FRAMES, DOG_INTRO_WALK_SPEED } from './constants.js';
import {
    drawSprite,
    DOG_WALK_1, DOG_WALK_2, DOG_SNIFF, DOG_ALERT, DOG_JUMP,
    DOG_HOLD_ONE, DOG_HOLD_TWO, DOG_LAUGH_1, DOG_LAUGH_2
} from './sprites.js';
import { playDogLaugh } from './audio.js';

// Dog state: hidden | walking | sniffing | alert | jumping | hold | laughing
let dog = {
    state: 'hidden',
    x: -40,
    y: GRASS_TOP - 30,
    frame: 0,
    timer: 0,
    jumpVy: 0,
    jumpStartY: 0,
    ducksHeld: 0,        // 1 or 2
    laughPlayed: false,
    popupY: 0            // for rising from grass
};

export function resetDog() {
    dog.state = 'hidden';
    dog.x = -40;
    dog.y = GRASS_TOP - 30;
    dog.frame = 0;
    dog.timer = 0;
    dog.laughPlayed = false;
}

export function startDogIntro(abbreviated) {
    if (abbreviated) {
        // Quick head pop for rounds 2+
        dog.state = 'alert';
        dog.x = GAME_WIDTH / 2;
        dog.y = GRASS_TOP - 30;
        dog.timer = 40;
    } else {
        // Full walk across for round 1
        dog.state = 'walking';
        dog.x = -40;
        dog.y = GRASS_TOP - 30;
        dog.timer = 0;
    }
    dog.frame = 0;
    dog.laughPlayed = false;
}

export function startDogResult(ducksHit) {
    dog.ducksHeld = ducksHit;
    dog.x = GAME_WIDTH / 2;
    dog.laughPlayed = false;

    if (ducksHit > 0) {
        dog.state = 'hold';
        dog.popupY = GRASS_TOP + 60; // start below grass
        dog.timer = DOG_POPUP_FRAMES;
    } else {
        dog.state = 'laughing';
        dog.popupY = GRASS_TOP + 60;
        dog.timer = DOG_POPUP_FRAMES;
    }
}

export function updateDog() {
    dog.timer--;

    switch (dog.state) {
        case 'walking':
            dog.x += DOG_INTRO_WALK_SPEED;
            dog.frame = Math.floor(Math.abs(dog.timer) / 10) % 2;

            // At center, start sniffing
            if (dog.x >= GAME_WIDTH / 2 - 20) {
                dog.state = 'sniffing';
                dog.timer = 60;
            }
            break;

        case 'sniffing':
            if (dog.timer <= 0) {
                dog.state = 'alert';
                dog.timer = 30;
            }
            break;

        case 'alert':
            if (dog.timer <= 0) {
                dog.state = 'jumping';
                dog.jumpVy = -6;
                dog.jumpStartY = dog.y;
                dog.timer = 60;
            }
            break;

        case 'jumping':
            dog.y += dog.jumpVy;
            dog.jumpVy += 0.3; // gravity
            // When dog falls back down past grass line, hide
            if (dog.y > GRASS_TOP + 20) {
                dog.state = 'hidden';
            }
            break;

        case 'hold':
            // Rise from grass
            if (dog.popupY > GRASS_TOP - 30) {
                dog.popupY -= 3;
            }
            if (dog.timer <= 0) {
                dog.state = 'hidden';
            }
            break;

        case 'laughing':
            // Rise from grass
            if (dog.popupY > GRASS_TOP - 30) {
                dog.popupY -= 3;
            }
            dog.frame = Math.floor(Date.now() / 200) % 2;
            if (!dog.laughPlayed && dog.popupY <= GRASS_TOP - 20) {
                playDogLaugh();
                dog.laughPlayed = true;
            }
            if (dog.timer <= 0) {
                dog.state = 'hidden';
            }
            break;
    }
}

export function isDogDone() {
    return dog.state === 'hidden';
}

export function drawDog(ctx) {
    if (dog.state === 'hidden') return;

    let sprite;
    let x = dog.x;
    let y = dog.y;

    switch (dog.state) {
        case 'walking':
            sprite = dog.frame === 0 ? DOG_WALK_1 : DOG_WALK_2;
            break;
        case 'sniffing':
            sprite = DOG_SNIFF;
            break;
        case 'alert':
            sprite = DOG_ALERT;
            break;
        case 'jumping':
            sprite = DOG_JUMP;
            break;
        case 'hold':
            sprite = dog.ducksHeld >= 2 ? DOG_HOLD_TWO : DOG_HOLD_ONE;
            y = dog.popupY;
            break;
        case 'laughing':
            sprite = dog.frame === 0 ? DOG_LAUGH_1 : DOG_LAUGH_2;
            y = dog.popupY;
            break;
        default:
            return;
    }

    drawSprite(ctx, sprite, x, y, DOG_SCALE);
}

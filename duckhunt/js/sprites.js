// Duck Hunt — Pixel Art Sprites
// Each sprite is a 2D array of color strings (null = transparent)

export function drawSprite(ctx, sprite, x, y, scale = 1) {
    const h = sprite.length;
    const w = sprite[0].length;
    const ox = x - (w * scale) / 2;
    const oy = y - (h * scale) / 2;

    for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
            const color = sprite[r][c];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(ox + c * scale, oy + r * scale, scale, scale);
            }
        }
    }
}

export function drawSpriteFlipped(ctx, sprite, x, y, scale = 1) {
    const h = sprite.length;
    const w = sprite[0].length;
    const ox = x - (w * scale) / 2;
    const oy = y - (h * scale) / 2;

    for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
            const color = sprite[r][w - 1 - c];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(ox + c * scale, oy + r * scale, scale, scale);
            }
        }
    }
}

// --- Color shortcuts ---
const _ = null;
const K = '#e89800'; // beak orange
const W = '#ffffff'; // white
const P = '#000000'; // pupil/black
const N = '#000000'; // nose/outline

// Generate a duck sprite with given body/accent/wing colors
function makeDuck(B, A, WG) {
    // Duck facing RIGHT, wings UP (14w x 12h)
    const wingsUp = [
        [_,_,B,B,_,_,_,_,_,_,_,_,_,_],
        [_,B,A,A,B,_,_,_,_,_,_,_,_,_],
        [B,A,A,A,A,B,_,_,_,_,_,_,_,_],
        [_,B,B,B,B,_,_,_,_,_,K,K,_,_],
        [_,_,B,B,B,B,B,_,W,P,K,K,K,_],
        [_,_,_,B,B,B,B,B,B,B,K,_,_,_],
        [_,_,_,B,WG,WG,B,B,B,B,_,_,_,_],
        [_,_,_,_,B,B,B,B,B,_,_,_,_,_],
        [_,_,_,_,_,B,B,B,_,_,_,_,_,_],
        [_,_,_,_,_,B,_,B,_,_,_,_,_,_],
    ];

    // Duck facing RIGHT, wings MID (14w x 12h)
    const wingsMid = [
        [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_,_,K,K,_,_],
        [_,_,_,_,_,_,_,_,W,P,K,K,K,_],
        [_,_,_,B,B,B,B,B,B,B,K,_,_,_],
        [_,_,B,WG,WG,B,B,B,B,B,_,_,_,_],
        [_,B,WG,WG,WG,WG,B,B,B,_,_,_,_,_],
        [_,_,B,WG,WG,B,B,B,B,_,_,_,_,_],
        [_,_,_,B,B,B,B,B,_,_,_,_,_,_],
        [_,_,_,_,_,B,B,_,_,_,_,_,_,_],
        [_,_,_,_,_,B,_,B,_,_,_,_,_,_],
    ];

    // Duck facing RIGHT, wings DOWN (14w x 12h)
    const wingsDown = [
        [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_,_,K,K,_,_],
        [_,_,_,_,_,_,_,_,W,P,K,K,K,_],
        [_,_,_,B,B,B,B,B,B,B,K,_,_,_],
        [_,_,_,_,B,B,B,B,B,B,_,_,_,_],
        [_,_,_,_,_,B,B,B,B,_,_,_,_,_],
        [_,_,_,B,WG,WG,B,B,B,_,_,_,_,_],
        [_,_,B,WG,WG,WG,WG,B,_,_,_,_,_,_],
        [_,B,A,A,A,A,B,_,_,_,_,_,_,_],
        [_,_,B,B,B,_,B,_,_,_,_,_,_,_],
    ];

    return [wingsUp, wingsMid, wingsDown];
}

// Hit duck sprite (X eyes, tumbling)
function makeHitDuck(B, A) {
    return [
        [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
        [_,_,_,_,B,B,_,_,_,_,_,_,_,_],
        [_,B,B,B,B,B,B,B,_,_,_,_,_,_],
        [B,A,A,B,B,B,B,B,B,_,_,_,_,_],
        [_,B,B,B,B,B,B,B,B,B,_,_,_,_],
        [_,_,B,B,B,B,B,B,_,_,_,_,_,_],
        [_,_,_,B,B,B,B,_,_,_,_,_,_,_],
        [_,_,_,_,B,B,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    ];
}

// Falling duck sprite (upside down)
function makeFallingDuck(B, A) {
    return [
        [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
        [_,_,_,_,_,B,_,B,_,_,_,_,_,_],
        [_,_,_,_,B,B,B,_,_,_,_,_,_,_],
        [_,_,_,B,B,B,B,B,_,_,_,_,_,_],
        [_,_,B,B,B,B,B,B,B,_,_,_,_,_],
        [_,B,A,A,B,B,B,B,B,B,_,_,_,_],
        [_,_,B,B,B,B,B,B,B,_,_,_,_,_],
        [_,_,_,B,B,B,B,_,_,_,_,_,_,_],
        [_,_,_,_,_,_,_,_,P,W,K,K,_,_],
        [_,_,_,_,_,_,_,_,_,_,K,_,_,_],
    ];
}

// --- Duck sprite sets by color ---
import { DUCK_COLORS } from './constants.js';

const blackC = DUCK_COLORS.black;
const blueC = DUCK_COLORS.blue;
const redC = DUCK_COLORS.red;

export const DUCK_SPRITES = {
    black: {
        fly: makeDuck(blackC.body, blackC.accent, blackC.wing),
        hit: makeHitDuck(blackC.body, blackC.accent),
        fall: makeFallingDuck(blackC.body, blackC.accent)
    },
    blue: {
        fly: makeDuck(blueC.body, blueC.accent, blueC.wing),
        hit: makeHitDuck(blueC.body, blueC.accent),
        fall: makeFallingDuck(blueC.body, blueC.accent)
    },
    red: {
        fly: makeDuck(redC.body, redC.accent, redC.wing),
        hit: makeHitDuck(redC.body, redC.accent),
        fall: makeFallingDuck(redC.body, redC.accent)
    }
};

// --- Dog sprites ---
const BR = '#c87838'; // brown body
const LB = '#e8a858'; // light brown
const DB = '#985028'; // dark brown
const RD = '#d82800'; // red (tongue/collar)
const PK = '#f8a8a8'; // pink (tongue)

// Dog walking frame 1 (16w x 20h)
export const DOG_WALK_1 = [
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,P,W,BR,BR,DB,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,_,_,_,_,DB,BR,N,DB,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,LB,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,_,DB,LB,LB,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
    [_,DB,LB,LB,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
    [_,DB,LB,BR,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
    [_,_,DB,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,_,_,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,DB,_,_,DB,DB,_,_,_,_,_,_,_],
];

// Dog walking frame 2
export const DOG_WALK_2 = [
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,P,W,BR,BR,DB,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,_,_,_,_,DB,BR,N,DB,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,LB,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,_,DB,LB,LB,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
    [_,DB,LB,LB,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
    [_,DB,LB,BR,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
    [_,_,DB,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,DB,BR,_,_,_,_,BR,DB,_,_,_,_,_,_],
    [_,_,DB,DB,_,_,_,_,DB,DB,_,_,_,_,_,_],
];

// Dog sniffing (nose down)
export const DOG_SNIFF = [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,P,W,BR,BR,DB,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,BR,BR,_,_,_,_,_,_,_],
    [_,_,_,_,_,DB,BR,BR,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,DB,N,_,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,DB,LB,BR,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,DB,LB,LB,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,DB,LB,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,_,DB,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,_,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,DB,_,DB,DB,_,_,_,_,_,_,_,_],
];

// Dog alert (ears up, looking up)
export const DOG_ALERT = [
    [_,_,_,DB,_,_,_,DB,_,_,_,_,_,_,_,_],
    [_,_,DB,BR,DB,_,DB,BR,DB,_,_,_,_,_,_,_],
    [_,_,DB,BR,BR,DB,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,W,P,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,DB,N,DB,_,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,LB,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,DB,LB,LB,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,DB,LB,LB,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,DB,LB,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,_,DB,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,_,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,DB,_,DB,DB,_,_,_,_,_,_,_,_],
];

// Dog jumping (leaping up, compact pose)
export const DOG_JUMP = [
    [_,_,_,DB,_,_,_,DB,_,_,_,_,_,_,_,_],
    [_,_,DB,BR,DB,_,DB,BR,DB,_,_,_,_,_,_,_],
    [_,_,DB,BR,BR,DB,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,W,P,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,DB,N,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,BR,BR,BR,DB,_,_,_,_,_,_,_],
    [_,_,DB,LB,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,DB,LB,LB,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,_,DB,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,_,_,DB,DB,BR,BR,DB,DB,_,_,_,_,_,_,_],
];

// Dog holding one duck (upper body only — pops up from grass)
export const DOG_HOLD_ONE = [
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,W,P,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [_,_,DB,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,DB,LB,BR,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
    [_,DB,BR,BR,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
];

// Dog holding two ducks
export const DOG_HOLD_TWO = [
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,W,P,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [DB,BR,BR,BR,BR,BR,BR,BR,BR,BR,BR,BR,DB,_,_,_],
    [DB,LB,BR,BR,BR,BR,BR,BR,BR,BR,BR,LB,DB,_,_,_],
    [_,DB,BR,BR,BR,BR,BR,BR,BR,BR,BR,DB,_,_,_,_],
];

// Dog laughing frame 1
export const DOG_LAUGH_1 = [
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,BR,P,P,BR,DB,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,PK,DB,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [_,_,DB,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,DB,LB,BR,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
    [_,DB,BR,BR,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
];

// Dog laughing frame 2 (slight variation)
export const DOG_LAUGH_2 = [
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,DB,BR,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,DB,P,BR,BR,P,DB,_,_,_,_,_,_,_],
    [_,_,_,_,DB,PK,BR,DB,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,DB,DB,_,_,_,_,_,_,_,_,_],
    [_,_,DB,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_,_],
    [_,DB,LB,BR,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
    [_,DB,BR,BR,BR,BR,BR,BR,BR,BR,DB,_,_,_,_,_],
];

// --- Crosshair sprite (11x11) ---
const CW = '#ffffff';
export const CROSSHAIR = [
    [_,_,_,_,_,CW,_,_,_,_,_],
    [_,_,_,_,_,CW,_,_,_,_,_],
    [_,_,_,_,_,CW,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_],
    [CW,CW,CW,_,_,_,_,_,CW,CW,CW],
    [_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,CW,_,_,_,_,_],
    [_,_,_,_,_,CW,_,_,_,_,_],
    [_,_,_,_,_,CW,_,_,_,_,_],
];

// --- Title screen duck (decorative, large) ---
export const TITLE_DUCK = DUCK_SPRITES.black.fly[1];

// --- Bullet indicator for HUD ---
export const BULLET = [
    [_,W,_],
    [W,W,W],
    [W,W,W],
    [W,W,W],
    [W,W,W],
    [_,W,_],
];

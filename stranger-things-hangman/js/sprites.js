// Generic sprite renderer (same as Galaga)
export function drawSprite(ctx, sprite, x, y, scale = 1) {
    const pixelSize = scale;
    const spriteH = sprite.length;
    const spriteW = sprite[0].length;
    const offsetX = x - (spriteW * pixelSize) / 2;
    const offsetY = y - (spriteH * pixelSize) / 2;

    for (let row = 0; row < spriteH; row++) {
        for (let col = 0; col < spriteW; col++) {
            const color = sprite[row][col];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(
                    offsetX + col * pixelSize,
                    offsetY + row * pixelSize,
                    pixelSize,
                    pixelSize
                );
            }
        }
    }
}

// Color abbreviations for Demogorgon
const D = '#440000';  // dark flesh
const F = '#884422';  // flesh
const R = '#cc2200';  // red
const B = '#880000';  // blood red
const W = '#ccaa88';  // pale flesh
const P = '#ff4444';  // petal pink
const T = '#662200';  // dark brown
const G = '#333333';  // dark gray
const _ = null;       // transparent

// LEFT FOOT (bottom-left)
export const LEFT_FOOT = [
    [_,_,G,G,_],
    [_,G,D,G,_],
    [G,D,D,D,G],
    [G,D,D,D,G],
    [T,G,G,G,T],
];

// RIGHT FOOT (bottom-right)
export const RIGHT_FOOT = [
    [_,G,G,_,_],
    [_,G,D,G,_],
    [G,D,D,D,G],
    [G,D,D,D,G],
    [T,G,G,G,T],
];

// LEFT LEG
export const LEFT_LEG = [
    [_,_,D,D,_],
    [_,D,F,D,_],
    [_,D,F,D,_],
    [_,D,F,D,_],
    [_,D,D,D,_],
    [_,_,D,_,_],
];

// RIGHT LEG
export const RIGHT_LEG = [
    [_,D,D,_,_],
    [_,D,F,D,_],
    [_,D,F,D,_],
    [_,D,F,D,_],
    [_,D,D,D,_],
    [_,_,D,_,_],
];

// TORSO (central body mass)
export const TORSO = [
    [_,_,D,D,D,D,D,D,_,_],
    [_,D,F,F,F,F,F,F,D,_],
    [D,F,F,B,F,F,B,F,F,D],
    [D,F,F,F,F,F,F,F,F,D],
    [D,F,F,F,B,B,F,F,F,D],
    [D,F,F,F,F,F,F,F,F,D],
    [_,D,F,F,F,F,F,F,D,_],
    [_,D,F,F,F,F,F,F,D,_],
    [_,_,D,F,F,F,F,D,_,_],
    [_,_,_,D,D,D,D,_,_,_],
];

// LEFT ARM
export const LEFT_ARM = [
    [D,D,_,_,_],
    [_,D,D,_,_],
    [_,_,D,D,_],
    [_,_,D,F,D],
    [_,_,D,F,D],
    [_,D,F,D,_],
    [D,F,D,_,_],
];

// RIGHT ARM
export const RIGHT_ARM = [
    [_,_,_,D,D],
    [_,_,D,D,_],
    [_,D,D,_,_],
    [D,F,D,_,_],
    [D,F,D,_,_],
    [_,D,F,D,_],
    [_,_,D,F,D],
];

// LEFT CLAW (3 fingers/claws)
export const LEFT_CLAW = [
    [R,_,_,_],
    [D,R,_,_],
    [_,D,_,_],
    [R,D,_,_],
    [_,R,D,_],
    [_,_,D,D],
    [_,R,_,_],
    [R,_,_,_],
];

// RIGHT CLAW
export const RIGHT_CLAW = [
    [_,_,_,R],
    [_,_,R,D],
    [_,_,D,_],
    [_,_,D,R],
    [_,D,R,_],
    [D,D,_,_],
    [_,_,R,_],
    [_,_,_,R],
];

// HEAD - petal-face Demogorgon (the scariest part!)
export const HEAD = [
    [_,_,_,_,P,R,P,_,_,_,_],
    [_,_,_,P,R,B,R,P,_,_,_],
    [_,_,P,R,_,_,_,R,P,_,_],
    [_,P,R,_,_,_,_,_,R,P,_],
    [P,R,_,_,_,_,_,_,_,R,P],
    [P,R,_,_,B,B,B,_,_,R,P],
    [_,P,R,_,B,R,B,_,R,P,_],
    [_,_,P,R,_,B,_,R,P,_,_],
    [_,_,_,P,R,R,R,P,_,_,_],
    [_,_,_,_,D,D,D,_,_,_,_],
    [_,_,_,D,F,F,F,D,_,_,_],
];

// Part positions relative to center (x, y offsets from DEMOGORGON_X, DEMOGORGON_Y)
export const PART_OFFSETS = [
    { sprite: LEFT_FOOT,  x: -20, y: 110 },   // 0: left foot
    { sprite: RIGHT_FOOT, x: 20,  y: 110 },   // 1: right foot
    { sprite: LEFT_LEG,   x: -16, y: 75 },    // 2: left leg
    { sprite: RIGHT_LEG,  x: 16,  y: 75 },    // 3: right leg
    { sprite: TORSO,      x: 0,   y: 20 },    // 4: torso
    { sprite: LEFT_ARM,   x: -40, y: 10 },    // 5: left arm
    { sprite: RIGHT_ARM,  x: 40,  y: 10 },    // 6: right arm
    { sprite: LEFT_CLAW,  x: -55, y: -20 },   // 7: left claw
    { sprite: RIGHT_CLAW, x: 55,  y: -20 },   // 8: right claw
    { sprite: HEAD,       x: 0,   y: -40 },   // 9: head
];

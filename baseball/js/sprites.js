// Pixel-map sprite renderer (same as Galaga)
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

const W = '#ffffff';
const R = '#ff4444';
const B = '#4488ff';
const Y = '#ffff00';
const O = '#ff8800';
const G = '#44cc44';
const S = '#ccaa88'; // skin
const D = '#8b6914'; // dark/brown
const K = '#222222'; // dark gray
const T = '#cc2222'; // team red
const U = '#2244cc'; // team blue
const _ = null;

// Batter — ready stance (behind perspective, facing up-right)
export const BATTER_READY = [
    [_,_,_,_,S,S,_,_,_,_,_,_],
    [_,_,_,S,S,S,S,_,_,_,_,_],
    [_,_,_,T,T,T,_,_,_,_,_,_],
    [_,_,T,T,T,T,T,_,_,_,_,_],
    [_,_,T,T,T,T,T,_,_,W,W,_],
    [_,_,_,T,T,T,_,_,W,W,_,_],
    [_,_,_,S,_,S,_,W,W,_,_,_],
    [_,_,_,T,_,T,W,W,_,_,_,_],
    [_,_,_,T,_,T,_,_,_,_,_,_],
    [_,_,T,T,_,T,T,_,_,_,_,_],
    [_,_,K,K,_,K,K,_,_,_,_,_],
];

// Batter — mid-swing
export const BATTER_SWING = [
    [_,_,_,_,S,S,_,_,_,_,_,_],
    [_,_,_,S,S,S,S,_,_,_,_,_],
    [_,_,_,T,T,T,_,_,_,_,_,_],
    [_,_,T,T,T,T,T,_,_,_,_,_],
    [W,W,T,T,T,T,T,_,_,_,_,_],
    [_,W,W,T,T,T,_,_,_,_,_,_],
    [_,_,W,S,_,S,_,_,_,_,_,_],
    [_,_,_,T,_,T,_,_,_,_,_,_],
    [_,_,_,T,_,T,_,_,_,_,_,_],
    [_,_,T,T,_,T,T,_,_,_,_,_],
    [_,_,K,K,_,K,K,_,_,_,_,_],
];

// Pitcher — windup (facing down toward batter)
export const PITCHER_WINDUP = [
    [_,_,_,S,S,_,_,_],
    [_,_,S,S,S,S,_,_],
    [_,_,U,U,U,U,_,_],
    [_,U,U,U,U,U,U,_],
    [_,S,U,U,U,U,S,_],
    [_,_,U,U,U,U,_,_],
    [_,_,U,_,_,U,_,_],
    [_,_,U,_,_,U,_,_],
    [_,_,K,_,_,K,_,_],
];

// Pitcher — release
export const PITCHER_RELEASE = [
    [_,_,_,S,S,_,_,_,_,_],
    [_,_,S,S,S,S,_,_,_,_],
    [_,_,U,U,U,U,_,_,_,_],
    [_,U,U,U,U,U,U,_,_,_],
    [_,_,U,U,U,U,S,S,W,_],
    [_,_,U,U,U,U,_,_,_,_],
    [_,_,U,_,_,U,_,_,_,_],
    [_,_,U,_,_,U,_,_,_,_],
    [_,_,K,_,_,K,_,_,_,_],
];

// Runner — small sprite for field view (2 animation frames)
export const RUNNER_A = [
    [_,S,S,_],
    [_,T,T,_],
    [T,T,T,T],
    [_,T,T,_],
    [_,K,K,_],
    [K,_,_,K],
];

export const RUNNER_B = [
    [_,S,S,_],
    [_,T,T,_],
    [T,T,T,T],
    [_,T,T,_],
    [K,_,_,K],
    [_,K,K,_],
];

// Fielder — small sprite
export const FIELDER = [
    [_,S,S,_],
    [_,U,U,_],
    [U,U,U,U],
    [_,U,U,_],
    [_,K,K,_],
];

// Get batter sprite
export function getBatterSprite(swinging) {
    return swinging ? BATTER_SWING : BATTER_READY;
}

// Get pitcher sprite
export function getPitcherSprite(releasing) {
    return releasing ? PITCHER_RELEASE : PITCHER_WINDUP;
}

// Get runner sprite (animated)
export function getRunnerSprite(frame) {
    return frame % 2 === 0 ? RUNNER_A : RUNNER_B;
}

// Pixel-map sprite renderer
// Each sprite is defined as a 2D array of color values (null = transparent)

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

const C = '#00ccff'; // cyan
const W = '#ffffff'; // white
const O = '#ff6600'; // orange
const R = '#ff0000'; // red
const G = '#00ff88'; // green
const M = '#ff44ff'; // magenta
const Y = '#ffff00'; // yellow
const B = '#4488ff'; // blue
const _ = null;

// Player ship — classic arrowhead shape
export const PLAYER_SPRITE = [
    [_,_,_,_,_,_,C,_,_,_,_,_,_],
    [_,_,_,_,_,C,C,C,_,_,_,_,_],
    [_,_,_,_,_,C,W,C,_,_,_,_,_],
    [_,_,_,_,C,C,W,C,C,_,_,_,_],
    [_,_,_,_,C,C,C,C,C,_,_,_,_],
    [_,_,_,C,C,C,C,C,C,C,_,_,_],
    [_,_,C,C,C,C,C,C,C,C,C,_,_],
    [_,C,C,C,C,C,C,C,C,C,C,C,_],
    [C,C,_,C,C,C,C,C,C,C,_,C,C],
    [C,_,_,C,C,_,_,_,C,C,_,_,C],
    [C,_,_,_,_,_,_,_,_,_,_,_,C],
];

// Commander alien (green boss)
export const COMMANDER_SPRITE_A = [
    [_,_,_,_,G,G,G,G,_,_,_,_],
    [_,_,G,G,G,G,G,G,G,G,_,_],
    [_,G,G,G,G,G,G,G,G,G,G,_],
    [G,G,G,W,W,G,G,W,W,G,G,G],
    [G,G,G,G,G,G,G,G,G,G,G,G],
    [_,_,G,G,G,_,_,G,G,G,_,_],
    [_,G,G,_,G,G,G,G,_,G,G,_],
    [G,G,_,_,_,G,G,_,_,_,G,G],
];

export const COMMANDER_SPRITE_B = [
    [_,_,_,_,G,G,G,G,_,_,_,_],
    [_,_,G,G,G,G,G,G,G,G,_,_],
    [_,G,G,G,G,G,G,G,G,G,G,_],
    [G,G,G,W,W,G,G,W,W,G,G,G],
    [G,G,G,G,G,G,G,G,G,G,G,G],
    [_,_,G,G,_,G,G,_,G,G,_,_],
    [_,G,_,G,G,_,_,G,G,_,G,_],
    [_,_,G,_,_,_,_,_,_,G,_,_],
];

// Butterfly alien (magenta)
export const BUTTERFLY_SPRITE_A = [
    [_,_,_,_,M,M,M,M,_,_,_,_],
    [_,_,M,M,M,M,M,M,M,M,_,_],
    [_,M,M,M,W,M,M,W,M,M,M,_],
    [_,M,M,M,M,M,M,M,M,M,M,_],
    [M,M,_,M,M,M,M,M,M,_,M,M],
    [M,_,_,_,M,M,M,M,_,_,_,M],
    [M,_,_,_,M,_,_,M,_,_,_,M],
    [_,_,_,M,_,_,_,_,M,_,_,_],
];

export const BUTTERFLY_SPRITE_B = [
    [_,_,_,_,M,M,M,M,_,_,_,_],
    [_,_,M,M,M,M,M,M,M,M,_,_],
    [_,M,M,M,W,M,M,W,M,M,M,_],
    [_,M,M,M,M,M,M,M,M,M,M,_],
    [_,_,M,M,M,M,M,M,M,M,_,_],
    [_,M,M,_,M,M,M,M,_,M,M,_],
    [M,M,_,_,_,M,M,_,_,_,M,M],
    [M,_,_,_,_,_,_,_,_,_,_,M],
];

// Bee alien (yellow)
export const BEE_SPRITE_A = [
    [_,_,_,Y,Y,Y,Y,Y,Y,_,_,_],
    [_,_,Y,Y,Y,Y,Y,Y,Y,Y,_,_],
    [_,Y,Y,W,Y,Y,Y,Y,W,Y,Y,_],
    [_,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,_],
    [_,_,Y,Y,Y,Y,Y,Y,Y,Y,_,_],
    [_,_,_,Y,Y,_,_,Y,Y,_,_,_],
    [_,_,Y,Y,_,_,_,_,Y,Y,_,_],
    [_,Y,Y,_,_,_,_,_,_,Y,Y,_],
];

export const BEE_SPRITE_B = [
    [_,_,_,Y,Y,Y,Y,Y,Y,_,_,_],
    [_,_,Y,Y,Y,Y,Y,Y,Y,Y,_,_],
    [_,Y,Y,W,Y,Y,Y,Y,W,Y,Y,_],
    [_,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,_],
    [_,_,Y,Y,Y,Y,Y,Y,Y,Y,_,_],
    [_,_,_,Y,_,Y,Y,_,Y,_,_,_],
    [_,_,_,_,Y,_,_,Y,_,_,_,_],
    [_,_,_,Y,_,_,_,_,Y,_,_,_],
];

// Explosion sprite
export const EXPLOSION_SPRITE = [
    [_,_,R,_,_,_,R,_,_],
    [_,R,O,_,_,_,O,R,_],
    [R,O,Y,Y,_,Y,Y,O,R],
    [_,_,Y,W,W,W,Y,_,_],
    [_,_,_,W,W,W,_,_,_],
    [_,_,Y,W,W,W,Y,_,_],
    [R,O,Y,Y,_,Y,Y,O,R],
    [_,R,O,_,_,_,O,R,_],
    [_,_,R,_,_,_,R,_,_],
];

// Get alien sprite based on type and animation frame
export function getAlienSprite(type, frame) {
    const anim = frame % 2 === 0;
    switch (type) {
        case 'commander':
            return anim ? COMMANDER_SPRITE_A : COMMANDER_SPRITE_B;
        case 'butterfly':
            return anim ? BUTTERFLY_SPRITE_A : BUTTERFLY_SPRITE_B;
        case 'bee':
            return anim ? BEE_SPRITE_A : BEE_SPRITE_B;
        default:
            return BEE_SPRITE_A;
    }
}

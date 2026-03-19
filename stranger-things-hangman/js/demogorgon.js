import { DEMOGORGON_X, DEMOGORGON_Y } from './constants.js';
import { drawSprite, PART_OFFSETS } from './sprites.js';

export function drawDemogorgon(ctx, revealCount, drawFrame) {
    if (revealCount <= 0) return;

    const partsToShow = Math.min(revealCount, 10);

    // Red glow behind on full reveal (HEAD shown)
    if (partsToShow >= 10) {
        const pulse = 0.3 + Math.sin(drawFrame * 0.08) * 0.15;
        const glow = ctx.createRadialGradient(
            DEMOGORGON_X, DEMOGORGON_Y, 10,
            DEMOGORGON_X, DEMOGORGON_Y, 120
        );
        glow.addColorStop(0, `rgba(255, 32, 32, ${pulse})`);
        glow.addColorStop(1, 'rgba(255, 32, 32, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(DEMOGORGON_X - 120, DEMOGORGON_Y - 120, 240, 240);
    }

    // Draw each revealed part
    for (let i = 0; i < partsToShow; i++) {
        const part = PART_OFFSETS[i];
        const px = DEMOGORGON_X + part.x;
        const py = DEMOGORGON_Y + part.y;

        // Slight breathing animation for revealed parts
        const breathOffset = Math.sin(drawFrame * 0.03 + i * 0.5) * 0.5;

        drawSprite(ctx, part.sprite, px, py + breathOffset, 3);
    }

    // Petal-face opening animation when HEAD is the latest reveal
    if (partsToShow === 10 && drawFrame % 8 < 4) {
        // Subtle pulsing effect on the head
        ctx.globalAlpha = 0.3;
        const headPart = PART_OFFSETS[9];
        drawSprite(ctx, headPart.sprite, DEMOGORGON_X + headPart.x, DEMOGORGON_Y + headPart.y, 3.2);
        ctx.globalAlpha = 1;
    }
}

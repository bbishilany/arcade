import { PITCH_TYPES, GAME_WIDTH, PITCHER_Y } from './constants.js';
import { drawSprite, getPitcherSprite } from './sprites.js';

// Pitcher state
export function createPitcher() {
    return {
        x: GAME_WIDTH / 2,
        y: PITCHER_Y,
        selectedPitch: 0,     // index into PITCH_TYPES
        windupFrame: 0,
        isWindingUp: false,
        isReleasing: false,
        releaseFrame: 0,
        pitchCycleFrame: 0    // for cycling pitch type display
    };
}

// CPU pitcher AI — picks a pitch type
export function cpuSelectPitch() {
    const weights = [40, 25, 20, 15]; // fastball favored
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
        r -= weights[i];
        if (r <= 0) return i;
    }
    return 0;
}

// Player pitcher: cycle through pitch types
export function updatePitcherCycle(pitcher) {
    pitcher.pitchCycleFrame++;
    // Cycle every 30 frames
    if (pitcher.pitchCycleFrame % 30 === 0) {
        pitcher.selectedPitch = (pitcher.selectedPitch + 1) % PITCH_TYPES.length;
    }
}

export function startWindup(pitcher) {
    pitcher.isWindingUp = true;
    pitcher.windupFrame = 0;
}

export function updateWindup(pitcher) {
    if (!pitcher.isWindingUp) return false;

    pitcher.windupFrame++;
    if (pitcher.windupFrame >= 30) {
        pitcher.isWindingUp = false;
        pitcher.isReleasing = true;
        pitcher.releaseFrame = 0;
        return true; // release the ball
    }
    return false;
}

export function updateRelease(pitcher) {
    if (!pitcher.isReleasing) return;
    pitcher.releaseFrame++;
    if (pitcher.releaseFrame >= 15) {
        pitcher.isReleasing = false;
    }
}

export function getCurrentPitchType(pitcher) {
    return PITCH_TYPES[pitcher.selectedPitch];
}

export function drawPitcher(ctx, pitcher, drawFrame) {
    const releasing = pitcher.isReleasing;
    const sprite = getPitcherSprite(releasing);
    const scale = 2.5;

    // Slight bob during windup
    let yOff = 0;
    if (pitcher.isWindingUp) {
        yOff = -Math.sin(pitcher.windupFrame / 30 * Math.PI) * 8;
    }

    drawSprite(ctx, sprite, pitcher.x, pitcher.y + yOff, scale);

    // Mound
    ctx.beginPath();
    ctx.ellipse(pitcher.x, pitcher.y + 28, 25, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#9a7b20';
    ctx.fill();
}

// Draw pitch type selector (when player is pitching)
export function drawPitchSelector(ctx, pitcher, drawFrame) {
    const types = PITCH_TYPES;
    const sel = pitcher.selectedPitch;

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';

    for (let i = 0; i < types.length; i++) {
        const x = GAME_WIDTH / 2 + (i - 1.5) * 80;
        const y = 60;

        if (i === sel) {
            // Highlight selected
            ctx.fillStyle = types[i].color;
            const blink = Math.floor(drawFrame / 10) % 2 === 0;
            if (blink) {
                ctx.fillRect(x - 30, y - 8, 60, 16);
                ctx.fillStyle = '#000000';
            }
        } else {
            ctx.fillStyle = '#666666';
        }
        ctx.fillText(types[i].name, x, y + 4);
    }

}

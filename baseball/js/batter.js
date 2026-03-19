import {
    TIMING, GROUNDER_ODDS, LINE_DRIVE_ODDS, SWEET_SPOT_ODDS,
    FLY_BALL_ODDS, POP_FLY_ODDS, BATTER_X, BATTER_Y, POINTS
} from './constants.js';
import { drawSprite, getBatterSprite } from './sprites.js';

export function createBatter() {
    return {
        x: BATTER_X,
        y: BATTER_Y,
        swinging: false,
        swingFrame: 0,
        swingWindow: 24
    };
}

export function startSwing(batter) {
    batter.swinging = true;
    batter.swingFrame = 0;
}

export function updateSwing(batter) {
    if (!batter.swinging) return;
    batter.swingFrame++;
    if (batter.swingFrame >= batter.swingWindow) {
        batter.swinging = false;
        batter.swingFrame = 0;
    }
}

// Determine what happens when the player swings
// offset = how many frames before/after ball reaches plate
export function determineHitResult(offset) {
    // Check timing windows
    if (offset >= TIMING.WAY_EARLY_MIN && offset <= TIMING.WAY_EARLY_MAX) {
        return { timing: 'WAY EARLY', result: 'whiff' };
    }
    if (offset >= TIMING.EARLY_MIN && offset <= TIMING.EARLY_MAX) {
        return { timing: 'EARLY', result: pickWeighted(GROUNDER_ODDS) };
    }
    if (offset >= TIMING.GOOD_EARLY_MIN && offset <= TIMING.GOOD_EARLY_MAX) {
        return { timing: 'GOOD!', result: pickWeighted(LINE_DRIVE_ODDS) };
    }
    if (offset >= TIMING.PERFECT_MIN && offset <= TIMING.PERFECT_MAX) {
        return { timing: 'PERFECT!', result: pickWeighted(SWEET_SPOT_ODDS) };
    }
    if (offset >= TIMING.GOOD_LATE_MIN && offset <= TIMING.GOOD_LATE_MAX) {
        return { timing: 'GOOD!', result: pickWeighted(FLY_BALL_ODDS) };
    }
    if (offset >= TIMING.LATE_MIN && offset <= TIMING.LATE_MAX) {
        return { timing: 'LATE', result: pickWeighted(POP_FLY_ODDS) };
    }
    if (offset >= TIMING.WAY_LATE_MIN && offset <= TIMING.WAY_LATE_MAX) {
        return { timing: 'WAY LATE', result: 'whiff' };
    }

    // Outside all windows — didn't swing in time
    return { timing: 'MISS', result: 'whiff' };
}

function pickWeighted(odds) {
    const total = odds.reduce((sum, o) => sum + o[1], 0);
    let r = Math.random() * total;
    for (const [type, weight] of odds) {
        r -= weight;
        if (r <= 0) return type;
    }
    return odds[0][0];
}

// CPU batter AI — determines when to swing
// Returns frame offset from perfect (lower = better timing)
export function cpuBatterSwingOffset(difficulty) {
    // difficulty 0-1 (0 = easy to strike out, 1 = always perfect)
    const spread = 16 * (1 - difficulty);
    return Math.round((Math.random() - 0.5) * spread);
}

// Get arcade points for a hit result
export function getHitPoints(result, rbis) {
    let pts = 0;
    switch (result) {
        case 'single': pts = POINTS.SINGLE; break;
        case 'double': pts = POINTS.DOUBLE; break;
        case 'triple': pts = POINTS.TRIPLE; break;
        case 'homerun': pts = POINTS.HOMERUN; break;
        case 'error': pts = POINTS.SINGLE; break;
    }
    pts += rbis * POINTS.RBI;
    return pts;
}

export function drawBatter(ctx, batter, drawFrame) {
    const sprite = getBatterSprite(batter.swinging);
    drawSprite(ctx, sprite, batter.x, batter.y, 3);
}

// Draw timing feedback flash
export function drawTimingFlash(ctx, text, frame) {
    if (frame > 40) return;
    const alpha = 1 - frame / 40;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.textAlign = 'center';

    let color = '#ffffff';
    if (text === 'PERFECT!') color = '#ffff00';
    else if (text === 'GOOD!') color = '#00ff88';
    else if (text.includes('EARLY') || text.includes('LATE')) color = '#ff8844';

    ctx.fillStyle = color;
    ctx.fillText(text, 240, 430);
    ctx.restore();
}

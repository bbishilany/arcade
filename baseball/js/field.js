import { GAME_WIDTH, GAME_HEIGHT, DIAMOND_CX, DIAMOND_CY, BASE_DIST, COLORS } from './constants.js';
import { drawSprite, getRunnerSprite, FIELDER } from './sprites.js';

// Base positions (top-down diamond)
//           2B
//       3B      1B
//          HOME
const HOME = { x: DIAMOND_CX, y: DIAMOND_CY };
const FIRST = { x: DIAMOND_CX + BASE_DIST, y: DIAMOND_CY - BASE_DIST * 0.6 };
const SECOND = { x: DIAMOND_CX, y: DIAMOND_CY - BASE_DIST * 1.2 };
const THIRD = { x: DIAMOND_CX - BASE_DIST, y: DIAMOND_CY - BASE_DIST * 0.6 };

const BASES = [FIRST, SECOND, THIRD]; // index 0=1B, 1=2B, 2=3B

// Fielder positions
const FIELDER_POS = [
    { x: DIAMOND_CX, y: DIAMOND_CY - BASE_DIST * 0.5 },             // pitcher
    { x: DIAMOND_CX, y: DIAMOND_CY + 15 },                           // catcher
    { x: DIAMOND_CX + BASE_DIST * 0.7, y: DIAMOND_CY - BASE_DIST * 0.3 }, // 1B
    { x: DIAMOND_CX + BASE_DIST * 0.4, y: DIAMOND_CY - BASE_DIST * 0.8 }, // 2B
    { x: DIAMOND_CX - BASE_DIST * 0.4, y: DIAMOND_CY - BASE_DIST * 0.8 }, // SS
    { x: DIAMOND_CX - BASE_DIST * 0.7, y: DIAMOND_CY - BASE_DIST * 0.3 }, // 3B
    { x: DIAMOND_CX - BASE_DIST * 1.2, y: DIAMOND_CY - BASE_DIST * 1.5 }, // LF
    { x: DIAMOND_CX, y: DIAMOND_CY - BASE_DIST * 1.8 },             // CF
    { x: DIAMOND_CX + BASE_DIST * 1.2, y: DIAMOND_CY - BASE_DIST * 1.5 }, // RF
];

// Runner animation state
export function createRunners() {
    return {
        onBase: [false, false, false], // 1st, 2nd, 3rd
        animating: [],  // [{from: {x,y}, to: {x,y}, progress: 0, speed: 0.02}]
        scored: 0       // runs scored this play
    };
}

// Advance runners based on hit result
export function advanceRunners(runners, hitResult) {
    const newBases = [false, false, false];
    let runs = 0;
    const anims = [];

    // How many bases to advance
    let advance = 0;
    switch (hitResult) {
        case 'single': case 'error': advance = 1; break;
        case 'double': advance = 2; break;
        case 'triple': advance = 3; break;
        case 'homerun': advance = 4; break;
        case 'out':
            // Batter out, no runners advance
            runners.scored = 0;
            runners.animating = [];
            return { runs: 0, outs: 0, batterReachedBase: false };
        case 'sacrifice':
            // Advance runners one base, batter is out
            for (let i = 2; i >= 0; i--) {
                if (runners.onBase[i]) {
                    if (i === 2) {
                        runs++;
                        anims.push({ from: THIRD, to: HOME, progress: 0 });
                    } else {
                        newBases[i + 1] = true;
                        anims.push({ from: BASES[i], to: BASES[i + 1], progress: 0 });
                    }
                    runners.onBase[i] = false;
                }
            }
            runners.onBase = newBases;
            runners.scored = runs;
            runners.animating = anims;
            return { runs, outs: 1, batterReachedBase: false };
        default:
            runners.scored = 0;
            runners.animating = [];
            return { runs: 0, outs: 0, batterReachedBase: false };
    }

    // Move existing runners
    for (let i = 2; i >= 0; i--) {
        if (runners.onBase[i]) {
            const newPos = i + advance;
            if (newPos >= 3) {
                // Scored!
                runs++;
                const fromBase = BASES[i];
                anims.push({ from: fromBase, to: HOME, progress: 0 });
            } else {
                newBases[newPos] = true;
                anims.push({ from: BASES[i], to: BASES[newPos], progress: 0 });
            }
            runners.onBase[i] = false;
        }
    }

    // Place batter
    let batterReached = false;
    if (advance >= 4) {
        // HR — batter scores too
        runs++;
        anims.push({ from: HOME, to: HOME, progress: 0, isHR: true });
    } else if (advance > 0) {
        newBases[advance - 1] = true;
        batterReached = true;
        anims.push({ from: HOME, to: BASES[advance - 1], progress: 0 });
    }

    runners.onBase = newBases;
    runners.scored = runs;
    runners.animating = anims;

    return { runs, outs: 0, batterReachedBase: batterReached };
}

export function updateRunnerAnimations(runners) {
    let allDone = true;
    for (const anim of runners.animating) {
        anim.progress += 0.025;
        if (anim.progress < 1) allDone = false;
        else anim.progress = 1;
    }
    return allDone;
}

export function drawField(ctx) {
    // Grass background
    ctx.fillStyle = COLORS.GRASS;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Outfield (slightly lighter)
    ctx.beginPath();
    ctx.arc(DIAMOND_CX, DIAMOND_CY, BASE_DIST * 2.2, Math.PI, 2 * Math.PI);
    ctx.fillStyle = COLORS.GRASS_LIGHT;
    ctx.fill();

    // Dirt infield diamond
    ctx.beginPath();
    ctx.moveTo(HOME.x, HOME.y + 10);
    ctx.lineTo(FIRST.x + 15, FIRST.y);
    ctx.lineTo(SECOND.x, SECOND.y - 15);
    ctx.lineTo(THIRD.x - 15, THIRD.y);
    ctx.closePath();
    ctx.fillStyle = COLORS.DIRT;
    ctx.fill();

    // Grass infield cutout
    ctx.beginPath();
    ctx.moveTo(HOME.x, HOME.y - 15);
    ctx.lineTo(FIRST.x - 10, FIRST.y + 5);
    ctx.lineTo(SECOND.x, SECOND.y + 20);
    ctx.lineTo(THIRD.x + 10, THIRD.y + 5);
    ctx.closePath();
    ctx.fillStyle = COLORS.GRASS;
    ctx.fill();

    // Pitcher mound
    ctx.beginPath();
    ctx.ellipse(DIAMOND_CX, DIAMOND_CY - BASE_DIST * 0.5, 12, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.MOUND;
    ctx.fill();

    // Base paths (foul lines)
    ctx.strokeStyle = COLORS.FOUL_LINE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(HOME.x, HOME.y);
    ctx.lineTo(HOME.x - BASE_DIST * 2.5, HOME.y - BASE_DIST * 2.5 * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(HOME.x, HOME.y);
    ctx.lineTo(HOME.x + BASE_DIST * 2.5, HOME.y - BASE_DIST * 2.5 * 0.6);
    ctx.stroke();

    // Bases
    drawBase(ctx, HOME.x, HOME.y, true);  // home plate
    drawBase(ctx, FIRST.x, FIRST.y);
    drawBase(ctx, SECOND.x, SECOND.y);
    drawBase(ctx, THIRD.x, THIRD.y);

    // Fielders
    for (const pos of FIELDER_POS) {
        drawSprite(ctx, FIELDER, pos.x, pos.y, 2);
    }

    // Outfield fence arc
    ctx.strokeStyle = '#664400';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(DIAMOND_CX, DIAMOND_CY, BASE_DIST * 2.2, Math.PI + 0.2, 2 * Math.PI - 0.2);
    ctx.stroke();
}

function drawBase(ctx, x, y, isHome) {
    ctx.fillStyle = COLORS.BASE_WHITE;
    if (isHome) {
        // Home plate pentagon
        ctx.beginPath();
        ctx.moveTo(x, y + 5);
        ctx.lineTo(x - 5, y);
        ctx.lineTo(x - 3, y - 5);
        ctx.lineTo(x + 3, y - 5);
        ctx.lineTo(x + 5, y);
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-4, -4, 8, 8);
        ctx.restore();
    }
}

export function drawRunners(ctx, runners, drawFrame) {
    const animFrame = Math.floor(drawFrame / 10);

    // Draw runners on bases
    for (let i = 0; i < 3; i++) {
        if (runners.onBase[i]) {
            const base = BASES[i];
            const sprite = getRunnerSprite(animFrame);
            drawSprite(ctx, sprite, base.x + 10, base.y + 10, 2);
        }
    }

    // Draw animating runners
    for (const anim of runners.animating) {
        const t = anim.progress;
        let x, y;

        if (anim.isHR) {
            // HR: run the full diamond
            if (t < 0.25) {
                const p = t / 0.25;
                x = HOME.x + (FIRST.x - HOME.x) * p;
                y = HOME.y + (FIRST.y - HOME.y) * p;
            } else if (t < 0.5) {
                const p = (t - 0.25) / 0.25;
                x = FIRST.x + (SECOND.x - FIRST.x) * p;
                y = FIRST.y + (SECOND.y - FIRST.y) * p;
            } else if (t < 0.75) {
                const p = (t - 0.5) / 0.25;
                x = SECOND.x + (THIRD.x - SECOND.x) * p;
                y = SECOND.y + (THIRD.y - SECOND.y) * p;
            } else {
                const p = (t - 0.75) / 0.25;
                x = THIRD.x + (HOME.x - THIRD.x) * p;
                y = THIRD.y + (HOME.y - THIRD.y) * p;
            }
        } else {
            x = anim.from.x + (anim.to.x - anim.from.x) * t;
            y = anim.from.y + (anim.to.y - anim.from.y) * t;
        }

        if (t < 1) {
            const sprite = getRunnerSprite(animFrame);
            drawSprite(ctx, sprite, x, y, 2);
        }
    }
}

export function getHomePos() { return HOME; }
export function getBasePositions() { return BASES; }

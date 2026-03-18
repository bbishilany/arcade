import { FORMATION_COLS, FORMATION_ROWS, ALIEN_SPACING_X, ALIEN_SPACING_Y,
         FORMATION_TOP, FORMATION_LEFT, FORMATION_BASE_SPEED, FORMATION_SPEED_INCREMENT,
         FORMATION_SWEEP_RANGE, BASE_DIVE_CHANCE, DIVE_CHANCE_INCREMENT,
         MAX_DIVERS_BASE } from './constants.js';
import { createAlien, getAlienType, startDive, updateAlien } from './alien.js';

// Pixel letter definitions — each is an array of [col, row] positions
const LETTERS = {
    O: [[1,0],[2,0], [0,1],[3,1], [0,2],[3,2], [0,3],[3,3], [1,4],[2,4]],
    L: [[0,0], [0,1], [0,2], [0,3], [0,4],[1,4],[2,4]],
    I: [[0,0],[1,0],[2,0], [1,1], [1,2], [1,3], [0,4],[1,4],[2,4]],
    E: [[0,0],[1,0],[2,0], [0,1], [0,2],[1,2], [0,3], [0,4],[1,4],[2,4]],
    T: [[0,0],[1,0],[2,0],[3,0],[4,0], [2,1], [2,2], [2,3], [2,4]],
    H: [[0,0],[3,0], [0,1],[3,1], [0,2],[1,2],[2,2],[3,2], [0,3],[3,3], [0,4],[3,4]]
};

// Width of each letter (rightmost column + 1)
const LETTER_WIDTHS = { O: 4, L: 3, I: 3, E: 3, T: 5, H: 4 };

// Alien type per letter position in word (cycles for color variety)
const LETTER_TYPES = ['commander', 'butterfly', 'bee', 'commander', 'butterfly'];

function createNameFormation(word, wave) {
    const letters = word.split('');
    const gap = 1; // columns between letters

    // Calculate total width in grid units
    let totalWidth = 0;
    for (let i = 0; i < letters.length; i++) {
        totalWidth += LETTER_WIDTHS[letters[i]];
        if (i < letters.length - 1) totalWidth += gap;
    }

    // Center horizontally: 18px per grid unit
    const cellSize = 18;
    const startX = (480 - totalWidth * cellSize) / 2;
    const startY = 70;

    const aliens = [];
    let cursorX = 0;

    for (let li = 0; li < letters.length; li++) {
        const ch = letters[li];
        const positions = LETTERS[ch];
        const type = LETTER_TYPES[li % LETTER_TYPES.length];

        for (const [c, r] of positions) {
            const alien = createAlien(0, 0, type);
            // Override position — these are pixel-positioned, not grid-based
            alien.baseX = startX + (cursorX + c) * cellSize;
            alien.baseY = startY + r * 22;
            alien.noAnim = true;
            alien.noDive = true;
            aliens.push(alien);
        }

        cursorX += LETTER_WIDTHS[ch] + gap;
    }

    return {
        aliens,
        wave,
        offsetX: 0,
        direction: 1,
        speed: FORMATION_BASE_SPEED + wave * FORMATION_SPEED_INCREMENT,
        diveChance: 0,
        maxDivers: 0,
        sweepRange: 0,
        isNameFormation: true,
        animTimer: 0,
        enterTimer: 0,
        entered: false
    };
}

export function createFormation(wave) {
    // Wave 3: spell OLLIE
    if (wave === 3) return createNameFormation('OLLIE', wave);
    // Wave 4: spell THEO
    if (wave === 4) return createNameFormation('THEO', wave);

    const aliens = [];
    for (let row = 0; row < FORMATION_ROWS; row++) {
        for (let col = 0; col < FORMATION_COLS; col++) {
            const type = getAlienType(row);
            aliens.push(createAlien(col, row, type));
        }
    }

    return {
        aliens,
        wave,
        offsetX: 0,
        direction: 1,
        speed: FORMATION_BASE_SPEED + wave * FORMATION_SPEED_INCREMENT,
        diveChance: BASE_DIVE_CHANCE + wave * DIVE_CHANCE_INCREMENT,
        maxDivers: MAX_DIVERS_BASE + Math.floor(wave / 2),
        animTimer: 0,
        enterTimer: 0,
        entered: false
    };
}

export function updateFormation(formation, bullets, playerX) {
    // Formation entry animation
    if (!formation.entered) {
        formation.enterTimer++;
        if (formation.enterTimer > 30) {
            formation.entered = true;
        }
    }

    // Side-to-side sweep — use per-formation sweepRange if set
    const sweepRange = formation.sweepRange !== undefined
        ? formation.sweepRange
        : FORMATION_SWEEP_RANGE;

    if (sweepRange > 0) {
        formation.offsetX += formation.speed * formation.direction;
        if (Math.abs(formation.offsetX) > sweepRange) {
            formation.direction *= -1;
            formation.offsetX = sweepRange * formation.direction;
        }
    }

    // Update each alien's formation position
    const aliveAliens = formation.aliens.filter(a => a.alive);
    const currentDivers = aliveAliens.filter(a => a.diving).length;

    for (const alien of formation.aliens) {
        if (!alien.alive) continue;

        if (formation.isNameFormation) {
            // Name formation: use pixel-based baseX/baseY, no sweep offset
            alien.formX = alien.baseX;
            alien.formY = alien.baseY;

            // Entry animation: slide in from top
            if (!formation.entered) {
                const entryProgress = Math.min(formation.enterTimer / 30, 1);
                alien.formY = alien.baseY * entryProgress - 40 * (1 - entryProgress);
            }
        } else {
            // Standard grid formation
            alien.formX = FORMATION_LEFT + alien.col * ALIEN_SPACING_X + formation.offsetX;
            alien.formY = FORMATION_TOP + alien.row * ALIEN_SPACING_Y;

            // Entry animation: slide in from top
            if (!formation.entered) {
                const entryProgress = Math.min(formation.enterTimer / 30, 1);
                alien.formY = alien.formY * entryProgress - 40 * (1 - entryProgress);
            }

            // Maybe start a dive (never for name formation aliens)
            if (!alien.diving && !alien.noDive && formation.entered
                && currentDivers < formation.maxDivers) {
                if (Math.random() < formation.diveChance) {
                    startDive(alien, playerX);
                }
            }
        }

        updateAlien(alien, bullets, playerX);
    }

    formation.animTimer++;
}

export function formationCleared(formation) {
    return formation.aliens.every(a => !a.alive);
}

export function getAliveCount(formation) {
    return formation.aliens.filter(a => a.alive).length;
}

export function updateFormationSpeed(formation) {
    // Don't speed up name formations
    if (formation.isNameFormation) return;

    const alive = getAliveCount(formation);
    const total = FORMATION_COLS * FORMATION_ROWS;
    const ratio = alive / total;
    const baseSpeed = FORMATION_BASE_SPEED + formation.wave * FORMATION_SPEED_INCREMENT;
    formation.speed = baseSpeed * (1 + (1 - ratio) * 2);
}

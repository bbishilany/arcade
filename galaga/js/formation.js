import { GAME_WIDTH, FORMATION_COLS, FORMATION_ROWS, ALIEN_SPACING_X, ALIEN_SPACING_Y,
         FORMATION_TOP, FORMATION_LEFT, FORMATION_BASE_SPEED, FORMATION_SPEED_INCREMENT,
         FORMATION_SWEEP_RANGE, BASE_DIVE_CHANCE, DIVE_CHANCE_INCREMENT,
         MAX_DIVERS_BASE } from './constants.js';
import { createAlien, getAlienType, startDive, updateAlien } from './alien.js';

// Pixel font — each letter is 5 rows tall
// Most are 3 cols wide; M and W are 5 cols wide
const FONT = {
    A: [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
    B: [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
    E: [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
    H: [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
    I: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
    L: [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
    M: [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
    O: [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
    T: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
    W: [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,0,1,1],[0,1,0,1,0]],
    Y: [[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],
};

function wordToPositions(word, startX, startY, spacing) {
    const positions = [];
    let x = startX;
    for (const char of word) {
        const letter = FONT[char];
        if (!letter) continue;
        const letterWidth = letter[0].length;
        for (let row = 0; row < letter.length; row++) {
            for (let col = 0; col < letterWidth; col++) {
                if (letter[row][col]) {
                    positions.push({
                        x: x + col * spacing,
                        y: startY + row * spacing
                    });
                }
            }
        }
        x += (letterWidth + 1) * spacing;
    }
    return positions;
}

function getWordWidth(word, spacing) {
    let totalCols = 0;
    for (const char of word) {
        const letter = FONT[char];
        if (!letter) continue;
        if (totalCols > 0) totalCols += 1; // gap between letters
        totalCols += letter[0].length;
    }
    return (totalCols - 1) * spacing;
}

function createNameFormation() {
    const SP = 15;
    const aliens = [];

    const names = [
        { word: 'BILLY',   type: 'commander', y: 45  },
        { word: 'OLLIE',   type: 'butterfly', y: 140 },
        { word: 'THEO',    type: 'bee',       y: 235 },
        { word: 'MATTHEW', type: 'commander', y: 330 },
    ];

    for (const { word, type, y } of names) {
        const wordWidth = getWordWidth(word, SP);
        const startX = (GAME_WIDTH - wordWidth) / 2;
        const positions = wordToPositions(word, startX, y, SP);

        for (const pos of positions) {
            const alien = createAlien(0, 0, type);
            alien.baseX = pos.x;
            alien.baseY = pos.y;
            alien.noAnim = true;
            aliens.push(alien);
        }
    }

    return {
        aliens,
        wave: 1,
        offsetX: 0,
        direction: 1,
        speed: FORMATION_BASE_SPEED + FORMATION_SPEED_INCREMENT,
        sweepRange: 0,
        diveChance: 0,
        maxDivers: 0,
        animTimer: 0,
        enterTimer: 0,
        entered: false
    };
}

export function createFormation(wave) {
    // Wave 1: special name formation
    if (wave === 1) {
        return createNameFormation();
    }

    // Standard grid formation for wave 2+
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

    // Side-to-side sweep (skip if sweepRange is 0)
    const sweep = formation.sweepRange !== undefined ? formation.sweepRange : FORMATION_SWEEP_RANGE;
    if (sweep > 0) {
        formation.offsetX += formation.speed * formation.direction;
        if (Math.abs(formation.offsetX) > sweep) {
            formation.direction *= -1;
            formation.offsetX = sweep * formation.direction;
        }
    }

    // Update each alien's formation position
    const aliveAliens = formation.aliens.filter(a => a.alive);
    const currentDivers = aliveAliens.filter(a => a.diving).length;

    for (const alien of formation.aliens) {
        if (!alien.alive) continue;

        // Set formation position — custom or grid-based
        if (alien.baseX !== undefined) {
            alien.formX = alien.baseX + formation.offsetX;
            alien.formY = alien.baseY;
        } else {
            alien.formX = FORMATION_LEFT + alien.col * ALIEN_SPACING_X + formation.offsetX;
            alien.formY = FORMATION_TOP + alien.row * ALIEN_SPACING_Y;
        }

        // Entry animation: slide in from top
        if (!formation.entered) {
            const entryProgress = Math.min(formation.enterTimer / 30, 1);
            alien.formY = alien.formY * entryProgress - 40 * (1 - entryProgress);
        }

        // Maybe start a dive
        if (!alien.diving && formation.entered && currentDivers < formation.maxDivers) {
            if (Math.random() < formation.diveChance) {
                startDive(alien, playerX);
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
    const alive = getAliveCount(formation);
    const total = formation.aliens.length;
    const ratio = alive / total;
    const baseSpeed = FORMATION_BASE_SPEED + formation.wave * FORMATION_SPEED_INCREMENT;
    formation.speed = baseSpeed * (1 + (1 - ratio) * 2);
}

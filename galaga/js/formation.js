import { FORMATION_COLS, FORMATION_ROWS, ALIEN_SPACING_X, ALIEN_SPACING_Y,
         FORMATION_TOP, FORMATION_LEFT, FORMATION_BASE_SPEED, FORMATION_SPEED_INCREMENT,
         FORMATION_SWEEP_RANGE, BASE_DIVE_CHANCE, DIVE_CHANCE_INCREMENT,
         MAX_DIVERS_BASE } from './constants.js';
import { createAlien, getAlienType, startDive, updateAlien } from './alien.js';

export function createFormation(wave) {
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

    // Side-to-side sweep
    formation.offsetX += formation.speed * formation.direction;
    if (Math.abs(formation.offsetX) > FORMATION_SWEEP_RANGE) {
        formation.direction *= -1;
        formation.offsetX = FORMATION_SWEEP_RANGE * formation.direction;
    }

    // Update each alien's formation position
    const aliveAliens = formation.aliens.filter(a => a.alive);
    const currentDivers = aliveAliens.filter(a => a.diving).length;

    for (const alien of formation.aliens) {
        if (!alien.alive) continue;

        // Set formation position
        alien.formX = FORMATION_LEFT + alien.col * ALIEN_SPACING_X + formation.offsetX;
        alien.formY = FORMATION_TOP + alien.row * ALIEN_SPACING_Y;

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
    const total = FORMATION_COLS * FORMATION_ROWS;
    const ratio = alive / total;
    const baseSpeed = FORMATION_BASE_SPEED + formation.wave * FORMATION_SPEED_INCREMENT;
    formation.speed = baseSpeed * (1 + (1 - ratio) * 2);
}

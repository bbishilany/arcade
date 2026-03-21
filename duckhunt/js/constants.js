// Duck Hunt — Constants & Configuration

export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 640;

// Layout zones
export const SKY_TOP = 0;
export const SKY_HEIGHT = 416;
export const TREE_TOP = 360;
export const GRASS_TOP = 416;
export const GRASS_BOTTOM = 560;
export const HUD_TOP = 560;

// Colors
export const SKY_COLOR = '#63b4ff';
export const GRASS_COLOR_1 = '#38b838';
export const GRASS_COLOR_2 = '#207820';
export const TREE_COLOR = '#185818';
export const HUD_BG = '#000000';
export const HUD_TEXT = '#ffffff';

// Game states
export const STATES = {
    TITLE: 'TITLE',
    MODE_SELECT: 'MODE_SELECT',
    DOG_INTRO: 'DOG_INTRO',
    ROUND_INTRO: 'ROUND_INTRO',
    FLYING: 'FLYING',
    DUCK_HIT: 'DUCK_HIT',
    DUCK_ESCAPED: 'DUCK_ESCAPED',
    DOG_RESULT: 'DOG_RESULT',
    ROUND_END: 'ROUND_END',
    GAME_OVER: 'GAME_OVER',
    NAME_ENTRY: 'NAME_ENTRY'
};

// Gameplay
export const TOTAL_ROUNDS = 10;
export const DUCK_FLY_FRAMES = 240; // ~4 seconds at 60fps (was 5s)
export const PERFECT_BONUS = 10000;

// Mode-specific config
// Mode A: 2 ducks at a time, 5 attempts = 10 ducks/round, 3 shots
// Mode B: 3 ducks at a time, 4 attempts = 12 ducks/round, 4 shots
export const MODE_CONFIG = {
    A: { ducksPerAttempt: 2, attempts: 5, shotsPerAttempt: 3 },
    B: { ducksPerAttempt: 3, attempts: 4, shotsPerAttempt: 4 }
};

// Derived: total ducks per round
export function ducksPerRound(mode) {
    const c = MODE_CONFIG[mode];
    return c.ducksPerAttempt * c.attempts;
}

// Minimum hits to pass each round (index 0 unused)
// Mode A: out of 10 ducks
export const MIN_HITS_A = [0, 6, 6, 6, 6, 7, 7, 8, 8, 9, 9];
// Mode B: out of 12 ducks
export const MIN_HITS_B = [0, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11];

export function minHits(mode, round) {
    return mode === 'A' ? MIN_HITS_A[round] : MIN_HITS_B[round];
}

// Points per duck hit per round (index 0 unused)
export const POINTS = [0, 500, 500, 800, 800, 1000, 1000, 1500, 1500, 2000, 2000];

// Duck speed per round — faster base + steeper ramp
export function duckSpeed(round) {
    return 2.5 + round * 0.3;
}

// Direction change interval range (frames) — tighter turns
export const DIR_CHANGE_MIN = 60;
export const DIR_CHANGE_MAX = 110;

// Animation timing
export const DUCK_HIT_FLASH = 12;    // white flash frames
export const DUCK_FALL_SPEED = 4;     // gravity pixels per frame
export const DOG_INTRO_WALK_SPEED = 1.5;
export const DOG_POPUP_FRAMES = 90;   // how long dog shows result
export const ROUND_INTRO_FRAMES = 120;
export const ROUND_END_FRAMES = 120;
export const GAME_OVER_FRAMES = 180;

// Duck wing animation speed (frames per wing cycle)
export const WING_ANIM_SPEED = 8;

// Duck colors
export const DUCK_COLORS = {
    black: { body: '#383838', accent: '#585858', wing: '#484868' },
    blue:  { body: '#2038ec', accent: '#3858fc', wing: '#5878fc' },
    red:   { body: '#d82800', accent: '#fc4838', wing: '#fc6858' }
};

// Sprite scale
export const DUCK_SCALE = 3;
export const DOG_SCALE = 3;

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
export const DUCKS_PER_ROUND = 10;
export const SHOTS_PER_ATTEMPT = 3;
export const DUCK_FLY_FRAMES = 300; // ~5 seconds at 60fps
export const PERFECT_BONUS = 10000;

// Minimum hits to pass each round (index 0 unused)
export const MIN_HITS = [0, 6, 6, 6, 6, 7, 7, 8, 8, 9, 9];

// Points per duck hit per round (index 0 unused)
export const POINTS = [0, 500, 500, 800, 800, 1000, 1000, 1500, 1500, 2000, 2000];

// Duck speed per round
export function duckSpeed(round) {
    return 2.0 + round * 0.2;
}

// Direction change interval range (frames)
export const DIR_CHANGE_MIN = 90;
export const DIR_CHANGE_MAX = 150;

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

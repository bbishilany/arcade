// Canvas
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 640;

// Game states
export const STATES = {
    TITLE: 'TITLE',
    DIFFICULTY_SELECT: 'DIFFICULTY_SELECT',
    PLAYING: 'PLAYING',
    WIN: 'WIN',
    LOSE: 'LOSE',
    GAME_OVER: 'GAME_OVER',
    NAME_ENTRY: 'NAME_ENTRY'
};

// Difficulty settings
export const DIFFICULTIES = {
    EASY:   { name: 'EASY',   maxWrong: 10, startPart: 0, mult: 1.0, pool: 'easy' },
    MEDIUM: { name: 'MEDIUM', maxWrong: 8,  startPart: 2, mult: 1.5, pool: 'medium' },
    HARD:   { name: 'HARD',   maxWrong: 6,  startPart: 4, mult: 2.5, pool: 'hard' }
};

// Demogorgon body parts (10 total, revealed in order)
export const BODY_PARTS = [
    'LEFT_FOOT', 'RIGHT_FOOT', 'LEFT_LEG', 'RIGHT_LEG',
    'TORSO', 'LEFT_ARM', 'RIGHT_ARM', 'LEFT_CLAW', 'RIGHT_CLAW', 'HEAD'
];

// Colors - Stranger Things palette
export const COLORS = {
    BG: '#0a0608',
    WALL: '#1a0e12',
    WALL_LINE: '#251519',
    WIRE: '#444444',
    BULB_OFF: '#333333',
    TEXT: '#ffffff',
    TITLE_RED: '#ff2020',
    EERIE_BLUE: '#2040ff',
    EERIE_GREEN: '#20ff40',
    CATEGORY: '#ff4040',
    CORRECT: '#20ff40',
    WRONG: '#ff2020',
    BLANK: '#666666',
    GLOW_RED: '#ff2020',
    GLOW_BLUE: '#2040ff',
    SCORE: '#ffff00'
};

// Light bulb colors (cycle through these)
export const BULB_COLORS = ['#ff2020', '#20ff40', '#2040ff', '#ffff00', '#ff8800', '#ff40ff', '#00ffff'];

// Scoring
export const CORRECT_BASE = 100;
export const WORD_COMPLETE_BONUS = 500;
export const PERFECT_BONUS = 1000;
export const SPEED_BONUS_MULT = 10;
export const SPEED_BONUS_WINDOW = 60; // seconds

// Streak multiplier
export const STREAK_INCREMENT = 0.5;

// Timing (in frames at 60fps)
export const TITLE_BLINK_RATE = 30;
export const WIN_DURATION = 150;      // 2.5 seconds
export const LOSE_DURATION = 180;     // 3 seconds
export const GAME_OVER_DURATION = 120; // 2 seconds

// Layout positions
export const WORD_Y = 480;           // Word display Y position
export const CATEGORY_Y = 440;      // Category label Y position
export const DEMOGORGON_X = 360;    // Demogorgon center X
export const DEMOGORGON_Y = 280;    // Demogorgon center Y
export const LIGHTS_Y_ROW1 = 80;    // First row of lights
export const LIGHTS_Y_ROW2 = 130;   // Second row of lights
export const LIGHTS_START_X = 30;   // Left edge of lights
export const LIGHTS_END_X = 450;    // Right edge of lights

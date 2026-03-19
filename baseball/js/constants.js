// Canvas
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 640;

// Game states
export const STATES = {
    TITLE: 'TITLE',
    MODE_SELECT: 'MODE_SELECT',
    LOBBY: 'LOBBY',
    INNING_START: 'INNING_START',
    AT_BAT: 'AT_BAT',
    PITCHING: 'PITCHING',
    BALL_IN_PLAY: 'BALL_IN_PLAY',
    FIELD_PLAY: 'FIELD_PLAY',
    SIDE_CHANGE: 'SIDE_CHANGE',
    GAME_OVER: 'GAME_OVER',
    NAME_ENTRY: 'NAME_ENTRY'
};

// Innings
export const TOTAL_INNINGS = 5;

// Batting view positions
export const PITCHER_Y = 130;
export const PLATE_Y = 510;
export const BATTER_X = 200;
export const BATTER_Y = 510;
export const ZONE_X = 240;
export const ZONE_Y = 480;
export const ZONE_W = 90;
export const ZONE_H = 50;

// Pitch types
export const PITCH_TYPES = [
    { name: 'FAST', frames: 45, curve: 0, color: '#ff4444' },
    { name: 'CURVE', frames: 55, curve: 40, color: '#44ff44' },
    { name: 'SLIDE', frames: 50, curve: -35, color: '#4488ff' },
    { name: 'CHANGE', frames: 65, curve: 0, color: '#ffff44' }
];

// Swing timing offsets from perfect (frame 0 = ball reaches plate)
// Negative = early, positive = late
export const TIMING = {
    WAY_EARLY_MIN: -12, WAY_EARLY_MAX: -9,   // whiff
    EARLY_MIN: -8,      EARLY_MAX: -5,        // grounder
    GOOD_EARLY_MIN: -4, GOOD_EARLY_MAX: -3,   // line drive
    PERFECT_MIN: -2,    PERFECT_MAX: 2,        // sweet spot
    GOOD_LATE_MIN: 3,   GOOD_LATE_MAX: 4,      // fly ball
    LATE_MIN: 5,        LATE_MAX: 8,           // pop fly
    WAY_LATE_MIN: 9,    WAY_LATE_MAX: 12       // whiff
};

// Hit result probabilities [type, weight]
export const GROUNDER_ODDS = [['out', 60], ['single', 30], ['error', 10]];
export const LINE_DRIVE_ODDS = [['single', 40], ['double', 35], ['triple', 15], ['out', 10]];
export const SWEET_SPOT_ODDS = [['homerun', 50], ['triple', 25], ['double', 20], ['single', 5]];
export const FLY_BALL_ODDS = [['out', 50], ['double', 25], ['sacrifice', 25]];
export const POP_FLY_ODDS = [['out', 90], ['single', 10]];

// Arcade scoring
export const POINTS = {
    SINGLE: 100,
    DOUBLE: 250,
    TRIPLE: 500,
    HOMERUN: 1000,
    RBI: 200,
    STRIKEOUT_PITCHED: 150,
    WIN: 2000
};

// Colors
export const COLORS = {
    BG: '#000814',
    GRASS: '#1a6b2a',
    GRASS_LIGHT: '#228b3a',
    DIRT: '#8b6914',
    DIRT_DARK: '#6b4f0f',
    DIRT_LIGHT: '#a07b1a',
    BASE_WHITE: '#ffffff',
    FOUL_LINE: '#ffffff',
    MOUND: '#9a7b20',
    SKY: '#000a1f',
    HUD_TEXT: '#ffffff',
    TITLE_MAIN: '#ff4444',
    TITLE_SUB: '#00ccff',
    BALL: '#ffffff',
    STRIKE_ZONE: 'rgba(255,255,0,0.15)',
    STRIKE_ZONE_BORDER: 'rgba(255,255,0,0.4)'
};

// Timing durations (frames at 60fps)
export const INNING_START_DURATION = 120;
export const SIDE_CHANGE_DURATION = 90;
export const GAME_OVER_DURATION = 180;
export const RESULT_FLASH_DURATION = 60;
export const FIELD_PLAY_DURATION = 150;

// Star background
export const STAR_COUNT = 50;
export const STAR_SPEED_MIN = 0.1;
export const STAR_SPEED_MAX = 0.5;

// Field view constants
export const DIAMOND_CX = 240;  // center x of diamond
export const DIAMOND_CY = 400;  // home plate y
export const BASE_DIST = 110;   // pixels between bases

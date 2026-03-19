// Canvas
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 640;

// Player
export const PLAYER_SPEED = 4;
export const PLAYER_WIDTH = 30;
export const PLAYER_HEIGHT = 24;
export const PLAYER_Y_OFFSET = 50; // from bottom
export const MAX_LIVES = 3;
export const FIRE_COOLDOWN = 6; // frames between shots
export const MAX_PLAYER_BULLETS = 99;

// Bullets
export const PLAYER_BULLET_SPEED = 7;
export const ALIEN_BULLET_SPEED = 3.5;
export const BULLET_WIDTH = 8;
export const BULLET_HEIGHT = 14;

// Alien formation
export const FORMATION_COLS = 10;
export const FORMATION_ROWS = 5;
export const ALIEN_WIDTH = 30;
export const ALIEN_HEIGHT = 28;
export const ALIEN_SPACING_X = 36;
export const ALIEN_SPACING_Y = 32;
export const FORMATION_TOP = 60;
export const FORMATION_LEFT = 48;
export const FORMATION_BASE_SPEED = 0.3;
export const FORMATION_SPEED_INCREMENT = 0.08;
export const FORMATION_SWEEP_RANGE = 20;

// Alien types
export const ALIEN_TYPES = {
    COMMANDER: { row: 0, color: '#00ff88', points: 150, name: 'Commander' },
    BUTTERFLY: { rows: [1, 2], color: '#ff44ff', points: 80, name: 'Butterfly' },
    BEE:       { rows: [3, 4], color: '#ffff00', points: 50, name: 'Bee' }
};

// Dive behavior
export const BASE_DIVE_CHANCE = 0.004;
export const DIVE_CHANCE_INCREMENT = 0.001;
export const DIVE_SPEED = 3;
export const MAX_DIVERS_BASE = 3;
export const ALIEN_FIRE_CHANCE = 0.012; // per-diver per-frame

// Particles
export const PARTICLE_COUNT = 12;
export const PARTICLE_SPEED = 3;
export const PARTICLE_LIFE = 30; // frames
export const PARTICLE_SIZE = 3;

// Colors
export const COLORS = {
    BG: '#000000',
    PLAYER: '#00ccff',
    PLAYER_ENGINE: '#ff6600',
    PLAYER_BULLET: '#ffffff',
    ALIEN_BULLET: '#ff4444',
    HUD_TEXT: '#ffffff',
    TITLE_TEXT: '#ff4444',
    TITLE_SUB: '#00ccff',
    STAR: '#ffffff'
};

// Game states
export const STATES = {
    TITLE: 'TITLE',
    WAVE_INTRO: 'WAVE_INTRO',
    PLAYING: 'PLAYING',
    PLAYER_DEATH: 'PLAYER_DEATH',
    GAME_OVER: 'GAME_OVER',
    NAME_ENTRY: 'NAME_ENTRY'
};

// Timing
export const WAVE_INTRO_DURATION = 120; // frames (2 seconds at 60fps)
export const DEATH_PAUSE_DURATION = 90;
export const GAME_OVER_DURATION = 180;

// Dual Fighter
export const DUAL_FIGHTER_GAP = 22;

// Stars
export const STAR_COUNT = 80;
export const STAR_SPEED_MIN = 0.3;
export const STAR_SPEED_MAX = 1.5;

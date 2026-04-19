// Level definitions for Angry Birds
// Each level has birds, pigs, and block structures

export const LEVELS = [
    // Level 1 — Simple intro
    {
        birds: ['red', 'red', 'red'],
        pigs: [
            { x: 650, y: -25, radius: 18 }
        ],
        blocks: [
            // Small tower
            { x: 620, y: -15, w: 15, h: 80, material: 'wood' },
            { x: 680, y: -15, w: 15, h: 80, material: 'wood' },
            { x: 650, y: -65, w: 80, h: 12, material: 'wood' },
        ]
    },
    // Level 2 — Two pigs
    {
        birds: ['red', 'red', 'blue', 'red'],
        pigs: [
            { x: 620, y: -25, radius: 18 },
            { x: 730, y: -25, radius: 18 },
        ],
        blocks: [
            // Left shelter
            { x: 590, y: -15, w: 15, h: 80, material: 'wood' },
            { x: 650, y: -15, w: 15, h: 80, material: 'wood' },
            { x: 620, y: -65, w: 80, h: 12, material: 'wood' },
            // Right shelter
            { x: 700, y: -15, w: 15, h: 80, material: 'wood' },
            { x: 760, y: -15, w: 15, h: 80, material: 'wood' },
            { x: 730, y: -65, w: 80, h: 12, material: 'wood' },
        ]
    },
    // Level 3 — Stone fortress
    {
        birds: ['red', 'yellow', 'red', 'red'],
        pigs: [
            { x: 680, y: -25, radius: 18 },
            { x: 680, y: -95, radius: 15 },
        ],
        blocks: [
            // Stone walls
            { x: 645, y: -15, w: 15, h: 80, material: 'stone' },
            { x: 715, y: -15, w: 15, h: 80, material: 'stone' },
            { x: 680, y: -65, w: 90, h: 12, material: 'wood' },
            // Upper level
            { x: 660, y: -80, w: 12, h: 50, material: 'wood' },
            { x: 700, y: -80, w: 12, h: 50, material: 'wood' },
            { x: 680, y: -115, w: 60, h: 12, material: 'wood' },
        ]
    },
    // Level 4 — Ice and wood mix
    {
        birds: ['yellow', 'red', 'blue', 'red', 'black'],
        pigs: [
            { x: 600, y: -25, radius: 16 },
            { x: 700, y: -25, radius: 18 },
            { x: 780, y: -25, radius: 16 },
        ],
        blocks: [
            // Ice barriers
            { x: 560, y: -25, w: 12, h: 60, material: 'ice' },
            { x: 640, y: -25, w: 12, h: 60, material: 'ice' },
            { x: 600, y: -65, w: 100, h: 10, material: 'ice' },
            // Wood center
            { x: 670, y: -15, w: 15, h: 80, material: 'wood' },
            { x: 730, y: -15, w: 15, h: 80, material: 'wood' },
            { x: 700, y: -65, w: 80, h: 12, material: 'wood' },
            // Right structure
            { x: 760, y: -25, w: 12, h: 60, material: 'ice' },
            { x: 800, y: -25, w: 12, h: 60, material: 'ice' },
            { x: 780, y: -65, w: 60, h: 10, material: 'ice' },
        ]
    },
    // Level 5 — Big fortress
    {
        birds: ['red', 'yellow', 'black', 'red', 'blue'],
        pigs: [
            { x: 660, y: -25, radius: 18 },
            { x: 740, y: -25, radius: 18 },
            { x: 700, y: -95, radius: 20 },
            { x: 700, y: -155, radius: 15 },
        ],
        blocks: [
            // Ground floor
            { x: 625, y: -15, w: 15, h: 80, material: 'stone' },
            { x: 700, y: -15, w: 15, h: 80, material: 'stone' },
            { x: 775, y: -15, w: 15, h: 80, material: 'stone' },
            { x: 662, y: -65, w: 90, h: 12, material: 'wood' },
            { x: 738, y: -65, w: 90, h: 12, material: 'wood' },
            // Second floor
            { x: 660, y: -80, w: 12, h: 50, material: 'wood' },
            { x: 740, y: -80, w: 12, h: 50, material: 'wood' },
            { x: 700, y: -115, w: 100, h: 12, material: 'stone' },
            // Top
            { x: 680, y: -130, w: 12, h: 50, material: 'wood' },
            { x: 720, y: -130, w: 12, h: 50, material: 'wood' },
            { x: 700, y: -165, w: 60, h: 10, material: 'wood' },
        ]
    },
    // Level 6 — Scattered pigs
    {
        birds: ['red', 'blue', 'yellow', 'red', 'black'],
        pigs: [
            { x: 500, y: -25, radius: 16 },
            { x: 650, y: -25, radius: 18 },
            { x: 800, y: -25, radius: 16 },
            { x: 650, y: -100, radius: 15 },
        ],
        blocks: [
            // Left bunker
            { x: 470, y: -20, w: 12, h: 50, material: 'ice' },
            { x: 530, y: -20, w: 12, h: 50, material: 'ice' },
            { x: 500, y: -55, w: 80, h: 10, material: 'ice' },
            // Center tower
            { x: 620, y: -15, w: 15, h: 80, material: 'stone' },
            { x: 680, y: -15, w: 15, h: 80, material: 'stone' },
            { x: 650, y: -65, w: 80, h: 12, material: 'stone' },
            { x: 635, y: -80, w: 12, h: 50, material: 'wood' },
            { x: 665, y: -80, w: 12, h: 50, material: 'wood' },
            { x: 650, y: -115, w: 50, h: 10, material: 'wood' },
            // Right bunker
            { x: 770, y: -20, w: 12, h: 50, material: 'wood' },
            { x: 830, y: -20, w: 12, h: 50, material: 'wood' },
            { x: 800, y: -55, w: 80, h: 10, material: 'wood' },
        ]
    },
    // Level 7 — Stone castle
    {
        birds: ['black', 'red', 'yellow', 'black', 'red', 'blue'],
        pigs: [
            { x: 680, y: -25, radius: 20 },
            { x: 680, y: -95, radius: 18 },
            { x: 640, y: -95, radius: 15 },
            { x: 720, y: -95, radius: 15 },
            { x: 680, y: -165, radius: 18 },
        ],
        blocks: [
            // Floor 1
            { x: 630, y: -15, w: 18, h: 80, material: 'stone' },
            { x: 730, y: -15, w: 18, h: 80, material: 'stone' },
            { x: 680, y: -65, w: 120, h: 14, material: 'stone' },
            // Floor 2
            { x: 640, y: -80, w: 14, h: 60, material: 'stone' },
            { x: 720, y: -80, w: 14, h: 60, material: 'stone' },
            { x: 680, y: -120, w: 100, h: 14, material: 'stone' },
            // Floor 3
            { x: 655, y: -135, w: 14, h: 50, material: 'wood' },
            { x: 705, y: -135, w: 14, h: 50, material: 'wood' },
            { x: 680, y: -170, w: 70, h: 12, material: 'wood' },
        ]
    },
    // Level 8 — Twin towers
    {
        birds: ['yellow', 'red', 'black', 'blue', 'red', 'yellow'],
        pigs: [
            { x: 560, y: -25, radius: 16 },
            { x: 560, y: -100, radius: 15 },
            { x: 760, y: -25, radius: 16 },
            { x: 760, y: -100, radius: 15 },
            { x: 660, y: -25, radius: 20 },
        ],
        blocks: [
            // Left tower
            { x: 530, y: -15, w: 14, h: 80, material: 'wood' },
            { x: 590, y: -15, w: 14, h: 80, material: 'wood' },
            { x: 560, y: -65, w: 80, h: 12, material: 'wood' },
            { x: 540, y: -80, w: 12, h: 50, material: 'wood' },
            { x: 580, y: -80, w: 12, h: 50, material: 'wood' },
            { x: 560, y: -115, w: 60, h: 10, material: 'wood' },
            // Bridge
            { x: 660, y: -15, w: 80, h: 14, material: 'stone' },
            // Right tower
            { x: 730, y: -15, w: 14, h: 80, material: 'ice' },
            { x: 790, y: -15, w: 14, h: 80, material: 'ice' },
            { x: 760, y: -65, w: 80, h: 12, material: 'ice' },
            { x: 740, y: -80, w: 12, h: 50, material: 'ice' },
            { x: 780, y: -80, w: 12, h: 50, material: 'ice' },
            { x: 760, y: -115, w: 60, h: 10, material: 'ice' },
        ]
    },
    // Level 9 — The wall
    {
        birds: ['black', 'black', 'yellow', 'red', 'red', 'blue'],
        pigs: [
            { x: 780, y: -25, radius: 18 },
            { x: 820, y: -25, radius: 16 },
            { x: 800, y: -80, radius: 15 },
        ],
        blocks: [
            // Thick wall
            { x: 680, y: -50, w: 25, h: 150, material: 'stone' },
            { x: 710, y: -50, w: 25, h: 150, material: 'stone' },
            // Behind-wall shelter
            { x: 760, y: -15, w: 14, h: 80, material: 'wood' },
            { x: 840, y: -15, w: 14, h: 80, material: 'wood' },
            { x: 800, y: -65, w: 100, h: 12, material: 'wood' },
            { x: 785, y: -80, w: 12, h: 40, material: 'wood' },
            { x: 815, y: -80, w: 12, h: 40, material: 'wood' },
            { x: 800, y: -110, w: 50, h: 10, material: 'wood' },
        ]
    },
    // Level 10 — Final boss
    {
        birds: ['red', 'yellow', 'black', 'blue', 'red', 'black', 'yellow'],
        pigs: [
            { x: 620, y: -25, radius: 16 },
            { x: 700, y: -25, radius: 16 },
            { x: 780, y: -25, radius: 16 },
            { x: 660, y: -100, radius: 18 },
            { x: 740, y: -100, radius: 18 },
            { x: 700, y: -175, radius: 22 },
        ],
        blocks: [
            // Base floor
            { x: 585, y: -15, w: 18, h: 80, material: 'stone' },
            { x: 660, y: -15, w: 18, h: 80, material: 'stone' },
            { x: 740, y: -15, w: 18, h: 80, material: 'stone' },
            { x: 815, y: -15, w: 18, h: 80, material: 'stone' },
            { x: 622, y: -65, w: 90, h: 14, material: 'stone' },
            { x: 700, y: -65, w: 100, h: 14, material: 'stone' },
            { x: 778, y: -65, w: 90, h: 14, material: 'stone' },
            // Second floor
            { x: 630, y: -80, w: 14, h: 60, material: 'wood' },
            { x: 700, y: -80, w: 14, h: 60, material: 'wood' },
            { x: 770, y: -80, w: 14, h: 60, material: 'wood' },
            { x: 665, y: -120, w: 85, h: 14, material: 'stone' },
            { x: 735, y: -120, w: 85, h: 14, material: 'stone' },
            // Third floor
            { x: 665, y: -135, w: 14, h: 50, material: 'wood' },
            { x: 735, y: -135, w: 14, h: 50, material: 'wood' },
            { x: 700, y: -170, w: 90, h: 12, material: 'stone' },
            // Crown
            { x: 685, y: -185, w: 10, h: 40, material: 'ice' },
            { x: 715, y: -185, w: 10, h: 40, material: 'ice' },
            { x: 700, y: -215, w: 50, h: 10, material: 'ice' },
        ]
    },
];

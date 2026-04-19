// Level definitions for Angry Birds
// Massive structures — built for a thousand-pound wrecking ball bird
// Block y values are relative to ground (negative = above ground)

export const LEVELS = [
    // ═══════════════════════════════════════════════════════════
    // Level 1 — THE SKYSCRAPER: 6-story wood tower
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'red', 'yellow'],
        pigs: [
            { x: 700, y: -25, radius: 18 },
            { x: 700, y: -115, radius: 16 },
            { x: 700, y: -205, radius: 16 },
            { x: 700, y: -295, radius: 15 },
        ],
        blocks: [
            // Floor 1
            { x: 665, y: -20, w: 16, h: 90, material: 'wood' },
            { x: 735, y: -20, w: 16, h: 90, material: 'wood' },
            { x: 700, y: -75, w: 90, h: 14, material: 'wood' },
            // Floor 2
            { x: 670, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 730, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 700, y: -135, w: 80, h: 12, material: 'wood' },
            // Floor 3
            { x: 670, y: -150, w: 14, h: 70, material: 'wood' },
            { x: 730, y: -150, w: 14, h: 70, material: 'wood' },
            { x: 700, y: -195, w: 80, h: 12, material: 'wood' },
            // Floor 4
            { x: 675, y: -210, w: 12, h: 70, material: 'wood' },
            { x: 725, y: -210, w: 12, h: 70, material: 'wood' },
            { x: 700, y: -255, w: 70, h: 12, material: 'wood' },
            // Floor 5
            { x: 680, y: -270, w: 12, h: 60, material: 'wood' },
            { x: 720, y: -270, w: 12, h: 60, material: 'wood' },
            { x: 700, y: -310, w: 60, h: 10, material: 'wood' },
            // Spire
            { x: 690, y: -320, w: 10, h: 40, material: 'wood' },
            { x: 710, y: -320, w: 10, h: 40, material: 'wood' },
            { x: 700, y: -350, w: 40, h: 10, material: 'wood' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 2 — TWIN TOWERS: Two tall towers with skybridge
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'red', 'yellow', 'red'],
        pigs: [
            { x: 580, y: -25, radius: 18 },
            { x: 580, y: -155, radius: 16 },
            { x: 580, y: -285, radius: 15 },
            { x: 780, y: -25, radius: 18 },
            { x: 780, y: -155, radius: 16 },
            { x: 780, y: -285, radius: 15 },
        ],
        blocks: [
            // === Left Tower ===
            { x: 545, y: -20, w: 16, h: 90, material: 'wood' },
            { x: 615, y: -20, w: 16, h: 90, material: 'wood' },
            { x: 580, y: -75, w: 90, h: 14, material: 'wood' },
            { x: 550, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 610, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 580, y: -135, w: 80, h: 12, material: 'wood' },
            { x: 555, y: -150, w: 14, h: 70, material: 'wood' },
            { x: 605, y: -150, w: 14, h: 70, material: 'wood' },
            { x: 580, y: -195, w: 70, h: 12, material: 'wood' },
            { x: 560, y: -210, w: 12, h: 70, material: 'wood' },
            { x: 600, y: -210, w: 12, h: 70, material: 'wood' },
            { x: 580, y: -255, w: 60, h: 10, material: 'wood' },
            { x: 565, y: -265, w: 10, h: 50, material: 'wood' },
            { x: 595, y: -265, w: 10, h: 50, material: 'wood' },
            { x: 580, y: -300, w: 50, h: 10, material: 'wood' },

            // === Right Tower ===
            { x: 745, y: -20, w: 16, h: 90, material: 'wood' },
            { x: 815, y: -20, w: 16, h: 90, material: 'wood' },
            { x: 780, y: -75, w: 90, h: 14, material: 'wood' },
            { x: 750, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 810, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 780, y: -135, w: 80, h: 12, material: 'wood' },
            { x: 755, y: -150, w: 14, h: 70, material: 'wood' },
            { x: 805, y: -150, w: 14, h: 70, material: 'wood' },
            { x: 780, y: -195, w: 70, h: 12, material: 'wood' },
            { x: 760, y: -210, w: 12, h: 70, material: 'wood' },
            { x: 800, y: -210, w: 12, h: 70, material: 'wood' },
            { x: 780, y: -255, w: 60, h: 10, material: 'wood' },
            { x: 765, y: -265, w: 10, h: 50, material: 'wood' },
            { x: 795, y: -265, w: 10, h: 50, material: 'wood' },
            { x: 780, y: -300, w: 50, h: 10, material: 'wood' },

            // === Skybridge ===
            { x: 680, y: -195, w: 140, h: 14, material: 'stone' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 3 — THE ICE PYRAMID: Wide base, narrows to peak
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'yellow', 'red', 'red'],
        pigs: [
            { x: 640, y: -25, radius: 18 },
            { x: 720, y: -25, radius: 18 },
            { x: 800, y: -25, radius: 18 },
            { x: 680, y: -105, radius: 16 },
            { x: 760, y: -105, radius: 16 },
            { x: 720, y: -195, radius: 15 },
        ],
        blocks: [
            // Base row (wide)
            { x: 580, y: -20, w: 14, h: 90, material: 'ice' },
            { x: 640, y: -20, w: 14, h: 90, material: 'ice' },
            { x: 720, y: -20, w: 14, h: 90, material: 'ice' },
            { x: 800, y: -20, w: 14, h: 90, material: 'ice' },
            { x: 860, y: -20, w: 14, h: 90, material: 'ice' },
            { x: 610, y: -75, w: 75, h: 12, material: 'ice' },
            { x: 680, y: -75, w: 95, h: 12, material: 'ice' },
            { x: 760, y: -75, w: 95, h: 12, material: 'ice' },
            { x: 830, y: -75, w: 75, h: 12, material: 'ice' },
            // Second row
            { x: 620, y: -90, w: 14, h: 70, material: 'ice' },
            { x: 680, y: -90, w: 14, h: 70, material: 'ice' },
            { x: 760, y: -90, w: 14, h: 70, material: 'ice' },
            { x: 820, y: -90, w: 14, h: 70, material: 'ice' },
            { x: 650, y: -135, w: 75, h: 12, material: 'ice' },
            { x: 720, y: -135, w: 100, h: 12, material: 'ice' },
            { x: 790, y: -135, w: 75, h: 12, material: 'ice' },
            // Third row
            { x: 660, y: -150, w: 14, h: 70, material: 'ice' },
            { x: 720, y: -150, w: 14, h: 70, material: 'ice' },
            { x: 780, y: -150, w: 14, h: 70, material: 'ice' },
            { x: 690, y: -195, w: 75, h: 12, material: 'ice' },
            { x: 750, y: -195, w: 75, h: 12, material: 'ice' },
            // Peak
            { x: 700, y: -210, w: 12, h: 60, material: 'ice' },
            { x: 740, y: -210, w: 12, h: 60, material: 'ice' },
            { x: 720, y: -250, w: 60, h: 12, material: 'ice' },
            { x: 720, y: -270, w: 10, h: 40, material: 'ice' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 4 — STONE FORTRESS: Thick walls, deep chambers
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['yellow', 'red', 'black', 'red', 'yellow'],
        pigs: [
            { x: 650, y: -30, radius: 20 },
            { x: 750, y: -30, radius: 20 },
            { x: 650, y: -140, radius: 18 },
            { x: 750, y: -140, radius: 18 },
            { x: 700, y: -250, radius: 20 },
        ],
        blocks: [
            // Outer walls
            { x: 590, y: -40, w: 22, h: 130, material: 'stone' },
            { x: 810, y: -40, w: 22, h: 130, material: 'stone' },
            // Inner wall
            { x: 700, y: -30, w: 20, h: 110, material: 'stone' },
            // Floor 1 ceilings
            { x: 645, y: -105, w: 130, h: 16, material: 'stone' },
            { x: 755, y: -105, w: 130, h: 16, material: 'stone' },
            // Floor 2 walls
            { x: 610, y: -125, w: 18, h: 80, material: 'stone' },
            { x: 700, y: -125, w: 18, h: 80, material: 'stone' },
            { x: 790, y: -125, w: 18, h: 80, material: 'stone' },
            // Floor 2 ceiling
            { x: 700, y: -175, w: 200, h: 16, material: 'stone' },
            // Floor 3 walls
            { x: 640, y: -195, w: 16, h: 80, material: 'wood' },
            { x: 760, y: -195, w: 16, h: 80, material: 'wood' },
            { x: 700, y: -245, w: 140, h: 14, material: 'stone' },
            // Battlement top
            { x: 640, y: -260, w: 12, h: 50, material: 'wood' },
            { x: 670, y: -260, w: 12, h: 50, material: 'wood' },
            { x: 700, y: -260, w: 12, h: 50, material: 'wood' },
            { x: 730, y: -260, w: 12, h: 50, material: 'wood' },
            { x: 760, y: -260, w: 12, h: 50, material: 'wood' },
            { x: 700, y: -295, w: 150, h: 12, material: 'wood' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 5 — CITY BLOCK: Three skyscrapers side by side
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'yellow', 'black', 'red', 'red', 'yellow'],
        pigs: [
            { x: 550, y: -25, radius: 16 },
            { x: 550, y: -115, radius: 15 },
            { x: 550, y: -205, radius: 14 },
            { x: 700, y: -25, radius: 18 },
            { x: 700, y: -155, radius: 16 },
            { x: 700, y: -285, radius: 15 },
            { x: 700, y: -385, radius: 14 },
            { x: 850, y: -25, radius: 16 },
            { x: 850, y: -115, radius: 15 },
        ],
        blocks: [
            // === Building 1 (short, left) ===
            { x: 520, y: -20, w: 14, h: 90, material: 'ice' },
            { x: 580, y: -20, w: 14, h: 90, material: 'ice' },
            { x: 550, y: -75, w: 80, h: 12, material: 'ice' },
            { x: 525, y: -90, w: 12, h: 70, material: 'ice' },
            { x: 575, y: -90, w: 12, h: 70, material: 'ice' },
            { x: 550, y: -135, w: 70, h: 10, material: 'ice' },
            { x: 530, y: -150, w: 10, h: 60, material: 'ice' },
            { x: 570, y: -150, w: 10, h: 60, material: 'ice' },
            { x: 550, y: -190, w: 60, h: 10, material: 'ice' },
            { x: 535, y: -200, w: 10, h: 40, material: 'ice' },
            { x: 565, y: -200, w: 10, h: 40, material: 'ice' },
            { x: 550, y: -230, w: 50, h: 10, material: 'ice' },

            // === Building 2 (tallest, center) ===
            { x: 660, y: -20, w: 18, h: 90, material: 'stone' },
            { x: 740, y: -20, w: 18, h: 90, material: 'stone' },
            { x: 700, y: -75, w: 100, h: 14, material: 'stone' },
            { x: 668, y: -95, w: 16, h: 80, material: 'wood' },
            { x: 732, y: -95, w: 16, h: 80, material: 'wood' },
            { x: 700, y: -145, w: 85, h: 12, material: 'wood' },
            { x: 672, y: -160, w: 14, h: 70, material: 'wood' },
            { x: 728, y: -160, w: 14, h: 70, material: 'wood' },
            { x: 700, y: -205, w: 75, h: 12, material: 'wood' },
            { x: 676, y: -220, w: 14, h: 70, material: 'wood' },
            { x: 724, y: -220, w: 14, h: 70, material: 'wood' },
            { x: 700, y: -265, w: 70, h: 12, material: 'stone' },
            { x: 680, y: -280, w: 12, h: 60, material: 'wood' },
            { x: 720, y: -280, w: 12, h: 60, material: 'wood' },
            { x: 700, y: -320, w: 60, h: 10, material: 'wood' },
            { x: 685, y: -335, w: 10, h: 50, material: 'wood' },
            { x: 715, y: -335, w: 10, h: 50, material: 'wood' },
            { x: 700, y: -370, w: 50, h: 10, material: 'wood' },
            { x: 690, y: -385, w: 10, h: 40, material: 'wood' },
            { x: 710, y: -385, w: 10, h: 40, material: 'wood' },
            { x: 700, y: -415, w: 40, h: 10, material: 'wood' },

            // === Building 3 (medium, right) ===
            { x: 820, y: -20, w: 14, h: 90, material: 'wood' },
            { x: 880, y: -20, w: 14, h: 90, material: 'wood' },
            { x: 850, y: -75, w: 80, h: 12, material: 'wood' },
            { x: 825, y: -90, w: 12, h: 70, material: 'wood' },
            { x: 875, y: -90, w: 12, h: 70, material: 'wood' },
            { x: 850, y: -135, w: 70, h: 10, material: 'wood' },
            { x: 835, y: -150, w: 10, h: 50, material: 'wood' },
            { x: 865, y: -150, w: 10, h: 50, material: 'wood' },
            { x: 850, y: -185, w: 50, h: 10, material: 'wood' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 6 — THE CATHEDRAL: Tall spire with flying buttresses
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'black', 'yellow', 'red', 'red'],
        pigs: [
            { x: 700, y: -30, radius: 22 },
            { x: 650, y: -140, radius: 16 },
            { x: 750, y: -140, radius: 16 },
            { x: 700, y: -240, radius: 18 },
            { x: 700, y: -350, radius: 15 },
            { x: 700, y: -440, radius: 14 },
        ],
        blocks: [
            // Base — thick nave
            { x: 620, y: -30, w: 22, h: 110, material: 'stone' },
            { x: 780, y: -30, w: 22, h: 110, material: 'stone' },
            { x: 700, y: -95, w: 180, h: 18, material: 'stone' },
            // Buttresses (left)
            { x: 575, y: -15, w: 16, h: 80, material: 'stone' },
            { x: 595, y: -50, w: 50, h: 12, material: 'stone' },
            // Buttresses (right)
            { x: 825, y: -15, w: 16, h: 80, material: 'stone' },
            { x: 805, y: -50, w: 50, h: 12, material: 'stone' },
            // Second floor
            { x: 640, y: -115, w: 16, h: 80, material: 'stone' },
            { x: 760, y: -115, w: 16, h: 80, material: 'stone' },
            { x: 700, y: -165, w: 140, h: 14, material: 'stone' },
            // Third floor
            { x: 660, y: -180, w: 14, h: 80, material: 'wood' },
            { x: 740, y: -180, w: 14, h: 80, material: 'wood' },
            { x: 700, y: -230, w: 100, h: 12, material: 'wood' },
            // Tower section
            { x: 675, y: -245, w: 14, h: 70, material: 'wood' },
            { x: 725, y: -245, w: 14, h: 70, material: 'wood' },
            { x: 700, y: -290, w: 70, h: 12, material: 'wood' },
            { x: 680, y: -305, w: 12, h: 60, material: 'wood' },
            { x: 720, y: -305, w: 12, h: 60, material: 'wood' },
            { x: 700, y: -345, w: 60, h: 10, material: 'wood' },
            // Spire
            { x: 688, y: -360, w: 10, h: 60, material: 'ice' },
            { x: 712, y: -360, w: 10, h: 60, material: 'ice' },
            { x: 700, y: -400, w: 45, h: 10, material: 'ice' },
            { x: 693, y: -415, w: 8, h: 50, material: 'ice' },
            { x: 707, y: -415, w: 8, h: 50, material: 'ice' },
            { x: 700, y: -450, w: 30, h: 8, material: 'ice' },
            // Cross on top
            { x: 700, y: -465, w: 6, h: 30, material: 'ice' },
            { x: 700, y: -475, w: 20, h: 6, material: 'ice' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 7 — THE DAM: Massive wall protecting pig village
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['black', 'red', 'black', 'yellow', 'red', 'red'],
        pigs: [
            { x: 800, y: -25, radius: 18 },
            { x: 860, y: -25, radius: 16 },
            { x: 920, y: -25, radius: 16 },
            { x: 830, y: -100, radius: 15 },
            { x: 890, y: -100, radius: 15 },
            { x: 860, y: -180, radius: 14 },
        ],
        blocks: [
            // === THE DAM (thick multi-layer wall) ===
            { x: 630, y: -70, w: 30, h: 190, material: 'stone' },
            { x: 665, y: -60, w: 30, h: 170, material: 'stone' },
            { x: 700, y: -50, w: 30, h: 150, material: 'stone' },
            // Dam buttress
            { x: 595, y: -30, w: 20, h: 110, material: 'stone' },
            { x: 612, y: -50, w: 40, h: 14, material: 'stone' },
            // Dam top walkway
            { x: 665, y: -165, w: 120, h: 12, material: 'stone' },
            // Dam towers
            { x: 618, y: -120, w: 14, h: 100, material: 'stone' },
            { x: 618, y: -180, w: 30, h: 14, material: 'stone' },
            { x: 712, y: -100, w: 14, h: 60, material: 'stone' },
            { x: 712, y: -140, w: 30, h: 14, material: 'stone' },

            // === PIG VILLAGE (behind dam) ===
            // House 1
            { x: 775, y: -15, w: 12, h: 80, material: 'wood' },
            { x: 825, y: -15, w: 12, h: 80, material: 'wood' },
            { x: 800, y: -65, w: 65, h: 10, material: 'wood' },
            // House 2
            { x: 850, y: -15, w: 12, h: 80, material: 'wood' },
            { x: 930, y: -15, w: 12, h: 80, material: 'wood' },
            { x: 890, y: -65, w: 100, h: 10, material: 'wood' },
            // Second floor shared
            { x: 800, y: -80, w: 12, h: 60, material: 'wood' },
            { x: 860, y: -80, w: 12, h: 60, material: 'wood' },
            { x: 920, y: -80, w: 12, h: 60, material: 'wood' },
            { x: 830, y: -120, w: 80, h: 10, material: 'wood' },
            { x: 890, y: -120, w: 80, h: 10, material: 'wood' },
            // Lookout tower
            { x: 840, y: -135, w: 10, h: 60, material: 'wood' },
            { x: 880, y: -135, w: 10, h: 60, material: 'wood' },
            { x: 860, y: -175, w: 60, h: 10, material: 'wood' },
            { x: 850, y: -190, w: 8, h: 30, material: 'wood' },
            { x: 870, y: -190, w: 8, h: 30, material: 'wood' },
            { x: 860, y: -215, w: 35, h: 8, material: 'wood' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 8 — THE CITADEL: Concentric walls, pigs everywhere
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['yellow', 'red', 'black', 'red', 'yellow', 'black'],
        pigs: [
            // Outer ring
            { x: 580, y: -25, radius: 16 },
            { x: 820, y: -25, radius: 16 },
            // Middle ring
            { x: 640, y: -110, radius: 16 },
            { x: 760, y: -110, radius: 16 },
            // Inner keep
            { x: 700, y: -25, radius: 20 },
            { x: 700, y: -180, radius: 18 },
            { x: 700, y: -290, radius: 16 },
            { x: 700, y: -380, radius: 15 },
        ],
        blocks: [
            // === Outer Wall ===
            { x: 530, y: -25, w: 20, h: 100, material: 'stone' },
            { x: 870, y: -25, w: 20, h: 100, material: 'stone' },
            { x: 555, y: -15, w: 12, h: 80, material: 'wood' },
            { x: 845, y: -15, w: 12, h: 80, material: 'wood' },
            { x: 570, y: -65, w: 50, h: 10, material: 'wood' },
            { x: 838, y: -65, w: 50, h: 10, material: 'wood' },
            { x: 610, y: -15, w: 12, h: 80, material: 'wood' },
            { x: 790, y: -15, w: 12, h: 80, material: 'wood' },

            // === Middle Wall ===
            { x: 610, y: -85, w: 18, h: 90, material: 'stone' },
            { x: 790, y: -85, w: 18, h: 90, material: 'stone' },
            { x: 700, y: -140, w: 200, h: 14, material: 'stone' },
            { x: 640, y: -90, w: 12, h: 70, material: 'wood' },
            { x: 760, y: -90, w: 12, h: 70, material: 'wood' },

            // === Inner Keep (tallest) ===
            { x: 665, y: -20, w: 18, h: 90, material: 'stone' },
            { x: 735, y: -20, w: 18, h: 90, material: 'stone' },
            { x: 700, y: -75, w: 90, h: 14, material: 'stone' },
            // Keep floor 2
            { x: 670, y: -155, w: 16, h: 80, material: 'stone' },
            { x: 730, y: -155, w: 16, h: 80, material: 'stone' },
            { x: 700, y: -205, w: 80, h: 14, material: 'stone' },
            // Keep floor 3
            { x: 676, y: -220, w: 14, h: 60, material: 'wood' },
            { x: 724, y: -220, w: 14, h: 60, material: 'wood' },
            { x: 700, y: -260, w: 70, h: 12, material: 'wood' },
            // Keep floor 4
            { x: 680, y: -275, w: 12, h: 60, material: 'wood' },
            { x: 720, y: -275, w: 12, h: 60, material: 'wood' },
            { x: 700, y: -315, w: 60, h: 10, material: 'wood' },
            // Tower top
            { x: 685, y: -330, w: 10, h: 50, material: 'wood' },
            { x: 715, y: -330, w: 10, h: 50, material: 'wood' },
            { x: 700, y: -365, w: 50, h: 10, material: 'wood' },
            { x: 690, y: -380, w: 8, h: 40, material: 'ice' },
            { x: 710, y: -380, w: 8, h: 40, material: 'ice' },
            { x: 700, y: -410, w: 35, h: 8, material: 'ice' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 9 — PIG METROPOLIS: Dense cityscape of towers
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['black', 'red', 'yellow', 'black', 'red', 'yellow', 'red'],
        pigs: [
            { x: 500, y: -25, radius: 16 },
            { x: 500, y: -135, radius: 14 },
            { x: 620, y: -25, radius: 18 },
            { x: 620, y: -155, radius: 16 },
            { x: 620, y: -285, radius: 15 },
            { x: 740, y: -25, radius: 18 },
            { x: 740, y: -155, radius: 16 },
            { x: 740, y: -245, radius: 14 },
            { x: 860, y: -25, radius: 16 },
            { x: 860, y: -135, radius: 14 },
        ],
        blocks: [
            // === Tower A (medium) ===
            { x: 470, y: -20, w: 14, h: 90, material: 'ice' },
            { x: 530, y: -20, w: 14, h: 90, material: 'ice' },
            { x: 500, y: -75, w: 80, h: 10, material: 'ice' },
            { x: 478, y: -90, w: 10, h: 60, material: 'ice' },
            { x: 522, y: -90, w: 10, h: 60, material: 'ice' },
            { x: 500, y: -130, w: 60, h: 10, material: 'ice' },
            { x: 485, y: -145, w: 10, h: 50, material: 'ice' },
            { x: 515, y: -145, w: 10, h: 50, material: 'ice' },
            { x: 500, y: -180, w: 50, h: 8, material: 'ice' },

            // === Tower B (tallest) ===
            { x: 585, y: -20, w: 16, h: 90, material: 'stone' },
            { x: 655, y: -20, w: 16, h: 90, material: 'stone' },
            { x: 620, y: -75, w: 90, h: 12, material: 'stone' },
            { x: 592, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 648, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 620, y: -135, w: 75, h: 10, material: 'wood' },
            { x: 597, y: -150, w: 12, h: 70, material: 'wood' },
            { x: 643, y: -150, w: 12, h: 70, material: 'wood' },
            { x: 620, y: -195, w: 65, h: 10, material: 'wood' },
            { x: 600, y: -210, w: 12, h: 60, material: 'wood' },
            { x: 640, y: -210, w: 12, h: 60, material: 'wood' },
            { x: 620, y: -250, w: 60, h: 10, material: 'wood' },
            { x: 605, y: -265, w: 10, h: 50, material: 'wood' },
            { x: 635, y: -265, w: 10, h: 50, material: 'wood' },
            { x: 620, y: -300, w: 50, h: 8, material: 'wood' },

            // === Tower C (tall) ===
            { x: 705, y: -20, w: 16, h: 90, material: 'wood' },
            { x: 775, y: -20, w: 16, h: 90, material: 'wood' },
            { x: 740, y: -75, w: 90, h: 12, material: 'wood' },
            { x: 712, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 768, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 740, y: -135, w: 75, h: 10, material: 'wood' },
            { x: 718, y: -150, w: 12, h: 60, material: 'wood' },
            { x: 762, y: -150, w: 12, h: 60, material: 'wood' },
            { x: 740, y: -190, w: 65, h: 10, material: 'wood' },
            { x: 722, y: -205, w: 10, h: 50, material: 'wood' },
            { x: 758, y: -205, w: 10, h: 50, material: 'wood' },
            { x: 740, y: -240, w: 55, h: 10, material: 'wood' },
            { x: 730, y: -255, w: 8, h: 30, material: 'wood' },
            { x: 750, y: -255, w: 8, h: 30, material: 'wood' },
            { x: 740, y: -280, w: 35, h: 8, material: 'wood' },

            // === Tower D (medium) ===
            { x: 830, y: -20, w: 14, h: 90, material: 'wood' },
            { x: 890, y: -20, w: 14, h: 90, material: 'wood' },
            { x: 860, y: -75, w: 80, h: 10, material: 'wood' },
            { x: 838, y: -90, w: 10, h: 60, material: 'wood' },
            { x: 882, y: -90, w: 10, h: 60, material: 'wood' },
            { x: 860, y: -130, w: 60, h: 10, material: 'wood' },
            { x: 845, y: -145, w: 10, h: 50, material: 'wood' },
            { x: 875, y: -145, w: 10, h: 50, material: 'wood' },
            { x: 860, y: -180, w: 50, h: 8, material: 'wood' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 10 — THE MEGA CASTLE: Ultimate fortress, 500px tall
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'yellow', 'black', 'red', 'black', 'yellow', 'red', 'black'],
        pigs: [
            // Ground floor
            { x: 620, y: -30, radius: 18 },
            { x: 700, y: -30, radius: 22 },
            { x: 780, y: -30, radius: 18 },
            // Second floor
            { x: 650, y: -145, radius: 16 },
            { x: 750, y: -145, radius: 16 },
            // Third floor
            { x: 700, y: -250, radius: 18 },
            // Fourth floor
            { x: 680, y: -350, radius: 15 },
            { x: 720, y: -350, radius: 15 },
            // Throne room
            { x: 700, y: -440, radius: 20 },
            // Crown
            { x: 700, y: -520, radius: 14 },
        ],
        blocks: [
            // === MASSIVE BASE ===
            { x: 570, y: -30, w: 24, h: 110, material: 'stone' },
            { x: 660, y: -30, w: 24, h: 110, material: 'stone' },
            { x: 740, y: -30, w: 24, h: 110, material: 'stone' },
            { x: 830, y: -30, w: 24, h: 110, material: 'stone' },
            { x: 615, y: -95, w: 115, h: 18, material: 'stone' },
            { x: 700, y: -95, w: 105, h: 18, material: 'stone' },
            { x: 785, y: -95, w: 115, h: 18, material: 'stone' },

            // === SECOND FLOOR ===
            { x: 600, y: -115, w: 20, h: 80, material: 'stone' },
            { x: 700, y: -115, w: 20, h: 80, material: 'stone' },
            { x: 800, y: -115, w: 20, h: 80, material: 'stone' },
            { x: 650, y: -165, w: 120, h: 16, material: 'stone' },
            { x: 750, y: -165, w: 120, h: 16, material: 'stone' },

            // === THIRD FLOOR ===
            { x: 630, y: -185, w: 18, h: 80, material: 'wood' },
            { x: 770, y: -185, w: 18, h: 80, material: 'wood' },
            { x: 700, y: -185, w: 16, h: 70, material: 'wood' },
            { x: 700, y: -235, w: 160, h: 14, material: 'stone' },

            // === FOURTH FLOOR ===
            { x: 650, y: -255, w: 16, h: 70, material: 'wood' },
            { x: 750, y: -255, w: 16, h: 70, material: 'wood' },
            { x: 700, y: -300, w: 120, h: 14, material: 'wood' },

            // === FIFTH FLOOR ===
            { x: 665, y: -320, w: 14, h: 60, material: 'wood' },
            { x: 735, y: -320, w: 14, h: 60, material: 'wood' },
            { x: 700, y: -360, w: 90, h: 12, material: 'wood' },

            // === THRONE ROOM ===
            { x: 672, y: -375, w: 14, h: 60, material: 'wood' },
            { x: 728, y: -375, w: 14, h: 60, material: 'wood' },
            { x: 700, y: -415, w: 75, h: 12, material: 'stone' },

            // === TOWER TOP ===
            { x: 680, y: -430, w: 12, h: 50, material: 'ice' },
            { x: 720, y: -430, w: 12, h: 50, material: 'ice' },
            { x: 700, y: -465, w: 60, h: 10, material: 'ice' },
            { x: 688, y: -480, w: 10, h: 40, material: 'ice' },
            { x: 712, y: -480, w: 10, h: 40, material: 'ice' },
            { x: 700, y: -510, w: 45, h: 10, material: 'ice' },

            // === CROWN SPIRE ===
            { x: 694, y: -525, w: 8, h: 40, material: 'ice' },
            { x: 706, y: -525, w: 8, h: 40, material: 'ice' },
            { x: 700, y: -555, w: 30, h: 8, material: 'ice' },
            { x: 700, y: -570, w: 6, h: 20, material: 'ice' },

            // === OUTER BATTLEMENTS ===
            { x: 540, y: -15, w: 16, h: 80, material: 'stone' },
            { x: 860, y: -15, w: 16, h: 80, material: 'stone' },
            { x: 540, y: -65, w: 40, h: 12, material: 'stone' },
            { x: 860, y: -65, w: 40, h: 12, material: 'stone' },
        ]
    },
];

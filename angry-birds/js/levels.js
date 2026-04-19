// Level definitions — dense, packed structures with mixed materials
// All blocks start asleep (frozen) until the bird hits
// y values relative to ground (negative = above)
// Materials: wood (brown), stone (gray), ice (blue), steel (dark)

// Helper: build a floor (two pillars + beam)
function floor(cx, y, span, pillarH, pillarMat, beamMat) {
    const half = span / 2;
    return [
        { x: cx - half, y: y, w: 16, h: pillarH, material: pillarMat },
        { x: cx + half, y: y, w: 16, h: pillarH, material: pillarMat },
        { x: cx, y: y - pillarH / 2 - 6, w: span + 20, h: 14, material: beamMat },
    ];
}

// Helper: stack floors into a tower
function tower(cx, baseY, floors, span, shrink = 4) {
    const blocks = [];
    let y = baseY;
    for (let i = 0; i < floors.length; i++) {
        const f = floors[i];
        const s = span - i * shrink;
        const h = f.h || 70;
        blocks.push(...floor(cx, y, s, h, f.pillar, f.beam));
        y = y - h / 2 - 6 - h / 2 - 4;
    }
    return blocks;
}

export const LEVELS = [
    // ═══════════════════════════════════════════════════════════
    // Level 1 — WOOD TOWER: 5-story solid wood tower
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'red', 'yellow'],
        pigs: [
            { x: 700, y: -30, radius: 18 },
            { x: 700, y: -110, radius: 16 },
            { x: 700, y: -190, radius: 15 },
            { x: 700, y: -270, radius: 14 },
        ],
        blocks: [
            // Floor 1 — thick base
            { x: 660, y: -20, w: 18, h: 85, material: 'wood' },
            { x: 700, y: -20, w: 18, h: 85, material: 'wood' },
            { x: 740, y: -20, w: 18, h: 85, material: 'wood' },
            { x: 700, y: -72, w: 110, h: 16, material: 'wood' },
            // Floor 2
            { x: 668, y: -90, w: 16, h: 70, material: 'wood' },
            { x: 732, y: -90, w: 16, h: 70, material: 'wood' },
            { x: 700, y: -90, w: 12, h: 70, material: 'wood' },
            { x: 700, y: -135, w: 90, h: 14, material: 'wood' },
            // Floor 3
            { x: 672, y: -150, w: 14, h: 65, material: 'wood' },
            { x: 728, y: -150, w: 14, h: 65, material: 'wood' },
            { x: 700, y: -192, w: 80, h: 12, material: 'wood' },
            // Floor 4
            { x: 676, y: -205, w: 14, h: 60, material: 'wood' },
            { x: 724, y: -205, w: 14, h: 60, material: 'wood' },
            { x: 700, y: -245, w: 70, h: 12, material: 'wood' },
            // Floor 5 — top
            { x: 682, y: -258, w: 12, h: 55, material: 'wood' },
            { x: 718, y: -258, w: 12, h: 55, material: 'wood' },
            { x: 700, y: -295, w: 55, h: 10, material: 'wood' },
            // Cap
            { x: 690, y: -308, w: 10, h: 30, material: 'wood' },
            { x: 710, y: -308, w: 10, h: 30, material: 'wood' },
            { x: 700, y: -330, w: 35, h: 8, material: 'wood' },
            // Fill blocks between pillars (density)
            { x: 700, y: -40, w: 40, h: 10, material: 'wood' },
            { x: 700, y: -55, w: 40, h: 10, material: 'wood' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 2 — TWIN KEEPS: Two dense towers with bridge
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'red', 'yellow', 'red'],
        pigs: [
            { x: 580, y: -30, radius: 18 },
            { x: 580, y: -140, radius: 16 },
            { x: 580, y: -250, radius: 14 },
            { x: 780, y: -30, radius: 18 },
            { x: 780, y: -140, radius: 16 },
            { x: 780, y: -250, radius: 14 },
        ],
        blocks: [
            // === Left Tower ===
            { x: 545, y: -20, w: 18, h: 85, material: 'wood' },
            { x: 580, y: -20, w: 16, h: 85, material: 'wood' },
            { x: 615, y: -20, w: 18, h: 85, material: 'wood' },
            { x: 580, y: -72, w: 95, h: 14, material: 'stone' },
            { x: 550, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 580, y: -90, w: 12, h: 70, material: 'wood' },
            { x: 610, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 580, y: -135, w: 85, h: 12, material: 'stone' },
            { x: 555, y: -150, w: 14, h: 65, material: 'wood' },
            { x: 605, y: -150, w: 14, h: 65, material: 'wood' },
            { x: 580, y: -192, w: 75, h: 12, material: 'wood' },
            { x: 560, y: -208, w: 12, h: 60, material: 'wood' },
            { x: 600, y: -208, w: 12, h: 60, material: 'wood' },
            { x: 580, y: -248, w: 60, h: 10, material: 'wood' },
            { x: 568, y: -260, w: 10, h: 35, material: 'wood' },
            { x: 592, y: -260, w: 10, h: 35, material: 'wood' },
            { x: 580, y: -285, w: 45, h: 8, material: 'wood' },
            // Fill
            { x: 580, y: -45, w: 30, h: 12, material: 'wood' },
            { x: 580, y: -115, w: 25, h: 10, material: 'wood' },

            // === Right Tower ===
            { x: 745, y: -20, w: 18, h: 85, material: 'wood' },
            { x: 780, y: -20, w: 16, h: 85, material: 'wood' },
            { x: 815, y: -20, w: 18, h: 85, material: 'wood' },
            { x: 780, y: -72, w: 95, h: 14, material: 'stone' },
            { x: 750, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 780, y: -90, w: 12, h: 70, material: 'wood' },
            { x: 810, y: -90, w: 14, h: 70, material: 'wood' },
            { x: 780, y: -135, w: 85, h: 12, material: 'stone' },
            { x: 755, y: -150, w: 14, h: 65, material: 'wood' },
            { x: 805, y: -150, w: 14, h: 65, material: 'wood' },
            { x: 780, y: -192, w: 75, h: 12, material: 'wood' },
            { x: 760, y: -208, w: 12, h: 60, material: 'wood' },
            { x: 800, y: -208, w: 12, h: 60, material: 'wood' },
            { x: 780, y: -248, w: 60, h: 10, material: 'wood' },
            { x: 768, y: -260, w: 10, h: 35, material: 'wood' },
            { x: 792, y: -260, w: 10, h: 35, material: 'wood' },
            { x: 780, y: -285, w: 45, h: 8, material: 'wood' },
            // Fill
            { x: 780, y: -45, w: 30, h: 12, material: 'wood' },
            { x: 780, y: -115, w: 25, h: 10, material: 'wood' },

            // === Skybridge ===
            { x: 680, y: -135, w: 120, h: 16, material: 'stone' },
            { x: 650, y: -100, w: 14, h: 60, material: 'stone' },
            { x: 710, y: -100, w: 14, h: 60, material: 'stone' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 3 — ICE PYRAMID: Dense layered ice
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'yellow', 'red', 'red'],
        pigs: [
            { x: 640, y: -25, radius: 16 },
            { x: 720, y: -25, radius: 16 },
            { x: 800, y: -25, radius: 16 },
            { x: 680, y: -100, radius: 16 },
            { x: 760, y: -100, radius: 16 },
            { x: 720, y: -180, radius: 15 },
            { x: 720, y: -250, radius: 14 },
        ],
        blocks: [
            // Row 1 — 6 pillars
            { x: 580, y: -20, w: 14, h: 85, material: 'ice' },
            { x: 620, y: -20, w: 14, h: 85, material: 'ice' },
            { x: 660, y: -20, w: 14, h: 85, material: 'ice' },
            { x: 740, y: -20, w: 14, h: 85, material: 'ice' },
            { x: 780, y: -20, w: 14, h: 85, material: 'ice' },
            { x: 860, y: -20, w: 14, h: 85, material: 'ice' },
            // Row 1 beams
            { x: 620, y: -72, w: 95, h: 12, material: 'ice' },
            { x: 700, y: -72, w: 95, h: 12, material: 'ice' },
            { x: 780, y: -72, w: 95, h: 12, material: 'ice' },
            { x: 840, y: -72, w: 70, h: 12, material: 'ice' },
            // Fill blocks
            { x: 640, y: -35, w: 20, h: 12, material: 'ice' },
            { x: 720, y: -35, w: 20, h: 12, material: 'ice' },
            { x: 800, y: -35, w: 20, h: 12, material: 'ice' },
            { x: 640, y: -55, w: 20, h: 12, material: 'ice' },
            { x: 720, y: -55, w: 20, h: 12, material: 'ice' },
            { x: 800, y: -55, w: 20, h: 12, material: 'ice' },

            // Row 2 — 5 pillars
            { x: 620, y: -88, w: 14, h: 65, material: 'ice' },
            { x: 660, y: -88, w: 14, h: 65, material: 'ice' },
            { x: 720, y: -88, w: 14, h: 65, material: 'ice' },
            { x: 780, y: -88, w: 14, h: 65, material: 'ice' },
            { x: 820, y: -88, w: 14, h: 65, material: 'ice' },
            { x: 660, y: -130, w: 60, h: 12, material: 'ice' },
            { x: 720, y: -130, w: 80, h: 12, material: 'ice' },
            { x: 780, y: -130, w: 60, h: 12, material: 'ice' },
            // Fill
            { x: 680, y: -105, w: 18, h: 10, material: 'ice' },
            { x: 760, y: -105, w: 18, h: 10, material: 'ice' },

            // Row 3 — 3 pillars
            { x: 670, y: -148, w: 14, h: 60, material: 'ice' },
            { x: 720, y: -148, w: 14, h: 60, material: 'ice' },
            { x: 770, y: -148, w: 14, h: 60, material: 'ice' },
            { x: 720, y: -188, w: 120, h: 12, material: 'ice' },

            // Row 4 — 2 pillars
            { x: 695, y: -202, w: 12, h: 50, material: 'ice' },
            { x: 745, y: -202, w: 12, h: 50, material: 'ice' },
            { x: 720, y: -237, w: 70, h: 10, material: 'ice' },

            // Peak
            { x: 706, y: -250, w: 10, h: 40, material: 'ice' },
            { x: 734, y: -250, w: 10, h: 40, material: 'ice' },
            { x: 720, y: -278, w: 45, h: 8, material: 'ice' },
            { x: 720, y: -290, w: 8, h: 25, material: 'ice' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 4 — STONE BUNKER: Thick stone walls, tight chambers
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['yellow', 'red', 'black', 'red', 'yellow'],
        pigs: [
            { x: 650, y: -30, radius: 18 },
            { x: 750, y: -30, radius: 18 },
            { x: 650, y: -130, radius: 16 },
            { x: 750, y: -130, radius: 16 },
            { x: 700, y: -230, radius: 18 },
            { x: 700, y: -320, radius: 16 },
        ],
        blocks: [
            // Thick outer walls
            { x: 590, y: -40, w: 24, h: 130, material: 'stone' },
            { x: 810, y: -40, w: 24, h: 130, material: 'stone' },
            // Center divider
            { x: 700, y: -35, w: 20, h: 120, material: 'stone' },
            // Floor 1 ceiling
            { x: 645, y: -105, w: 130, h: 18, material: 'stone' },
            { x: 755, y: -105, w: 130, h: 18, material: 'stone' },
            // Cross braces floor 1
            { x: 630, y: -50, w: 50, h: 10, material: 'stone' },
            { x: 770, y: -50, w: 50, h: 10, material: 'stone' },
            { x: 630, y: -70, w: 50, h: 10, material: 'wood' },
            { x: 770, y: -70, w: 50, h: 10, material: 'wood' },
            // Floor 2 walls
            { x: 615, y: -125, w: 20, h: 80, material: 'stone' },
            { x: 700, y: -125, w: 18, h: 80, material: 'stone' },
            { x: 785, y: -125, w: 20, h: 80, material: 'stone' },
            // Floor 2 fill
            { x: 655, y: -130, w: 40, h: 10, material: 'wood' },
            { x: 745, y: -130, w: 40, h: 10, material: 'wood' },
            { x: 655, y: -150, w: 40, h: 10, material: 'wood' },
            { x: 745, y: -150, w: 40, h: 10, material: 'wood' },
            // Floor 2 ceiling
            { x: 700, y: -175, w: 200, h: 18, material: 'stone' },
            // Floor 3 — narrower
            { x: 650, y: -200, w: 18, h: 70, material: 'wood' },
            { x: 750, y: -200, w: 18, h: 70, material: 'wood' },
            { x: 700, y: -200, w: 14, h: 70, material: 'wood' },
            { x: 700, y: -245, w: 125, h: 14, material: 'stone' },
            // Floor 4
            { x: 668, y: -262, w: 14, h: 60, material: 'wood' },
            { x: 732, y: -262, w: 14, h: 60, material: 'wood' },
            { x: 700, y: -302, w: 85, h: 12, material: 'wood' },
            // Top
            { x: 682, y: -315, w: 12, h: 40, material: 'wood' },
            { x: 718, y: -315, w: 12, h: 40, material: 'wood' },
            { x: 700, y: -345, w: 55, h: 10, material: 'wood' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 5 — CITY BLOCK: Three dense buildings, mixed materials
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'yellow', 'black', 'red', 'red', 'yellow'],
        pigs: [
            // Building A
            { x: 520, y: -25, radius: 16 },
            { x: 520, y: -105, radius: 14 },
            { x: 520, y: -185, radius: 14 },
            // Building B
            { x: 700, y: -25, radius: 18 },
            { x: 700, y: -130, radius: 16 },
            { x: 700, y: -240, radius: 15 },
            { x: 700, y: -340, radius: 14 },
            // Building C
            { x: 870, y: -25, radius: 16 },
            { x: 870, y: -105, radius: 14 },
        ],
        blocks: [
            // === Building A (ice, 3 floors) ===
            { x: 488, y: -20, w: 16, h: 85, material: 'ice' },
            { x: 520, y: -20, w: 14, h: 85, material: 'ice' },
            { x: 552, y: -20, w: 16, h: 85, material: 'ice' },
            { x: 520, y: -72, w: 85, h: 12, material: 'ice' },
            { x: 505, y: -40, w: 16, h: 10, material: 'ice' },
            { x: 535, y: -40, w: 16, h: 10, material: 'ice' },
            { x: 493, y: -88, w: 14, h: 60, material: 'ice' },
            { x: 547, y: -88, w: 14, h: 60, material: 'ice' },
            { x: 520, y: -128, w: 75, h: 12, material: 'ice' },
            { x: 520, y: -100, w: 25, h: 10, material: 'ice' },
            { x: 498, y: -148, w: 12, h: 55, material: 'ice' },
            { x: 542, y: -148, w: 12, h: 55, material: 'ice' },
            { x: 520, y: -185, w: 65, h: 10, material: 'ice' },
            { x: 506, y: -198, w: 10, h: 35, material: 'ice' },
            { x: 534, y: -198, w: 10, h: 35, material: 'ice' },
            { x: 520, y: -222, w: 45, h: 8, material: 'ice' },

            // === Building B (stone+wood, tallest, 5 floors) ===
            { x: 660, y: -20, w: 20, h: 85, material: 'stone' },
            { x: 700, y: -20, w: 18, h: 85, material: 'stone' },
            { x: 740, y: -20, w: 20, h: 85, material: 'stone' },
            { x: 700, y: -72, w: 105, h: 16, material: 'stone' },
            { x: 680, y: -40, w: 18, h: 10, material: 'wood' },
            { x: 720, y: -40, w: 18, h: 10, material: 'wood' },
            { x: 680, y: -55, w: 18, h: 10, material: 'wood' },
            { x: 720, y: -55, w: 18, h: 10, material: 'wood' },
            { x: 668, y: -92, w: 16, h: 65, material: 'wood' },
            { x: 732, y: -92, w: 16, h: 65, material: 'wood' },
            { x: 700, y: -92, w: 14, h: 65, material: 'wood' },
            { x: 700, y: -134, w: 90, h: 14, material: 'stone' },
            { x: 672, y: -152, w: 14, h: 60, material: 'wood' },
            { x: 728, y: -152, w: 14, h: 60, material: 'wood' },
            { x: 700, y: -192, w: 80, h: 12, material: 'wood' },
            { x: 700, y: -162, w: 25, h: 10, material: 'wood' },
            { x: 678, y: -210, w: 14, h: 55, material: 'wood' },
            { x: 722, y: -210, w: 14, h: 55, material: 'wood' },
            { x: 700, y: -247, w: 65, h: 12, material: 'stone' },
            { x: 684, y: -262, w: 12, h: 45, material: 'wood' },
            { x: 716, y: -262, w: 12, h: 45, material: 'wood' },
            { x: 700, y: -294, w: 55, h: 10, material: 'wood' },
            { x: 690, y: -308, w: 10, h: 40, material: 'wood' },
            { x: 710, y: -308, w: 10, h: 40, material: 'wood' },
            { x: 700, y: -338, w: 40, h: 8, material: 'wood' },
            { x: 700, y: -350, w: 8, h: 20, material: 'wood' },

            // === Building C (wood, 2 floors) ===
            { x: 838, y: -20, w: 16, h: 85, material: 'wood' },
            { x: 870, y: -20, w: 14, h: 85, material: 'wood' },
            { x: 902, y: -20, w: 16, h: 85, material: 'wood' },
            { x: 870, y: -72, w: 85, h: 12, material: 'wood' },
            { x: 855, y: -40, w: 16, h: 10, material: 'wood' },
            { x: 885, y: -40, w: 16, h: 10, material: 'wood' },
            { x: 845, y: -88, w: 14, h: 60, material: 'wood' },
            { x: 895, y: -88, w: 14, h: 60, material: 'wood' },
            { x: 870, y: -128, w: 70, h: 10, material: 'wood' },
            { x: 856, y: -140, w: 10, h: 30, material: 'wood' },
            { x: 884, y: -140, w: 10, h: 30, material: 'wood' },
            { x: 870, y: -162, w: 45, h: 8, material: 'wood' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 6 — STEEL FORTRESS: First steel blocks appear
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'black', 'yellow', 'red', 'black'],
        pigs: [
            { x: 700, y: -30, radius: 22 },
            { x: 650, y: -140, radius: 16 },
            { x: 750, y: -140, radius: 16 },
            { x: 700, y: -250, radius: 18 },
            { x: 700, y: -350, radius: 16 },
            { x: 700, y: -430, radius: 14 },
        ],
        blocks: [
            // Steel-reinforced base
            { x: 620, y: -35, w: 26, h: 120, material: 'steel' },
            { x: 780, y: -35, w: 26, h: 120, material: 'steel' },
            { x: 700, y: -35, w: 22, h: 120, material: 'stone' },
            { x: 700, y: -105, w: 190, h: 20, material: 'steel' },
            // Floor 1 fill
            { x: 660, y: -45, w: 30, h: 12, material: 'stone' },
            { x: 740, y: -45, w: 30, h: 12, material: 'stone' },
            { x: 660, y: -65, w: 30, h: 12, material: 'wood' },
            { x: 740, y: -65, w: 30, h: 12, material: 'wood' },
            { x: 660, y: -85, w: 30, h: 12, material: 'wood' },
            { x: 740, y: -85, w: 30, h: 12, material: 'wood' },
            // Floor 2
            { x: 640, y: -128, w: 20, h: 75, material: 'stone' },
            { x: 760, y: -128, w: 20, h: 75, material: 'stone' },
            { x: 700, y: -128, w: 16, h: 75, material: 'wood' },
            { x: 700, y: -175, w: 145, h: 16, material: 'steel' },
            { x: 670, y: -140, w: 20, h: 10, material: 'wood' },
            { x: 730, y: -140, w: 20, h: 10, material: 'wood' },
            // Floor 3
            { x: 660, y: -198, w: 16, h: 70, material: 'wood' },
            { x: 740, y: -198, w: 16, h: 70, material: 'wood' },
            { x: 700, y: -198, w: 14, h: 70, material: 'wood' },
            { x: 700, y: -243, w: 105, h: 14, material: 'stone' },
            // Floor 4
            { x: 672, y: -260, w: 14, h: 60, material: 'wood' },
            { x: 728, y: -260, w: 14, h: 60, material: 'wood' },
            { x: 700, y: -300, w: 80, h: 12, material: 'wood' },
            { x: 700, y: -270, w: 20, h: 10, material: 'wood' },
            // Floor 5
            { x: 680, y: -318, w: 12, h: 55, material: 'wood' },
            { x: 720, y: -318, w: 12, h: 55, material: 'wood' },
            { x: 700, y: -355, w: 60, h: 10, material: 'wood' },
            // Top
            { x: 688, y: -370, w: 10, h: 45, material: 'ice' },
            { x: 712, y: -370, w: 10, h: 45, material: 'ice' },
            { x: 700, y: -402, w: 45, h: 10, material: 'ice' },
            { x: 694, y: -415, w: 8, h: 35, material: 'ice' },
            { x: 706, y: -415, w: 8, h: 35, material: 'ice' },
            { x: 700, y: -440, w: 30, h: 8, material: 'ice' },
            // Buttresses
            { x: 575, y: -15, w: 18, h: 80, material: 'stone' },
            { x: 825, y: -15, w: 18, h: 80, material: 'stone' },
            { x: 598, y: -50, w: 40, h: 12, material: 'stone' },
            { x: 802, y: -50, w: 40, h: 12, material: 'stone' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 7 — THE DAM: Massive layered wall + village
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['black', 'red', 'black', 'yellow', 'red', 'red'],
        pigs: [
            { x: 810, y: -25, radius: 18 },
            { x: 870, y: -25, radius: 16 },
            { x: 930, y: -25, radius: 16 },
            { x: 840, y: -100, radius: 15 },
            { x: 900, y: -100, radius: 15 },
            { x: 870, y: -175, radius: 14 },
        ],
        blocks: [
            // Dam layer 1
            { x: 620, y: -60, w: 32, h: 170, material: 'stone' },
            // Dam layer 2
            { x: 658, y: -50, w: 32, h: 150, material: 'stone' },
            // Dam layer 3
            { x: 696, y: -40, w: 32, h: 130, material: 'steel' },
            // Dam cross-braces
            { x: 640, y: -120, w: 60, h: 14, material: 'stone' },
            { x: 680, y: -85, w: 50, h: 14, material: 'steel' },
            // Dam buttress
            { x: 585, y: -30, w: 22, h: 110, material: 'stone' },
            { x: 604, y: -55, w: 40, h: 14, material: 'stone' },
            { x: 604, y: -80, w: 35, h: 12, material: 'stone' },
            // Dam top walkway
            { x: 660, y: -155, w: 130, h: 14, material: 'stone' },
            { x: 616, y: -120, w: 14, h: 85, material: 'stone' },
            { x: 616, y: -172, w: 30, h: 14, material: 'stone' },

            // Pig village
            { x: 785, y: -15, w: 14, h: 75, material: 'wood' },
            { x: 835, y: -15, w: 14, h: 75, material: 'wood' },
            { x: 810, y: -62, w: 65, h: 10, material: 'wood' },
            { x: 810, y: -35, w: 25, h: 10, material: 'wood' },
            { x: 860, y: -15, w: 14, h: 75, material: 'wood' },
            { x: 940, y: -15, w: 14, h: 75, material: 'wood' },
            { x: 900, y: -62, w: 100, h: 10, material: 'wood' },
            { x: 880, y: -35, w: 20, h: 10, material: 'wood' },
            { x: 920, y: -35, w: 20, h: 10, material: 'wood' },
            { x: 810, y: -78, w: 12, h: 55, material: 'wood' },
            { x: 870, y: -78, w: 12, h: 55, material: 'wood' },
            { x: 930, y: -78, w: 12, h: 55, material: 'wood' },
            { x: 840, y: -115, w: 80, h: 10, material: 'wood' },
            { x: 900, y: -115, w: 80, h: 10, material: 'wood' },
            { x: 840, y: -90, w: 25, h: 10, material: 'wood' },
            { x: 900, y: -90, w: 25, h: 10, material: 'wood' },
            { x: 850, y: -130, w: 10, h: 50, material: 'wood' },
            { x: 890, y: -130, w: 10, h: 50, material: 'wood' },
            { x: 870, y: -165, w: 60, h: 10, material: 'wood' },
            { x: 860, y: -178, w: 8, h: 30, material: 'wood' },
            { x: 880, y: -178, w: 8, h: 30, material: 'wood' },
            { x: 870, y: -200, w: 35, h: 8, material: 'wood' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 8 — CITADEL: Concentric rings, all stone+steel
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['yellow', 'red', 'black', 'red', 'yellow', 'black'],
        pigs: [
            { x: 580, y: -25, radius: 16 },
            { x: 820, y: -25, radius: 16 },
            { x: 640, y: -115, radius: 15 },
            { x: 760, y: -115, radius: 15 },
            { x: 700, y: -30, radius: 20 },
            { x: 700, y: -170, radius: 18 },
            { x: 700, y: -280, radius: 16 },
            { x: 700, y: -370, radius: 14 },
        ],
        blocks: [
            // Outer wall — stone
            { x: 530, y: -25, w: 22, h: 100, material: 'stone' },
            { x: 870, y: -25, w: 22, h: 100, material: 'stone' },
            { x: 560, y: -15, w: 14, h: 80, material: 'stone' },
            { x: 840, y: -15, w: 14, h: 80, material: 'stone' },
            { x: 570, y: -65, w: 50, h: 12, material: 'stone' },
            { x: 832, y: -65, w: 50, h: 12, material: 'stone' },
            { x: 610, y: -15, w: 14, h: 80, material: 'wood' },
            { x: 790, y: -15, w: 14, h: 80, material: 'wood' },
            { x: 580, y: -35, w: 20, h: 10, material: 'wood' },
            { x: 820, y: -35, w: 20, h: 10, material: 'wood' },

            // Middle wall — stone
            { x: 610, y: -85, w: 20, h: 90, material: 'steel' },
            { x: 790, y: -85, w: 20, h: 90, material: 'steel' },
            { x: 700, y: -140, w: 200, h: 16, material: 'steel' },
            { x: 645, y: -95, w: 14, h: 65, material: 'stone' },
            { x: 755, y: -95, w: 14, h: 65, material: 'stone' },
            { x: 645, y: -105, w: 25, h: 10, material: 'wood' },
            { x: 755, y: -105, w: 25, h: 10, material: 'wood' },

            // Inner keep — tallest
            { x: 665, y: -20, w: 20, h: 90, material: 'stone' },
            { x: 735, y: -20, w: 20, h: 90, material: 'stone' },
            { x: 700, y: -20, w: 16, h: 90, material: 'wood' },
            { x: 700, y: -75, w: 95, h: 16, material: 'stone' },
            { x: 683, y: -40, w: 16, h: 10, material: 'wood' },
            { x: 717, y: -40, w: 16, h: 10, material: 'wood' },
            // Keep floor 2
            { x: 672, y: -155, w: 18, h: 75, material: 'stone' },
            { x: 728, y: -155, w: 18, h: 75, material: 'stone' },
            { x: 700, y: -155, w: 14, h: 75, material: 'wood' },
            { x: 700, y: -202, w: 80, h: 14, material: 'steel' },
            // Keep floor 3
            { x: 678, y: -220, w: 14, h: 60, material: 'wood' },
            { x: 722, y: -220, w: 14, h: 60, material: 'wood' },
            { x: 700, y: -260, w: 65, h: 12, material: 'stone' },
            { x: 700, y: -235, w: 20, h: 10, material: 'wood' },
            // Keep floor 4
            { x: 684, y: -275, w: 12, h: 55, material: 'wood' },
            { x: 716, y: -275, w: 12, h: 55, material: 'wood' },
            { x: 700, y: -312, w: 55, h: 10, material: 'wood' },
            // Tower top
            { x: 690, y: -325, w: 10, h: 45, material: 'ice' },
            { x: 710, y: -325, w: 10, h: 45, material: 'ice' },
            { x: 700, y: -357, w: 40, h: 8, material: 'ice' },
            { x: 696, y: -370, w: 8, h: 30, material: 'ice' },
            { x: 704, y: -370, w: 8, h: 30, material: 'ice' },
            { x: 700, y: -392, w: 25, h: 6, material: 'ice' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 9 — PIG METROPOLIS: 4 dense towers, packed city
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['black', 'red', 'yellow', 'black', 'red', 'yellow', 'red'],
        pigs: [
            { x: 500, y: -25, radius: 16 },
            { x: 500, y: -120, radius: 14 },
            { x: 620, y: -25, radius: 18 },
            { x: 620, y: -140, radius: 16 },
            { x: 620, y: -260, radius: 14 },
            { x: 740, y: -25, radius: 18 },
            { x: 740, y: -140, radius: 16 },
            { x: 740, y: -230, radius: 14 },
            { x: 870, y: -25, radius: 16 },
            { x: 870, y: -120, radius: 14 },
        ],
        blocks: [
            // Tower A (ice, medium)
            { x: 470, y: -20, w: 16, h: 85, material: 'ice' },
            { x: 500, y: -20, w: 14, h: 85, material: 'ice' },
            { x: 530, y: -20, w: 16, h: 85, material: 'ice' },
            { x: 500, y: -72, w: 80, h: 12, material: 'ice' },
            { x: 486, y: -40, w: 14, h: 10, material: 'ice' },
            { x: 514, y: -40, w: 14, h: 10, material: 'ice' },
            { x: 480, y: -88, w: 12, h: 55, material: 'ice' },
            { x: 520, y: -88, w: 12, h: 55, material: 'ice' },
            { x: 500, y: -125, w: 60, h: 10, material: 'ice' },
            { x: 500, y: -100, w: 18, h: 10, material: 'ice' },
            { x: 488, y: -138, w: 10, h: 40, material: 'ice' },
            { x: 512, y: -138, w: 10, h: 40, material: 'ice' },
            { x: 500, y: -165, w: 45, h: 8, material: 'ice' },

            // Tower B (stone+wood, tallest)
            { x: 585, y: -20, w: 18, h: 85, material: 'stone' },
            { x: 620, y: -20, w: 16, h: 85, material: 'stone' },
            { x: 655, y: -20, w: 18, h: 85, material: 'stone' },
            { x: 620, y: -72, w: 90, h: 14, material: 'stone' },
            { x: 603, y: -40, w: 16, h: 10, material: 'wood' },
            { x: 637, y: -40, w: 16, h: 10, material: 'wood' },
            { x: 603, y: -55, w: 16, h: 10, material: 'wood' },
            { x: 637, y: -55, w: 16, h: 10, material: 'wood' },
            { x: 594, y: -92, w: 14, h: 65, material: 'wood' },
            { x: 646, y: -92, w: 14, h: 65, material: 'wood' },
            { x: 620, y: -92, w: 12, h: 65, material: 'wood' },
            { x: 620, y: -134, w: 75, h: 12, material: 'stone' },
            { x: 600, y: -152, w: 12, h: 55, material: 'wood' },
            { x: 640, y: -152, w: 12, h: 55, material: 'wood' },
            { x: 620, y: -189, w: 60, h: 10, material: 'wood' },
            { x: 620, y: -165, w: 18, h: 10, material: 'wood' },
            { x: 606, y: -202, w: 10, h: 45, material: 'wood' },
            { x: 634, y: -202, w: 10, h: 45, material: 'wood' },
            { x: 620, y: -234, w: 50, h: 8, material: 'wood' },
            { x: 610, y: -245, w: 8, h: 35, material: 'wood' },
            { x: 630, y: -245, w: 8, h: 35, material: 'wood' },
            { x: 620, y: -270, w: 35, h: 6, material: 'wood' },

            // Tower C (wood, tall)
            { x: 705, y: -20, w: 18, h: 85, material: 'wood' },
            { x: 740, y: -20, w: 16, h: 85, material: 'wood' },
            { x: 775, y: -20, w: 18, h: 85, material: 'wood' },
            { x: 740, y: -72, w: 90, h: 12, material: 'wood' },
            { x: 723, y: -40, w: 16, h: 10, material: 'wood' },
            { x: 757, y: -40, w: 16, h: 10, material: 'wood' },
            { x: 714, y: -90, w: 14, h: 60, material: 'wood' },
            { x: 766, y: -90, w: 14, h: 60, material: 'wood' },
            { x: 740, y: -90, w: 12, h: 60, material: 'wood' },
            { x: 740, y: -130, w: 75, h: 10, material: 'stone' },
            { x: 720, y: -148, w: 12, h: 55, material: 'wood' },
            { x: 760, y: -148, w: 12, h: 55, material: 'wood' },
            { x: 740, y: -185, w: 60, h: 10, material: 'wood' },
            { x: 740, y: -155, w: 18, h: 10, material: 'wood' },
            { x: 728, y: -198, w: 10, h: 40, material: 'wood' },
            { x: 752, y: -198, w: 10, h: 40, material: 'wood' },
            { x: 740, y: -225, w: 45, h: 8, material: 'wood' },
            { x: 740, y: -240, w: 8, h: 20, material: 'wood' },

            // Tower D (wood, short)
            { x: 840, y: -20, w: 16, h: 85, material: 'wood' },
            { x: 870, y: -20, w: 14, h: 85, material: 'wood' },
            { x: 900, y: -20, w: 16, h: 85, material: 'wood' },
            { x: 870, y: -72, w: 80, h: 10, material: 'wood' },
            { x: 856, y: -40, w: 14, h: 10, material: 'wood' },
            { x: 884, y: -40, w: 14, h: 10, material: 'wood' },
            { x: 848, y: -88, w: 12, h: 55, material: 'wood' },
            { x: 892, y: -88, w: 12, h: 55, material: 'wood' },
            { x: 870, y: -125, w: 60, h: 10, material: 'wood' },
            { x: 870, y: -100, w: 18, h: 10, material: 'wood' },
            { x: 858, y: -138, w: 10, h: 35, material: 'wood' },
            { x: 882, y: -138, w: 10, h: 35, material: 'wood' },
            { x: 870, y: -162, w: 40, h: 8, material: 'wood' },
        ]
    },

    // ═══════════════════════════════════════════════════════════
    // Level 10 — MEGA FORTRESS: Steel-reinforced, 500px tall
    // ═══════════════════════════════════════════════════════════
    {
        birds: ['red', 'yellow', 'black', 'red', 'black', 'yellow', 'red', 'black'],
        pigs: [
            { x: 630, y: -30, radius: 18 },
            { x: 700, y: -30, radius: 22 },
            { x: 770, y: -30, radius: 18 },
            { x: 660, y: -145, radius: 16 },
            { x: 740, y: -145, radius: 16 },
            { x: 700, y: -250, radius: 18 },
            { x: 690, y: -350, radius: 15 },
            { x: 710, y: -350, radius: 15 },
            { x: 700, y: -440, radius: 18 },
            { x: 700, y: -520, radius: 14 },
        ],
        blocks: [
            // MASSIVE STEEL BASE
            { x: 575, y: -35, w: 28, h: 120, material: 'steel' },
            { x: 660, y: -35, w: 26, h: 120, material: 'steel' },
            { x: 740, y: -35, w: 26, h: 120, material: 'steel' },
            { x: 825, y: -35, w: 28, h: 120, material: 'steel' },
            { x: 618, y: -105, w: 115, h: 20, material: 'steel' },
            { x: 700, y: -105, w: 110, h: 20, material: 'steel' },
            { x: 782, y: -105, w: 115, h: 20, material: 'steel' },
            // Base fill — dense
            { x: 618, y: -40, w: 35, h: 12, material: 'stone' },
            { x: 700, y: -40, w: 40, h: 12, material: 'stone' },
            { x: 782, y: -40, w: 35, h: 12, material: 'stone' },
            { x: 618, y: -60, w: 35, h: 12, material: 'stone' },
            { x: 700, y: -60, w: 40, h: 12, material: 'stone' },
            { x: 782, y: -60, w: 35, h: 12, material: 'stone' },
            { x: 618, y: -80, w: 35, h: 12, material: 'wood' },
            { x: 700, y: -80, w: 40, h: 12, material: 'wood' },
            { x: 782, y: -80, w: 35, h: 12, material: 'wood' },

            // SECOND FLOOR — stone
            { x: 605, y: -120, w: 22, h: 80, material: 'stone' },
            { x: 700, y: -120, w: 22, h: 80, material: 'stone' },
            { x: 795, y: -120, w: 22, h: 80, material: 'stone' },
            { x: 650, y: -170, w: 115, h: 18, material: 'steel' },
            { x: 750, y: -170, w: 115, h: 18, material: 'steel' },
            { x: 650, y: -135, w: 50, h: 10, material: 'wood' },
            { x: 750, y: -135, w: 50, h: 10, material: 'wood' },
            { x: 650, y: -152, w: 50, h: 10, material: 'wood' },
            { x: 750, y: -152, w: 50, h: 10, material: 'wood' },

            // THIRD FLOOR — wood+stone
            { x: 635, y: -195, w: 20, h: 75, material: 'stone' },
            { x: 765, y: -195, w: 20, h: 75, material: 'stone' },
            { x: 700, y: -195, w: 18, h: 75, material: 'wood' },
            { x: 700, y: -242, w: 155, h: 16, material: 'steel' },
            { x: 668, y: -210, w: 25, h: 10, material: 'wood' },
            { x: 732, y: -210, w: 25, h: 10, material: 'wood' },
            { x: 668, y: -225, w: 25, h: 10, material: 'wood' },
            { x: 732, y: -225, w: 25, h: 10, material: 'wood' },

            // FOURTH FLOOR
            { x: 655, y: -262, w: 16, h: 65, material: 'wood' },
            { x: 745, y: -262, w: 16, h: 65, material: 'wood' },
            { x: 700, y: -262, w: 14, h: 65, material: 'wood' },
            { x: 700, y: -304, w: 115, h: 14, material: 'stone' },
            { x: 678, y: -275, w: 18, h: 10, material: 'wood' },
            { x: 722, y: -275, w: 18, h: 10, material: 'wood' },

            // FIFTH FLOOR
            { x: 668, y: -322, w: 14, h: 60, material: 'wood' },
            { x: 732, y: -322, w: 14, h: 60, material: 'wood' },
            { x: 700, y: -362, w: 85, h: 12, material: 'stone' },
            { x: 700, y: -338, w: 30, h: 10, material: 'wood' },

            // THRONE ROOM
            { x: 675, y: -378, w: 14, h: 55, material: 'wood' },
            { x: 725, y: -378, w: 14, h: 55, material: 'wood' },
            { x: 700, y: -415, w: 70, h: 12, material: 'steel' },
            { x: 700, y: -392, w: 22, h: 10, material: 'wood' },

            // TOWER TOP
            { x: 683, y: -430, w: 12, h: 45, material: 'ice' },
            { x: 717, y: -430, w: 12, h: 45, material: 'ice' },
            { x: 700, y: -462, w: 55, h: 10, material: 'ice' },
            { x: 700, y: -445, w: 16, h: 10, material: 'ice' },
            { x: 690, y: -478, w: 10, h: 40, material: 'ice' },
            { x: 710, y: -478, w: 10, h: 40, material: 'ice' },
            { x: 700, y: -508, w: 40, h: 10, material: 'ice' },

            // CROWN SPIRE
            { x: 694, y: -522, w: 8, h: 35, material: 'ice' },
            { x: 706, y: -522, w: 8, h: 35, material: 'ice' },
            { x: 700, y: -548, w: 25, h: 8, material: 'ice' },
            { x: 700, y: -562, w: 6, h: 20, material: 'ice' },

            // OUTER BATTLEMENTS
            { x: 540, y: -15, w: 18, h: 80, material: 'stone' },
            { x: 860, y: -15, w: 18, h: 80, material: 'stone' },
            { x: 540, y: -65, w: 45, h: 14, material: 'stone' },
            { x: 860, y: -65, w: 45, h: 14, material: 'stone' },
            { x: 540, y: -40, w: 20, h: 10, material: 'wood' },
            { x: 860, y: -40, w: 20, h: 10, material: 'wood' },
        ]
    },
];

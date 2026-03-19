import { LIGHTS_Y_ROW1, LIGHTS_Y_ROW2, LIGHTS_START_X, LIGHTS_END_X, COLORS, BULB_COLORS } from './constants.js';

const lights = [];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function initLights() {
    lights.length = 0;
    for (let i = 0; i < 26; i++) {
        const row = i < 13 ? 0 : 1;
        const indexInRow = i < 13 ? i : i - 13;
        const countInRow = i < 13 ? 13 : 13;
        const rowY = row === 0 ? LIGHTS_Y_ROW1 : LIGHTS_Y_ROW2;
        const x = LIGHTS_START_X + (indexInRow / (countInRow - 1)) * (LIGHTS_END_X - LIGHTS_START_X);

        lights.push({
            letter: LETTERS[i],
            x,
            y: rowY,
            color: BULB_COLORS[i % BULB_COLORS.length],
            flickerPhase: Math.random() * Math.PI * 2,
            flickerSpeed: 0.02 + Math.random() * 0.04,
        });
    }
}

export function updateLights(frameCount) {
    for (const light of lights) {
        light.flickerPhase += light.flickerSpeed;
    }
}

export function drawLights(ctx, guessedLetters, wrongLetters, drawFrame, mode) {
    // Draw wires
    ctx.strokeStyle = COLORS.WIRE;
    ctx.lineWidth = 2;

    // Row 1 wire
    ctx.beginPath();
    ctx.moveTo(LIGHTS_START_X - 10, LIGHTS_Y_ROW1);
    for (let i = 0; i < 13; i++) {
        const light = lights[i];
        ctx.lineTo(light.x, light.y + 3);
    }
    ctx.lineTo(LIGHTS_END_X + 10, LIGHTS_Y_ROW1);
    ctx.stroke();

    // Row 2 wire
    ctx.beginPath();
    ctx.moveTo(LIGHTS_START_X - 10, LIGHTS_Y_ROW2);
    for (let i = 13; i < 26; i++) {
        const light = lights[i];
        ctx.lineTo(light.x, light.y + 3);
    }
    ctx.lineTo(LIGHTS_END_X + 10, LIGHTS_Y_ROW2);
    ctx.stroke();

    // Draw each bulb
    for (const light of lights) {
        const isCorrect = guessedLetters && guessedLetters.has(light.letter) && !wrongLetters.has(light.letter);
        const isWrong = wrongLetters && wrongLetters.has(light.letter);

        let bulbColor, glowAlpha, bulbRadius;

        if (mode === 'win') {
            // Strobe rainbow
            const strobeIdx = (Math.floor(drawFrame / 4) + LETTERS.indexOf(light.letter)) % BULB_COLORS.length;
            bulbColor = BULB_COLORS[strobeIdx];
            glowAlpha = 0.6 + Math.sin(drawFrame * 0.3) * 0.3;
            bulbRadius = 6;
        } else if (mode === 'lose') {
            // Fade out
            const fadeAlpha = Math.max(0, 1 - (drawFrame % 180) / 120);
            bulbColor = light.color;
            glowAlpha = 0.1 * fadeAlpha;
            bulbRadius = 5;
        } else if (isCorrect) {
            // Bright steady glow
            bulbColor = '#20ff40';
            glowAlpha = 0.5 + Math.sin(drawFrame * 0.1) * 0.1;
            bulbRadius = 7;
        } else if (isWrong) {
            // Red dim
            bulbColor = '#ff2020';
            glowAlpha = 0.15;
            bulbRadius = 5;
        } else {
            // Idle flicker
            const flicker = Math.sin(light.flickerPhase) * 0.5 + 0.5;
            bulbColor = light.color;
            glowAlpha = 0.1 + flicker * 0.2;
            bulbRadius = 5;
        }

        // Glow
        const glow = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, bulbRadius * 3);
        glow.addColorStop(0, bulbColor + Math.floor(glowAlpha * 255).toString(16).padStart(2, '0'));
        glow.addColorStop(1, bulbColor + '00');
        ctx.fillStyle = glow;
        ctx.fillRect(light.x - bulbRadius * 3, light.y - bulbRadius * 3, bulbRadius * 6, bulbRadius * 6);

        // Bulb cap (dark connector)
        ctx.fillStyle = '#333';
        ctx.fillRect(light.x - 2, light.y - 4, 4, 4);

        // Bulb body
        ctx.fillStyle = bulbColor;
        ctx.globalAlpha = 0.3 + glowAlpha;
        ctx.beginPath();
        ctx.arc(light.x, light.y + 3, bulbRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Letter label below bulb
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isCorrect ? '#20ff40' : isWrong ? '#ff2020' : '#555';
        ctx.fillText(light.letter, light.x, light.y + 18);
    }
}

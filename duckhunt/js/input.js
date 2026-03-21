// Duck Hunt — Input (mouse/touch pointing + click/tap to shoot)
// Different from other arcade games: this is a pointing game, not directional

import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';

const keys = {};
const justPressed = {};

// Mouse/crosshair position in game coordinates
let mouseX = GAME_WIDTH / 2;
let mouseY = GAME_HEIGHT / 2;

// Shot event: {x, y} in game coordinates, consumed once per frame
let shotEvent = null;

// Track if device is touch
let isTouch = false;
let lastTapTime = 0;

const canvas = document.getElementById('gameCanvas');

export function initInput() {
    isTouch = matchMedia('(pointer: coarse)').matches;

    // --- Keyboard ---
    window.addEventListener('keydown', (e) => {
        if (!keys[e.code]) justPressed[e.code] = true;
        keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    // --- Mouse movement (desktop crosshair tracking) ---
    canvas.addEventListener('mousemove', (e) => {
        const pos = canvasCoords(e.clientX, e.clientY);
        mouseX = pos.x;
        mouseY = pos.y;
    });

    // --- Mouse click (desktop shoot) ---
    canvas.addEventListener('click', (e) => {
        const pos = canvasCoords(e.clientX, e.clientY);
        mouseX = pos.x;
        mouseY = pos.y;
        shotEvent = { x: pos.x, y: pos.y };
        // Also trigger Enter for menu navigation
        justPressed['Enter'] = true;
        keys['Enter'] = true;
        setTimeout(() => { keys['Enter'] = false; }, 50);
    });

    // --- Touch (mobile shoot at tap location) ---
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const t = e.touches[0];
        const pos = canvasCoords(t.clientX, t.clientY);
        mouseX = pos.x;
        mouseY = pos.y;
        shotEvent = { x: pos.x, y: pos.y };
        lastTapTime = Date.now();
        // Also trigger Enter for menu navigation
        justPressed['Enter'] = true;
        keys['Enter'] = true;
        setTimeout(() => { keys['Enter'] = false; }, 50);
    }, { passive: false });

    // Prevent context menu on canvas
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
}

function canvasCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

// --- Public API ---

export function isPressed(code) {
    if (justPressed[code]) {
        justPressed[code] = false;
        return true;
    }
    return false;
}

export function isHeld(code) {
    return !!keys[code];
}

export function getMousePos() {
    return { x: mouseX, y: mouseY };
}

export function consumeShot() {
    if (shotEvent) {
        const s = shotEvent;
        shotEvent = null;
        return s;
    }
    return null;
}

export function clearPressed() {
    for (const key in justPressed) justPressed[key] = false;
    shotEvent = null;
}

export function getIsTouch() {
    return isTouch;
}

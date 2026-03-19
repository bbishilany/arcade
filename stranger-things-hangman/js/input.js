import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';

const keys = {};
const justPressed = {};
let pendingLetter = null;
let canvasTap = null; // {x, y} in game coordinates

export function initInput() {
    window.addEventListener('keydown', (e) => {
        if (!keys[e.code]) {
            justPressed[e.code] = true;
        }
        keys[e.code] = true;

        // A-Z letter press
        if (e.code >= 'KeyA' && e.code <= 'KeyZ') {
            const letter = e.code.charAt(3);
            pendingLetter = letter;
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    // Touch letter buttons
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const letter of letters) {
        const btn = document.getElementById('letter-' + letter);
        if (!btn) continue;

        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            pendingLetter = letter;
        }, { passive: false });

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            pendingLetter = letter;
        });
    }

    // Canvas tap/click — track position for menu hit detection
    const canvas = document.getElementById('gameCanvas');

    function handleCanvasTap(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = GAME_WIDTH / rect.width;
        const scaleY = GAME_HEIGHT / rect.height;
        canvasTap = {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
        justPressed['Enter'] = true;
        keys['Enter'] = true;
        setTimeout(() => { keys['Enter'] = false; }, 50);
    }

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const t = e.touches[0];
        handleCanvasTap(t.clientX, t.clientY);
    }, { passive: false });

    canvas.addEventListener('click', (e) => {
        handleCanvasTap(e.clientX, e.clientY);
    });
}

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

export function consumeLetterPress() {
    if (pendingLetter) {
        const letter = pendingLetter;
        pendingLetter = null;
        return letter;
    }
    return null;
}

export function consumeCanvasTap() {
    if (canvasTap) {
        const tap = canvasTap;
        canvasTap = null;
        return tap;
    }
    return null;
}

export function clearPressed() {
    for (const key in justPressed) justPressed[key] = false;
}

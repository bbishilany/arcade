const keys = {};
const justPressed = {};

// Secret cheat code: type "123" for 10x bullet speed
let cheatBuffer = '';
let cheatActive = false;

// Touch state
const activeTouches = {};

export function initInput() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'Enter',
             'KeyA', 'KeyD', 'KeyW', 'KeyS'].includes(e.code)) {
            e.preventDefault();
        }
        if (!keys[e.code]) {
            justPressed[e.code] = true;
        }
        keys[e.code] = true;

        // Cheat code detection
        if (e.key >= '0' && e.key <= '9') {
            cheatBuffer += e.key;
            if (cheatBuffer.length > 3) cheatBuffer = cheatBuffer.slice(-3);
            if (cheatBuffer === '123') {
                cheatActive = !cheatActive;
                cheatBuffer = '';
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    // Touch controls — left side moves, right side fires, tap anywhere for Enter
    const canvas = document.getElementById('gameCanvas');

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        for (const touch of e.changedTouches) {
            const zone = getTouchZone(touch, canvas);
            activeTouches[touch.identifier] = zone;
            applyTouch(zone, true);
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        for (const touch of e.changedTouches) {
            const oldZone = activeTouches[touch.identifier];
            const newZone = getTouchZone(touch, canvas);
            if (oldZone !== newZone) {
                if (oldZone) applyTouch(oldZone, false);
                activeTouches[touch.identifier] = newZone;
                applyTouch(newZone, true);
            }
        }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        for (const touch of e.changedTouches) {
            const zone = activeTouches[touch.identifier];
            if (zone) applyTouch(zone, false);
            delete activeTouches[touch.identifier];
        }
    }, { passive: false });

    canvas.addEventListener('touchcancel', (e) => {
        for (const touch of e.changedTouches) {
            const zone = activeTouches[touch.identifier];
            if (zone) applyTouch(zone, false);
            delete activeTouches[touch.identifier];
        }
    });
}

function getTouchZone(touch, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;

    // Bottom 40% of screen = controls, top 60% = tap for Enter
    if (y < 0.6) return 'enter';
    if (x < 0.35) return 'left';
    if (x > 0.65) return 'right';
    return 'fire';
}

function applyTouch(zone, down) {
    if (zone === 'left') {
        if (down && !keys['ArrowLeft']) justPressed['ArrowLeft'] = true;
        keys['ArrowLeft'] = down;
    } else if (zone === 'right') {
        if (down && !keys['ArrowRight']) justPressed['ArrowRight'] = true;
        keys['ArrowRight'] = down;
    } else if (zone === 'fire') {
        if (down && !keys['Space']) justPressed['Space'] = true;
        keys['Space'] = down;
    } else if (zone === 'enter') {
        if (down) {
            justPressed['Enter'] = true;
            keys['Enter'] = true;
            // Release Enter after a frame so it acts as a tap
            setTimeout(() => { keys['Enter'] = false; }, 50);
        }
    }
}

export function isHeld(code) {
    return !!keys[code];
}

export function isPressed(code) {
    if (justPressed[code]) {
        justPressed[code] = false;
        return true;
    }
    return false;
}

export function clearPressed() {
    for (const key in justPressed) {
        justPressed[key] = false;
    }
}

export function isCheatActive() {
    return cheatActive;
}

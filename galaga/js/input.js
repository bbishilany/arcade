const keys = {};
const justPressed = {};

// Secret cheat code: type "123" for 10x bullet speed
let cheatBuffer = '';
let cheatActive = false;

export function initInput() {
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

const keys = {};
const justPressed = {};
let pendingLetter = null;

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

    // Canvas tap = Enter for menus
    const canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        justPressed['Enter'] = true;
        keys['Enter'] = true;
        setTimeout(() => { keys['Enter'] = false; }, 50);
    }, { passive: false });
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

export function clearPressed() {
    for (const key in justPressed) justPressed[key] = false;
}

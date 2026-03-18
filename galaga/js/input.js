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

    // Touch controls — visible buttons for iPad/phone
    initTouchButtons();

    // Tap on canvas = Enter (for start/restart screens)
    const canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        justPressed['Enter'] = true;
        keys['Enter'] = true;
        setTimeout(() => { keys['Enter'] = false; }, 50);
    }, { passive: false });
}

function initTouchButtons() {
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnFire = document.getElementById('btnFire');

    if (!btnLeft) return; // no touch controls in DOM

    // Helper: bind a button to a key code
    function bindButton(btn, code) {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.add('active');
            if (!keys[code]) justPressed[code] = true;
            keys[code] = true;
        }, { passive: false });

        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.remove('active');
            keys[code] = false;
        }, { passive: false });

        btn.addEventListener('touchcancel', (e) => {
            btn.classList.remove('active');
            keys[code] = false;
        });
    }

    bindButton(btnLeft, 'ArrowLeft');
    bindButton(btnRight, 'ArrowRight');
    bindButton(btnFire, 'Space');
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

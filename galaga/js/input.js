const keys = {};
const justPressed = {};

// Secret cheat codes
// "123" = 10x bullet speed
// "67"  = free movement (up/down/left/right)
// "99"  = fire a missile that destroys 10 aliens
let cheatBuffer = '';
let cheatActive = false;
let freeMovementActive = false;
let missileReady = false;

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
            if (cheatBuffer.endsWith('67')) {
                freeMovementActive = !freeMovementActive;
                cheatBuffer = '';
            }
            if (cheatBuffer.endsWith('99')) {
                missileReady = true;
                cheatBuffer = '';
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    // Touch controls — visible buttons for iPad/phone
    initTouchButtons();

    // Tap on canvas — acts as Enter for menus, or cycles names on name select
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

export function isFreeMovementActive() {
    return freeMovementActive;
}

export function consumeMissile() {
    if (missileReady) {
        missileReady = false;
        return true;
    }
    return false;
}

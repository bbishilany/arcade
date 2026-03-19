const keys = {};
const justPressed = {};

let touchSwing = false;
let touchPitch = false;
let touchConfirm = false;

export function initInput() {
    window.addEventListener('keydown', (e) => {
        if (['Space', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
             'Escape', 'Backspace'].includes(e.code)) {
            e.preventDefault();
        }
        if (!keys[e.code]) {
            justPressed[e.code] = true;
        }
        keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    // Touch: canvas tap = Enter for menus
    const canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        justPressed['Enter'] = true;
        keys['Enter'] = true;
        setTimeout(() => { keys['Enter'] = false; }, 50);
    }, { passive: false });

    initTouchButtons();
}

function initTouchButtons() {
    bindTouch('btnSwing', () => { touchSwing = true; });
    bindTouch('btnPitch', () => { touchPitch = true; });
    bindTouch('btnConfirm', () => { touchConfirm = true; });
}

function bindTouch(id, onPress) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.add('active');
        onPress();
    }, { passive: false });
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.remove('active');
    }, { passive: false });
    btn.addEventListener('touchcancel', () => {
        btn.classList.remove('active');
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

export function isSwingPressed() {
    if (isPressed('Space') || touchSwing) {
        touchSwing = false;
        return true;
    }
    return false;
}

export function isPitchPressed() {
    if (isPressed('Space') || touchPitch) {
        touchPitch = false;
        return true;
    }
    return false;
}

export function isConfirmPressed() {
    if (isPressed('Enter') || touchConfirm) {
        touchConfirm = false;
        return true;
    }
    return false;
}

export function clearPressed() {
    for (const key in justPressed) {
        justPressed[key] = false;
    }
    touchSwing = false;
    touchPitch = false;
    touchConfirm = false;
}

// Show/hide specific touch button groups
export function showTouchControls(mode) {
    const swing = document.getElementById('swingControls');
    const pitch = document.getElementById('pitchControls');
    const confirm = document.getElementById('confirmControls');
    if (swing) swing.style.display = mode === 'batting' ? 'flex' : 'none';
    if (pitch) pitch.style.display = mode === 'pitching' ? 'flex' : 'none';
    if (confirm) confirm.style.display = mode === 'confirm' ? 'flex' : 'none';
}

import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
import { init, update, draw } from './game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set internal resolution
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Detect touch device
const isTouch = matchMedia('(pointer: coarse)').matches;

// Scale canvas to fit window while maintaining aspect ratio
function resizeCanvas() {
    const ratio = GAME_WIDTH / GAME_HEIGHT;
    let w = window.innerWidth;
    // Reserve space for touch controls on mobile
    let h = isTouch ? window.innerHeight - 130 : window.innerHeight;

    if (w / h > ratio) {
        w = h * ratio;
    } else {
        h = w / ratio;
    }

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize game
init();

// Fixed timestep game loop at 60fps
const FPS = 60;
const FRAME_TIME = 1000 / FPS;
let lastTime = 0;
let accumulator = 0;
let drawFrame = 0;

// Reset timing after tab switch to prevent catch-up spike
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        lastTime = 0;
        accumulator = 0;
    }
});

function gameLoop(timestamp) {
    if (lastTime === 0) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += delta;

    // Cap accumulator — at most 2 catch-up frames to prevent teleporting
    if (accumulator > FRAME_TIME * 2) {
        accumulator = FRAME_TIME * 2;
    }

    while (accumulator >= FRAME_TIME) {
        update();
        accumulator -= FRAME_TIME;
    }

    // drawFrame only increments once per visual frame — no flicker
    drawFrame++;
    draw(ctx, drawFrame);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
import { init, update, draw } from './game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const isTouch = matchMedia('(pointer: coarse)').matches;

function resizeCanvas() {
    const ratio = GAME_WIDTH / GAME_HEIGHT;
    const vp = window.visualViewport || { width: window.innerWidth, height: window.innerHeight };
    let w = vp.width;
    let h = isTouch ? vp.height - 160 : vp.height;

    if (w / h > ratio) w = h * ratio;
    else h = w / ratio;

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
}

window.addEventListener('resize', resizeCanvas);
if (window.visualViewport) window.visualViewport.addEventListener('resize', resizeCanvas);
resizeCanvas();

init();

const FPS = 60;
const FRAME_TIME = 1000 / FPS;

let lastTime = 0;
let accumulator = 0;
let drawFrame = 0;

function gameLoop(timestamp) {
    if (lastTime === 0) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += delta;

    if (accumulator > FRAME_TIME * 5) {
        accumulator = FRAME_TIME * 5;
    }

    while (accumulator >= FRAME_TIME) {
        update();
        accumulator -= FRAME_TIME;
    }

    drawFrame++;
    draw(ctx, drawFrame);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// Duck Hunt — Central state machine

import {
    GAME_WIDTH, GAME_HEIGHT, STATES,
    SKY_COLOR, GRASS_COLOR_1, GRASS_COLOR_2, TREE_COLOR,
    GRASS_TOP, SKY_HEIGHT, HUD_TOP, TREE_TOP,
    TOTAL_ROUNDS, MODE_CONFIG, ducksPerRound, minHits,
    POINTS, PERFECT_BONUS, DUCK_FLY_FRAMES,
    ROUND_INTRO_FRAMES, ROUND_END_FRAMES, GAME_OVER_FRAMES,
    DUCK_SCALE
} from './constants.js';

import { isPressed, getMousePos, consumeShot, clearPressed, getIsTouch } from './input.js';
import { createDuck, updateDuck, hitTestDuck, shootDuck, drawDuck } from './duck.js';
import { resetDog, startDogIntro, startDogResult, updateDog, isDogDone, drawDog } from './dog.js';
import { drawHUD } from './hud.js';
import { drawTitleScreen, drawModeSelect, drawRoundIntro, drawGameOver } from './screens.js';
import { refreshLeaderboard, saveScore } from './leaderboard.js';
import { drawSprite, CROSSHAIR } from './sprites.js';
import {
    playGunshot, playQuack, playHitThud, playFallingTone,
    playRoundStart, playPerfect, playGameOver as playGameOverSound
} from './audio.js';

// --- Game state ---
let state = STATES.TITLE;
let gameMode = 'A';          // A = 2 ducks, B = 3 ducks
let selectedMode = 'A';      // for mode select screen
let round = 1;
let score = 0;
let shotsLeft = 3;
let ducks = [];               // active duck entities
let duckResults = [];          // 'hit' or 'miss' for each duck this round
let currentDuckIndex = 0;     // total ducks resolved this round
let timer = 0;
let frame = 0;
let roundHits = 0;
let shotFired = false;
let gameOverSoundPlayed = false;
let totalDucksThisRound = 10;

// Flash effect on shot
let flashTimer = 0;

// Name entry
const overlay = document.getElementById('nameOverlay');
const nameInput = document.getElementById('nameInput');
const nameSubmit = document.getElementById('nameSubmit');
const nameScore = document.getElementById('nameScore');

// --- Init ---
export function init() {
    refreshLeaderboard();
    state = STATES.TITLE;

    nameSubmit.addEventListener('click', submitScore);
    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitScore();
    });
}

async function submitScore() {
    const name = nameInput.value.trim().toUpperCase().slice(0, 8);
    if (!name) return;
    overlay.style.display = 'none';
    await saveScore(name, score);
    state = STATES.TITLE;
    clearPressed();
}

// --- Reset for new game ---
function startNewGame() {
    round = 1;
    score = 0;
    duckResults = [];
    currentDuckIndex = 0;
    roundHits = 0;
    gameOverSoundPlayed = false;
    totalDucksThisRound = ducksPerRound(gameMode);
    resetDog();
    startDogIntroState(false);
}

function startDogIntroState(abbreviated) {
    state = STATES.DOG_INTRO;
    startDogIntro(abbreviated);
    timer = 0;
}

function startRound() {
    state = STATES.ROUND_INTRO;
    timer = ROUND_INTRO_FRAMES;
    duckResults = [];
    currentDuckIndex = 0;
    roundHits = 0;
    totalDucksThisRound = ducksPerRound(gameMode);
    playRoundStart();
}

function spawnDucks() {
    state = STATES.FLYING;
    ducks = [];
    const cfg = MODE_CONFIG[gameMode];
    shotsLeft = cfg.shotsPerAttempt;
    shotFired = false;

    for (let i = 0; i < cfg.ducksPerAttempt; i++) {
        ducks.push(createDuck(round));
    }
}

// --- Update ---
export function update() {
    frame++;

    switch (state) {
        case STATES.TITLE:
            updateTitle();
            break;
        case STATES.MODE_SELECT:
            updateModeSelect();
            break;
        case STATES.DOG_INTRO:
            updateDogIntro();
            break;
        case STATES.ROUND_INTRO:
            updateRoundIntro();
            break;
        case STATES.FLYING:
            updateFlying();
            break;
        case STATES.DUCK_HIT:
            updateDuckHit();
            break;
        case STATES.DUCK_ESCAPED:
            updateDuckEscaped();
            break;
        case STATES.DOG_RESULT:
            updateDogResult();
            break;
        case STATES.ROUND_END:
            updateRoundEnd();
            break;
        case STATES.GAME_OVER:
            updateGameOver();
            break;
        case STATES.NAME_ENTRY:
            // Handled by DOM overlay
            break;
    }

    if (flashTimer > 0) flashTimer--;
}

function updateTitle() {
    if (isPressed('Enter') || isPressed('Space')) {
        state = STATES.MODE_SELECT;
        selectedMode = 'A';
        clearPressed();
    }
}

function updateModeSelect() {
    if (isPressed('ArrowUp') || isPressed('ArrowDown')) {
        selectedMode = selectedMode === 'A' ? 'B' : 'A';
    }

    // Tap detection for mode select on mobile
    const shot = consumeShot();
    if (shot) {
        // Check if tap is in Game A region (y 250-320) or Game B region (y 340-410)
        if (shot.y >= 250 && shot.y <= 320) {
            selectedMode = 'A';
            gameMode = 'A';
            startNewGame();
            clearPressed();
            return;
        } else if (shot.y >= 340 && shot.y <= 410) {
            selectedMode = 'B';
            gameMode = 'B';
            startNewGame();
            clearPressed();
            return;
        }
    }

    if (isPressed('Enter') || isPressed('Space')) {
        gameMode = selectedMode;
        startNewGame();
        clearPressed();
    }
}

function updateDogIntro() {
    updateDog();
    timer++;
    if (isDogDone() || timer > 500) {
        startRound();
    }
}

function updateRoundIntro() {
    timer--;
    if (timer <= 0) {
        spawnDucks();
    }
}

function updateFlying() {
    // Handle shot
    const shot = consumeShot();
    if (shot && shotsLeft > 0) {
        shotsLeft--;
        flashTimer = 3;
        playGunshot();

        // Check hit on each duck
        for (const duck of ducks) {
            if (hitTestDuck(duck, shot.x, shot.y)) {
                shootDuck(duck);
                playHitThud();
            }
        }
    }

    // Update ducks
    for (const duck of ducks) {
        updateDuck(duck);
    }

    // Check if all ducks resolved
    const allDone = ducks.every(d => d.state === 'gone' || d.state === 'escaped');
    const anyStillFlying = ducks.some(d => d.state === 'flying');
    const anyAnimating = ducks.some(d => d.state === 'hit' || d.state === 'falling');

    // Out of ammo — force ducks to start escaping via flyTimer
    if (shotsLeft <= 0 && anyStillFlying && !anyAnimating) {
        for (const duck of ducks) {
            if (duck.state === 'flying' && duck.flyTimer < DUCK_FLY_FRAMES) {
                duck.flyTimer = DUCK_FLY_FRAMES; // triggers natural escape sequence
            }
        }
    }

    // All ducks resolved — move to result
    if (allDone) {
        const hitsThisAttempt = ducks.filter(d => d.state === 'gone').length;
        const ducksThisAttempt = ducks.length;

        // Record each duck individually
        for (let i = 0; i < ducksThisAttempt; i++) {
            const wasHit = ducks[i].state === 'gone';
            duckResults.push(wasHit ? 'hit' : 'miss');
            if (wasHit) {
                score += POINTS[round];
                roundHits++;
            }
            currentDuckIndex++;
        }

        // Play quack for escaped ducks
        if (hitsThisAttempt < ducksThisAttempt) {
            playQuack();
        } else {
            playFallingTone();
        }

        // Start dog result animation
        startDogResult(hitsThisAttempt);
        state = STATES.DOG_RESULT;
        timer = 0;
    }
}

function updateDuckHit() {
    // Handled inline in FLYING state now
}

function updateDuckEscaped() {
    // Handled inline in FLYING state now
}

function updateDogResult() {
    updateDog();
    timer++;

    if (isDogDone() || timer > 120) {
        // More ducks this round?
        if (currentDuckIndex < totalDucksThisRound) {
            spawnDucks();
        } else {
            // Round end
            state = STATES.ROUND_END;
            timer = ROUND_END_FRAMES;

            // Perfect round bonus
            if (roundHits === totalDucksThisRound) {
                score += PERFECT_BONUS;
                playPerfect();
            }
        }
    }
}

function updateRoundEnd() {
    timer--;
    if (timer <= 0) {
        // Check if passed
        if (roundHits >= minHits(gameMode, round)) {
            // Next round
            round++;
            if (round > TOTAL_ROUNDS) {
                // Beat all rounds!
                state = STATES.GAME_OVER;
                timer = GAME_OVER_FRAMES;
                gameOverSoundPlayed = false;
            } else {
                startDogIntroState(true); // abbreviated for rounds 2+
            }
        } else {
            // Failed
            state = STATES.GAME_OVER;
            timer = GAME_OVER_FRAMES;
            gameOverSoundPlayed = false;
        }
    }
}

function updateGameOver() {
    if (!gameOverSoundPlayed) {
        playGameOverSound();
        gameOverSoundPlayed = true;
    }
    timer--;
    if (timer <= 0) {
        if (isPressed('Enter') || isPressed('Space')) {
            showNameEntry();
        }
        // Consume shot for touch
        const shot = consumeShot();
        if (shot) {
            showNameEntry();
        }
    }
}

function showNameEntry() {
    state = STATES.NAME_ENTRY;
    overlay.style.display = 'flex';
    nameScore.textContent = `SCORE: ${score}`;
    nameInput.value = '';
    nameInput.focus();
}

// --- Draw ---
export function draw(ctx, drawFrame) {
    switch (state) {
        case STATES.TITLE:
            drawTitleScreen(ctx, drawFrame);
            break;

        case STATES.MODE_SELECT:
            drawModeSelect(ctx, selectedMode, drawFrame);
            break;

        case STATES.DOG_INTRO:
            drawScene(ctx);
            drawDog(ctx);
            break;

        case STATES.ROUND_INTRO:
            drawScene(ctx);
            drawRoundIntro(ctx, round, drawFrame);
            drawHUD(ctx, hudState());
            break;

        case STATES.FLYING:
        case STATES.DUCK_HIT:
        case STATES.DUCK_ESCAPED:
            drawScene(ctx);

            // Flash on shot
            if (flashTimer > 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(0, 0, GAME_WIDTH, SKY_HEIGHT);
            }

            // Draw ducks
            for (const duck of ducks) {
                drawDuck(ctx, duck, drawFrame);
            }

            // Crosshair
            if (!getIsTouch()) {
                const mp = getMousePos();
                drawSprite(ctx, CROSSHAIR, mp.x, mp.y, 2);
            }

            drawHUD(ctx, hudState());
            break;

        case STATES.DOG_RESULT:
            drawScene(ctx);
            drawDog(ctx);
            drawHUD(ctx, hudState());
            break;

        case STATES.ROUND_END:
            drawScene(ctx);
            drawRoundEndOverlay(ctx, drawFrame);
            drawHUD(ctx, hudState());
            break;

        case STATES.GAME_OVER:
        case STATES.NAME_ENTRY:
            drawScene(ctx);
            drawHUD(ctx, hudState());
            drawGameOver(ctx, score, drawFrame);
            break;
    }
}

function hudState() {
    return {
        round,
        score,
        shotsLeft,
        duckResults,
        currentDuckIndex,
        totalDucks: totalDucksThisRound
    };
}

// --- Scene drawing (sky, trees, grass) ---
function drawScene(ctx) {
    // Sky
    ctx.fillStyle = SKY_COLOR;
    ctx.fillRect(0, 0, GAME_WIDTH, SKY_HEIGHT);

    // Tree silhouettes at horizon
    ctx.fillStyle = TREE_COLOR;
    drawTrees(ctx);

    // Grass
    ctx.fillStyle = GRASS_COLOR_1;
    ctx.fillRect(0, GRASS_TOP, GAME_WIDTH, GRASS_TOP + 80);
    ctx.fillStyle = GRASS_COLOR_2;
    ctx.fillRect(0, GRASS_TOP + 40, GAME_WIDTH, 200);
}

function drawTrees(ctx) {
    // Simple tree silhouettes along the horizon
    const treePositions = [30, 80, 140, 200, 260, 320, 380, 440];
    for (const tx of treePositions) {
        const h = 30 + Math.sin(tx * 0.3) * 15;
        const w = 25 + Math.cos(tx * 0.5) * 10;
        // Tree top (triangle)
        ctx.beginPath();
        ctx.moveTo(tx - w / 2, GRASS_TOP);
        ctx.lineTo(tx, GRASS_TOP - h);
        ctx.lineTo(tx + w / 2, GRASS_TOP);
        ctx.fill();
        // Trunk
        ctx.fillRect(tx - 3, GRASS_TOP - 5, 6, 10);
    }
}

function drawRoundEndOverlay(ctx, drawFrame) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, GAME_WIDTH, SKY_HEIGHT);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`ROUND ${round}`, GAME_WIDTH / 2, 160);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText(`${roundHits} / ${totalDucksThisRound} DUCKS`, GAME_WIDTH / 2, 200);

    const needed = minHits(gameMode, round);
    const passed = roundHits >= needed;
    if (passed) {
        ctx.fillStyle = '#00ff00';
        ctx.fillText('CLEAR!', GAME_WIDTH / 2, 240);
    } else {
        ctx.fillStyle = '#ff4444';
        ctx.fillText('FAILED', GAME_WIDTH / 2, 240);
        ctx.fillStyle = '#888888';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText(`NEEDED ${needed}`, GAME_WIDTH / 2, 265);
    }

    if (roundHits === totalDucksThisRound) {
        const blink = Math.floor(drawFrame / 15) % 2;
        if (blink) {
            ctx.fillStyle = '#ffff00';
            ctx.font = '10px "Press Start 2P", monospace';
            ctx.fillText('PERFECT! +10000', GAME_WIDTH / 2, 300);
        }
    }
}

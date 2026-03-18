import { GAME_WIDTH, GAME_HEIGHT, STATES, WAVE_INTRO_DURATION,
         DEATH_PAUSE_DURATION, GAME_OVER_DURATION, COLORS,
         STAR_COUNT, STAR_SPEED_MIN, STAR_SPEED_MAX } from './constants.js';
import { initInput, isPressed, isHeld, clearPressed } from './input.js';
import { createPlayer, updatePlayer, drawPlayer, killPlayer, respawnPlayer } from './player.js';
import { updateBullets, drawBullets } from './bullet.js';
import { drawAlien } from './alien.js';
import { createFormation, updateFormation, formationCleared,
         updateFormationSpeed } from './formation.js';
import { processCollisions } from './collision.js';
import { spawnExplosion, updateParticles, drawParticles, clearParticles } from './particles.js';
import { initAudio, playShoot, playExplosion, playPlayerDeath,
         playWaveComplete, playGameOver, playStartGame } from './audio.js';
import { drawHUD } from './hud.js';
import { drawTitleScreen, drawWaveIntro, drawGameOver } from './screens.js';
import { refreshLeaderboard, getLeaderboard, getHighScore, saveScore } from './leaderboard.js';

let state = STATES.TITLE;
let player = null;
let formation = null;
let bullets = [];
let score = 0;
let highScore = 0;
let wave = 1;
let stateTimer = 0;
let stars = [];

// Name entry DOM elements
let nameOverlay, nameInput, nameSubmit, nameScoreEl;

function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * GAME_WIDTH,
            y: Math.random() * GAME_HEIGHT,
            speed: STAR_SPEED_MIN + Math.random() * (STAR_SPEED_MAX - STAR_SPEED_MIN),
            brightness: 0.3 + Math.random() * 0.7,
            size: Math.random() < 0.3 ? 2 : 1
        });
    }
}

function updateStars() {
    for (const star of stars) {
        star.y += star.speed;
        if (star.y > GAME_HEIGHT) {
            star.y = 0;
            star.x = Math.random() * GAME_WIDTH;
        }
        star.brightness += (Math.random() - 0.5) * 0.1;
        if (star.brightness < 0.2) star.brightness = 0.2;
        if (star.brightness > 1) star.brightness = 1;
    }
}

function drawStars(ctx) {
    for (const star of stars) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }
}

function startGame() {
    player = createPlayer();
    bullets = [];
    score = 0;
    wave = 1;
    clearParticles();
    formation = createFormation(wave);
    playStartGame();
    changeState(STATES.WAVE_INTRO);
}

function nextWave() {
    wave++;
    player.lives++;  // bonus life for clearing a wave
    bullets = [];
    clearParticles();
    formation = createFormation(wave);
    playWaveComplete();
    changeState(STATES.WAVE_INTRO);
}

function changeState(newState) {
    state = newState;
    stateTimer = 0;

    // Refresh leaderboard when entering title screen
    if (newState === STATES.TITLE) {
        refreshLeaderboard().then(() => {
            highScore = getHighScore();
        });
    }
}

function showNameEntry() {
    nameScoreEl.textContent = 'SCORE: ' + score.toString().padStart(6, '0') + '  WAVE: ' + wave;
    nameInput.value = '';
    nameOverlay.style.display = 'flex';
    setTimeout(() => nameInput.focus(), 100);
}

function hideNameEntry() {
    nameOverlay.style.display = 'none';
    nameInput.blur();
}

function submitName() {
    let name = nameInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (name.length === 0) name = 'ACE';
    hideNameEntry();

    // Save online + local, then go to title
    saveScore(name, score, wave).then(() => {
        highScore = getHighScore();
        changeState(STATES.TITLE);
    });
}

export function init() {
    initInput();
    initAudio();
    initStars();

    // Load online leaderboard in background
    refreshLeaderboard().then(() => {
        highScore = getHighScore();
    });

    // Grab name entry DOM elements
    nameOverlay = document.getElementById('nameOverlay');
    nameInput = document.getElementById('nameInput');
    nameSubmit = document.getElementById('nameSubmit');
    nameScoreEl = document.getElementById('nameScore');

    nameSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        submitName();
    });
    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitName();
        }
        e.stopPropagation();
    });
    nameInput.addEventListener('keyup', (e) => e.stopPropagation());
}

export function update() {
    stateTimer++;
    updateStars();
    updateParticles();

    switch (state) {
        case STATES.TITLE:
            if (isPressed('Enter')) {
                startGame();
            }
            break;

        case STATES.WAVE_INTRO:
            if (stateTimer >= WAVE_INTRO_DURATION) {
                changeState(STATES.PLAYING);
            }
            break;

        case STATES.PLAYING: {
            const shotFired = updatePlayer(player, bullets);
            if (shotFired) playShoot();

            updateFormation(formation, bullets, player.x);
            updateFormationSpeed(formation);
            updateBullets(bullets);

            processCollisions(player, formation, bullets, {
                onAlienHit: (alien) => {
                    score += alien.points;
                    if (score > highScore) highScore = score;
                    const colors = {
                        commander: '#00ff88',
                        butterfly: '#ff44ff',
                        bee: '#ffff00'
                    };
                    spawnExplosion(alien.x, alien.y, colors[alien.type] || '#ffffff');
                    playExplosion();
                },
                onPlayerHit: () => {
                    killPlayer(player);
                    spawnExplosion(player.x, player.y, COLORS.PLAYER);
                    playPlayerDeath();
                    changeState(STATES.PLAYER_DEATH);
                }
            });

            if (formationCleared(formation)) {
                nextWave();
            }
            break;
        }

        case STATES.PLAYER_DEATH:
            updateBullets(bullets);
            if (stateTimer >= DEATH_PAUSE_DURATION) {
                if (player.lives > 0) {
                    respawnPlayer(player);
                    bullets = [];
                    changeState(STATES.PLAYING);
                } else {
                    playGameOver();
                    changeState(STATES.GAME_OVER);
                }
            }
            break;

        case STATES.GAME_OVER:
            if (stateTimer >= GAME_OVER_DURATION) {
                showNameEntry();
                changeState(STATES.NAME_ENTRY);
            }
            break;

        case STATES.NAME_ENTRY:
            break;
    }

    clearPressed();
}

export function draw(ctx, drawFrame) {
    ctx.fillStyle = COLORS.BG;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawStars(ctx);

    switch (state) {
        case STATES.TITLE:
            drawTitleScreen(ctx, drawFrame, getLeaderboard());
            break;

        case STATES.WAVE_INTRO:
            drawWaveIntro(ctx, wave, stateTimer);
            drawHUD(ctx, score, highScore, player.lives, wave);
            break;

        case STATES.PLAYING:
            for (const alien of formation.aliens) {
                drawAlien(ctx, alien, drawFrame);
            }
            drawPlayer(ctx, player, drawFrame);
            drawBullets(ctx, bullets);
            drawParticles(ctx);
            drawHUD(ctx, score, highScore, player.lives, wave);
            break;

        case STATES.PLAYER_DEATH:
            for (const alien of formation.aliens) {
                drawAlien(ctx, alien, drawFrame);
            }
            drawBullets(ctx, bullets);
            drawParticles(ctx);
            drawHUD(ctx, score, highScore, player.lives, wave);
            break;

        case STATES.GAME_OVER:
            drawGameOver(ctx, score, highScore, drawFrame);
            break;

        case STATES.NAME_ENTRY:
            break;
    }
}

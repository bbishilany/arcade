import { GAME_WIDTH, GAME_HEIGHT, STATES, WAVE_INTRO_DURATION,
         DEATH_PAUSE_DURATION, GAME_OVER_DURATION, COLORS,
         STAR_COUNT, STAR_SPEED_MIN, STAR_SPEED_MAX } from './constants.js';
import { initInput, isPressed, clearPressed } from './input.js';
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

let state = STATES.TITLE;
let player = null;
let formation = null;
let bullets = [];
let score = 0;
let highScore = 0;
let wave = 1;
let stateTimer = 0;
let frameCount = 0;
let stars = [];

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
        // Twinkle
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
    bullets = [];
    clearParticles();
    formation = createFormation(wave);
    playWaveComplete();
    changeState(STATES.WAVE_INTRO);
}

function changeState(newState) {
    state = newState;
    stateTimer = 0;
}

export function init() {
    initInput();
    initAudio();
    initStars();
}

export function update() {
    frameCount++;
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

        case STATES.PLAYING:
            // Update player
            const shotFired = updatePlayer(player, bullets);
            if (shotFired) playShoot();

            // Update formation and aliens
            updateFormation(formation, bullets, player.x);
            updateFormationSpeed(formation);

            // Update bullets
            updateBullets(bullets);

            // Check collisions
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

            // Check wave clear
            if (formationCleared(formation)) {
                nextWave();
            }
            break;

        case STATES.PLAYER_DEATH:
            // Let particles finish, then check lives
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
            if (stateTimer >= GAME_OVER_DURATION && isPressed('Enter')) {
                changeState(STATES.TITLE);
            }
            break;
    }

    clearPressed();
}

export function draw(ctx) {
    // Clear
    ctx.fillStyle = COLORS.BG;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Starfield (always visible)
    drawStars(ctx);

    switch (state) {
        case STATES.TITLE:
            drawTitleScreen(ctx, frameCount);
            break;

        case STATES.WAVE_INTRO:
            drawWaveIntro(ctx, wave, stateTimer);
            drawHUD(ctx, score, highScore, player.lives, wave);
            break;

        case STATES.PLAYING:
            // Draw formation aliens
            for (const alien of formation.aliens) {
                drawAlien(ctx, alien, frameCount);
            }
            drawPlayer(ctx, player, frameCount);
            drawBullets(ctx, bullets);
            drawParticles(ctx);
            drawHUD(ctx, score, highScore, player.lives, wave);
            break;

        case STATES.PLAYER_DEATH:
            for (const alien of formation.aliens) {
                drawAlien(ctx, alien, frameCount);
            }
            drawBullets(ctx, bullets);
            drawParticles(ctx);
            drawHUD(ctx, score, highScore, player.lives, wave);
            break;

        case STATES.GAME_OVER:
            drawGameOver(ctx, score, highScore, stateTimer);
            break;
    }
}

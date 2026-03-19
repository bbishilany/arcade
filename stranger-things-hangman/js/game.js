import { GAME_WIDTH, GAME_HEIGHT, STATES, DIFFICULTIES, COLORS, CORRECT_BASE, WORD_COMPLETE_BONUS, PERFECT_BONUS, SPEED_BONUS_MULT, SPEED_BONUS_WINDOW, STREAK_INCREMENT, WIN_DURATION, LOSE_DURATION, GAME_OVER_DURATION } from './constants.js';
import { getRandomWord, getUniqueLetters } from './words.js';
import { initInput, isPressed, clearPressed, consumeLetterPress, consumeCanvasTap } from './input.js';
import { drawDemogorgon } from './demogorgon.js';
import { initLights, drawLights, updateLights } from './lights.js';
import { drawTitleScreen, drawDifficultySelect, drawWinScreen, drawGameOverScreen } from './screens.js';
import { drawHUD, drawWord } from './hud.js';
import { initAudio, playCorrectGuess, playWrongGuess, playWin, playLose, playStartGame, playDifficultySelect } from './audio.js';
import { createParticles, updateParticles, drawParticles } from './particles.js';
import { getLeaderboard, submitScore, loadLeaderboard } from './leaderboard.js';

// Game state
let state = STATES.TITLE;
let stateTimer = 0;
let difficulty = null;
let currentWordEntry = null;
let currentWord = '';
let uniqueLetters = null;
let guessedLetters = new Set();
let wrongLetters = new Set();
let wrongCount = 0;
let score = 0;
let highScore = 0;
let streak = 0;
let wordsCompleted = 0;
let roundStartTime = 0;
let revealParts = 0;

// DOM elements
let nameOverlay, nameInput, nameSubmit, nameScoreEl;

function changeState(newState) {
    state = newState;
    stateTimer = 0;
}

function startNewRound() {
    currentWordEntry = getRandomWord(difficulty.pool);
    currentWord = currentWordEntry.word;
    uniqueLetters = getUniqueLetters(currentWord);
    guessedLetters = new Set();
    wrongLetters = new Set();
    wrongCount = 0;
    revealParts = difficulty.startPart;
    roundStartTime = Date.now();

    // Reset letter buttons
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong', 'used');
    });

    changeState(STATES.PLAYING);
}

function guessLetter(letter) {
    if (guessedLetters.has(letter)) return;
    guessedLetters.add(letter);

    const btn = document.getElementById('letter-' + letter);

    if (currentWord.includes(letter)) {
        // Correct guess
        streak++;
        const streakMult = 1 + (streak - 1) * STREAK_INCREMENT;
        const points = Math.floor(CORRECT_BASE * streakMult * difficulty.mult);
        score += points;

        if (btn) btn.classList.add('correct', 'used');
        playCorrectGuess();

        // Sparkle particles at letter positions in the word
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === letter) {
                const wordLen = currentWord.length;
                const spacing = Math.min(30, (GAME_WIDTH - 60) / wordLen);
                const startX = (GAME_WIDTH - wordLen * spacing) / 2 + spacing / 2;
                createParticles(startX + i * spacing, 480, COLORS.CORRECT, 5);
            }
        }

        // Check win
        const allGuessed = [...uniqueLetters].every(l => guessedLetters.has(l));
        if (allGuessed) {
            // Word complete bonus
            score += Math.floor(WORD_COMPLETE_BONUS * difficulty.mult);

            // Speed bonus
            const elapsed = (Date.now() - roundStartTime) / 1000;
            if (elapsed < SPEED_BONUS_WINDOW) {
                score += Math.floor((SPEED_BONUS_WINDOW - elapsed) * SPEED_BONUS_MULT * difficulty.mult);
            }

            // Perfect bonus
            if (wrongCount === 0) {
                score += PERFECT_BONUS;
            }

            wordsCompleted++;
            playWin();
            changeState(STATES.WIN);
        }
    } else {
        // Wrong guess
        streak = 0;
        wrongCount++;
        revealParts = difficulty.startPart + wrongCount;
        wrongLetters.add(letter);

        if (btn) btn.classList.add('wrong', 'used');
        playWrongGuess();

        // Check lose
        if (wrongCount >= difficulty.maxWrong) {
            playLose();
            changeState(STATES.LOSE);
        }
    }
}

function showNameEntry() {
    nameScoreEl.textContent = 'SCORE: ' + score;
    nameOverlay.style.display = '';
    nameInput.value = '';
    nameInput.focus();
}

function hideNameEntry() {
    nameOverlay.style.display = 'none';
}

export function init() {
    initInput();
    initAudio();
    initLights();

    // DOM elements
    nameOverlay = document.getElementById('nameOverlay');
    nameInput = document.getElementById('nameInput');
    nameSubmit = document.getElementById('nameSubmit');
    nameScoreEl = document.getElementById('nameScore');

    // Name entry handlers
    nameSubmit.addEventListener('click', () => {
        const name = nameInput.value.trim().toUpperCase() || 'ANON';
        submitScore(name, score, difficulty ? difficulty.name : 'EASY');
        hideNameEntry();
        changeState(STATES.TITLE);
    });

    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') nameSubmit.click();
    });

    // Load leaderboard
    loadLeaderboard();
}

export function update() {
    stateTimer++;
    updateParticles();
    updateLights(stateTimer);

    switch (state) {
        case STATES.TITLE:
            if (isPressed('Enter') || isPressed('Space')) {
                changeState(STATES.DIFFICULTY_SELECT);
            }
            break;

        case STATES.DIFFICULTY_SELECT: {
            let picked = null;

            // Keyboard
            if (isPressed('Digit1') || isPressed('Numpad1')) picked = DIFFICULTIES.EASY;
            else if (isPressed('Digit2') || isPressed('Numpad2')) picked = DIFFICULTIES.MEDIUM;
            else if (isPressed('Digit3') || isPressed('Numpad3')) picked = DIFFICULTIES.HARD;

            // Tap/click on difficulty boxes
            if (!picked) {
                const tap = consumeCanvasTap();
                if (tap && tap.x >= 100 && tap.x <= 380) {
                    if (tap.y >= 255 && tap.y <= 325) picked = DIFFICULTIES.EASY;
                    else if (tap.y >= 355 && tap.y <= 425) picked = DIFFICULTIES.MEDIUM;
                    else if (tap.y >= 455 && tap.y <= 525) picked = DIFFICULTIES.HARD;
                }
            }

            if (picked) {
                difficulty = picked;
                playDifficultySelect();
                playStartGame();
                score = 0;
                streak = 0;
                wordsCompleted = 0;
                startNewRound();
            } else if (isPressed('Escape')) {
                changeState(STATES.TITLE);
            }
            break;
        }

        case STATES.PLAYING: {
            const letter = consumeLetterPress();
            if (letter) {
                guessLetter(letter);
            }
            if (isPressed('Escape')) {
                changeState(STATES.TITLE);
            }
            break;
        }

        case STATES.WIN:
            if (stateTimer >= WIN_DURATION) {
                startNewRound(); // Next word
            }
            break;

        case STATES.LOSE:
            if (stateTimer >= LOSE_DURATION) {
                changeState(STATES.GAME_OVER);
            }
            break;

        case STATES.GAME_OVER:
            if (stateTimer >= GAME_OVER_DURATION) {
                if (score > 0) {
                    showNameEntry();
                    changeState(STATES.NAME_ENTRY);
                } else {
                    changeState(STATES.TITLE);
                }
            }
            break;

        case STATES.NAME_ENTRY:
            break;
    }

    clearPressed();
}

export function draw(ctx, drawFrame) {
    // Background - dark wall
    ctx.fillStyle = COLORS.BG;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Wood paneling lines
    ctx.strokeStyle = COLORS.WALL_LINE;
    ctx.lineWidth = 1;
    for (let y = 0; y < GAME_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(GAME_WIDTH, y);
        ctx.stroke();
    }
    // Vertical panel lines
    for (let x = 0; x < GAME_WIDTH; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GAME_HEIGHT);
        ctx.stroke();
    }

    // Vignette
    const gradient = ctx.createRadialGradient(GAME_WIDTH/2, GAME_HEIGHT/2, 100, GAME_WIDTH/2, GAME_HEIGHT/2, 400);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    switch (state) {
        case STATES.TITLE:
            drawLights(ctx, new Set(), new Set(), drawFrame, 'idle');
            drawTitleScreen(ctx, drawFrame, getLeaderboard());
            break;

        case STATES.DIFFICULTY_SELECT:
            drawLights(ctx, new Set(), new Set(), drawFrame, 'idle');
            drawDifficultySelect(ctx, drawFrame);
            break;

        case STATES.PLAYING:
            drawLights(ctx, guessedLetters, wrongLetters, drawFrame, 'playing');
            drawDemogorgon(ctx, revealParts, drawFrame);
            drawWord(ctx, currentWord, guessedLetters, currentWordEntry.category);
            drawHUD(ctx, score, difficulty, wrongCount, wordsCompleted, streak);
            drawParticles(ctx);
            break;

        case STATES.WIN:
            drawLights(ctx, guessedLetters, wrongLetters, drawFrame, 'win');
            drawDemogorgon(ctx, revealParts, drawFrame);
            drawWord(ctx, currentWord, guessedLetters, currentWordEntry.category);
            drawHUD(ctx, score, difficulty, wrongCount, wordsCompleted, streak);
            drawWinScreen(ctx, drawFrame, score);
            drawParticles(ctx);
            break;

        case STATES.LOSE:
            drawLights(ctx, guessedLetters, wrongLetters, drawFrame, 'lose');
            drawDemogorgon(ctx, 10, drawFrame);  // Full reveal
            drawWord(ctx, currentWord, new Set(currentWord.replace(/[^A-Z]/g, '').split('')), currentWordEntry.category); // Reveal all
            drawHUD(ctx, score, difficulty, wrongCount, wordsCompleted, streak);
            drawGameOverScreen(ctx, drawFrame, score);
            drawParticles(ctx);
            break;

        case STATES.GAME_OVER:
            drawLights(ctx, new Set(), new Set(), drawFrame, 'lose');
            drawGameOverScreen(ctx, drawFrame, score);
            break;

        case STATES.NAME_ENTRY:
            break;
    }
}

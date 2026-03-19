import {
    GAME_WIDTH, GAME_HEIGHT, STATES, TOTAL_INNINGS, COLORS,
    STAR_COUNT, STAR_SPEED_MIN, STAR_SPEED_MAX, PITCH_TYPES,
    INNING_START_DURATION, SIDE_CHANGE_DURATION, GAME_OVER_DURATION,
    RESULT_FLASH_DURATION, FIELD_PLAY_DURATION, POINTS,
    ZONE_X, ZONE_Y, ZONE_W, ZONE_H, PLATE_Y
} from './constants.js';
import { initInput, isPressed, isHeld, isSwingPressed, isPitchPressed,
         isConfirmPressed, clearPressed, showTouchControls } from './input.js';
import { createPitch, updatePitch, drawPitchBall } from './ball.js';
import { createPitcher, cpuSelectPitch, updatePitcherCycle, startWindup,
         updateWindup, updateRelease, getCurrentPitchType, drawPitcher,
         drawPitchSelector } from './pitcher.js';
import { createBatter, startSwing, updateSwing, determineHitResult,
         cpuBatterSwingOffset, getHitPoints, drawBatter, drawTimingFlash } from './batter.js';
import { createRunners, advanceRunners, updateRunnerAnimations,
         drawField, drawRunners } from './field.js';
import { createFieldBall, updateFieldBall, drawFieldBall } from './ball.js';
import { drawHUD, drawBaseIndicator } from './hud.js';
import { drawTitleScreen, drawModeSelect, drawLobby, drawInningStart,
         drawResultFlash, drawGameOver, drawSideChange } from './screens.js';
import { initAudio, playBatCrack, playSwingMiss, playPitchThrow,
         playHomeRun, playStrikeout, playCrowdCheer, playOrganCharge,
         playGameOver as playGameOverSound, playStartGame, playStrikeCalled } from './audio.js';
import { refreshLeaderboard, getLeaderboard, getHighScore, saveScore } from './leaderboard.js';
import {
    createRoom, joinRoom, sendMessage, onMessage, onStatus,
    isHost, isConnected, getRoomCode, disconnect
} from './multiplayer.js';

let state = STATES.TITLE;
let stateTimer = 0;
let stars = [];

// Game state
let gs = null;
let pitcher = null;
let batter = null;
let currentBall = null;
let runners = null;
let fieldBall = null;

// Mode
let isMultiplayer = false;
let modeSelection = 0; // 0=CPU, 1=Friend

// Lobby
let lobbyStatus = '';
let codeInput = '';
let isHosting = false;
let lobbyAction = null; // null, 'pick', 'create', 'join'
let lobbySelection = 0; // 0=create, 1=join

// Result display
let resultText = '';
let resultSubtext = '';
let resultTimer = 0;
let timingText = '';
let timingTimer = 0;

// CPU difficulty
let cpuPitchDelay = 0;
let cpuSwingScheduled = false;
let cpuSwingFrame = 0;
let ballInPlayDelay = 0; // frames to wait before next at-bat

// Name entry DOM
let nameOverlay, nameInput, nameSubmit, nameScoreEl;

// Who controls what this half-inning
// In solo: player always bats at bottom, CPU bats at top
// In multiplayer: host=home(bottom batter), guest=away(top batter)
function playerIsBatting() {
    if (!isMultiplayer) {
        return gs.halfInning === 'bottom';
    }
    // Multiplayer: host bats in bottom, guest bats in top
    if (isHost()) return gs.halfInning === 'bottom';
    return gs.halfInning === 'top';
}

function resetGameState() {
    gs = {
        homeScore: 0,
        awayScore: 0,
        inning: 1,
        halfInning: 'top',
        outs: 0,
        balls: 0,
        strikes: 0,
        arcadeScore: 0,
        isMultiplayer: isMultiplayer
    };
    runners = createRunners();
    pitcher = createPitcher();
    batter = createBatter();
    currentBall = null;
    fieldBall = null;
    resultText = '';
    resultSubtext = '';
    resultTimer = 0;
    timingText = '';
    timingTimer = 0;
}

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
    for (const s of stars) {
        s.y += s.speed;
        if (s.y > GAME_HEIGHT) { s.y = 0; s.x = Math.random() * GAME_WIDTH; }
    }
}

function drawStars(ctx) {
    for (const s of stars) {
        ctx.fillStyle = `rgba(255,255,255,${s.brightness})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
    }
}

function changeState(newState) {
    state = newState;
    stateTimer = 0;

    // Touch control visibility
    if (newState === STATES.AT_BAT && playerIsBatting()) {
        showTouchControls('batting');
    } else if (newState === STATES.PITCHING || (newState === STATES.AT_BAT && !playerIsBatting())) {
        showTouchControls('pitching');
    } else {
        showTouchControls('none');
    }

    if (newState === STATES.TITLE) {
        refreshLeaderboard();
    }
}

function startAtBat() {
    currentBall = null;
    batter = createBatter();
    pitcher = createPitcher();
    cpuPitchDelay = 0;
    cpuSwingScheduled = false;

    if (playerIsBatting()) {
        // Player bats, CPU/opponent pitches
        changeState(STATES.AT_BAT);
    } else {
        // CPU/opponent bats, player pitches
        changeState(STATES.AT_BAT);
    }
}

function throwPitch(pitchTypeIndex) {
    pitcher.selectedPitch = pitchTypeIndex;
    startWindup(pitcher);
    playPitchThrow();
}

function handlePitchRelease() {
    const pitchType = getCurrentPitchType(pitcher);
    currentBall = createPitch(pitchType);

    if (isMultiplayer && isConnected()) {
        sendMessage({
            type: 'pitch',
            pitchIndex: pitcher.selectedPitch,
            frame: stateTimer
        });
    }
}

function handleSwing() {
    if (!currentBall || batter.swinging) return;

    startSwing(batter);

    // Calculate timing offset
    const framesRemaining = currentBall.totalFrames - currentBall.frame;
    const offset = -framesRemaining; // negative = early

    const result = determineHitResult(offset);

    timingText = result.timing;
    timingTimer = 0;

    if (result.result === 'whiff') {
        // Swing and miss
        playSwingMiss();
        gs.strikes++;
        if (gs.strikes >= 3) {
            resultText = 'STRIKE OUT!';
            resultSubtext = '';
            resultTimer = 0;
            playStrikeout();
            gs.outs++;
            if (!playerIsBatting()) {
                gs.arcadeScore += POINTS.STRIKEOUT_PITCHED;
            }
            currentBall = null;
            if (gs.outs >= 3) {
                changeState(STATES.SIDE_CHANGE);
            } else {
                gs.balls = 0;
                gs.strikes = 0;
                ballInPlayDelay = 60;
                changeState(STATES.BALL_IN_PLAY);
            }
        }
    } else {
        // Ball in play!
        playBatCrack();
        currentBall.active = false;
        handleHit(result.result);
    }

    if (isMultiplayer && isConnected()) {
        sendMessage({
            type: 'swing',
            offset: offset,
            frame: stateTimer
        });
    }
}

function handleHit(hitType) {
    // Advance runners
    const result = advanceRunners(runners, hitType);

    // Score runs
    if (gs.halfInning === 'top') {
        gs.awayScore += result.runs;
    } else {
        gs.homeScore += result.runs;
    }

    // Arcade points (for the batter)
    if (playerIsBatting()) {
        gs.arcadeScore += getHitPoints(hitType, result.runs);
    }

    // Result text
    switch (hitType) {
        case 'homerun':
            resultText = 'HOME RUN!';
            playHomeRun();
            playCrowdCheer();
            break;
        case 'triple':
            resultText = 'TRIPLE!';
            playCrowdCheer();
            break;
        case 'double':
            resultText = 'DOUBLE!';
            break;
        case 'single':
            resultText = 'SINGLE!';
            break;
        case 'error':
            resultText = 'ERROR!';
            break;
        case 'out':
            resultText = 'OUT!';
            gs.outs++;
            break;
        case 'sacrifice':
            resultText = 'SAC FLY!';
            gs.outs += result.outs; // sacrifice returns outs=1
            break;
    }

    if (hitType === 'homerun' && result.runs > 1) {
        resultSubtext = result.runs + '-RUN HOMER!';
    } else if (result.runs > 0 && hitType !== 'homerun') {
        resultSubtext = result.runs + ' RUN' + (result.runs > 1 ? 'S' : '') + ' SCORED!';
    } else {
        resultSubtext = '';
    }
    resultTimer = 0;

    // Create field ball animation
    fieldBall = createFieldBall(hitType, 240, 400);

    changeState(STATES.FIELD_PLAY);
}

function handleBallCalled() {
    // Ball 4 — walk (gs.balls already incremented by caller)
    resultText = 'WALK!';
    resultSubtext = '';
    resultTimer = 0;

    // Advance runners for walk
    if (runners.onBase[0]) {
        if (runners.onBase[1]) {
            if (runners.onBase[2]) {
                // Bases loaded walk — score a run
                if (gs.halfInning === 'top') gs.awayScore++;
                else gs.homeScore++;
                resultSubtext = 'RUN SCORED!';
                if (playerIsBatting()) gs.arcadeScore += POINTS.RBI;
            }
            runners.onBase[2] = true;
        }
        runners.onBase[1] = true;
    }
    runners.onBase[0] = true;

    gs.balls = 0;
    gs.strikes = 0;
    currentBall = null;
    ballInPlayDelay = 70;
    changeState(STATES.BALL_IN_PLAY);
}

function sideChange() {
    gs.outs = 0;
    gs.balls = 0;
    gs.strikes = 0;
    runners = createRunners();

    if (gs.halfInning === 'top') {
        gs.halfInning = 'bottom';
    } else {
        gs.halfInning = 'top';
        gs.inning++;
    }

    // Check if game over
    if (gs.inning > TOTAL_INNINGS) {
        if (gs.homeScore !== gs.awayScore) {
            // Game over
            if (gs.homeScore > gs.awayScore) {
                gs.arcadeScore += POINTS.WIN;
            }
            playGameOverSound();
            changeState(STATES.GAME_OVER);
            return;
        }
        // Tie — extra innings (keep going)
    }

    // Also check if bottom of last inning and home is ahead
    if (gs.inning === TOTAL_INNINGS && gs.halfInning === 'bottom' && gs.homeScore > gs.awayScore) {
        gs.arcadeScore += POINTS.WIN;
        playGameOverSound();
        changeState(STATES.GAME_OVER);
        return;
    }

    changeState(STATES.INNING_START);
}

function showNameEntry() {
    nameScoreEl.textContent = 'PTS: ' + gs.arcadeScore.toString().padStart(6, '0');
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
    if (name.length === 0) name = 'SLUGGER';
    hideNameEntry();

    saveScore(name, gs.arcadeScore).then(() => {
        if (isMultiplayer) disconnect();
        changeState(STATES.TITLE);
    });
}

// Multiplayer message handler
function handleMultiplayerMessage(data) {
    if (data.type === 'pitch') {
        // Opponent threw a pitch
        pitcher.selectedPitch = data.pitchIndex;
        startWindup(pitcher);
    }
    if (data.type === 'swing') {
        // Opponent swung
        startSwing(batter);
        const result = determineHitResult(data.offset);
        timingText = result.timing;
        timingTimer = 0;

        if (result.result === 'whiff') {
            playSwingMiss();
            gs.strikes++;
            if (gs.strikes >= 3) {
                resultText = 'STRIKE OUT!';
                resultTimer = 0;
                playStrikeout();
                gs.outs++;
                if (playerIsBatting()) {
                    // We were pitching — we get the K points
                } else {
                    gs.arcadeScore += POINTS.STRIKEOUT_PITCHED;
                }
                currentBall = null;
                if (gs.outs >= 3) {
                    changeState(STATES.SIDE_CHANGE);
                } else {
                    gs.balls = 0;
                    gs.strikes = 0;
                    ballInPlayDelay = 60;
                    changeState(STATES.BALL_IN_PLAY);
                }
            }
        } else {
            playBatCrack();
            if (currentBall) currentBall.active = false;
            handleHit(result.result);
        }
    }
    if (data.type === 'ready') {
        // Both connected, start game
        changeState(STATES.INNING_START);
    }
}

// ---- INIT ----
export function init() {
    initInput();
    initAudio();
    initStars();

    refreshLeaderboard();

    onMessage(handleMultiplayerMessage);
    onStatus((msg) => { lobbyStatus = msg; });

    // Name entry DOM
    nameOverlay = document.getElementById('nameOverlay');
    nameInput = document.getElementById('nameInput');
    nameSubmit = document.getElementById('nameSubmit');
    nameScoreEl = document.getElementById('nameScore');

    nameSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        submitName();
    });
    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); submitName(); }
        e.stopPropagation();
    });
    nameInput.addEventListener('keyup', (e) => e.stopPropagation());
}

// ---- UPDATE ----
export function update() {
    stateTimer++;
    updateStars();

    switch (state) {
        case STATES.TITLE:
            if (isPressed('Enter') || isConfirmPressed()) {
                changeState(STATES.MODE_SELECT);
            }
            break;

        case STATES.MODE_SELECT:
            if (isPressed('ArrowUp') || isPressed('ArrowLeft')) {
                modeSelection = 0;
            }
            if (isPressed('ArrowDown') || isPressed('ArrowRight')) {
                modeSelection = 1;
            }
            if (isPressed('Enter') || isConfirmPressed()) {
                if (modeSelection === 0) {
                    // VS CPU
                    isMultiplayer = false;
                    resetGameState();
                    playStartGame();
                    changeState(STATES.INNING_START);
                } else {
                    // VS FRIEND
                    isMultiplayer = true;
                    codeInput = '';
                    lobbyStatus = '';
                    lobbyAction = 'pick';
                    lobbySelection = 0;
                    changeState(STATES.LOBBY);
                }
            }
            if (isPressed('Escape')) {
                changeState(STATES.TITLE);
            }
            break;

        case STATES.LOBBY:
            updateLobby();
            break;

        case STATES.INNING_START:
            if (stateTimer >= INNING_START_DURATION) {
                playOrganCharge();
                startAtBat();
            }
            break;

        case STATES.AT_BAT:
            updateAtBat();
            break;

        case STATES.BALL_IN_PLAY:
            // Brief pause showing result, then next at-bat
            updateSwing(batter);
            if (stateTimer >= ballInPlayDelay) {
                if (gs.outs >= 3) {
                    changeState(STATES.SIDE_CHANGE);
                } else {
                    startAtBat();
                }
            }
            break;

        case STATES.FIELD_PLAY:
            updateFieldPlay();
            break;

        case STATES.SIDE_CHANGE:
            if (stateTimer >= SIDE_CHANGE_DURATION) {
                sideChange();
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

    // Update timing flash
    if (timingText) {
        timingTimer++;
        if (timingTimer > 40) timingText = '';
    }

    // Update result text
    if (resultText) {
        resultTimer++;
    }

    clearPressed();
}

function updateLobby() {
    if (isPressed('Escape')) {
        disconnect();
        changeState(STATES.MODE_SELECT);
        return;
    }

    if (lobbyAction === 'pick') {
        // Choose create or join
        if (isPressed('ArrowUp') || isPressed('ArrowLeft')) lobbySelection = 0;
        if (isPressed('ArrowDown') || isPressed('ArrowRight')) lobbySelection = 1;

        if (isPressed('Enter') || isConfirmPressed()) {
            if (lobbySelection === 0) {
                lobbyAction = 'create';
                isHosting = true;
                createRoom().then((code) => {
                    if (!code) lobbyAction = 'pick';
                });
            } else {
                lobbyAction = 'join';
                isHosting = false;
                codeInput = '';
            }
        }
        return;
    }

    if (lobbyAction === 'create') {
        if (isConnected()) {
            resetGameState();
            playStartGame();
            sendMessage({ type: 'ready' });
            changeState(STATES.INNING_START);
        }
        return;
    }

    if (lobbyAction === 'join') {
        // Type room code
        for (let d = 0; d <= 9; d++) {
            if (isPressed('Digit' + d) || isPressed('Numpad' + d)) {
                if (codeInput.length < 4) codeInput += String(d);
            }
        }
        if (isPressed('Backspace')) {
            codeInput = codeInput.slice(0, -1);
        }

        if (isPressed('Enter') && codeInput.length === 4) {
            lobbyAction = 'connecting';
            joinRoom(codeInput).then((success) => {
                if (success) {
                    resetGameState();
                    playStartGame();
                    sendMessage({ type: 'ready' });
                    changeState(STATES.INNING_START);
                } else {
                    lobbyAction = 'join';
                    codeInput = '';
                }
            });
        }
    }
}

function updateAtBat() {
    const released = updateWindup(pitcher);
    if (released) {
        handlePitchRelease();
        // Schedule CPU swing when player is pitching in solo mode
        if (!playerIsBatting() && !isMultiplayer && currentBall) {
            cpuSwingScheduled = true;
            const difficulty = 0.3 + Math.random() * 0.4;
            const offset = cpuBatterSwingOffset(difficulty);
            cpuSwingFrame = currentBall.totalFrames + offset;
        }
    }
    updateRelease(pitcher);
    updateSwing(batter);

    if (currentBall) {
        updatePitch(currentBall);

        // Check if ball reached plate without a swing
        if (currentBall.reachedPlate && !batter.swinging) {
            const inZone = Math.abs(currentBall.x - ZONE_X) < ZONE_W / 2;

            if (inZone) {
                gs.strikes++;
                playStrikeCalled();
                if (gs.strikes >= 3) {
                    resultText = 'STRIKE OUT!';
                    resultSubtext = '';
                    resultTimer = 0;
                    playStrikeout();
                    gs.outs++;
                    if (!playerIsBatting()) {
                        gs.arcadeScore += POINTS.STRIKEOUT_PITCHED;
                    }
                    currentBall = null;
                    if (gs.outs >= 3) {
                        changeState(STATES.SIDE_CHANGE);
                    } else {
                        gs.balls = 0;
                        gs.strikes = 0;
                        ballInPlayDelay = 50;
                        changeState(STATES.BALL_IN_PLAY);
                    }
                    return;
                }
            } else {
                gs.balls++;
                if (gs.balls >= 4) {
                    handleBallCalled();
                    return;
                }
            }
            currentBall = null;
            cpuPitchDelay = 0;
            return;
        }
    }

    if (playerIsBatting()) {
        // Player is batting
        if (isSwingPressed() && currentBall && !batter.swinging) {
            handleSwing();
        }

        // CPU pitching
        if (!currentBall && !pitcher.isWindingUp) {
            cpuPitchDelay++;
            if (cpuPitchDelay > 40) {
                throwPitch(cpuSelectPitch());
            }
        }
    } else {
        // Player is pitching (or CPU batting)
        if (!isMultiplayer) {
            // Player pitches
            updatePitcherCycle(pitcher);

            if (isPressed('ArrowLeft')) {
                pitcher.selectedPitch = (pitcher.selectedPitch - 1 + PITCH_TYPES.length) % PITCH_TYPES.length;
                pitcher.pitchCycleFrame = 0;
            }
            if (isPressed('ArrowRight')) {
                pitcher.selectedPitch = (pitcher.selectedPitch + 1) % PITCH_TYPES.length;
                pitcher.pitchCycleFrame = 0;
            }

            if (isPitchPressed() && !currentBall && !pitcher.isWindingUp) {
                throwPitch(pitcher.selectedPitch);
            }

            // CPU batter swing
            if (cpuSwingScheduled && currentBall) {
                if (currentBall.frame >= cpuSwingFrame) {
                    cpuSwingScheduled = false;
                    // CPU decides whether to swing
                    if (Math.random() < 0.75) {
                        handleSwing();
                    }
                    // If doesn't swing, ball passes (called strike/ball)
                }
            }
        } else {
            // Multiplayer: wait for opponent's actions via messages
            // Player pitches with controls
            if (isPressed('ArrowLeft')) {
                pitcher.selectedPitch = (pitcher.selectedPitch - 1 + PITCH_TYPES.length) % PITCH_TYPES.length;
            }
            if (isPressed('ArrowRight')) {
                pitcher.selectedPitch = (pitcher.selectedPitch + 1) % PITCH_TYPES.length;
            }
            if (isPitchPressed() && !currentBall && !pitcher.isWindingUp) {
                throwPitch(pitcher.selectedPitch);
                sendMessage({
                    type: 'pitch',
                    pitchIndex: pitcher.selectedPitch
                });
            }
            if (pitcher.isWindingUp) {
                const released = updateWindup(pitcher);
                if (released) handlePitchRelease();
            }
        }
    }
}

function updateFieldPlay() {
    if (fieldBall) {
        updateFieldBall(fieldBall);
    }
    updateRunnerAnimations(runners);

    if (stateTimer >= FIELD_PLAY_DURATION) {
        fieldBall = null;
        gs.balls = 0;
        gs.strikes = 0;

        if (gs.outs >= 3) {
            changeState(STATES.SIDE_CHANGE);
        } else {
            startAtBat();
        }
    }
}

// ---- DRAW ----
export function draw(ctx, drawFrame) {
    // Background
    ctx.fillStyle = COLORS.BG;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    switch (state) {
        case STATES.TITLE:
            drawStars(ctx);
            drawTitleScreen(ctx, drawFrame, getLeaderboard());
            break;

        case STATES.MODE_SELECT:
            drawStars(ctx);
            drawModeSelect(ctx, drawFrame, modeSelection);
            break;

        case STATES.LOBBY:
            drawStars(ctx);
            drawLobby(ctx, drawFrame, lobbyAction, lobbySelection,
                       getRoomCode(), lobbyStatus, codeInput);
            break;

        case STATES.INNING_START:
            drawStars(ctx);
            drawInningStart(ctx, gs.inning, gs.halfInning, stateTimer);
            drawHUD(ctx, gs);
            break;

        case STATES.AT_BAT:
        case STATES.BALL_IN_PLAY:
            drawBattingView(ctx, drawFrame);
            break;

        case STATES.FIELD_PLAY:
            drawFieldView(ctx, drawFrame);
            break;

        case STATES.SIDE_CHANGE:
            drawStars(ctx);
            const nextHalf = gs.halfInning === 'top' ? 'bottom' : 'top';
            const nextInn = gs.halfInning === 'top' ? gs.inning : gs.inning + 1;
            drawSideChange(ctx, stateTimer, nextHalf, nextInn);
            drawHUD(ctx, gs);
            break;

        case STATES.GAME_OVER:
            drawStars(ctx);
            drawGameOver(ctx, gs.homeScore, gs.awayScore, gs.arcadeScore, drawFrame);
            break;

        case STATES.NAME_ENTRY:
            drawStars(ctx);
            break;
    }
}

function drawBattingView(ctx, drawFrame) {
    // Sky gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    grad.addColorStop(0, '#000a1f');
    grad.addColorStop(0.6, '#001133');
    grad.addColorStop(1, '#0a2a0a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    drawStars(ctx);

    // Ground
    ctx.fillStyle = COLORS.DIRT;
    ctx.fillRect(0, PLATE_Y + 30, GAME_WIDTH, GAME_HEIGHT - PLATE_Y - 30);

    // Pitcher's mound area
    ctx.fillStyle = COLORS.MOUND;
    ctx.beginPath();
    ctx.ellipse(GAME_WIDTH / 2, 155, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Home plate (pentagon)
    const hpX = ZONE_X;
    const hpY = PLATE_Y + 12;
    const hpW = 22;
    const hpH = 16;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(hpX, hpY + hpH);           // bottom point
    ctx.lineTo(hpX - hpW, hpY + 4);       // bottom-left
    ctx.lineTo(hpX - hpW, hpY - hpH + 4); // top-left
    ctx.lineTo(hpX + hpW, hpY - hpH + 4); // top-right
    ctx.lineTo(hpX + hpW, hpY + 4);       // bottom-right
    ctx.closePath();
    ctx.fill();
    // Dark outline
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Strike zone box
    ctx.strokeStyle = COLORS.STRIKE_ZONE_BORDER;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(ZONE_X - ZONE_W / 2, ZONE_Y - ZONE_H / 2, ZONE_W, ZONE_H);
    ctx.setLineDash([]);
    ctx.fillStyle = COLORS.STRIKE_ZONE;
    ctx.fillRect(ZONE_X - ZONE_W / 2, ZONE_Y - ZONE_H / 2, ZONE_W, ZONE_H);

    // Pitcher
    drawPitcher(ctx, pitcher, drawFrame);

    // Batter
    drawBatter(ctx, batter, drawFrame);

    // Ball
    if (currentBall) {
        drawPitchBall(ctx, currentBall);
    }

    // Role banner + prompts
    if (state === STATES.AT_BAT) {
        ctx.textAlign = 'center';

        if (playerIsBatting()) {
            // Player is BATTING
            // Role banner
            ctx.font = '10px "Press Start 2P", monospace';
            ctx.fillStyle = '#ff4444';
            ctx.fillText('YOUR AT BAT', GAME_WIDTH / 2, GAME_HEIGHT - 30);

            // Swing prompt when ball is in the air
            if (currentBall && !batter.swinging) {
                if (Math.floor(drawFrame / 8) % 2 === 0) {
                    ctx.font = '16px "Press Start 2P", monospace';
                    ctx.fillStyle = '#ffff00';
                    ctx.fillText('SPACE = SWING!', GAME_WIDTH / 2, GAME_HEIGHT - 60);
                }
            } else if (!currentBall && !pitcher.isWindingUp) {
                ctx.font = '8px "Press Start 2P", monospace';
                ctx.fillStyle = '#888888';
                ctx.fillText('WAIT FOR PITCH...', GAME_WIDTH / 2, GAME_HEIGHT - 60);
            }
        } else {
            // Player is PITCHING
            if (!currentBall && !pitcher.isWindingUp) {
                drawPitchSelector(ctx, pitcher, drawFrame);

                // Role banner
                ctx.textAlign = 'center';
                ctx.font = '10px "Press Start 2P", monospace';
                ctx.fillStyle = '#4488ff';
                ctx.fillText('YOU ARE PITCHING', GAME_WIDTH / 2, GAME_HEIGHT - 30);
                ctx.font = '8px "Press Start 2P", monospace';
                ctx.fillStyle = '#888888';
                ctx.fillText('<< ARROWS >>  SPACE = THROW', GAME_WIDTH / 2, GAME_HEIGHT - 55);
            } else {
                ctx.font = '10px "Press Start 2P", monospace';
                ctx.fillStyle = '#4488ff';
                ctx.fillText('YOU ARE PITCHING', GAME_WIDTH / 2, GAME_HEIGHT - 30);
            }
        }
    }

    // Timing flash
    if (timingText) {
        drawTimingFlash(ctx, timingText, timingTimer);
    }

    // Result flash
    if (resultText && resultTimer < RESULT_FLASH_DURATION) {
        drawResultFlash(ctx, resultText, resultSubtext, resultTimer);
    }

    // HUD
    drawHUD(ctx, gs);
    drawBaseIndicator(ctx, runners.onBase);
}

function drawFieldView(ctx, drawFrame) {
    drawField(ctx);
    drawRunners(ctx, runners, drawFrame);

    if (fieldBall) {
        drawFieldBall(ctx, fieldBall);
    }

    // Result flash overlay
    if (resultText && resultTimer < RESULT_FLASH_DURATION + 30) {
        drawResultFlash(ctx, resultText, resultSubtext, resultTimer);
    }

    // HUD on top
    drawHUD(ctx, gs);
    drawBaseIndicator(ctx, runners.onBase);
}

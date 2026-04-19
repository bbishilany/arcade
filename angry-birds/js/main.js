// Angry Birds — Main game loop
import { Vec2, Body, PhysicsWorld } from './physics.js';
import { Renderer } from './renderer.js';
import { LEVELS } from './levels.js';
import { ParticleSystem } from './particles.js';
import { SFX } from './audio.js';
import { addScore, isHighScore } from './leaderboard.js';

// ── Game state ──────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const renderer = new Renderer(canvas);

let state = 'title'; // title | playing | aiming | flying | settling | levelComplete | gameOver
let world, particles;
let currentLevel = 0;
let score = 0;
let birdsQueue = [];
let currentBird = null;
let pigs = [];
let blocks = [];
let trajectoryDots = [];
let settleTimer = 0;
let levelCompleteTimer = 0;

// Slingshot position
const SLING = { x: 180, y: 0 }; // y set relative to ground
let slingshotPos = new Vec2();
let pullStart = null;
let pullCurrent = null;
let isPulling = false;
const MAX_PULL = 100;
const LAUNCH_POWER = 8;

// ── Level loading ───────────────────────────────────────────
function loadLevel(idx) {
    const level = LEVELS[idx];
    if (!level) {
        state = 'gameOver';
        SFX.levelComplete();
        return;
    }

    const groundY = renderer.groundY;
    world = new PhysicsWorld(groundY);
    particles = new ParticleSystem();
    pigs = [];
    blocks = [];
    trajectoryDots = [];
    settleTimer = 0;
    levelCompleteTimer = 0;

    slingshotPos = new Vec2(SLING.x, groundY - 10);

    // Birds
    birdsQueue = [...level.birds];
    currentBird = null;

    // Pigs
    for (const p of level.pigs) {
        const pig = world.add(new Body(p.x, groundY + p.y, {
            type: 'circle',
            radius: p.radius || 18,
            mass: 3,
            restitution: 0.2,
            friction: 0.6,
            hp: 80,
            tag: 'pig',
        }));
        pigs.push(pig);
    }

    // Blocks
    for (const b of level.blocks) {
        const materialProps = {
            wood: { hp: 80, mass: 2, restitution: 0.2 },
            stone: { hp: 200, mass: 5, restitution: 0.1 },
            ice: { hp: 40, mass: 1, restitution: 0.3 },
        };
        const mp = materialProps[b.material] || materialProps.wood;
        const block = world.add(new Body(b.x, groundY + b.y, {
            type: 'rect',
            width: b.w,
            height: b.h,
            mass: mp.mass,
            restitution: mp.restitution,
            friction: 0.7,
            hp: mp.hp,
            tag: 'block',
            userData: { material: b.material },
        }));
        blocks.push(block);
    }

    loadNextBird();
    state = 'playing';
}

function loadNextBird() {
    if (birdsQueue.length === 0) {
        currentBird = null;
        return;
    }
    const type = birdsQueue.shift();
    currentBird = world.add(new Body(slingshotPos.x, slingshotPos.y - 55, {
        type: 'circle',
        radius: type === 'black' ? 20 : (type === 'blue' ? 12 : 16),
        mass: type === 'black' ? 6 : (type === 'blue' ? 1.5 : 3),
        restitution: 0.3,
        friction: 0.5,
        hp: 9999,
        tag: 'bird',
        userData: { birdType: type, launched: false, ability: false },
        isStatic: true,
    }));
}

// ── Input handling ──────────────────────────────────────────
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
        return new Vec2(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
    return new Vec2(e.clientX - rect.left, e.clientY - rect.top);
}

function onDown(e) {
    e.preventDefault();
    const pos = getPos(e);

    if (state === 'title') {
        SFX.click();
        currentLevel = 0;
        score = 0;
        loadLevel(0);
        return;
    }

    if (state === 'levelComplete') {
        if (levelCompleteTimer > 60) {
            SFX.click();
            currentLevel++;
            if (currentLevel >= LEVELS.length) {
                state = 'gameOver';
            } else {
                loadLevel(currentLevel);
            }
        }
        return;
    }

    if (state === 'gameOver') {
        SFX.click();
        handleGameOver();
        return;
    }

    if (state === 'flying') {
        // Activate bird ability mid-flight
        if (currentBird && !currentBird.userData.ability) {
            activateBirdAbility();
        }
        return;
    }

    if (state === 'playing' && currentBird) {
        const dist = pos.sub(currentBird.pos).len();
        if (dist < 60) {
            isPulling = true;
            pullStart = pos;
            pullCurrent = pos;
            state = 'aiming';
        }
    }
}

function onMove(e) {
    e.preventDefault();
    if (state !== 'aiming' || !isPulling) return;
    pullCurrent = getPos(e);

    // Clamp pull distance
    const diff = pullCurrent.sub(slingshotPos);
    const dist = diff.len();
    if (dist > MAX_PULL) {
        pullCurrent = slingshotPos.add(diff.norm().mul(MAX_PULL));
    }

    // Position bird at pull point
    currentBird.pos = pullCurrent.clone();

    // Calculate trajectory preview
    const launchVel = slingshotPos.sub(pullCurrent).mul(LAUNCH_POWER);
    trajectoryDots = computeTrajectory(pullCurrent, launchVel, 25);

    SFX.stretch();
}

function onUp(e) {
    e.preventDefault();
    if (state !== 'aiming' || !isPulling) return;

    isPulling = false;
    trajectoryDots = [];

    const diff = slingshotPos.sub(currentBird.pos);
    const dist = diff.len();

    if (dist < 10) {
        // Didn't pull far enough — snap back
        currentBird.pos = new Vec2(slingshotPos.x, slingshotPos.y - 55);
        state = 'playing';
        return;
    }

    // Launch!
    currentBird.isStatic = false;
    currentBird.invMass = 1 / currentBird.mass;
    currentBird.vel = diff.mul(LAUNCH_POWER);
    currentBird.userData.launched = true;
    state = 'flying';
    SFX.launch();
}

function activateBirdAbility() {
    if (!currentBird) return;
    const type = currentBird.userData.birdType;
    currentBird.userData.ability = true;

    if (type === 'yellow') {
        // Speed boost
        const dir = currentBird.vel.norm();
        currentBird.vel = dir.mul(currentBird.vel.len() * 2.5);
        SFX.launch();
    } else if (type === 'blue') {
        // Split into 3
        const baseVel = currentBird.vel.clone();
        for (let i = -1; i <= 1; i += 2) {
            const angle = Math.atan2(baseVel.y, baseVel.x) + i * 0.25;
            const speed = baseVel.len();
            const splitBird = world.add(new Body(
                currentBird.pos.x + i * 8,
                currentBird.pos.y,
                {
                    type: 'circle',
                    radius: 10,
                    mass: 1,
                    restitution: 0.3,
                    friction: 0.5,
                    hp: 9999,
                    tag: 'bird',
                    userData: { birdType: 'blue', launched: true, ability: true },
                }
            ));
            splitBird.vel = new Vec2(Math.cos(angle) * speed, Math.sin(angle) * speed);
        }
        SFX.launch();
    } else if (type === 'black') {
        // Explode — damage everything nearby
        const pos = currentBird.pos;
        const BLAST_RADIUS = 120;
        const BLAST_FORCE = 500;

        for (const body of world.bodies) {
            if (body === currentBird || body.isStatic) continue;
            const diff = body.pos.sub(pos);
            const dist = diff.len();
            if (dist < BLAST_RADIUS && dist > 0) {
                const force = diff.norm().mul(BLAST_FORCE * (1 - dist / BLAST_RADIUS));
                body.vel = body.vel.add(force);
                body.damage(150 * (1 - dist / BLAST_RADIUS));
            }
        }

        particles.emit(pos.x, pos.y, 30, '#ff6600', { speed: 250, size: 6, decay: 0.02 });
        particles.emit(pos.x, pos.y, 20, '#ff0', { speed: 200, size: 4, decay: 0.025 });
        particles.emit(pos.x, pos.y, 15, '#fff', { speed: 180, size: 3, decay: 0.03 });

        SFX.destroy();
        currentBird.destroyed = true;
    } else if (type === 'white') {
        // Drop egg bomb
        const egg = world.add(new Body(currentBird.pos.x, currentBird.pos.y, {
            type: 'circle',
            radius: 10,
            mass: 4,
            restitution: 0.1,
            friction: 0.3,
            hp: 9999,
            tag: 'bird',
            userData: { birdType: 'white' },
        }));
        egg.vel = new Vec2(0, 400);

        // Bird pops up
        currentBird.vel = new Vec2(currentBird.vel.x * 0.5, -300);
        SFX.launch();
    }
}

function computeTrajectory(startPos, startVel, steps) {
    const dots = [];
    let px = startPos.x, py = startPos.y;
    let vx = startVel.x, vy = startVel.y;
    const dt = 1 / 60;
    for (let i = 0; i < steps; i++) {
        vx *= 0.98;
        vy += 800 * dt;
        vy *= 0.98;
        px += vx * dt;
        py += vy * dt;
        if (i % 2 === 0) dots.push(new Vec2(px, py));
        if (py > renderer.groundY) break;
    }
    return dots;
}

// ── Game events ─────────────────────────────────────────────
function checkDestructions() {
    // Check for destroyed blocks
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        if (block.destroyed) {
            const material = block.userData.material || 'wood';
            particles.emitDestruction(block.pos.x, block.pos.y, material);
            const points = material === 'stone' ? 500 : material === 'ice' ? 200 : 300;
            score += points;
            particles.emitScore(block.pos.x, block.pos.y);
            SFX.destroy();
            blocks.splice(i, 1);
        }
    }

    // Check for destroyed pigs
    for (let i = pigs.length - 1; i >= 0; i--) {
        const pig = pigs[i];
        if (pig.destroyed) {
            particles.emitDestruction(pig.pos.x, pig.pos.y, 'pig');
            score += 5000;
            particles.emitScore(pig.pos.x, pig.pos.y);
            SFX.pigDeath();
            pigs.splice(i, 1);
        }
    }
}

function checkLevelComplete() {
    if (pigs.length === 0) {
        // Bonus for remaining birds
        score += birdsQueue.length * 10000;
        state = 'levelComplete';
        levelCompleteTimer = 0;
        SFX.levelComplete();
        return true;
    }
    return false;
}

function getStars() {
    const level = LEVELS[currentLevel];
    const maxPigs = level.pigs.length;
    const baseScore = maxPigs * 5000;
    if (score >= baseScore * 3) return 3;
    if (score >= baseScore * 2) return 2;
    return 1;
}

function handleGameOver() {
    if (isHighScore(score)) {
        showNameEntry();
    } else {
        state = 'title';
    }
}

function showNameEntry() {
    const overlay = document.getElementById('nameOverlay');
    const scoreEl = document.getElementById('nameScore');
    const input = document.getElementById('nameInput');
    const submit = document.getElementById('nameSubmit');

    scoreEl.textContent = `SCORE: ${score}`;
    overlay.style.display = 'flex';
    input.value = '';
    input.focus();

    const doSubmit = () => {
        const name = input.value.trim() || 'AAA';
        addScore(name, score);
        overlay.style.display = 'none';
        state = 'title';
        submit.removeEventListener('click', doSubmit);
        input.removeEventListener('keydown', onKey);
    };

    const onKey = (e) => {
        if (e.key === 'Enter') doSubmit();
    };

    submit.addEventListener('click', doSubmit);
    input.addEventListener('keydown', onKey);
}

// ── Input listeners ─────────────────────────────────────────
canvas.addEventListener('mousedown', onDown);
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mouseup', onUp);
canvas.addEventListener('touchstart', onDown, { passive: false });
canvas.addEventListener('touchmove', onMove, { passive: false });
canvas.addEventListener('touchend', onUp, { passive: false });

// ── Game loop ───────────────────────────────────────────────
let lastTime = 0;

function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 1 / 30);
    lastTime = timestamp;

    // ── Update ──
    if (state === 'flying' || state === 'settling') {
        world.update(dt);
        particles.update(dt);
        checkDestructions();

        // Check if bird has stopped or gone off screen
        if (state === 'flying' && currentBird) {
            const b = currentBird;
            if (b.destroyed || b.pos.x > canvas.width + 100 || b.pos.y > renderer.groundY + 100) {
                state = 'settling';
                settleTimer = 0;
            } else if (b.userData.launched && b.isSleeping()) {
                state = 'settling';
                settleTimer = 0;
            }
        }

        if (state === 'settling') {
            settleTimer++;
            if (settleTimer > 90) { // ~1.5 seconds to let physics settle
                if (checkLevelComplete()) {
                    // Level complete handled
                } else if (birdsQueue.length > 0 || currentBird) {
                    // Remove used bird and load next
                    if (currentBird) {
                        world.remove(currentBird);
                        currentBird = null;
                    }
                    loadNextBird();
                    if (currentBird) {
                        state = 'playing';
                    } else {
                        state = 'gameOver';
                        SFX.gameOver();
                    }
                } else {
                    state = 'gameOver';
                    SFX.gameOver();
                }
            }
        }
    }

    if (state === 'levelComplete') {
        levelCompleteTimer++;
        particles.update(dt);
    }

    // ── Render ──
    renderer.clear();

    if (state === 'title') {
        renderer.drawTitleScreen();
    } else {
        // Draw slingshot back
        renderer.drawSlingshot(slingshotPos.x, slingshotPos.y);

        // Draw blocks
        for (const block of blocks) {
            if (!block.destroyed) renderer.drawBlock(block);
        }

        // Draw pigs
        for (const pig of pigs) {
            if (!pig.destroyed) renderer.drawPig(pig);
        }

        // Draw slingshot band + bird
        if (currentBird && !currentBird.destroyed) {
            if (isPulling) {
                renderer.drawSlingshotBand(slingshotPos, currentBird.pos, true);
            }
            renderer.drawBird(currentBird, currentBird.userData.birdType);
        }

        // Draw any extra birds in flight (blue splits)
        for (const body of world.bodies) {
            if (body.tag === 'bird' && body !== currentBird && !body.destroyed) {
                renderer.drawBird(body, body.userData.birdType);
            }
        }

        // Front slingshot post
        renderer.drawSlingshotFront(slingshotPos.x, slingshotPos.y);

        // Trajectory
        if (trajectoryDots.length > 0) {
            renderer.drawTrajectory(trajectoryDots);
        }

        // Particles
        for (const p of particles.particles) {
            renderer.drawParticle(p);
        }

        // HUD
        const remainingBirdTypes = birdsQueue.slice();
        renderer.drawHUD(score, birdsQueue.length, currentLevel + 1, remainingBirdTypes);

        // Overlays
        if (state === 'levelComplete') {
            renderer.drawLevelComplete(score, getStars());
        } else if (state === 'gameOver') {
            renderer.drawGameOver(score);
        }
    }

    requestAnimationFrame(gameLoop);
}

// ── Start ───────────────────────────────────────────────────
requestAnimationFrame(gameLoop);

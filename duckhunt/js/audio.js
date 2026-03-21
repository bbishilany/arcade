// Duck Hunt — Web Audio Synthesis (no external files)

let audioCtx = null;

function ctx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function ensureResumed() {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

// --- Gunshot: noise burst + low thump ---
export function playGunshot() {
    ensureResumed();
    const ac = ctx();
    const t = ac.currentTime;

    // Noise burst
    const bufLen = ac.sampleRate * 0.08;
    const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 3);
    }
    const noise = ac.createBufferSource();
    noise.buffer = buf;
    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(0.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    noise.connect(noiseGain).connect(ac.destination);
    noise.start(t);
    noise.stop(t + 0.08);

    // Low thump
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(g).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.1);
}

// --- Quack: square wave wobble ---
export function playQuack() {
    ensureResumed();
    const ac = ctx();
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(550, t);
    osc.frequency.linearRampToValueAtTime(650, t + 0.05);
    osc.frequency.linearRampToValueAtTime(550, t + 0.1);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(g).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.12);
}

// --- Duck hit thud ---
export function playHitThud() {
    ensureResumed();
    const ac = ctx();
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.15);
}

// --- Falling tone ---
export function playFallingTone() {
    ensureResumed();
    const ac = ctx();
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.5);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(g).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.5);
}

// --- Dog laugh: ascending notes E4-G4-A4 ---
export function playDogLaugh() {
    ensureResumed();
    const ac = ctx();
    const t = ac.currentTime;
    const notes = [329.63, 392.00, 440.00]; // E4, G4, A4
    notes.forEach((freq, i) => {
        const osc = ac.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t + i * 0.12);
        const g = ac.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.setValueAtTime(0.12, t + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.1);
        osc.connect(g).connect(ac.destination);
        osc.start(t + i * 0.12);
        osc.stop(t + i * 0.12 + 0.1);
    });
}

// --- Round start jingle ---
export function playRoundStart() {
    ensureResumed();
    const ac = ctx();
    const t = ac.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
        const osc = ac.createOscillator();
        osc.type = 'square';
        osc.frequency.value = freq;
        const g = ac.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.setValueAtTime(0.12, t + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.15);
        osc.connect(g).connect(ac.destination);
        osc.start(t + i * 0.1);
        osc.stop(t + i * 0.1 + 0.15);
    });
}

// --- Perfect round fanfare ---
export function playPerfect() {
    ensureResumed();
    const ac = ctx();
    const t = ac.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
        const osc = ac.createOscillator();
        osc.type = 'square';
        osc.frequency.value = freq;
        const g = ac.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.setValueAtTime(0.12, t + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.2);
        osc.connect(g).connect(ac.destination);
        osc.start(t + i * 0.12);
        osc.stop(t + i * 0.12 + 0.2);
    });
}

// --- Game over descending notes ---
export function playGameOver() {
    ensureResumed();
    const ac = ctx();
    const t = ac.currentTime;
    const notes = [392.00, 329.63, 261.63, 196.00]; // G4, E4, C4, G3
    notes.forEach((freq, i) => {
        const osc = ac.createOscillator();
        osc.type = 'square';
        osc.frequency.value = freq;
        const g = ac.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.setValueAtTime(0.12, t + i * 0.2);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.2 + 0.25);
        osc.connect(g).connect(ac.destination);
        osc.start(t + i * 0.2);
        osc.stop(t + i * 0.2 + 0.25);
    });
}

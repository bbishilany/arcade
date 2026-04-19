// Web Audio API sound effects — no external files needed

let audioCtx = null;

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(freq, duration, type = 'square', volume = 0.15) {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Audio not available
    }
}

function playNoise(duration, volume = 0.08) {
    try {
        const ctx = getCtx();
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    } catch (e) {
        // Audio not available
    }
}

export const SFX = {
    launch() {
        playTone(200, 0.15, 'sawtooth', 0.12);
        setTimeout(() => playTone(300, 0.1, 'sawtooth', 0.08), 50);
    },

    stretch() {
        playTone(80 + Math.random() * 40, 0.05, 'sine', 0.04);
    },

    impact() {
        playNoise(0.15, 0.12);
        playTone(100, 0.1, 'square', 0.08);
    },

    destroy() {
        playNoise(0.25, 0.15);
        playTone(60, 0.2, 'sawtooth', 0.1);
        setTimeout(() => playTone(40, 0.15, 'sawtooth', 0.06), 80);
    },

    pigDeath() {
        playTone(500, 0.08, 'square', 0.1);
        setTimeout(() => playTone(300, 0.12, 'square', 0.08), 60);
        setTimeout(() => playTone(150, 0.15, 'square', 0.06), 130);
    },

    score() {
        playTone(600, 0.08, 'square', 0.08);
        setTimeout(() => playTone(800, 0.08, 'square', 0.08), 80);
    },

    levelComplete() {
        const notes = [400, 500, 600, 800];
        notes.forEach((n, i) => {
            setTimeout(() => playTone(n, 0.15, 'square', 0.1), i * 120);
        });
    },

    gameOver() {
        const notes = [400, 300, 200, 100];
        notes.forEach((n, i) => {
            setTimeout(() => playTone(n, 0.2, 'square', 0.1), i * 200);
        });
    },

    click() {
        playTone(440, 0.05, 'square', 0.06);
    },
};

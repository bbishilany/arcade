let audioCtx = null;

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

export function initAudio() {
    const resume = () => { getCtx(); };
    document.addEventListener('keydown', resume, { once: true });
    document.addEventListener('touchstart', resume, { once: true });
}

// Sharp crack — the most important sound
export function playBatCrack() {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;

        // Initial sharp transient
        const bufLen = ctx.sampleRate * 0.08;
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
            const env = Math.exp(-i / (ctx.sampleRate * 0.01));
            data[i] = (Math.random() * 2 - 1) * env;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const gain = ctx.createGain();
        noise.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        noise.start(t);
        noise.stop(t + 0.08);

        // Woody thump
        const osc = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc.connect(g2);
        g2.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.05);
        g2.gain.setValueAtTime(0.3, t);
        g2.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
    } catch(e) {}
}

// Swing and miss — whoosh
export function playSwingMiss() {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        const bufLen = ctx.sampleRate * 0.15;
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
            const p = i / bufLen;
            const env = Math.sin(p * Math.PI) * 0.3;
            data[i] = (Math.random() * 2 - 1) * env;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 0.5;
        noise.connect(filter);
        filter.connect(ctx.destination);
        noise.start(t);
        noise.stop(t + 0.15);
    } catch(e) {}
}

// Pitch throw — quick whoosh
export function playPitchThrow() {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.1);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
    } catch(e) {}
}

// Home run — ascending celebration
export function playHomeRun() {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        const notes = [523, 659, 784, 1047, 1318]; // C5 E5 G5 C6 E6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t + i * 0.1);
            gain.gain.setValueAtTime(0.12, t + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.2);
            osc.start(t + i * 0.1);
            osc.stop(t + i * 0.1 + 0.2);
        });
    } catch(e) {}
}

// Strikeout — sad descending
export function playStrikeout() {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        const notes = [392, 349, 311, 262]; // G4 F4 Eb4 C4
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + i * 0.2);
            gain.gain.setValueAtTime(0.12, t + i * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.2 + 0.2);
            osc.start(t + i * 0.2);
            osc.stop(t + i * 0.2 + 0.2);
        });
    } catch(e) {}
}

// Crowd cheer — noise buffer
export function playCrowdCheer() {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        const duration = 0.8;
        const bufLen = ctx.sampleRate * duration;
        const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
            const p = i / bufLen;
            const env = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8;
            data[i] = (Math.random() * 2 - 1) * env * 0.15;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 0.3;
        noise.connect(filter);
        filter.connect(ctx.destination);
        noise.start(t);
        noise.stop(t + duration);
    } catch(e) {}
}

// Stadium organ charge — "da da da DA DA DA"
export function playOrganCharge() {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        // Classic charge: C D E - C E (C6)
        const notes = [
            [523, 0.15], [587, 0.15], [659, 0.15],
            [523, 0.15], [659, 0.2], [784, 0.4]
        ];
        let offset = 0;
        for (const [freq, dur] of notes) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t + offset);
            gain.gain.setValueAtTime(0.08, t + offset);
            gain.gain.setValueAtTime(0.08, t + offset + dur - 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, t + offset + dur);
            osc.start(t + offset);
            osc.stop(t + offset + dur);
            offset += dur;
        }
    } catch(e) {}
}

// Game over
export function playGameOver() {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        const notes = [392, 349, 330, 262];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + i * 0.3);
            gain.gain.setValueAtTime(0.15, t + i * 0.3);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.3 + 0.3);
            osc.start(t + i * 0.3);
            osc.stop(t + i * 0.3 + 0.3);
        });
    } catch(e) {}
}

// Start game jingle
export function playStartGame() {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        const notes = [262, 330, 392, 523];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t + i * 0.08);
            gain.gain.setValueAtTime(0.1, t + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.15);
            osc.start(t + i * 0.08);
            osc.stop(t + i * 0.08 + 0.15);
        });
    } catch(e) {}
}

// Called/looking strike — ump call
export function playStrikeCalled() {
    try {
        const ctx = getCtx();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, t);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
    } catch(e) {}
}

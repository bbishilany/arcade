import { PARTICLE_COUNT, PARTICLE_SPEED, PARTICLE_LIFE, PARTICLE_SIZE } from './constants.js';

const particles = [];

export function spawnExplosion(x, y, color) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.5;
        const speed = PARTICLE_SPEED * (0.5 + Math.random());
        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: PARTICLE_LIFE + Math.floor(Math.random() * 10),
            maxLife: PARTICLE_LIFE + 10,
            color,
            size: PARTICLE_SIZE + Math.random() * 2
        });
    }
}

export function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life--;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

export function drawParticles(ctx) {
    for (const p of particles) {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
}

export function clearParticles() {
    particles.length = 0;
}

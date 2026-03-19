const particles = [];

export function createParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = 2 + Math.random() * 2;
        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            life: 30 + Math.floor(Math.random() * 15),
            maxLife: 45,
            color,
            size: 2 + Math.random() * 2,
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
        p.vy += 0.05; // slight gravity
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
        // Sparkle shape — small diamond
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.life * 0.1);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

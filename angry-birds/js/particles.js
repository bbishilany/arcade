// Particle system for destruction effects

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, count, color, opts = {}) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (opts.speed || 150) * (0.3 + Math.random() * 0.7);
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - (opts.upward ? 80 : 0),
                size: opts.size || (2 + Math.random() * 4),
                life: 1,
                decay: (opts.decay || 0.02) + Math.random() * 0.01,
                color: color,
                gravity: opts.gravity ?? 300,
            });
        }
    }

    emitDestruction(x, y, material) {
        const colors = {
            wood: ['#a06820', '#806018', '#c08030', '#604010'],
            stone: ['#808090', '#606068', '#a0a0b0', '#404048'],
            ice: ['#80c0e0', '#60a0c0', '#a0e0ff', '#4080a0'],
            pig: ['#50b030', '#40a020', '#60c040', '#3a7a28'],
            bird: ['#e03030', '#c02020', '#ff4040'],
        };
        const cs = colors[material] || colors.wood;
        for (let i = 0; i < 12; i++) {
            const c = cs[Math.floor(Math.random() * cs.length)];
            this.emit(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, 1, c, {
                speed: 200,
                size: 3 + Math.random() * 5,
                decay: 0.015,
            });
        }
    }

    emitScore(x, y) {
        this.emit(x, y, 6, '#ff0', {
            speed: 60,
            size: 2,
            decay: 0.025,
            upward: true,
            gravity: 50,
        });
    }

    update(dt) {
        for (const p of this.particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += p.gravity * dt;
            p.life -= p.decay;
        }
        this.particles = this.particles.filter(p => p.life > 0);
    }
}

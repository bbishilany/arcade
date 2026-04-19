// Canvas renderer — draws all game objects with retro-arcade style

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = { x: 0, y: 0, scale: 1 };
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.groundY = this.canvas.height - 80;
    }

    clear() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Sky gradient
        const sky = ctx.createLinearGradient(0, 0, 0, this.groundY);
        sky.addColorStop(0, '#1a1a3e');
        sky.addColorStop(0.5, '#2d2d6b');
        sky.addColorStop(1, '#4a3060');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, this.groundY);

        // Stars
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 60; i++) {
            const sx = (i * 137.5 + 50) % w;
            const sy = (i * 97.3 + 20) % (this.groundY - 40);
            const size = (i % 3 === 0) ? 2 : 1;
            ctx.globalAlpha = 0.3 + (i % 5) * 0.15;
            ctx.fillRect(sx, sy, size, size);
        }
        ctx.globalAlpha = 1;

        // Ground
        ctx.fillStyle = '#2d5a1e';
        ctx.fillRect(0, this.groundY, w, h - this.groundY);

        // Ground detail stripe
        ctx.fillStyle = '#3a7a28';
        ctx.fillRect(0, this.groundY, w, 4);

        // Ground texture dots
        ctx.fillStyle = '#245018';
        for (let i = 0; i < w; i += 12) {
            for (let j = 0; j < (h - this.groundY); j += 12) {
                if ((i + j) % 24 === 0) {
                    ctx.fillRect(i, this.groundY + j + 8, 2, 2);
                }
            }
        }
    }

    drawSlingshot(x, y) {
        const ctx = this.ctx;

        // Back post
        ctx.fillStyle = '#5a3a1a';
        ctx.fillRect(x - 4, y - 50, 8, 60);

        // Fork
        ctx.fillStyle = '#6b4423';
        ctx.fillRect(x - 18, y - 65, 8, 25);
        ctx.fillRect(x + 10, y - 65, 8, 25);

        // Base
        ctx.fillStyle = '#4a2a0a';
        ctx.fillRect(x - 10, y + 5, 20, 10);
    }

    drawSlingshotBand(slingshotPos, birdPos, pulling) {
        if (!pulling) return;
        const ctx = this.ctx;
        ctx.strokeStyle = '#3a2010';
        ctx.lineWidth = 4;

        // Left band
        ctx.beginPath();
        ctx.moveTo(slingshotPos.x - 14, slingshotPos.y - 55);
        ctx.lineTo(birdPos.x, birdPos.y);
        ctx.stroke();

        // Right band
        ctx.beginPath();
        ctx.moveTo(slingshotPos.x + 14, slingshotPos.y - 55);
        ctx.lineTo(birdPos.x, birdPos.y);
        ctx.stroke();
    }

    drawSlingshotFront(x, y) {
        const ctx = this.ctx;
        // Front post (drawn over bird)
        ctx.fillStyle = '#7a5433';
        ctx.fillRect(x - 3, y - 45, 6, 55);
    }

    drawBird(body, birdType) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(body.pos.x, body.pos.y);
        ctx.rotate(body.angle);

        const r = body.radius;
        const colors = {
            red: { body: '#e03030', belly: '#e8a0a0', brow: '#600' },
            blue: { body: '#3060e0', belly: '#a0c0e8', brow: '#003' },
            yellow: { body: '#e0c020', belly: '#f0e8a0', brow: '#660' },
            black: { body: '#303030', belly: '#808080', brow: '#000' },
            white: { body: '#e8e8e8', belly: '#fff', brow: '#444' },
        };
        const c = colors[birdType] || colors.red;

        // Body
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = c.body;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Belly
        ctx.beginPath();
        ctx.arc(0, r * 0.25, r * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = c.belly;
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-r * 0.25, -r * 0.15, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(r * 0.25, -r * 0.15, r * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-r * 0.18, -r * 0.12, r * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(r * 0.32, -r * 0.12, r * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Eyebrows
        ctx.strokeStyle = c.brow;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-r * 0.45, -r * 0.4);
        ctx.lineTo(-r * 0.05, -r * 0.3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(r * 0.05, -r * 0.3);
        ctx.lineTo(r * 0.45, -r * 0.4);
        ctx.stroke();

        // Beak
        ctx.fillStyle = '#f0a020';
        ctx.beginPath();
        ctx.moveTo(r * 0.5, r * 0.05);
        ctx.lineTo(r * 0.9, r * 0.15);
        ctx.lineTo(r * 0.5, r * 0.3);
        ctx.closePath();
        ctx.fill();

        // Tail feathers
        ctx.fillStyle = c.brow;
        ctx.beginPath();
        ctx.moveTo(-r * 0.7, -r * 0.5);
        ctx.lineTo(-r * 1.1, -r * 0.8);
        ctx.lineTo(-r * 0.9, -r * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-r * 0.8, -r * 0.2);
        ctx.lineTo(-r * 1.2, -r * 0.4);
        ctx.lineTo(-r * 0.9, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    drawPig(body) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(body.pos.x, body.pos.y);

        const r = body.radius;
        const healthPct = body.hp / body.maxHp;

        // Body
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = healthPct > 0.5 ? '#50b030' : '#80a030';
        ctx.fill();
        ctx.strokeStyle = '#2a5a15';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Snout
        ctx.beginPath();
        ctx.ellipse(0, r * 0.15, r * 0.35, r * 0.25, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#40a020';
        ctx.fill();
        ctx.strokeStyle = '#2a5a15';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Nostrils
        ctx.fillStyle = '#2a5a15';
        ctx.beginPath();
        ctx.arc(-r * 0.12, r * 0.15, r * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(r * 0.12, r * 0.15, r * 0.06, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-r * 0.3, -r * 0.2, r * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(r * 0.3, -r * 0.2, r * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#000';
        const pupilSize = healthPct > 0.3 ? r * 0.1 : r * 0.06;
        ctx.beginPath();
        ctx.arc(-r * 0.25, -r * 0.18, pupilSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(r * 0.35, -r * 0.18, pupilSize, 0, Math.PI * 2);
        ctx.fill();

        // Damage expression
        if (healthPct < 0.5) {
            // Dizzy eyes — X marks
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            const drawX = (cx, cy, s) => {
                ctx.beginPath();
                ctx.moveTo(cx - s, cy - s);
                ctx.lineTo(cx + s, cy + s);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(cx + s, cy - s);
                ctx.lineTo(cx - s, cy + s);
                ctx.stroke();
            };
            drawX(-r * 0.25, -r * 0.18, r * 0.08);
            drawX(r * 0.35, -r * 0.18, r * 0.08);
        }

        // Ears
        ctx.fillStyle = '#50b030';
        ctx.beginPath();
        ctx.arc(-r * 0.6, -r * 0.6, r * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(r * 0.6, -r * 0.6, r * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawBlock(body) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(body.pos.x, body.pos.y);
        ctx.rotate(body.angle);

        const hw = body.width / 2;
        const hh = body.height / 2;
        const healthPct = body.hp / body.maxHp;

        const material = body.userData.material || 'wood';
        let color, borderColor;

        if (material === 'wood') {
            color = healthPct > 0.5 ? '#a06820' : '#806018';
            borderColor = '#604010';
        } else if (material === 'stone') {
            color = healthPct > 0.5 ? '#808090' : '#606068';
            borderColor = '#404048';
        } else if (material === 'ice') {
            color = healthPct > 0.5 ? '#80c0e0' : '#60a0c0';
            borderColor = '#4080a0';
        } else {
            color = '#a06820';
            borderColor = '#604010';
        }

        ctx.fillStyle = color;
        ctx.fillRect(-hw, -hh, body.width, body.height);

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-hw, -hh, body.width, body.height);

        // Damage cracks
        if (healthPct < 0.7) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1 - healthPct;
            ctx.beginPath();
            ctx.moveTo(-hw * 0.3, -hh);
            ctx.lineTo(0, 0);
            ctx.lineTo(hw * 0.5, hh);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(hw, -hh * 0.4);
            ctx.lineTo(0, hh * 0.2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Wood grain lines
        if (material === 'wood' && body.width > body.height) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = 0.3;
            for (let i = -hh + 4; i < hh; i += 6) {
                ctx.beginPath();
                ctx.moveTo(-hw + 2, i);
                ctx.lineTo(hw - 2, i);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }

    drawTrajectory(points) {
        const ctx = this.ctx;
        ctx.fillStyle = '#fff';
        for (let i = 0; i < points.length; i++) {
            const alpha = 0.1 + (i / points.length) * 0.3;
            const size = 2 + (i / points.length) * 2;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    drawParticle(p) {
        const ctx = this.ctx;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1;
    }

    drawHUD(score, birdsLeft, level, birdTypes) {
        const ctx = this.ctx;
        const font = "'Press Start 2P', monospace";

        // Score
        ctx.font = `14px ${font}`;
        ctx.fillStyle = '#ff0';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${score}`, 20, 30);

        // Level
        ctx.textAlign = 'center';
        ctx.fillText(`LEVEL ${level}`, this.canvas.width / 2, 30);

        // Birds remaining — draw mini bird icons
        ctx.textAlign = 'right';
        ctx.fillText('BIRDS:', this.canvas.width - 20 - birdsLeft * 22, 30);
        for (let i = 0; i < birdsLeft; i++) {
            const bx = this.canvas.width - 15 - i * 22;
            const type = birdTypes[i] || 'red';
            const colors = {
                red: '#e03030', blue: '#3060e0', yellow: '#e0c020',
                black: '#303030', white: '#e8e8e8'
            };
            ctx.fillStyle = colors[type] || '#e03030';
            ctx.beginPath();
            ctx.arc(bx, 26, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    drawMessage(text, subtext, y) {
        const ctx = this.ctx;
        const font = "'Press Start 2P', monospace";

        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff0';
        ctx.font = `24px ${font}`;
        ctx.fillText(text, this.canvas.width / 2, y || this.canvas.height / 2);

        if (subtext) {
            ctx.fillStyle = '#aaa';
            ctx.font = `10px ${font}`;
            ctx.fillText(subtext, this.canvas.width / 2, (y || this.canvas.height / 2) + 35);
        }
    }

    drawLevelComplete(score, stars) {
        const ctx = this.ctx;
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawMessage('LEVEL CLEAR!', null, cy - 40);

        // Stars
        const starSize = 20;
        for (let i = 0; i < 3; i++) {
            const sx = cx - 50 + i * 50;
            ctx.font = `${starSize}px serif`;
            ctx.fillStyle = i < stars ? '#ff0' : '#444';
            ctx.textAlign = 'center';
            ctx.fillText('\u2605', sx, cy + 10);
        }

        ctx.font = "12px 'Press Start 2P', monospace";
        ctx.fillStyle = '#fff';
        ctx.fillText(`SCORE: ${score}`, cx, cy + 50);

        ctx.fillStyle = '#aaa';
        ctx.font = "9px 'Press Start 2P', monospace";
        ctx.fillText('CLICK TO CONTINUE', cx, cy + 80);
    }

    drawGameOver(score) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawMessage('GAME OVER', `FINAL SCORE: ${score}`, this.canvas.height / 2 - 20);

        ctx.fillStyle = '#aaa';
        ctx.font = "9px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.fillText('CLICK TO RESTART', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }

    drawTitleScreen() {
        const ctx = this.ctx;
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.clear();

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        ctx.textAlign = 'center';
        ctx.font = "28px 'Press Start 2P', monospace";
        ctx.fillStyle = '#e03030';
        ctx.fillText('ANGRY', cx, cy - 60);
        ctx.fillStyle = '#ff0';
        ctx.fillText('BIRDS', cx, cy - 25);

        // Bird icon
        ctx.fillStyle = '#e03030';
        ctx.beginPath();
        ctx.arc(cx, cy + 30, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Eyes on title bird
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx - 6, cy + 26, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + 6, cy + 26, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(cx - 4, cy + 27, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + 8, cy + 27, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#f0a020';
        ctx.beginPath();
        ctx.moveTo(cx + 14, cy + 30);
        ctx.lineTo(cx + 25, cy + 33);
        ctx.lineTo(cx + 14, cy + 38);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#aaa';
        ctx.font = "10px 'Press Start 2P', monospace";
        ctx.fillText('CLICK TO START', cx, cy + 90);

        ctx.fillStyle = '#666';
        ctx.font = "7px 'Press Start 2P', monospace";
        ctx.fillText('DRAG TO AIM \u2022 RELEASE TO LAUNCH', cx, cy + 115);
    }
}

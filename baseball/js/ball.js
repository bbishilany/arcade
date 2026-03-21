import { PITCHER_Y, PLATE_Y, ZONE_X, GAME_WIDTH } from './constants.js';

// Ball state for batting view
export function createPitch(pitchType, isFireball = false) {
    const frames = isFireball ? 15 : pitchType.frames; // fireball is 3x faster than a fastball
    return {
        type: pitchType,
        frame: 0,
        totalFrames: frames,
        startX: GAME_WIDTH / 2,
        startY: PITCHER_Y + 20,
        targetX: ZONE_X,
        targetY: PLATE_Y,
        curve: isFireball ? 0 : pitchType.curve,
        x: GAME_WIDTH / 2,
        y: PITCHER_Y + 20,
        size: 3,
        active: true,
        reachedPlate: false,
        isFireball: isFireball
    };
}

export function updatePitch(ball) {
    if (!ball.active) return;

    ball.frame++;
    const t = ball.frame / ball.totalFrames; // 0 to 1

    if (t >= 1) {
        ball.reachedPlate = true;
        ball.x = ball.targetX;
        ball.y = ball.targetY;
        return;
    }

    // Linear y movement
    ball.y = ball.startY + (ball.targetY - ball.startY) * t;

    // Curve: applies a sine-curve lateral movement
    const curveAmount = ball.curve * Math.sin(t * Math.PI);
    ball.x = ball.startX + (ball.targetX - ball.startX) * t + curveAmount * t;

    // Ball size grows with perspective (small at pitcher, big at plate)
    ball.size = 3 + t * 6;
}

export function drawPitchBall(ctx, ball) {
    if (!ball.active) return;

    const r = ball.size;

    if (ball.isFireball) {
        // Fiery trail behind the ball (toward pitcher)
        const trailLen = 20 + Math.random() * 10;
        const grad = ctx.createLinearGradient(ball.x, ball.y - r, ball.x, ball.y - r - trailLen);
        grad.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
        grad.addColorStop(0.4, 'rgba(255, 200, 0, 0.5)');
        grad.addColorStop(1, 'rgba(255, 50, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(ball.x - r * 1.5, ball.y - r - trailLen, r * 3, trailLen);

        // Inner flame core
        ctx.fillStyle = 'rgba(255, 255, 100, 0.6)';
        ctx.fillRect(ball.x - r * 0.8, ball.y - r - trailLen * 0.6, r * 1.6, trailLen * 0.5);

        // Flickering embers
        for (let i = 0; i < 4; i++) {
            const ex = ball.x + (Math.random() - 0.5) * r * 4;
            const ey = ball.y - r - Math.random() * trailLen;
            const es = 1 + Math.random() * 2;
            ctx.fillStyle = `rgba(255, ${150 + Math.random() * 105}, 0, ${0.4 + Math.random() * 0.4})`;
            ctx.fillRect(ex - es / 2, ey - es / 2, es, es);
        }

        // Outer glow
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 80, 0, 0.25)';
        ctx.fill();

        // Ball core — bright orange/white
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6600';
        ctx.fill();

        // Hot center
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffff88';
        ctx.fill();

        return;
    }

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Red stitching hint
    if (r > 4) {
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ball.x - r * 0.3, ball.y, r * 0.5, -0.8, 0.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ball.x + r * 0.3, ball.y, r * 0.5, Math.PI - 0.8, Math.PI + 0.8);
        ctx.stroke();
    }
}

// Ball for field view — hit trajectory
export function createFieldBall(hitType, startX, startY) {
    const trajectories = {
        single: { endX: 280 + Math.random() * 100, endY: 150 + Math.random() * 80, peakH: 20, frames: 60 },
        double: { endX: 150 + Math.random() * 180, endY: 80 + Math.random() * 60, peakH: 40, frames: 80 },
        triple: { endX: 100 + Math.random() * 280, endY: 50 + Math.random() * 40, peakH: 50, frames: 100 },
        homerun: { endX: 200 + Math.random() * 80, endY: 20 + Math.random() * 30, peakH: 80, frames: 90 },
        out: { endX: 200 + Math.random() * 150, endY: 120 + Math.random() * 100, peakH: 50, frames: 70 },
        error: { endX: 250 + Math.random() * 100, endY: 160 + Math.random() * 60, peakH: 15, frames: 50 },
        sacrifice: { endX: 220 + Math.random() * 80, endY: 100 + Math.random() * 60, peakH: 60, frames: 80 }
    };

    const traj = trajectories[hitType] || trajectories.out;

    return {
        frame: 0,
        totalFrames: traj.frames,
        startX: startX,
        startY: startY,
        endX: traj.endX,
        endY: traj.endY,
        peakH: traj.peakH,
        x: startX,
        y: startY,
        shadow: { x: startX, y: startY },
        active: true
    };
}

export function updateFieldBall(ball) {
    if (!ball.active) return;

    ball.frame++;
    const t = Math.min(ball.frame / ball.totalFrames, 1);

    // Ground position (shadow)
    ball.shadow.x = ball.startX + (ball.endX - ball.startX) * t;
    ball.shadow.y = ball.startY + (ball.endY - ball.startY) * t;

    // Ball with arc height
    const arcH = ball.peakH * Math.sin(t * Math.PI);
    ball.x = ball.shadow.x;
    ball.y = ball.shadow.y - arcH;

    if (t >= 1) {
        ball.active = false;
    }
}

export function drawFieldBall(ctx, ball) {
    if (!ball || ball.frame === 0) return;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(ball.shadow.x, ball.shadow.y, 4, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
}

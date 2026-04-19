// Simple 2D physics engine for Angry Birds
// Handles rigid body simulation, collision detection & response

export const GRAVITY = 600;
const DAMPING = 0.998;
const BOUNCE_THRESHOLD = 20;
const COLLISION_ITERATIONS = 4;
const POSITION_CORRECTION = 0.4;
const SLOP = 0.5;

export class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    add(v) { return new Vec2(this.x + v.x, this.y + v.y); }
    sub(v) { return new Vec2(this.x - v.x, this.y - v.y); }
    mul(s) { return new Vec2(this.x * s, this.y * s); }
    dot(v) { return this.x * v.x + this.y * v.y; }
    len() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    norm() {
        const l = this.len();
        return l > 0 ? new Vec2(this.x / l, this.y / l) : new Vec2();
    }
    cross(v) { return this.x * v.y - this.y * v.x; }
    rotate(angle) {
        const c = Math.cos(angle), s = Math.sin(angle);
        return new Vec2(this.x * c - this.y * s, this.x * s + this.y * c);
    }
    clone() { return new Vec2(this.x, this.y); }
}

export class Body {
    constructor(x, y, opts = {}) {
        this.pos = new Vec2(x, y);
        this.vel = new Vec2();
        this.acc = new Vec2();
        this.angle = opts.angle || 0;
        this.angVel = 0;
        this.mass = opts.mass || 1;
        this.invMass = opts.isStatic ? 0 : 1 / this.mass;
        this.restitution = opts.restitution ?? 0.3;
        this.friction = opts.friction ?? 0.5;
        this.isStatic = opts.isStatic || false;
        this.type = opts.type || 'circle'; // 'circle' or 'rect'
        this.radius = opts.radius || 15;
        this.width = opts.width || 30;
        this.height = opts.height || 30;
        this.hp = opts.hp ?? 100;
        this.maxHp = this.hp;
        this.tag = opts.tag || '';
        this.destroyed = false;
        this.userData = opts.userData || {};

        // Moment of inertia
        if (this.type === 'circle') {
            this.inertia = this.isStatic ? 0 : 0.5 * this.mass * this.radius * this.radius;
        } else {
            this.inertia = this.isStatic ? 0 : (this.mass * (this.width * this.width + this.height * this.height)) / 12;
        }
        this.invInertia = this.inertia > 0 ? 1 / this.inertia : 0;
    }

    applyForce(f) {
        this.acc = this.acc.add(f.mul(this.invMass));
    }

    // Sub-step integration — no damping here (applied once per frame in world)
    integrate(dt) {
        if (this.isStatic || this.destroyed) return;

        this.vel = this.vel.add(this.acc.mul(dt));
        this.vel = this.vel.add(new Vec2(0, GRAVITY * dt));
        this.pos = this.pos.add(this.vel.mul(dt));

        this.angle += this.angVel * dt;

        this.acc = new Vec2();
    }

    // Apply damping once per frame
    applyDamping() {
        if (this.isStatic || this.destroyed) return;
        this.vel = this.vel.mul(DAMPING);
        this.angVel *= DAMPING;
    }

    getAABB() {
        if (this.type === 'circle') {
            return {
                min: new Vec2(this.pos.x - this.radius, this.pos.y - this.radius),
                max: new Vec2(this.pos.x + this.radius, this.pos.y + this.radius)
            };
        }
        // For rotated rectangles, compute the bounding box
        const hw = this.width / 2, hh = this.height / 2;
        const corners = [
            new Vec2(-hw, -hh), new Vec2(hw, -hh),
            new Vec2(hw, hh), new Vec2(-hw, hh)
        ].map(c => c.rotate(this.angle).add(this.pos));

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const c of corners) {
            minX = Math.min(minX, c.x);
            minY = Math.min(minY, c.y);
            maxX = Math.max(maxX, c.x);
            maxY = Math.max(maxY, c.y);
        }
        return { min: new Vec2(minX, minY), max: new Vec2(maxX, maxY) };
    }

    damage(amount) {
        if (this.isStatic) return;
        this.hp -= amount;
        if (this.hp <= 0) {
            this.destroyed = true;
        }
    }

    isSleeping() {
        return !this.isStatic && this.vel.len() < 3 && Math.abs(this.angVel) < 0.05;
    }
}

export class PhysicsWorld {
    constructor(groundY) {
        this.bodies = [];
        this.groundY = groundY;
    }

    add(body) {
        this.bodies.push(body);
        return body;
    }

    remove(body) {
        const idx = this.bodies.indexOf(body);
        if (idx >= 0) this.bodies.splice(idx, 1);
    }

    update(dt) {
        const subDt = dt / COLLISION_ITERATIONS;
        for (let i = 0; i < COLLISION_ITERATIONS; i++) {
            for (const b of this.bodies) {
                b.integrate(subDt);
            }
            this.resolveGroundCollisions();
            this.resolveBodyCollisions();
        }

        // Damping once per frame — not per sub-step
        for (const b of this.bodies) {
            b.applyDamping();
        }

        // Remove destroyed bodies
        this.bodies = this.bodies.filter(b => !b.destroyed);
    }

    resolveGroundCollisions() {
        for (const b of this.bodies) {
            if (b.isStatic || b.destroyed) continue;

            if (b.type === 'circle') {
                const bottom = b.pos.y + b.radius;
                if (bottom > this.groundY) {
                    b.pos.y = this.groundY - b.radius;
                    if (Math.abs(b.vel.y) > BOUNCE_THRESHOLD) {
                        b.vel.y *= -b.restitution;
                    } else {
                        b.vel.y = 0;
                    }
                    b.vel.x *= (1 - b.friction * 0.1);
                    b.angVel *= 0.95;
                }
            } else {
                // Rect ground collision (simplified — use AABB bottom)
                const aabb = b.getAABB();
                if (aabb.max.y > this.groundY) {
                    const penetration = aabb.max.y - this.groundY;
                    b.pos.y -= penetration;
                    if (Math.abs(b.vel.y) > BOUNCE_THRESHOLD) {
                        b.vel.y *= -b.restitution;
                    } else {
                        b.vel.y = 0;
                    }
                    b.vel.x *= (1 - b.friction * 0.1);
                    b.angVel *= 0.9;
                }
            }

            // Wall boundaries
            if (b.pos.x < b.radius) {
                b.pos.x = b.radius;
                b.vel.x *= -b.restitution;
            }
        }
    }

    resolveBodyCollisions() {
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const a = this.bodies[i];
                const b = this.bodies[j];
                if (a.destroyed || b.destroyed) continue;
                if (a.isStatic && b.isStatic) continue;

                const collision = this.detectCollision(a, b);
                if (collision) {
                    this.resolveCollision(a, b, collision);
                }
            }
        }
    }

    detectCollision(a, b) {
        if (a.type === 'circle' && b.type === 'circle') {
            return this.circleVsCircle(a, b);
        }
        if (a.type === 'circle' && b.type === 'rect') {
            return this.circleVsRect(a, b);
        }
        if (a.type === 'rect' && b.type === 'circle') {
            const c = this.circleVsRect(b, a);
            if (c) { c.normal = c.normal.mul(-1); }
            return c;
        }
        return this.rectVsRect(a, b);
    }

    circleVsCircle(a, b) {
        const diff = b.pos.sub(a.pos);
        const dist = diff.len();
        const overlap = a.radius + b.radius - dist;
        if (overlap <= 0) return null;
        const normal = dist > 0 ? diff.norm() : new Vec2(0, -1);
        return { normal, depth: overlap };
    }

    circleVsRect(circle, rect) {
        // Transform circle center to rect's local space
        const local = circle.pos.sub(rect.pos).rotate(-rect.angle);
        const hw = rect.width / 2, hh = rect.height / 2;

        // Clamp to rect bounds
        const closest = new Vec2(
            Math.max(-hw, Math.min(hw, local.x)),
            Math.max(-hh, Math.min(hh, local.y))
        );

        const diff = local.sub(closest);
        const dist = diff.len();

        if (dist >= circle.radius) return null;

        let normal;
        if (dist > 0.001) {
            normal = diff.norm().rotate(rect.angle);
        } else {
            // Circle center is inside rect
            const dx = hw - Math.abs(local.x);
            const dy = hh - Math.abs(local.y);
            if (dx < dy) {
                normal = new Vec2(local.x > 0 ? 1 : -1, 0).rotate(rect.angle);
            } else {
                normal = new Vec2(0, local.y > 0 ? 1 : -1).rotate(rect.angle);
            }
        }

        return { normal, depth: circle.radius - dist };
    }

    rectVsRect(a, b) {
        // SAT for OBBs (simplified — use AABB overlap)
        const aabb1 = a.getAABB();
        const aabb2 = b.getAABB();

        const overlapX = Math.min(aabb1.max.x, aabb2.max.x) - Math.max(aabb1.min.x, aabb2.min.x);
        const overlapY = Math.min(aabb1.max.y, aabb2.max.y) - Math.max(aabb1.min.y, aabb2.min.y);

        if (overlapX <= 0 || overlapY <= 0) return null;

        const diff = b.pos.sub(a.pos);
        let normal;
        let depth;

        if (overlapX < overlapY) {
            depth = overlapX;
            normal = new Vec2(diff.x > 0 ? 1 : -1, 0);
        } else {
            depth = overlapY;
            normal = new Vec2(0, diff.y > 0 ? 1 : -1);
        }

        return { normal, depth };
    }

    resolveCollision(a, b, collision) {
        const { normal, depth } = collision;

        // Position correction
        const totalInvMass = a.invMass + b.invMass;
        if (totalInvMass === 0) return;

        const correction = Math.max(depth - SLOP, 0) * POSITION_CORRECTION / totalInvMass;
        a.pos = a.pos.sub(normal.mul(correction * a.invMass));
        b.pos = b.pos.add(normal.mul(correction * b.invMass));

        // Relative velocity
        const relVel = b.vel.sub(a.vel);
        const velAlongNormal = relVel.dot(normal);

        // Don't resolve if separating
        if (velAlongNormal > 0) return;

        const e = Math.min(a.restitution, b.restitution);
        let j = -(1 + e) * velAlongNormal / totalInvMass;

        // Birds are wrecking balls — amplify impulse on the target
        const birdHitting = (a.tag === 'bird' || b.tag === 'bird');
        if (birdHitting) j *= 2.5;

        const impulse = normal.mul(j);
        a.vel = a.vel.sub(impulse.mul(a.invMass));
        b.vel = b.vel.add(impulse.mul(b.invMass));

        // Friction impulse
        const tangent = relVel.sub(normal.mul(velAlongNormal));
        const tanLen = tangent.len();
        if (tanLen > 0.001) {
            const tanNorm = tangent.norm();
            const jt = -relVel.dot(tanNorm) / totalInvMass;
            const mu = (a.friction + b.friction) / 2;
            const frictionImpulse = Math.abs(jt) < j * mu
                ? tanNorm.mul(jt)
                : tanNorm.mul(-j * mu);
            a.vel = a.vel.sub(frictionImpulse.mul(a.invMass));
            b.vel = b.vel.add(frictionImpulse.mul(b.invMass));
        }

        // Angular response
        const contactSpeed = Math.abs(velAlongNormal);
        a.angVel += (Math.random() - 0.5) * contactSpeed * 0.01 * a.invInertia;
        b.angVel += (Math.random() - 0.5) * contactSpeed * 0.01 * b.invInertia;

        // Damage on impact
        const impactForce = Math.abs(velAlongNormal);
        if (impactForce > 20) {
            const dmg = impactForce * 2.5;
            if (a.tag === 'bird') {
                b.damage(dmg * 3); // bird wrecks everything
                // Bird barely slows down — plow through
                a.vel = a.vel.mul(0.92);
            }
            if (b.tag === 'bird') {
                a.damage(dmg * 3);
                b.vel = b.vel.mul(0.92);
            }
            if (a.tag === 'block' && b.tag === 'block') {
                a.damage(dmg * 0.5);
                b.damage(dmg * 0.5);
            }
            // Debris chain reactions — blocks hit pigs hard
            if (a.tag === 'block' && b.tag === 'pig') b.damage(dmg * 2);
            if (b.tag === 'block' && a.tag === 'pig') a.damage(dmg * 2);
        }
    }
}

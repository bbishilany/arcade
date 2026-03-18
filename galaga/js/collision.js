// AABB collision detection with swept support for fast bullets

export function checkCollision(a, b) {
    return (
        a.x - a.width / 2 < b.x + b.width / 2 &&
        a.x + a.width / 2 > b.x - b.width / 2 &&
        a.y - a.height / 2 < b.y + b.height / 2 &&
        a.y + a.height / 2 > b.y - b.height / 2
    );
}

// Swept collision for upward-moving player bullets:
// Extends the bullet hitbox to cover the full path it traveled this frame
function checkSweptBulletCollision(bullet, target) {
    const speed = bullet.speed || 7;
    // Bullet moved upward, so it was at (y + speed) last frame
    const bulletTop = bullet.y - bullet.height / 2;
    const bulletBottom = bullet.y + bullet.height / 2 + speed; // where it was last frame

    return (
        bullet.x - bullet.width / 2 < target.x + target.width / 2 &&
        bullet.x + bullet.width / 2 > target.x - target.width / 2 &&
        bulletTop < target.y + target.height / 2 &&
        bulletBottom > target.y - target.height / 2
    );
}

export function processCollisions(player, formation, bullets, callbacks) {
    const { onAlienHit, onPlayerHit } = callbacks;

    // Player bullets vs aliens
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
        const bullet = bullets[bi];
        if (!bullet.isPlayer) continue;

        for (const alien of formation.aliens) {
            if (!alien.alive) continue;

            // Use swept collision to handle fast bullets
            if (checkSweptBulletCollision(bullet, alien)) {
                alien.alive = false;
                onAlienHit(alien);

                if (bullet.isMissile) {
                    // Missile plows through — decrement kills left
                    bullet.killsLeft--;
                    if (bullet.killsLeft <= 0) {
                        bullets.splice(bi, 1);
                        break;
                    }
                    // Keep going — don't break, check next alien
                } else {
                    // Normal bullet dies on hit
                    bullets.splice(bi, 1);
                    break;
                }
            }
        }
    }

    // Skip player collision checks during invincibility
    if (!player.alive || player.blinkTimer > 0) return;

    // Alien bullets vs player
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
        const bullet = bullets[bi];
        if (bullet.isPlayer) continue;

        if (checkCollision(bullet, player)) {
            bullets.splice(bi, 1);
            onPlayerHit();
            return; // only one hit per frame
        }
    }

    // Diving aliens vs player
    for (const alien of formation.aliens) {
        if (!alien.alive || !alien.diving) continue;

        if (checkCollision(alien, player)) {
            alien.alive = false;
            onPlayerHit();
            return;
        }
    }
}

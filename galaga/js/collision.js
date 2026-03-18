// AABB collision detection

export function checkCollision(a, b) {
    return (
        a.x - a.width / 2 < b.x + b.width / 2 &&
        a.x + a.width / 2 > b.x - b.width / 2 &&
        a.y - a.height / 2 < b.y + b.height / 2 &&
        a.y + a.height / 2 > b.y - b.height / 2
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

            if (checkCollision(bullet, alien)) {
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

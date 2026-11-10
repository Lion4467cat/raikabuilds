/**
 * S. S. GOKULA SWAMY // RAIKABUILDS
 * Dragon Ball Super: Ultra Instinct Scroll Engine
 * Powered by Anime.js v4 & High-Performance Canvas Graphics
 * 100% Grounded, Zero External Assets Required
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Anime.js v4 Universal Helper
       ========================================================================== */
    function animate(target, params) {
        if (window.anime && typeof window.anime.animate === 'function') {
            return window.anime.animate(target, params);
        } else if (typeof window.anime === 'function') {
            return window.anime(Object.assign({ targets: target }, params));
        }
        // Fallback simple property setter if library fails to load
        for (const k in params) {
            if (typeof target[k] === 'number' && typeof params[k] === 'number') {
                target[k] = params[k];
            }
        }
    }

    /* ==========================================================================
       2. Web Audio API Synthesizer (Zero External Audio Files)
       ========================================================================== */
    let audioCtx = null;
    let isSoundEnabled = false;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Ultra Instinct Dodge Whoosh
    function playDodgeSound() {
        if (!isSoundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.18);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    }

    // Kamehameha Charging Hum
    function playChargeSound() {
        if (!isSoundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 1.2);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.25);
    }

    // Kamehameha Blast Explosion
    function playBlastSound() {
        if (!isSoundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        // Sub-bass rumble
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(80, ctx.currentTime);
        bassOsc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.8);

        bassGain.gain.setValueAtTime(0.35, ctx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);

        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start();
        bassOsc.stop(ctx.currentTime + 0.9);

        // High energy beam buzz
        const beamOsc = ctx.createOscillator();
        const beamGain = ctx.createGain();
        beamOsc.type = 'square';
        beamOsc.frequency.setValueAtTime(650, ctx.currentTime);
        beamOsc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.7);

        beamGain.gain.setValueAtTime(0.15, ctx.currentTime);
        beamGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

        beamOsc.connect(beamGain);
        beamGain.connect(ctx.destination);
        beamOsc.start();
        beamOsc.stop(ctx.currentTime + 0.75);
    }

    /* ==========================================================================
       3. Ultra Instinct Canvas Battle Simulation (Goku vs Jiren)
       ========================================================================== */
    const canvas = document.getElementById('dbz-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const phaseBadge = document.getElementById('arena-phase-badge');
    const statusText = document.getElementById('arena-status-text');
    const screenFlash = document.getElementById('kamehameha-screen-flash');
    const soundToggle = document.getElementById('arena-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const collapseToggle = document.getElementById('arena-collapse-toggle');
    const collapseIcon = document.getElementById('collapse-icon');
    const arenaEl = document.getElementById('ui-battle-arena');
    const btnDodge = document.getElementById('btn-action-dodge');
    const btnKamehameha = document.getElementById('btn-action-kamehameha');
    const btnNavUIMode = document.getElementById('btn-ui-mode');

    // Battle State
    const battle = {
        phase: 'idle', // 'idle', 'dodging', 'charging', 'firing'
        goku: {
            baseX: 130,
            baseY: 130,
            x: 130,
            y: 130,
            dodgeOffsetX: 0,
            dodgeOffsetY: 0,
            tilt: 0,
            auraPulse: 0.8,
            hairGlow: 0.9,
            afterimages: [] // {x, y, alpha, tilt}
        },
        jiren: {
            baseX: 470,
            baseY: 125,
            x: 470,
            y: 125,
            active: false,
            auraScale: 1,
            punches: [] // {x, y, vx, size, alpha}
        },
        kamehameha: {
            chargeRadius: 0,
            beamActive: false,
            beamWidth: 0,
            beamLength: 0,
            particles: [],
            rings: []
        },
        ambientParticles: []
    };

    // Initialize ambient UI divine heat particles
    for (let i = 0; i < 35; i++) {
        battle.ambientParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vy: -0.6 - Math.random() * 1.2,
            vx: (Math.random() - 0.5) * 0.4,
            size: 1 + Math.random() * 2,
            alpha: 0.2 + Math.random() * 0.6,
            color: Math.random() > 0.4 ? 'rgba(56, 189, 248,' : 'rgba(255, 255, 255,'
        });
    }

    // Toggle Sound
    soundToggle.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        soundIcon.textContent = isSoundEnabled ? '🔊' : '🔇';
        if (isSoundEnabled) {
            getAudioContext();
            playDodgeSound();
        }
    });

    // Toggle Collapse
    collapseToggle.addEventListener('click', () => {
        arenaEl.classList.toggle('collapsed');
        collapseIcon.textContent = arenaEl.classList.contains('collapsed') ? '□' : '_';
    });

    /* --------------------------------------------------------------------------
       Anime.js Animation Sequences
       -------------------------------------------------------------------------- */

    // Idle Goku Floating Breathing loop
    animate(battle.goku, {
        baseY: 135,
        auraPulse: 1.1,
        duration: 1800,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true
    });

    // Dodge Sequence powered by Anime.js
    let dodgeTimeline = null;
    function triggerDodgeAnimation() {
        battle.phase = 'dodging';
        battle.jiren.active = true;
        phaseBadge.textContent = 'MUI: DODGING JIREN';
        phaseBadge.style.color = '#38bdf8';
        statusText.textContent = 'Ultra Instinct: Effortlessly weaving past Jiren’s high-speed strikes!';
        playDodgeSound();

        // Spawn rapid ki punches from Jiren
        for (let i = 0; i < 7; i++) {
            setTimeout(() => {
                battle.jiren.punches.push({
                    x: battle.jiren.x - 20,
                    y: battle.jiren.y - 30 + Math.random() * 60,
                    vx: -14 - Math.random() * 6,
                    size: 14 + Math.random() * 10,
                    alpha: 0.95
                });
            }, i * 90);
        }

        // Goku evasive weave using anime.js
        animate(battle.goku, {
            dodgeOffsetX: [-25, 30, -35, 20, -10, 0],
            dodgeOffsetY: [18, -22, 16, -18, 10, 0],
            tilt: [-0.15, 0.18, -0.2, 0.12, 0],
            duration: 900,
            easing: 'easeInOutQuad',
            onUpdate: () => {
                // Spawn afterimages
                battle.goku.afterimages.push({
                    x: battle.goku.baseX + battle.goku.dodgeOffsetX,
                    y: battle.goku.baseY + battle.goku.dodgeOffsetY,
                    tilt: battle.goku.tilt,
                    alpha: 0.6
                });
                if (battle.goku.afterimages.length > 5) {
                    battle.goku.afterimages.shift();
                }
            },
            onComplete: () => {
                battle.phase = 'idle';
                phaseBadge.textContent = 'OMEN: READY';
                battle.jiren.active = false;
            }
        });
    }

    // Kamehameha Sequence powered by Anime.js
    function triggerKamehamehaAnimation() {
        if (battle.phase === 'charging' || battle.phase === 'firing') return;

        battle.phase = 'charging';
        phaseBadge.textContent = 'CHARGING KAMEHAMEHA';
        phaseBadge.style.color = '#38bdf8';
        statusText.textContent = 'Goku: "KA... ME... HA... ME..."';
        playChargeSound();

        // Step 1: Charge sphere expansion and spark convergence
        animate(battle.kamehameha, {
            chargeRadius: 28,
            duration: 1100,
            easing: 'easeInQuad',
            onUpdate: () => {
                // Add converging energy sparks
                battle.kamehameha.particles.push({
                    x: battle.goku.x + (Math.random() - 0.5) * 80,
                    y: battle.goku.y + (Math.random() - 0.5) * 80,
                    tx: battle.goku.x + 35,
                    ty: battle.goku.y + 10,
                    alpha: 0.9,
                    size: 2 + Math.random() * 3
                });
            },
            onComplete: () => {
                // Step 2: Fire Beam!
                battle.phase = 'firing';
                battle.jiren.active = true;
                phaseBadge.textContent = 'FULL POWER BLAST!';
                phaseBadge.style.color = '#ffffff';
                statusText.textContent = 'Goku: "...HAAA!!!!"';
                playBlastSound();

                // Screen Flash
                screenFlash.classList.add('active');
                setTimeout(() => screenFlash.classList.remove('active'), 250);

                // Animate beam extending across canvas
                battle.kamehameha.beamActive = true;
                animate(battle.kamehameha, {
                    beamWidth: 65,
                    beamLength: canvas.width - battle.goku.x - 30,
                    duration: 350,
                    easing: 'easeOutExpo',
                    onComplete: () => {
                        // Shake Jiren and blast him back
                        animate(battle.jiren, {
                            x: [battle.jiren.baseX, battle.jiren.baseX + 40, battle.jiren.baseX],
                            duration: 400,
                            easing: 'easeInOutQuad'
                        });

                        // Dissipate beam
                        setTimeout(() => {
                            animate(battle.kamehameha, {
                                beamWidth: 0,
                                chargeRadius: 0,
                                duration: 450,
                                easing: 'easeOutQuad',
                                onComplete: () => {
                                    battle.kamehameha.beamActive = false;
                                    battle.phase = 'idle';
                                    battle.jiren.active = false;
                                    phaseBadge.textContent = 'MUI: MASTERED';
                                    statusText.textContent = 'Kamehameha dissipated. Goku in total control.';
                                }
                            });
                        }, 800);
                    }
                });
            }
        });
    }

    // Button event listeners
    btnDodge.addEventListener('click', triggerDodgeAnimation);
    btnKamehameha.addEventListener('click', triggerKamehamehaAnimation);
    btnNavUIMode.addEventListener('click', () => {
        if (battle.phase === 'charging' || battle.phase === 'firing') {
            triggerDodgeAnimation();
        } else {
            triggerKamehamehaAnimation();
        }
    });

    // Keyboard Shortcuts (K = Kamehameha, D = Dodge)
    window.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        if (e.key === 'k' || e.key === 'K') {
            triggerKamehamehaAnimation();
        } else if (e.key === 'd' || e.key === 'D') {
            triggerDodgeAnimation();
        } else if (e.key === 'm' || e.key === 'M') {
            soundToggle.click();
        }
    });

    canvas.addEventListener('click', () => {
        if (Math.random() > 0.5) {
            triggerKamehamehaAnimation();
        } else {
            triggerDodgeAnimation();
        }
    });

    /* ==========================================================================
       4. Scroll-Driven Battle Choreography
       ========================================================================== */
    let lastScrollProgress = 0;
    let scrollThrottleTimeout = null;

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, window.pageYOffset / docHeight)) : 0;

        // Trigger dynamic battle phases based on scroll depth
        if (!scrollThrottleTimeout) {
            scrollThrottleTimeout = setTimeout(() => {
                scrollThrottleTimeout = null;

                // 25% - 50%: Dodge Jiren (Research & Early Projects)
                if (progress >= 0.22 && progress <= 0.52 && battle.phase === 'idle' && Math.abs(progress - lastScrollProgress) > 0.05) {
                    triggerDodgeAnimation();
                }
                // 78% - 100%: Fire Kamehameha (Reaching Bottom & Contact Section)
                else if (progress >= 0.82 && battle.phase === 'idle' && Math.abs(progress - lastScrollProgress) > 0.05) {
                    triggerKamehamehaAnimation();
                }

                lastScrollProgress = progress;
            }, 120);
        }
    }, { passive: true });

    /* ==========================================================================
       5. 60 FPS HTML5 Canvas Rendering Loop
       ========================================================================== */
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate actual Goku position with dodge offsets
        battle.goku.x = battle.goku.baseX + battle.goku.dodgeOffsetX;
        battle.goku.y = battle.goku.baseY + battle.goku.dodgeOffsetY;

        // A. Draw Ambient Ultra Instinct Rising Heat Sparks
        for (let i = 0; i < battle.ambientParticles.length; i++) {
            const p = battle.ambientParticles[i];
            p.y += p.vy;
            p.x += p.vx;
            if (p.y < 0) {
                p.y = canvas.height;
                p.x = Math.random() * canvas.width;
            }
            ctx.fillStyle = `${p.color} ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // B. Draw Ultra Instinct Afterimages (Ghost Weaves)
        for (let i = 0; i < battle.goku.afterimages.length; i++) {
            const ghost = battle.goku.afterimages[i];
            ghost.alpha -= 0.025;
            if (ghost.alpha > 0) {
                drawGoku(ghost.x, ghost.y, ghost.tilt, ghost.alpha, true);
            }
        }
        battle.goku.afterimages = battle.goku.afterimages.filter(g => g.alpha > 0);

        // C. Draw Jiren & Ki Punches
        if (battle.jiren.active || battle.phase === 'dodging') {
            drawJiren(battle.jiren.x, battle.jiren.y);

            // Render and update red ki punches
            for (let i = 0; i < battle.jiren.punches.length; i++) {
                const punch = battle.jiren.punches[i];
                punch.x += punch.vx;
                punch.alpha -= 0.015;

                // Draw red fiery shockwave fist
                const radGrad = ctx.createRadialGradient(punch.x, punch.y, 2, punch.x, punch.y, punch.size);
                radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                radGrad.addColorStop(0.3, 'rgba(239, 68, 68, 0.85)');
                radGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

                ctx.fillStyle = radGrad;
                ctx.beginPath();
                ctx.arc(punch.x, punch.y, punch.size, 0, Math.PI * 2);
                ctx.fill();

                // Impact streak
                ctx.strokeStyle = `rgba(249, 115, 22, ${punch.alpha * 0.7})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(punch.x, punch.y);
                ctx.lineTo(punch.x + 35, punch.y);
                ctx.stroke();
            }
            battle.jiren.punches = battle.jiren.punches.filter(p => p.x > -50 && p.alpha > 0);
        }

        // D. Draw Goku (Ultra Instinct)
        drawGoku(battle.goku.x, battle.goku.y, battle.goku.tilt, 1.0, false);

        // E. Draw Kamehameha Energy Sphere & Beam
        drawKamehameha();

        requestAnimationFrame(render);
    }

    /* --------------------------------------------------------------------------
       Goku Drawing Function (Stylized Ultra Instinct Form)
       -------------------------------------------------------------------------- */
    function drawGoku(x, y, tilt, opacity, isGhost) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt);
        ctx.globalAlpha = opacity;

        // 1. Divine Ultra Instinct Ethereal Aura
        const auraRadius = 45 * battle.goku.auraPulse;
        const auraGrad = ctx.createRadialGradient(0, -10, 10, 0, -10, auraRadius);
        if (isGhost) {
            auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            auraGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
            auraGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        } else {
            auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
            auraGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.55)');
            auraGrad.addColorStop(0.7, 'rgba(30, 64, 175, 0.25)');
            auraGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        }

        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.ellipse(0, -10, auraRadius, auraRadius * 1.25, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Torso & Gi
        // Torn orange gi shirt
        ctx.fillStyle = isGhost ? '#94a3b8' : '#ea580c';
        ctx.beginPath();
        ctx.moveTo(-18, 5);
        ctx.lineTo(-12, 35);
        ctx.lineTo(12, 35);
        ctx.lineTo(18, 5);
        ctx.closePath();
        ctx.fill();

        // Dark navy undershirt / chest muscle V
        ctx.fillStyle = isGhost ? '#64748b' : '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(-8, 5);
        ctx.lineTo(0, 22);
        ctx.lineTo(8, 5);
        ctx.closePath();
        ctx.fill();

        // Muscular Neck & Chin
        ctx.fillStyle = isGhost ? '#cbd5e1' : '#fbd5b5';
        ctx.beginPath();
        ctx.moveTo(-7, 2);
        ctx.lineTo(-5, -12);
        ctx.lineTo(5, -12);
        ctx.lineTo(7, 2);
        ctx.closePath();
        ctx.fill();

        // Face / Head
        ctx.fillStyle = isGhost ? '#cbd5e1' : '#ffdfba';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(11, -22);
        ctx.lineTo(9, -34);
        ctx.lineTo(-9, -34);
        ctx.lineTo(-11, -22);
        ctx.closePath();
        ctx.fill();

        // Ultra Instinct Silver Eyes & Eyebrows
        if (!isGhost) {
            ctx.fillStyle = '#1e293b';
            // Stern eyebrows
            ctx.fillRect(-7, -27, 5, 2);
            ctx.fillRect(2, -27, 5, 2);

            // Silver irises with black pupils
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(-6, -24, 4, 3);
            ctx.fillRect(3, -24, 4, 3);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-5, -23, 2, 2);
            ctx.fillRect(4, -23, 2, 2);
        }

        // 3. Iconic Goku Ultra Instinct Spiky Hair (Metallic Silver / Platinum)
        ctx.fillStyle = isGhost ? '#e2e8f0' : '#f1f5f9';
        ctx.strokeStyle = isGhost ? '#94a3b8' : '#38bdf8';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        // Hair Spikes (Goku Silhouette)
        ctx.moveTo(-10, -32);
        ctx.lineTo(-24, -42); // Left spike 1
        ctx.lineTo(-14, -46);
        ctx.lineTo(-28, -62); // Big left wing spike
        ctx.lineTo(-12, -58);
        ctx.lineTo(-8, -74);  // Top left spike
        ctx.lineTo(2, -60);
        ctx.lineTo(14, -76);  // Crown spike
        ctx.lineTo(12, -56);
        ctx.lineTo(26, -58);  // Right spike 1
        ctx.lineTo(15, -44);
        ctx.lineTo(28, -38);  // Right low spike
        ctx.lineTo(10, -32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Forehead hair bang
        ctx.beginPath();
        ctx.moveTo(-4, -32);
        ctx.lineTo(-1, -25);
        ctx.lineTo(3, -32);
        ctx.fill();

        ctx.restore();
    }

    /* --------------------------------------------------------------------------
       Jiren Drawing Function (The Strongest of Universe 11)
       -------------------------------------------------------------------------- */
    function drawJiren(x, y) {
        ctx.save();
        ctx.translate(x, y);

        // 1. Blazing Red/Crimson Ki Aura
        const auraRadius = 55 * battle.jiren.auraScale;
        const auraGrad = ctx.createRadialGradient(0, -10, 10, 0, -10, auraRadius);
        auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
        auraGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.4)');
        auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.ellipse(0, -10, auraRadius * 1.1, auraRadius * 1.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Muscular Torso (Pride Trooper Uniform: Red and Black)
        // Red Chest & Shoulders
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(-28, 0);
        ctx.lineTo(-22, 45);
        ctx.lineTo(22, 45);
        ctx.lineTo(28, 0);
        ctx.closePath();
        ctx.fill();

        // Black Center Stripe
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-8, 45);
        ctx.lineTo(8, 45);
        ctx.lineTo(10, 0);
        ctx.closePath();
        ctx.fill();

        // White Collar
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-10, -5, 20, 6);

        // 3. Head & Distinct Alien Features
        ctx.fillStyle = '#94a3b8'; // Grey skin tone
        ctx.beginPath();
        ctx.ellipse(0, -22, 16, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Jiren's Large Black/Purple Eyes
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(-7, -22, 4.5, 7, -0.15, 0, Math.PI * 2);
        ctx.ellipse(7, -22, 4.5, 7, 0.15, 0, Math.PI * 2);
        ctx.fill();

        // White Gloves & Punching Pose
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(-24, 18, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /* --------------------------------------------------------------------------
       Kamehameha Drawing Function
       -------------------------------------------------------------------------- */
    function drawKamehameha() {
        const originX = battle.goku.x + 28;
        const originY = battle.goku.y + 8;

        // 1. Charging Energy Sphere
        if (battle.kamehameha.chargeRadius > 0) {
            const r = battle.kamehameha.chargeRadius;

            // Multi-layered radial glowing orb
            const sphereGrad = ctx.createRadialGradient(originX, originY, 2, originX, originY, r);
            sphereGrad.addColorStop(0, '#ffffff');
            sphereGrad.addColorStop(0.35, '#38bdf8');
            sphereGrad.addColorStop(0.75, '#0284c7');
            sphereGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

            ctx.fillStyle = sphereGrad;
            ctx.beginPath();
            ctx.arc(originX, originY, r, 0, Math.PI * 2);
            ctx.fill();

            // Electric lightning sparks
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 4; i++) {
                const angle = Math.random() * Math.PI * 2;
                const len = r * (0.6 + Math.random() * 0.8);
                ctx.beginPath();
                ctx.moveTo(originX, originY);
                ctx.lineTo(originX + Math.cos(angle) * (len * 0.5) + (Math.random() - 0.5) * 6, originY + Math.sin(angle) * (len * 0.5));
                ctx.lineTo(originX + Math.cos(angle) * len, originY + Math.sin(angle) * len);
                ctx.stroke();
            }

            // Inward converging particles
            for (let i = 0; i < battle.kamehameha.particles.length; i++) {
                const p = battle.kamehameha.particles[i];
                p.x += (p.tx - p.x) * 0.18;
                p.y += (p.ty - p.y) * 0.18;
                p.alpha -= 0.04;

                ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            battle.kamehameha.particles = battle.kamehameha.particles.filter(p => p.alpha > 0);
        }

        // 2. Colossal Kamehameha Beam
        if (battle.kamehameha.beamActive && battle.kamehameha.beamWidth > 0) {
            const w = battle.kamehameha.beamWidth;
            const len = battle.kamehameha.beamLength;

            ctx.save();

            // Outer cyan glowing corona
            const beamOuterGrad = ctx.createLinearGradient(originX, originY - w, originX, originY + w);
            beamOuterGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
            beamOuterGrad.addColorStop(0.2, 'rgba(56, 189, 248, 0.6)');
            beamOuterGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.95)');
            beamOuterGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.6)');
            beamOuterGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

            ctx.fillStyle = beamOuterGrad;
            ctx.fillRect(originX, originY - w, len, w * 2);

            // Intense pure white plasma core
            const coreW = w * 0.42;
            const beamCoreGrad = ctx.createLinearGradient(originX, originY - coreW, originX, originY + coreW);
            beamCoreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
            beamCoreGrad.addColorStop(0.5, '#ffffff');
            beamCoreGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

            ctx.fillStyle = beamCoreGrad;
            ctx.fillRect(originX, originY - coreW, len, coreW * 2);

            // Expanding shockwave rings along beam
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2.5;
            for (let i = 1; i <= 3; i++) {
                const ringX = originX + (len * 0.28 * i);
                ctx.beginPath();
                ctx.ellipse(ringX, originY, w * 0.35, w * 1.1, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    // Start 60fps render loop
    requestAnimationFrame(render);

    /* ==========================================================================
       6. Active Navbar State on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset + 240;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
});

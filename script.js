/**
 * S. S. GOKULA SWAMY // RAIKABUILDS
 * Awwwards-Caliber Scrolling Engine & Cinematic Background Architecture
 * Ultra Instinct Scroll-Driven Video Scrubbing, Inertia Physics & Canvas Atmosphere
 * Powered by Anime.js v4 & Modern Web Standards
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Universal Anime.js v4 Helper
       ========================================================================== */
    function animate(target, params) {
        if (window.anime && typeof window.anime.animate === 'function') {
            return window.anime.animate(target, params);
        } else if (typeof window.anime === 'function') {
            return window.anime(Object.assign({ targets: target }, params));
        }
        for (const k in params) {
            if (typeof target[k] === 'number' && typeof params[k] === 'number') {
                target[k] = params[k];
            }
        }
    }

    /* ==========================================================================
       2. Real-Time Telemetry Clock (Bengaluru IST)
       ========================================================================== */
    const istClockEl = document.getElementById('live-ist-clock');
    function updateClock() {
        if (!istClockEl) return;
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        istClockEl.textContent = now.toLocaleTimeString('en-GB', options) + ' IST';
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* ==========================================================================
       3. Fluid Custom Magnetic Cursor (Awwwards Style)
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const cursorLabel = document.getElementById('cursor-label');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isCursorActive = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isCursorActive) {
            isCursorActive = true;
            ringX = mouseX;
            ringY = mouseY;
            if (cursorDot) cursorDot.style.opacity = '1';
            if (cursorRing) cursorRing.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        if (cursorDot) cursorDot.style.opacity = '0';
        if (cursorRing) cursorRing.style.opacity = '0';
        isCursorActive = false;
    });

    // Magnetic hover targets with data-cursor
    const hoverTargets = document.querySelectorAll('a, button, .showcase-card, .hero-stat-box, .skill-category-card, .cred-card, [data-cursor]');
    hoverTargets.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            if (!cursorRing) return;
            cursorRing.classList.add('is-hover');
            const label = el.getAttribute('data-cursor') || 'VIEW';
            if (cursorLabel) cursorLabel.textContent = label;
        });

        el.addEventListener('mouseleave', () => {
            if (!cursorRing) return;
            cursorRing.classList.remove('is-hover');
            if (cursorLabel) cursorLabel.textContent = '';
            // Reset magnetic pull
            el.style.transform = '';
        });

        el.addEventListener('mousemove', (e) => {
            // Subtle magnetic attraction for buttons
            if (el.tagName.toLowerCase() === 'button' || el.classList.contains('btn') || el.classList.contains('btn-resume')) {
                const rect = el.getBoundingClientRect();
                const relX = e.clientX - (rect.left + rect.width / 2);
                const relY = e.clientY - (rect.top + rect.height / 2);
                el.style.transform = `translate(${relX * 0.15}px, ${relY * 0.15}px)`;
            }
        });
    });

    /* ==========================================================================
       4. Cinematic Background Engine (Ultra Instinct Video Crossfader)
       ========================================================================== */
    const layerAwakening = document.getElementById('bg-layer-awakening');
    const layerDodge = document.getElementById('bg-layer-dodge');
    const layerKamehameha = document.getElementById('bg-layer-kamehameha');

    const videoAwakening = layerAwakening ? layerAwakening.querySelector('video') : null;
    const videoDodge = layerDodge ? layerDodge.querySelector('video') : null;
    const videoKamehameha = layerKamehameha ? layerKamehameha.querySelector('video') : null;

    // Ensure all background videos start playing silently and seamlessly
    [videoAwakening, videoDodge, videoKamehameha].forEach((vid) => {
        if (vid) {
            vid.muted = true;
            vid.playsInline = true;
            vid.play().catch(() => {
                // Auto-play policy fallback
                document.addEventListener('click', () => vid.play(), { once: true });
            });
        }
    });

    let currentPhase = 'awakening';
    const hudPhaseName = document.getElementById('hud-phase-name');

    function updateBackgroundPhase(globalProgress) {
        let targetPhase = 'awakening';
        let phaseLabel = 'UI // AWAKENING';

        if (globalProgress < 0.28) {
            targetPhase = 'awakening';
            phaseLabel = 'UI // AWAKENING';
        } else if (globalProgress < 0.62) {
            targetPhase = 'dodge';
            phaseLabel = 'UI // DODGE & ETERNAL FLOW';
        } else {
            targetPhase = 'kamehameha';
            phaseLabel = 'UI // KAMEHAMEHA CLIMAX';
        }

        if (hudPhaseName && hudPhaseName.textContent !== phaseLabel) {
            hudPhaseName.textContent = phaseLabel;
            animate(hudPhaseName, {
                opacity: [0, 1],
                translateY: [-6, 0],
                duration: 400,
                ease: 'outQuad'
            });
        }

        if (targetPhase !== currentPhase) {
            currentPhase = targetPhase;

            if (layerAwakening) layerAwakening.classList.toggle('active', currentPhase === 'awakening');
            if (layerDodge) layerDodge.classList.toggle('active', currentPhase === 'dodge');
            if (layerKamehameha) layerKamehameha.classList.toggle('active', currentPhase === 'kamehameha');
        }
    }

    /* ==========================================================================
       5. Ambient Canvas Particles & Kinetic Speed Lines
       ========================================================================== */
    const canvas = document.getElementById('ambient-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    function resizeCanvas() {
        if (!canvas) return;
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Celestial Silver God-Ki Embers
    const PARTICLE_COUNT = 45;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            radius: Math.random() * 2 + 1,
            speedY: Math.random() * 1.5 + 0.5,
            drift: (Math.random() - 0.5) * 0.8,
            alpha: Math.random() * 0.6 + 0.2,
            phase: Math.random() * Math.PI * 2
        });
    }

    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    function renderAmbientCanvas() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Calculate scroll velocity damping
        scrollVelocity *= 0.92;

        // Render celestial silver embers
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = particles[i];
            p.phase += 0.02;
            p.y -= (p.speedY + Math.abs(scrollVelocity) * 0.25);
            p.x += Math.sin(p.phase) * p.drift;

            if (p.y < -10) {
                p.y = canvasHeight + 10;
                p.x = Math.random() * canvasWidth;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = currentPhase === 'kamehameha' ? '#38bdf8' : '#e2e8f0';
            ctx.fill();
        }

        // Render kinetic speed lines when user scrolls rapidly
        if (Math.abs(scrollVelocity) > 3) {
            const lineCount = Math.min(Math.floor(Math.abs(scrollVelocity) * 1.5), 25);
            ctx.strokeStyle = currentPhase === 'kamehameha' 
                ? 'rgba(56, 189, 248, 0.35)' 
                : 'rgba(241, 245, 249, 0.25)';
            ctx.lineWidth = 1.5;

            for (let j = 0; j < lineCount; j++) {
                const lineX = (j * (canvasWidth / lineCount) + (Date.now() % 100)) % canvasWidth;
                const length = Math.random() * 80 + 40;
                const lineY = Math.random() * canvasHeight;

                ctx.beginPath();
                ctx.moveTo(lineX, lineY);
                ctx.lineTo(lineX, lineY + (scrollVelocity > 0 ? length : -length));
                ctx.stroke();
            }
        }
    }

    /* ==========================================================================
       6. Pinned Scrollytelling Showcase Engine
       ========================================================================== */
    const showcasePinnedSection = document.getElementById('showcase-pinned');
    const showcaseStrip = document.getElementById('showcase-strip');
    const activeSlideNumEl = document.getElementById('active-slide-num');
    const stripProgressBar = document.getElementById('strip-progress-bar');
    const showcaseCards = document.querySelectorAll('.showcase-card');

    function updateShowcasePinned(currentY) {
        if (!showcasePinnedSection || !showcaseStrip) return;

        // Skip horizontal transform on mobile/tablet where it gracefully stacks
        if (window.innerWidth <= 960) {
            showcaseStrip.style.transform = 'none';
            return;
        }

        const rect = showcasePinnedSection.getBoundingClientRect();
        const sectionTop = showcasePinnedSection.offsetTop;
        const sectionHeight = showcasePinnedSection.offsetHeight;
        const windowH = window.innerHeight;

        // Progress inside the pinned section from 0.0 to 1.0
        const totalDistance = sectionHeight - windowH;
        if (totalDistance <= 0) return;

        const distanceScrolled = currentY - sectionTop;
        const progress = Math.max(0, Math.min(1, distanceScrolled / totalDistance));

        // Horizontal glide width calculation
        const stripWidth = showcaseStrip.scrollWidth;
        const maxTranslate = stripWidth - (window.innerWidth * 0.88);

        const currentTranslate = progress * maxTranslate;
        showcaseStrip.style.transform = `translateX(-${currentTranslate}px)`;

        // Update active slide counter (01 to 04)
        const totalSlides = showcaseCards.length;
        const activeIndex = Math.min(totalSlides, Math.floor(progress * totalSlides) + 1);
        if (activeSlideNumEl) {
            activeSlideNumEl.textContent = `0${activeIndex}`;
        }

        // Update strip progress bar
        if (stripProgressBar) {
            stripProgressBar.style.width = `${progress * 100}%`;
        }

        // Parallax depth & 3D tilt on cards based on distance from center
        showcaseCards.forEach((card, idx) => {
            const cardCenter = (idx * (card.offsetWidth + (window.innerWidth * 0.04))) - currentTranslate + (card.offsetWidth / 2);
            const distFromScreenCenter = (cardCenter - (window.innerWidth / 2)) / (window.innerWidth / 2);
            const clampedDist = Math.max(-1, Math.min(1, distFromScreenCenter));

            // Apply subtle tilt and scale
            const scale = 1 - Math.abs(clampedDist) * 0.04;
            card.style.transform = `perspective(1000px) rotateY(${clampedDist * -4}deg) scale(${scale})`;
        });
    }

    /* ==========================================================================
       7. Scroll HUD & Global Progress Tracker
       ========================================================================== */
    const hudProgressBar = document.getElementById('hud-progress-bar');
    const hudCounter = document.getElementById('hud-counter');
    const hudDots = document.querySelectorAll('.hud-dot');

    const sections = [
        { id: '#hero', name: '01' },
        { id: '#showcase-pinned', name: '02' },
        { id: '#skills', name: '03' },
        { id: '#credentials', name: '04' },
        { id: '#contact', name: '05' }
    ];

    function updateScrollHUD(currentY, globalProgress) {
        if (hudProgressBar) {
            hudProgressBar.style.height = `${globalProgress * 100}%`;
        }

        // Find active section
        let activeIdx = 0;
        sections.forEach((sec, i) => {
            const el = document.querySelector(sec.id);
            if (el) {
                const top = el.offsetTop - 300;
                if (currentY >= top) {
                    activeIdx = i;
                }
            }
        });

        if (hudCounter) {
            hudCounter.textContent = `${sections[activeIdx].name} / 05`;
        }

        hudDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIdx);
        });
    }

    // Dot click smooth scroll
    hudDots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const target = dot.getAttribute('data-target');
            const targetEl = document.querySelector(target);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ==========================================================================
       8. Number Counter Increment Animation
       ========================================================================== */
    let numbersAnimated = false;
    function checkNumberCounters(currentY) {
        if (numbersAnimated) return;
        const heroStats = document.querySelector('.hero-stats-strip');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            numbersAnimated = true;
            document.querySelectorAll('.stat-num').forEach((numEl) => {
                const targetVal = parseFloat(numEl.getAttribute('data-count'));
                if (isNaN(targetVal)) return;

                const isFloat = String(targetVal).includes('.');
                const obj = { val: 0 };

                animate(obj, {
                    val: targetVal,
                    duration: 1800,
                    ease: 'outExpo',
                    onUpdate: () => {
                        numEl.textContent = isFloat ? obj.val.toFixed(1) : Math.floor(obj.val);
                    }
                });
            });
        }
    }

    /* ==========================================================================
       9. Copy Email Button with Visual Feedback
       ========================================================================== */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyStatusText = document.getElementById('copy-status-text');

    if (copyEmailBtn && copyStatusText) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'gokulaswamyss@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                const originalText = copyStatusText.textContent;
                copyStatusText.textContent = '✓ Copied to clipboard!';
                copyStatusText.style.color = '#38bdf8';

                setTimeout(() => {
                    copyStatusText.textContent = originalText;
                    copyStatusText.style.color = '';
                }, 2400);
            }).catch(() => {
                window.location.href = `mailto:${email}`;
            });
        });
    }

    /* ==========================================================================
       10. Main RAF Loop (60 FPS Smooth Interpolation & Inertia)
       ========================================================================== */
    function tick() {
        const currentY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const globalProgress = maxScroll > 0 ? Math.max(0, Math.min(1, currentY / maxScroll)) : 0;

        // Calculate scroll velocity
        const delta = currentY - lastScrollY;
        scrollVelocity += delta * 0.15;
        lastScrollY = currentY;

        // Update cursor ring smooth lag
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;

        if (cursorDot) {
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }
        if (cursorRing) {
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        }

        // Update Background Phase & Scrollytelling
        updateBackgroundPhase(globalProgress);
        updateShowcasePinned(currentY);
        updateScrollHUD(currentY, globalProgress);
        checkNumberCounters(currentY);
        renderAmbientCanvas();

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    console.log('⚡ raikabuilds // Awwwards-caliber scrolling engine initialized.');
});

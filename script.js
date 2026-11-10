/**
 * S. S. GOKULA SWAMY // RAIKABUILDS
 * Interactive Engineering Terminal & Fallback Scroll Animation Engine
 * Performance-first, zero third-party dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Native Scroll-Driven Animation Fallback (IntersectionObserver)
       Complies strictly with Modern Web Guidance best practices
       ========================================================================== */
    const supportsScrollDriven = CSS.supports && CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supportsScrollDriven && !prefersReducedMotion) {
        document.documentElement.classList.add('js-observer-ready');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Unobserve once revealed for peak performance
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    }

    /* ==========================================================================
       2. Active Navbar State on Scroll
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

    /* ==========================================================================
       3. Interactive Terminal Boot Sequence & Shell CLI
       ========================================================================== */
    const overlay = document.getElementById('terminal-overlay');
    const outputEl = document.getElementById('terminal-output');
    const promptLine = document.getElementById('terminal-prompt-line');
    const inputEl = document.getElementById('terminal-input');
    const skipBtn = document.getElementById('terminal-skip-btn');
    const openBtn = document.getElementById('open-terminal-btn');

    let isTyping = false;
    let bootAborted = false;

    const bootSequence = [
        { text: ">> INITIALIZING RAIKA AI SUBSYSTEMS (Bengaluru Node)...", class: "term-cyan", delay: 80 },
        { text: ">> DETECTING GPU HARDWARE... [PyTorch CUDA 13.0 Active]", class: "term-muted", delay: 90 },
        { text: ">> MOUNTING MULTIMODAL PERCEPTION HEADS:", class: "term-muted", delay: 100 },
        { text: "   • Google SigLIP-2 (768-dim, α=0.65 background attenuation) ... [OK]", class: "term-green", delay: 70 },
        { text: "   • Meta DINOv2-S (SmoothL1 Mass Regression Head) ............. [OK]", class: "term-green", delay: 70 },
        { text: "   • Microsoft MoGe-2 (Metric Depth + SVD Tare 3.5mm) .......... [OK]", class: "term-green", delay: 70 },
        { text: "   • Meta SAM 2.1 Hiera (Zero-Shot Boundary Disentanglement) ... [OK]", class: "term-green", delay: 70 },
        { text: ">> VERIFYING UNCLONE HACKATHON DEFENSIVE ENGINE:", class: "term-muted", delay: 80 },
        { text: "   • Real-Time Sliding Buffer: 6-second window calibrated", class: "term-indigo", delay: 60 },
        { text: "   • Segment-Level Policy: SYNTHETIC CONF >= 0.90 / 4s => [HOLD]", class: "term-amber", delay: 60 },
        { text: "   • Zero-Dependency stdlib PCM WAV Forensics (silence >0.15, RMS <0.004) [ACTIVE]", class: "term-indigo", delay: 60 },
        { text: ">> BENCHMARKING IEEE AIC 2026 WFLO TENSORS:", class: "term-muted", delay: 80 },
        { text: "   • Vectorized Jensen Wake Model: (8, 150, 150) tensors, ZERO LOOPS", class: "term-cyan", delay: 60 },
        { text: "   • Two-Fidelity GA Rescoring: 4029.16 GWh/yr (+2.69% / +105.7 GWh/yr GAIN)", class: "term-green", delay: 70 },
        { text: ">> CORE PROFILE LOADED: S. S. Gokula Swamy (Lion4467cat)", class: "term-cyan", delay: 120 },
        { text: ">> System fully operational. Type 'help' for commands, or press ESC to explore.", class: "term-muted", delay: 150 }
    ];

    function appendLine(htmlContent) {
        const p = document.createElement('p');
        p.innerHTML = htmlContent;
        outputEl.appendChild(p);
        outputEl.parentElement.scrollTop = outputEl.parentElement.scrollHeight;
    }

    async function runBootSequence() {
        isTyping = true;
        bootAborted = false;
        outputEl.innerHTML = '';
        promptLine.style.display = 'none';

        for (const item of bootSequence) {
            if (bootAborted) break;
            appendLine(`<span class="${item.class}">${item.text}</span>`);
            await new Promise(resolve => setTimeout(resolve, item.delay));
        }

        isTyping = false;
        promptLine.style.display = 'flex';
        inputEl.focus();
    }

    function closeTerminal() {
        bootAborted = true;
        overlay.classList.remove('active');
        sessionStorage.setItem('terminal_seen', 'true');
    }

    function openTerminal() {
        overlay.classList.add('active');
        if (outputEl.children.length === 0) {
            runBootSequence();
        } else {
            promptLine.style.display = 'flex';
            inputEl.focus();
        }
    }

    // Auto-open on first session visit only, so we never annoy returning visitors
    if (!sessionStorage.getItem('terminal_seen')) {
        setTimeout(openTerminal, 300);
    }

    skipBtn.addEventListener('click', closeTerminal);
    openBtn.addEventListener('click', openTerminal);

    // Global keyboard listener for [ESC] and [T]
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeTerminal();
        } else if ((e.key === 't' || e.key === 'T') && !overlay.classList.contains('active') && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            openTerminal();
        }
    });

    // Shell Command Processor
    const commands = {
        help: () => `
Available Commands:
  <span class="term-cyan">projects</span>   - Overview of NutriSense & The Greenifier
  <span class="term-cyan">research</span>   - IEEE AIC 2026 paper & UNCLONE Hackathon win
  <span class="term-cyan">resume</span>     - Open locked Curriculum Vitae PDF in a new tab
  <span class="term-cyan">identity</span>   - Cadet credentials, NDA qualification & endurance athletics
  <span class="term-cyan">stack</span>      - Full grounded AI & numerical stack
  <span class="term-cyan">clear</span>      - Clear terminal output
  <span class="term-cyan">exit</span>       - Close terminal and enter graphical portfolio
`,
        projects: () => `
<span class="term-green">1. NutriSense (Major Project @ BMSCE)</span>:
   8-subsystem 3D dietary metrology pipeline. SigLIP-2 (768-dim, α=0.65) classifying 115 dishes.
   MoGe-2 metric depth + SVD plane fitting (3.5mm tare) + frozen DINOv2-S SmoothL1 mass fusion.
   4,000-draw Monte Carlo engine applying Fréchet–Hoeffding comonotonic sums for PM POSHAN auditing.
   [GitHub: github.com/Lion4467cat/NutriSense]

<span class="term-green">2. The Greenifier</span>:
   Geospatial rooftop solar potential estimator. Zoom 18 satellite tiles via Web Mercator.
   OpenCV HSV thresholding, Canny edges, morphological closing.
   NASA POWER solar irradiance + Llama 3.3 70B financial modeling (INR 65,000/kW capex, CO2 offset).
   [GitHub: github.com/Lion4467cat/greenifier]
`,
        research: () => `
<span class="term-cyan">[ACCEPTED RESEARCH PAPER] IEEE AIC 2026</span>:
   "GPU-Accelerated Hybrid Two-Fidelity GA for Wind Farm Layout Optimization on Irregular Polygon Domains"
   Vectorized Jensen wake model in PyTorch: (8, 150, 150) tensors, zero loops.
   AEP: 4029.16 GWh/yr (+2.69% / +105.7 GWh/yr gain). Strict >= 400m spacing repair.

<span class="term-indigo">[1st RUNNER-UP] UNCLONE AI Hackathon 2026 (BMSCE & DetectifAI)</span>:
   "Verified-Agent Badge" — Client-side voice deepfake defense over 6s live call buffers.
   Synthetic confidence >= 0.90 on any 4s segment triggers immediate transaction hold.
   Pure Python stdlib PCM WAV forensics (silence >0.15, room RMS <0.004, clipping).
`,
        resume: () => {
            window.open('assets/SS_Gokula_Swamy_Resume.pdf', '_blank', 'noopener,noreferrer');
            return `<span class="term-green">Opening locked resume PDF in a new browser tab...</span>`;
        },
        identity: () => `
<span class="term-amber">MILITARY & CADET CREDENTIALS</span>:
  • Sainik School Kodagu Alumnus
  • Qualified UPSC NDA Written Examination (2023) — top ~0.5% nationwide
  • NCC Certificates: 'A' (Grade A), 'B' (Grade B), 'C' (Grade B)
  • Best Volunteer Award, NSS Annual Camp 2025 (selected from 100+ candidates)

<span class="term-amber">ENDURANCE ATHLETICS</span>:
  • Completed 79.9 km and 58.2 km timed cyclothons
  • Long-distance marathon runner & Himalayan mountain trekker
  • Competitive chess player (look-ahead search & combinatorial strategy)
`,
        stack: () => `
<span class="term-muted">AI & Multimodal:</span> SigLIP-2, DINOv2-S, MoGe-2, SAM 2.1, Llama 3.3 70B, Monte Carlo
<span class="term-muted">Optimization:</span>    PyTorch (CUDA Tensors), NumPy, Shapely, PyGAD, FLORIS, TopFarm
<span class="term-muted">Full-Stack:</span>      FastAPI, Flask, React 19, Leaflet.js, Web Audio API, Uvicorn, Vite
<span class="term-muted">Tooling:</span>         Linux, Git, GitHub, Docker, uv, Render, Groq API, NASA POWER API
`,
        clear: () => {
            outputEl.innerHTML = '';
            return null;
        },
        exit: () => {
            closeTerminal();
            return `<span class="term-muted">Exiting terminal...</span>`;
        },
        quit: () => {
            closeTerminal();
            return `<span class="term-muted">Exiting terminal...</span>`;
        }
    };

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawVal = inputEl.value.trim();
            const cmd = rawVal.toLowerCase();
            inputEl.value = '';

            if (!rawVal) return;

            appendLine(`<span class="prompt-user">tinkerer@raika</span><span class="prompt-sep">:</span><span class="prompt-path">~</span><span class="prompt-symbol">$</span> ${rawVal}`);

            if (commands[cmd]) {
                const res = commands[cmd]();
                if (res) appendLine(res);
            } else {
                appendLine(`<span class="term-rose">Command not recognized: '${rawVal}'. Type 'help' for available commands.</span>`);
            }
        }
    });

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeTerminal();
        }
    });
});

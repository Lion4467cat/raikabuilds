/**
 * S. S. Gokula Swamy — Portfolio Interactive Behavior
 * Theme toggle, mobile drawer, scroll progress, scroll-spy, subtle reveal, copy email.
 */
(function () {
    'use strict';

    var root = document.documentElement;
    var themeToggles = document.querySelectorAll('.theme-toggle');
    var themeChip = document.querySelector('.theme-chip');
    var themeLabel = document.querySelector('.theme-label');

    function getActiveTheme() {
        return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function syncThemeLabel() {
        var label = getActiveTheme() === 'dark' ? 'Dark' : 'Light';
        if (themeLabel) themeLabel.textContent = label;
        if (themeChip) themeChip.setAttribute('aria-label', 'Toggle color theme (' + label + ')');
    }

    themeToggles.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var next = getActiveTheme() === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            syncThemeLabel();
        });
    });
    syncThemeLabel();

    // ---- Mobile Navigation Drawer ----
    var menuBtn = document.getElementById('menu-btn');
    var drawer = document.getElementById('mobile-drawer');
    var mobileBar = document.getElementById('mobile-bar');

    function setDrawer(open) {
        if (!menuBtn || !drawer) return;
        drawer.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close section menu' : 'Open section menu');
    }

    if (menuBtn && drawer) {
        menuBtn.addEventListener('click', function () {
            setDrawer(!drawer.classList.contains('open'));
        });
        drawer.addEventListener('click', function (e) {
            if (e.target.closest('a')) setDrawer(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setDrawer(false);
        });
        document.addEventListener('click', function (e) {
            if (drawer.classList.contains('open') && mobileBar && !mobileBar.contains(e.target)) {
                setDrawer(false);
            }
        });
        window.matchMedia('(min-width: 881px)').addEventListener('change', function (mq) {
            if (mq.matches) setDrawer(false);
        });
    }

    // ---- Mobile Scroll Progress Line ----
    var progressEl = document.getElementById('scroll-progress');
    var ticking = false;
    function updateProgress() {
        if (progressEl) {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var ratio = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
            progressEl.style.transform = 'scaleX(' + ratio + ')';
        }
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateProgress);
        }
    }, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();

    // ---- Subtle Scroll Reveal ----
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var revealIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealIo.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -24px 0px' });
        reveals.forEach(function (el) { revealIo.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    // ---- Desktop Left-Rail Scroll Spy ----
    var railLinks = Array.prototype.slice.call(document.querySelectorAll('#rail-nav .rail-link[href^="#"]'));
    var sections = railLinks
        .map(function (a) { return document.querySelector(a.getAttribute('href')); })
        .filter(Boolean);

    function setActiveLink(id) {
        railLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === id);
        });
    }

    if ('IntersectionObserver' in window && sections.length) {
        var spyIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActiveLink('#' + entry.target.id);
                }
            });
        }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
        sections.forEach(function (sec) { spyIo.observe(sec); });
    }

    // ---- Copy Email Button ----
    var copyBtn = document.getElementById('copy-email');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var email = copyBtn.getAttribute('data-email') || 'gokulaswamyss@gmail.com';
            var original = copyBtn.textContent;
            function confirmCopy() {
                copyBtn.textContent = 'Copied ✓';
                setTimeout(function () { copyBtn.textContent = original; }, 2000);
            }
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(confirmCopy, function () {
                    copyBtn.textContent = email;
                    setTimeout(function () { copyBtn.textContent = original; }, 2500);
                });
            } else {
                var ta = document.createElement('textarea');
                ta.value = email;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    confirmCopy();
                } catch (err) {
                    copyBtn.textContent = email;
                    setTimeout(function () { copyBtn.textContent = original; }, 2500);
                }
                document.body.removeChild(ta);
            }
        });
    }

    // ---- Footer Year ----
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

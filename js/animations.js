/* =====================================================
   GLOWLABS — SCROLL & TECH ANIMATIONS
   ===================================================== */

(function () {
  'use strict';

  /* ── 1. Scroll reveal (data-anim + data-stagger) ── */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          if (el.dataset.stagger !== undefined) {
            /* assign --anim-d to each child */
            Array.from(el.children).forEach((child, i) => {
              child.style.setProperty('--anim-d', i * 0.1 + 's');
            });
          }
          el.classList.add('in');
          revealObs.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  function initReveal() {
    document.querySelectorAll('[data-anim], [data-stagger]').forEach((el) => {
      revealObs.observe(el);
    });
  }

  /* ── 2. Number counter (data-count) ─────────────── */
  function countUp(el) {
    const raw   = el.dataset.count;          // e.g. "60000" or "40"
    const suffix = el.dataset.suffix || '';  // e.g. "€" or "%"
    const prefix = el.dataset.prefix || '';  // e.g. "+"
    const target = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
    const duration = 1400; // ms
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      /* format with locale separators */
      el.textContent = prefix + current.toLocaleString('de-DE') + suffix;

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString('de-DE') + suffix;
    }
    requestAnimationFrame(tick);
  }

  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          countUp(e.target);
          countObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  function initCounters() {
    document.querySelectorAll('[data-count]').forEach((el) => {
      countObs.observe(el);
    });
  }

  /* ── 3. Typewriter for .gl-eyebrow ──────────────── */
  function typewriter(el) {
    const text   = el.textContent.trim();
    el.textContent = '';
    el.style.visibility = 'visible';
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 45);
  }

  const twObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          typewriter(e.target);
          twObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.8 }
  );

  function initTypewriter() {
    document.querySelectorAll('.gl-eyebrow, .gl-section-label').forEach((el) => {
      el.style.visibility = 'hidden';
      twObs.observe(el);
    });
  }

  /* ── 4. Scan-line dividers ───────────────────────── */
  function initScanLines() {
    /* inject a scan line before every section that has data-scanline */
    document.querySelectorAll('[data-scanline]').forEach((section) => {
      const div = document.createElement('div');
      div.className = 'gl-scan-line';
      section.insertAdjacentElement('beforebegin', div);
    });
  }

  /* ── 5. Particle background on .gl-hero ─────────── */
  function initParticles() {
    document.querySelectorAll('.gl-hero').forEach((hero) => {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = [
        'position:absolute', 'inset:0', 'width:100%', 'height:100%',
        'pointer-events:none', 'z-index:1', 'opacity:0.35'
      ].join(';');
      hero.style.position = hero.style.position || 'relative';
      hero.insertBefore(canvas, hero.firstChild);

      const ctx    = canvas.getContext('2d');
      const dpr    = window.devicePixelRatio || 1;
      const COUNT  = 55;
      let W, H, dots;

      function resize() {
        W = canvas.clientWidth;
        H = canvas.clientHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);
      }

      function makeDot() {
        return {
          x:  Math.random() * W,
          y:  Math.random() * H,
          r:  Math.random() * 1.5 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a:  Math.random() * 0.6 + 0.2
        };
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        dots.forEach((d) => {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0) d.x = W;
          if (d.x > W) d.x = 0;
          if (d.y < 0) d.y = H;
          if (d.y > H) d.y = 0;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160,140,255,${d.a})`;
          ctx.fill();
        });
        requestAnimationFrame(draw);
      }

      resize();
      dots = Array.from({ length: COUNT }, makeDot);
      draw();
      window.addEventListener('resize', () => { resize(); });
    });
  }

  /* ── Boot ────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    initReveal();
    initCounters();
    initTypewriter();
    initScanLines();
    initParticles();
  }
})();

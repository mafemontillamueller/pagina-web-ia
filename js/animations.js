/* =====================================================
   GLOWLABS — WOW ANIMATIONS v2
   Full immersive tech experience
   ===================================================== */
(function () {
  'use strict';

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Scroll progress bar ──────────────────────── */
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'gl-progress-bar';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ── 2. Custom cursor ───────────────────────────── */
  function initCursor() {
    if (isMobile || prefersReduced) return;
    const cursor = document.createElement('div');
    const trail  = document.createElement('div');
    cursor.className = 'gl-cursor';
    trail.className  = 'gl-cursor-trail';
    document.body.appendChild(cursor);
    document.body.appendChild(trail);

    let mx = -200, my = -200, tx = -200, ty = -200;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    /* trail follows with lag */
    function animTrail() {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.left = tx + 'px';
      trail.style.top  = ty + 'px';
      requestAnimationFrame(animTrail);
    }
    animTrail();

    /* hover state on interactive elements */
    document.querySelectorAll('a, button, .gl-btn, .gl-team-card, .gl-case-block, .gl-feature-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));
  }

  /* ── 3. Neural-net canvas on .gl-hero ───────────── */
  function initNeuralNet() {
    document.querySelectorAll('.gl-hero').forEach(hero => {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
      hero.style.position = hero.style.position || 'relative';
      hero.insertBefore(canvas, hero.firstChild);

      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let W, H, nodes;
      const COUNT      = isMobile ? 35 : 70;
      const CONNECT    = isMobile ? 100 : 160;
      const NODE_COLOR = 'rgba(160,140,255,';
      const LINE_COLOR = 'rgba(99,102,241,';

      function resize() {
        W = canvas.clientWidth;
        H = canvas.clientHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);
      }

      function makeNode() {
        return {
          x:  Math.random() * W,
          y:  Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r:  Math.random() * 1.8 + 0.5,
          a:  Math.random() * 0.5 + 0.3
        };
      }

      let mouseX = -9999, mouseY = -9999;
      canvas.parentElement.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
      });
      canvas.parentElement.addEventListener('mouseleave', () => {
        mouseX = -9999; mouseY = -9999;
      });

      let raf;
      function draw() {
        ctx.clearRect(0, 0, W, H);
        nodes.forEach(n => {
          /* mouse repulsion */
          const dx = n.x - mouseX, dy = n.y - mouseY;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 80) {
            n.vx += (dx / d) * 0.4;
            n.vy += (dy / d) * 0.4;
          }
          /* dampen & move */
          n.vx *= 0.98; n.vy *= 0.98;
          n.x += n.vx;  n.y += n.vy;
          if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
          if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
        });

        /* draw connections */
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < CONNECT) {
              const alpha = (1 - dist / CONNECT) * 0.35;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = LINE_COLOR + alpha + ')';
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
        /* draw nodes */
        nodes.forEach(n => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = NODE_COLOR + n.a + ')';
          ctx.fill();
        });

        raf = requestAnimationFrame(draw);
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            if (!nodes) { resize(); nodes = Array.from({length: COUNT}, makeNode); }
            if (!raf) draw();
          } else {
            cancelAnimationFrame(raf); raf = null;
          }
        });
      });
      observer.observe(canvas.parentElement);

      window.addEventListener('resize', () => {
        resize();
        if (nodes) nodes.forEach(n => { n.x = Math.random() * W; n.y = Math.random() * H; });
      });
    });
  }

  /* ── 4. Mouse parallax on hero shapes ───────────── */
  function initShapeParallax() {
    if (isMobile) return;
    document.querySelectorAll('.gl-hero').forEach(hero => {
      const shapes = hero.querySelectorAll('.gl-shape-wrap');
      if (!shapes.length) return;
      hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width  - 0.5;
        const cy = (e.clientY - rect.top)  / rect.height - 0.5;
        shapes.forEach((s, i) => {
          const depth = (i % 3 + 1) * 12;
          s.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
        });
      });
      hero.addEventListener('mouseleave', () => {
        shapes.forEach(s => s.style.transform = '');
      });
    });
  }

  /* ── 5. Word-split reveal on hero headings ───────── */
  function splitWords(el) {
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        words.forEach(tok => {
          if (/\s+/.test(tok)) {
            frag.appendChild(document.createTextNode(tok));
          } else if (tok) {
            const outer = document.createElement('span');
            outer.className = 'gl-word-outer';
            const inner = document.createElement('span');
            inner.className = 'gl-word-inner';
            inner.textContent = tok;
            outer.appendChild(inner);
            frag.appendChild(outer);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT') {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    walk(el);
  }

  function revealWords(el) {
    const inners = el.querySelectorAll('.gl-word-inner');
    inners.forEach((w, i) => {
      w.style.transitionDelay = (i * 0.055) + 's';
      w.classList.add('revealed');
    });
  }

  function initWordReveal() {
    /* split all h1/h2 in heroes */
    document.querySelectorAll('.gl-hero h1, .gl-hero h2').forEach(h => {
      splitWords(h);
      /* immediately reveal (hero is above fold) */
      requestAnimationFrame(() => requestAnimationFrame(() => revealWords(h)));
    });
    /* split h2/h3 in sections — reveal on scroll */
    document.querySelectorAll('[data-anim] h2, [data-anim] h3').forEach(h => {
      splitWords(h);
    });
  }

  /* ── 6. Scroll reveal (data-anim + data-stagger) ─── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.dataset.stagger !== undefined) {
        Array.from(el.children).forEach((child, i) => {
          child.style.setProperty('--anim-d', (i * 0.12) + 's');
        });
      }
      el.classList.add('in');
      /* reveal any split words inside */
      el.querySelectorAll('.gl-word-inner').forEach((w, i) => {
        w.style.transitionDelay = (i * 0.055) + 's';
        w.classList.add('revealed');
      });
      revealObs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  function initReveal() {
    document.querySelectorAll('[data-anim], [data-stagger]').forEach(el => revealObs.observe(el));
  }

  /* ── 7. Number counter ───────────────────────────── */
  function countUp(el) {
    const raw    = el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const target = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
    const duration = 1600;
    const start    = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      const cur = Math.round(eased * target);
      el.textContent = prefix + cur.toLocaleString('de-DE') + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString('de-DE') + suffix;
    }
    requestAnimationFrame(tick);
  }
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { countUp(e.target); countObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));
  }

  /* ── 8. Typewriter for .gl-eyebrow ──────────────── */
  function typewriter(el) {
    const text = el.textContent.trim();
    el.textContent = '';
    el.style.visibility = 'visible';
    let i = 0;
    const iv = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(iv);
    }, 42);
  }
  const twObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { typewriter(e.target); twObs.unobserve(e.target); }
    });
  }, { threshold: 0.9 });
  function initTypewriter() {
    document.querySelectorAll('.gl-eyebrow, .gl-section-label').forEach(el => {
      el.style.visibility = 'hidden';
      twObs.observe(el);
    });
  }

  /* ── 9. Scan-line dividers ───────────────────────── */
  function initScanLines() {
    document.querySelectorAll('[data-scanline]').forEach(section => {
      const div = document.createElement('div');
      div.className = 'gl-scan-line';
      section.insertAdjacentElement('beforebegin', div);
    });
  }

  /* ── 10. 3D tilt on cards ────────────────────────── */
  function addTilt(el) {
    if (isMobile || prefersReduced) return;
    el.classList.add('gl-tilt');
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) scale(1.025)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }
  function initTilt() {
    document.querySelectorAll('.gl-case-block, .gl-service-visual, .gl-mv-block').forEach(addTilt);
    document.querySelectorAll('.gl-team-card').forEach(el => {
      if (isMobile || prefersReduced) return;
      el.classList.add('gl-tilt');
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        el.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.03)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ── 11. Magnetic buttons ────────────────────────── */
  function initMagnetic() {
    if (isMobile || prefersReduced) return;
    document.querySelectorAll('.gl-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.22;
        const y = (e.clientY - r.top  - r.height / 2) * 0.22;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ── 12. Ripple on button click ──────────────────── */
  function initRipple() {
    document.querySelectorAll('.gl-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const r = btn.getBoundingClientRect();
        const span = document.createElement('span');
        span.className = 'gl-ripple';
        const size = Math.max(r.width, r.height) * 2;
        span.style.cssText = `
          width:${size}px;height:${size}px;
          left:${e.clientX - r.left - size/2}px;
          top:${e.clientY - r.top  - size/2}px;
        `;
        btn.appendChild(span);
        setTimeout(() => span.remove(), 700);
      });
    });
  }

  /* ── 13. Ambient section glow ────────────────────── */
  function initAmbientGlow() {
    const overlay = document.createElement('div');
    overlay.className = 'gl-ambient';
    document.body.insertBefore(overlay, document.body.firstChild);

    const colorMap = [
      { selector: '#captacion, .gl-hero',  color: 'rgba(99,102,241,0.06)'  },
      { selector: '#ventas',               color: 'rgba(59,130,246,0.06)'  },
      { selector: '#fidelizacion',         color: 'rgba(52,211,153,0.06)'  },
      { selector: '#filosofia',            color: 'rgba(249,115,22,0.05)'  },
      { selector: '.gl-team-section',      color: 'rgba(139,92,246,0.06)'  },
      { selector: '.gl-mv-grid',           color: 'rgba(244,63,94,0.05)'   },
      { selector: '#casos',                color: 'rgba(124,58,237,0.06)'  },
    ];

    const obsGlow = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const found = colorMap.find(m => e.target.matches(m.selector));
        if (found) {
          overlay.style.background = `radial-gradient(ellipse 70% 45% at 50% 0%, ${found.color} 0%, transparent 70%)`;
        }
      });
    }, { threshold: 0.3 });

    colorMap.forEach(m => {
      document.querySelectorAll(m.selector).forEach(el => obsGlow.observe(el));
    });
  }

  /* ── 14. Feature item opacity ────────────────────── */
  function initFeatureHover() {
    document.querySelectorAll('.gl-features-grid').forEach(grid => {
      const items = grid.querySelectorAll('.gl-feature-item');
      grid.addEventListener('mouseenter', () => {
        items.forEach(i => i.style.opacity = '0.45');
      });
      grid.addEventListener('mouseleave', () => {
        items.forEach(i => i.style.opacity = '');
      });
      items.forEach(item => {
        item.addEventListener('mouseenter', () => item.style.opacity = '1');
      });
    });
  }

  /* ── 15. Nav blur on scroll ──────────────────────── */
  function initNavScroll() {
    const nav = document.querySelector('.gl-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.style.background = 'rgba(10,10,12,0.95)';
        nav.style.borderBottomColor = 'rgba(255,255,255,0.1)';
      } else {
        nav.style.background = '';
        nav.style.borderBottomColor = '';
      }
    }, { passive: true });
  }

  /* ── 16. Stagger service sections ────────────────── */
  function initServiceStagger() {
    document.querySelectorAll('.gl-service-section').forEach((section, i) => {
      section.style.setProperty('--anim-d', (i * 0.08) + 's');
    });
  }

  /* ── Boot ─────────────────────────────────────────── */
  function boot() {
    initProgressBar();
    initCursor();
    initNeuralNet();
    initShapeParallax();
    initWordReveal();
    initReveal();
    initCounters();
    initTypewriter();
    initScanLines();
    initTilt();
    initMagnetic();
    initRipple();
    initAmbientGlow();
    initFeatureHover();
    initNavScroll();
    initServiceStagger();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

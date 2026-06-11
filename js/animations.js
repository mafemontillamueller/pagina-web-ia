/* =====================================================
   GLOWLABS — WOW ANIMATIONS v3
   Fix: word-split only on hero h1, never gradient spans
   New: scroll parallax, ticker, homepage hooks
   ===================================================== */
(function () {
  'use strict';

  const isMobile    = /Mobi|Android/i.test(navigator.userAgent);
  const isReduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════
     1. SCROLL PROGRESS BAR
  ═══════════════════════════════════════════════ */
  function initProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'gl-progress-bar';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     2. CUSTOM CURSOR
  ═══════════════════════════════════════════════ */
  function initCursor() {
    if (isMobile || isReduced) return;
    const cursor = document.createElement('div');
    const trail  = document.createElement('div');
    cursor.className = 'gl-cursor';
    trail.className  = 'gl-cursor-trail';
    document.body.appendChild(cursor);
    document.body.appendChild(trail);

    let mx = -300, my = -300, tx = -300, ty = -300;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });
    (function loop() {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.left = tx + 'px';
      trail.style.top  = ty + 'px';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .gl-btn, .gl-team-card, .gl-case-block, .gl-feature-item, .service_item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));
  }

  /* ═══════════════════════════════════════════════
     3. NEURAL-NET CANVAS on .gl-hero
  ═══════════════════════════════════════════════ */
  function initNeuralNet() {
    document.querySelectorAll('.gl-hero').forEach(hero => {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
      hero.insertBefore(canvas, hero.firstChild);

      const ctx  = canvas.getContext('2d');
      const dpr  = Math.min(window.devicePixelRatio || 1, 2);
      const CNT  = isMobile ? 35 : 70;
      const CONN = isMobile ? 110 : 160;
      let W, H, nodes, raf;
      let mx = -9999, my = -9999;

      function resize() {
        W = canvas.clientWidth; H = canvas.clientHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.scale(dpr, dpr);
      }
      const mkNode = () => ({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-.5)*.45, vy:(Math.random()-.5)*.45, r:Math.random()*1.8+.5, a:Math.random()*.5+.25 });

      hero.addEventListener('mousemove', e => { const r=canvas.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; });
      hero.addEventListener('mouseleave', () => { mx=-9999; my=-9999; });

      function draw() {
        ctx.clearRect(0,0,W,H);
        nodes.forEach(n => {
          const dx=n.x-mx, dy=n.y-my, d=Math.sqrt(dx*dx+dy*dy);
          if (d < 90) { n.vx += (dx/d)*.5; n.vy += (dy/d)*.5; }
          n.vx *= .98; n.vy *= .98; n.x += n.vx; n.y += n.vy;
          if(n.x<0)n.x=W; if(n.x>W)n.x=0; if(n.y<0)n.y=H; if(n.y>H)n.y=0;
        });
        for (let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
          const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<CONN){ const al=(1-dist/CONN)*.3; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=`rgba(99,102,241,${al})`; ctx.lineWidth=.8; ctx.stroke(); }
        }
        nodes.forEach(n=>{ ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fillStyle=`rgba(160,140,255,${n.a})`; ctx.fill(); });
        raf = requestAnimationFrame(draw);
      }

      new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { if(!nodes){resize();nodes=Array.from({length:CNT},mkNode);} if(!raf)draw(); }
        else { cancelAnimationFrame(raf); raf=null; }
      })).observe(hero);

      window.addEventListener('resize', () => { resize(); nodes&&nodes.forEach(n=>{n.x=Math.random()*W;n.y=Math.random()*H;}); });
    });
  }

  /* ═══════════════════════════════════════════════
     4. HERO SCROLL PARALLAX (content drifts up)
  ═══════════════════════════════════════════════ */
  function initHeroParallax() {
    if (isReduced) return;
    document.querySelectorAll('.gl-hero').forEach(hero => {
      const content = hero.querySelector('.gl-hero-content');
      const shapes  = hero.querySelectorAll('.gl-shape-wrap');
      if (!content) return;
      window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        const hH = hero.offsetHeight;
        if (sy > hH) return;
        const ratio = sy / hH;
        content.style.transform  = `translateY(${sy * 0.28}px)`;
        content.style.opacity     = Math.max(0, 1 - ratio * 2);
        shapes.forEach((s, i) => {
          s.style.transform = `translateY(${sy * (0.08 + i * 0.04)}px)`;
        });
      }, { passive: true });
    });
  }

  /* ═══════════════════════════════════════════════
     5. MOUSE PARALLAX on shapes
  ═══════════════════════════════════════════════ */
  function initShapeParallax() {
    if (isMobile || isReduced) return;
    document.querySelectorAll('.gl-hero').forEach(hero => {
      const shapes = hero.querySelectorAll('.gl-shape-wrap');
      if (!shapes.length) return;
      hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        const cx = (e.clientX-r.left)/r.width-.5;
        const cy = (e.clientY-r.top)/r.height-.5;
        shapes.forEach((s,i) => { const d=(i%3+1)*14; s.style.transform=`translate(${cx*d}px,${cy*d}px)`; });
      });
      hero.addEventListener('mouseleave', () => shapes.forEach(s => s.style.transform = ''));
    });
  }

  /* ═══════════════════════════════════════════════
     6. WORD-SPLIT REVEAL — HERO h1 ONLY
        (Safe: skips gradient/element children)
  ═══════════════════════════════════════════════ */
  function splitWords(el) {
    /* Only recurse into text nodes at the top level of el;
       child ELEMENT nodes (like gradient spans) are wrapped whole */
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const toks = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        toks.forEach(tok => {
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
          if (!tok) return;
          const outer = document.createElement('span');
          outer.className = 'gl-word-outer';
          const inner = document.createElement('span');
          inner.className = 'gl-word-inner';
          inner.textContent = tok;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        /* Wrap the whole element (e.g. gradient span) as one word */
        const outer = document.createElement('span');
        outer.className = 'gl-word-outer';
        const inner = document.createElement('span');
        inner.className = 'gl-word-inner';
        inner.style.display = 'inline'; /* gradient spans need inline, not inline-block */
        inner.appendChild(node.cloneNode(true));
        outer.appendChild(inner);
        node.parentNode.replaceChild(outer, node);
      }
    });
  }

  function revealWords(el, baseDelay) {
    el.querySelectorAll('.gl-word-inner').forEach((w, i) => {
      w.style.transitionDelay = ((baseDelay||0) + i * 0.055) + 's';
      w.classList.add('revealed');
    });
  }

  function initWordReveal() {
    /* Hero h1 — reveal immediately (above fold) */
    document.querySelectorAll('.gl-hero h1').forEach(h => {
      splitWords(h);
      requestAnimationFrame(() => requestAnimationFrame(() => revealWords(h, 0.2)));
    });
    /* Section h2 with data-split attribute — revealed on scroll via IntersectionObserver below */
    document.querySelectorAll('h2[data-split], h3[data-split]').forEach(h => {
      splitWords(h);
    });
  }

  /* ═══════════════════════════════════════════════
     7. SCROLL REVEAL (data-anim + data-stagger)
  ═══════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.dataset.stagger !== undefined) {
        Array.from(el.children).forEach((c, i) => c.style.setProperty('--anim-d', (i*.12)+'s'));
      }
      el.classList.add('in');
      /* Reveal any split words inside (only h2[data-split]) */
      el.querySelectorAll('.gl-word-inner').forEach((w, i) => {
        w.style.transitionDelay = (i * .055) + 's';
        w.classList.add('revealed');
      });
      revealObs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  function initReveal() {
    document.querySelectorAll('[data-anim], [data-stagger]').forEach(el => revealObs.observe(el));
  }

  /* ═══════════════════════════════════════════════
     8. HOMEPAGE SECTION HOOKS (Webflow classes)
  ═══════════════════════════════════════════════ */
  function initHomepage() {
    const addAnim = (sel, dir, delayMult) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (el.dataset.anim) return; /* already handled */
        el.dataset.anim = dir || 'up';
        if (delayMult) el.style.setProperty('--anim-d', (i * delayMult) + 's');
        revealObs.observe(el);
      });
    };
    addAnim('.service_item',      'up',    0.1);
    addAnim('.figures_item',      'scale', 0.1);
    addAnim('.brand-section',     'up',    0);
    addAnim('.feature_block',     'up',    0.08);
    addAnim('.case-study_item',   'up',    0.1);
    addAnim('[data-animate-figures]', 'up', 0);
  }

  /* ═══════════════════════════════════════════════
     9. SCROLL-DRIVEN BIG NUMBER SCALE
        (the "01 02 03" service visuals)
  ═══════════════════════════════════════════════ */
  function initBigNumParallax() {
    if (isReduced) return;
    document.querySelectorAll('.gl-service-visual').forEach(vis => {
      const bigNum = vis.querySelector('.big-num');
      if (!bigNum) return;
      const onScroll = () => {
        const rect = vis.getBoundingClientRect();
        const mid  = rect.top + rect.height / 2;
        const ratio = 1 - (mid / window.innerHeight);
        const scale = 1 + ratio * 0.25;
        bigNum.style.transform = `scale(${Math.max(.85, Math.min(scale, 1.25))})`;
        bigNum.style.opacity   = 0.05 + ratio * 0.12;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    });
  }

  /* ═══════════════════════════════════════════════
     10. TECH TICKER STRIP
  ═══════════════════════════════════════════════ */
  function initTicker() {
    const targets = document.querySelectorAll('[data-ticker]');
    if (!targets.length) return;
    const words = [
      'Inteligencia Artificial','Automatización','CRM','WhatsApp Bot',
      'Lead Generation','Funnels','Email Marketing','Instagram Ads',
      'Ventas ×3','Captación','Fidelización','Análisis Predictivo',
      'IA Generativa','Chatbots','Sistemas a Medida'
    ];
    targets.forEach(wrap => {
      wrap.style.cssText += 'overflow:hidden;white-space:nowrap;position:relative;';
      const track = document.createElement('div');
      track.style.cssText = 'display:inline-flex;gap:2.5rem;animation:glTickerRoll 30s linear infinite;will-change:transform;';
      const html = words.map(w => `<span style="font-size:.7rem;font-weight:700;letter-spacing:.14em;color:rgba(255,255,255,.35);text-transform:uppercase;">${w}</span>`).join('');
      track.innerHTML = html + html; /* duplicate for seamless loop */
      wrap.appendChild(track);
    });
    if (!document.getElementById('gl-ticker-style')) {
      const s = document.createElement('style');
      s.id = 'gl-ticker-style';
      s.textContent = '@keyframes glTickerRoll{from{transform:translateX(0)}to{transform:translateX(-50%)}}';
      document.head.appendChild(s);
    }
  }

  /* ═══════════════════════════════════════════════
     11. TYPEWRITER on .gl-eyebrow / .gl-section-label
  ═══════════════════════════════════════════════ */
  const twObs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, text = el.textContent.trim();
    el.textContent = ''; el.style.visibility = 'visible';
    let i = 0;
    const iv = setInterval(() => { el.textContent += text[i++]; if(i>=text.length)clearInterval(iv); }, 42);
    twObs.unobserve(el);
  }), { threshold: 0.9 });

  function initTypewriter() {
    document.querySelectorAll('.gl-eyebrow, .gl-section-label').forEach(el => {
      el.style.visibility = 'hidden';
      twObs.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════
     12. NUMBER COUNTER
  ═══════════════════════════════════════════════ */
  const countObs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const raw = el.dataset.count, suffix = el.dataset.suffix||'', prefix = el.dataset.prefix||'';
    const target = parseFloat(raw.replace(/\./g,'').replace(',','.'));
    const dur = 1600, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now-t0)/dur,1), e2 = 1-Math.pow(1-p,4);
      el.textContent = prefix + Math.round(e2*target).toLocaleString('de-DE') + suffix;
      if(p<1) requestAnimationFrame(tick); else el.textContent = prefix+target.toLocaleString('de-DE')+suffix;
    };
    requestAnimationFrame(tick);
    countObs.unobserve(el);
  }), { threshold: .5 });

  function initCounters() {
    document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));
  }

  /* ═══════════════════════════════════════════════
     13. SCAN-LINE DIVIDERS
  ═══════════════════════════════════════════════ */
  function initScanLines() {
    document.querySelectorAll('[data-scanline]').forEach(sec => {
      const d = document.createElement('div');
      d.className = 'gl-scan-line';
      sec.insertAdjacentElement('beforebegin', d);
    });
  }

  /* ═══════════════════════════════════════════════
     14. 3D TILT on cards
  ═══════════════════════════════════════════════ */
  function addTilt(el, maxDeg) {
    if (isMobile || isReduced) return;
    el.classList.add('gl-tilt');
    el.addEventListener('mousemove', e => {
      const r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      el.style.transform = `perspective(900px) rotateY(${x*maxDeg}deg) rotateX(${-y*maxDeg}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  }
  function initTilt() {
    document.querySelectorAll('.gl-case-block, .gl-service-visual, .gl-mv-block').forEach(el => addTilt(el, 9));
    document.querySelectorAll('.gl-team-card').forEach(el => addTilt(el, 6));
    document.querySelectorAll('.service_item').forEach(el => addTilt(el, 5));
  }

  /* ═══════════════════════════════════════════════
     15. MAGNETIC BUTTONS + RIPPLE
  ═══════════════════════════════════════════════ */
  function initButtons() {
    document.querySelectorAll('.gl-btn, .btn, [class*="button"]').forEach(btn => {
      if (!isMobile && !isReduced) {
        btn.addEventListener('mousemove', e => {
          const r=btn.getBoundingClientRect(), x=(e.clientX-r.left-r.width/2)*.22, y=(e.clientY-r.top-r.height/2)*.22;
          btn.style.transform = `translate(${x}px,${y}px)`;
        });
        btn.addEventListener('mouseleave', () => btn.style.transform = '');
      }
      btn.addEventListener('click', e => {
        const r=btn.getBoundingClientRect(), span=document.createElement('span');
        span.className = 'gl-ripple';
        const sz = Math.max(r.width,r.height)*2;
        span.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX-r.left-sz/2}px;top:${e.clientY-r.top-sz/2}px;`;
        btn.appendChild(span);
        setTimeout(() => span.remove(), 700);
      });
    });
  }

  /* ═══════════════════════════════════════════════
     16. AMBIENT SECTION GLOW
  ═══════════════════════════════════════════════ */
  function initAmbient() {
    const ov = document.createElement('div');
    ov.className = 'gl-ambient';
    document.body.insertBefore(ov, document.body.firstChild);
    const map = [
      { s: '.gl-hero, .padding-section-large.is-home-hero', c: 'rgba(99,102,241,0.06)'  },
      { s: '#captacion',          c: 'rgba(124,58,237,0.06)'  },
      { s: '#ventas',             c: 'rgba(59,130,246,0.06)'  },
      { s: '#fidelizacion',       c: 'rgba(52,211,153,0.06)'  },
      { s: '#filosofia',          c: 'rgba(249,115,22,0.05)'  },
      { s: '.gl-team-section',    c: 'rgba(139,92,246,0.07)'  },
      { s: '.gl-mv-grid',         c: 'rgba(244,63,94,0.05)'   },
      { s: '#casos',              c: 'rgba(124,58,237,0.07)'  },
      { s: '.figures-block',      c: 'rgba(99,102,241,0.05)'  },
    ];
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const found = map.find(m => { try { return e.target.matches(m.s); } catch(_){return false;} });
      if (found) ov.style.background = `radial-gradient(ellipse 70% 45% at 50% 0%,${found.c} 0%,transparent 70%)`;
    }), { threshold: 0.25 });
    map.forEach(m => { try { document.querySelectorAll(m.s).forEach(el => obs.observe(el)); } catch(_){} });
  }

  /* ═══════════════════════════════════════════════
     17. FEATURE GRID HOVER DIM
  ═══════════════════════════════════════════════ */
  function initFeatureHover() {
    document.querySelectorAll('.gl-features-grid').forEach(grid => {
      const items = grid.querySelectorAll('.gl-feature-item');
      grid.addEventListener('mouseenter', () => items.forEach(i => i.style.opacity = '0.4'));
      grid.addEventListener('mouseleave', () => items.forEach(i => i.style.opacity  = ''));
      items.forEach(item => { item.addEventListener('mouseenter', () => item.style.opacity = '1'); });
    });
  }

  /* ═══════════════════════════════════════════════
     18. NAV DARKEN ON SCROLL
  ═══════════════════════════════════════════════ */
  function initNav() {
    const nav = document.querySelector('.gl-nav, .navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 40;
      nav.style.background = scrolled ? 'rgba(10,10,12,0.97)' : '';
      nav.style.borderBottomColor = scrolled ? 'rgba(255,255,255,0.1)' : '';
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     BOOT
  ═══════════════════════════════════════════════ */
  function boot() {
    initProgressBar();
    initCursor();
    initNeuralNet();
    initHeroParallax();
    initShapeParallax();
    initWordReveal();
    initReveal();
    initHomepage();
    initBigNumParallax();
    initTicker();
    initTypewriter();
    initCounters();
    initScanLines();
    initTilt();
    initButtons();
    initAmbient();
    initFeatureHover();
    initNav();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();

/* ===== DAVIL — v2 motion engine =====
   Lenis + GSAP ScrollTrigger · char/word splits · 3D tilt · magnetic CTAs ·
   velocity skew · pinned manifesto · grain canvas · scroll progress
================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover:none)').matches;

  /* ---------- Year ---------- */
  $('#year') && ($('#year').textContent = new Date().getFullYear());

  /* ---------- Page progress bar ---------- */
  const progressBar = document.createElement('div');
  progressBar.className = 'page-progress';
  progressBar.innerHTML = '<span></span>';
  document.body.appendChild(progressBar);
  const progressFill = progressBar.querySelector('span');

  /* ---------- Loader ---------- */
  const loader = $('#loader');
  let heroStarted = false;
  const startHeroAnim = () => {
    if (heroStarted) return;
    heroStarted = true;
    document.body.classList.add('is-ready');
  };
  const hideLoader = () => {
    if (!loader || loader.classList.contains('hidden')) return;
    loader.classList.add('hidden');
    setTimeout(startHeroAnim, 400);
    setTimeout(() => loader.remove(), 1400);
  };
  window.addEventListener('load', () => setTimeout(hideLoader, 800));
  setTimeout(hideLoader, 3000);

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* ---------- Anchor links ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -60, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      $('.nav-menu')?.classList.remove('open');
      $('.nav-toggle')?.classList.remove('open');
    });
  });

  /* ---------- Nav scroll state ---------- */
  const nav = $('.nav');
  const onScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle('is-scrolled', y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressFill) progressFill.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Nav mobile toggle ---------- */
  const toggle = $('.nav-toggle');
  const menu = $('.nav-menu');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });

  /* ---------- Custom cursor with text mode ---------- */
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  if (dot && ring && !isTouch) {
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let label = '';
    addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform  = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    tick();
    // Hover targets (cards + links + buttons)
    const hoverSel = 'a, button, [data-cursor], .asse, .pilastro, .rcard, .piano, .contatto-card, .servizio, .storia-cap, .faq summary';
    $$(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('is-hover');
        const txt = el.dataset.cursor;
        if (txt) { ring.dataset.label = txt; ring.classList.add('has-label'); }
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('is-hover','has-label');
        delete ring.dataset.label;
      });
    });
  }

  /* ---------- Magnetic effect on primary CTAs ---------- */
  if (!isTouch && !prefersReducedMotion) {
    $$('.btn-primary, .nav-menu .cta').forEach(btn => {
      const strength = 18;
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- 3D tilt on cards ---------- */
  if (!isTouch && !prefersReducedMotion) {
    $$('.asse, .pilastro, .rcard, .piano, .contatto-card').forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.willChange = 'transform';
      let raf = null;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(1100px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translate3d(0,-3px,0)`;
        });
      };
      const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  /* ---------- Grain canvas overlay on hero ---------- */
  const hero = $('.hero');
  if (hero && !prefersReducedMotion) {
    const grain = document.createElement('canvas');
    grain.className = 'grain-canvas';
    hero.appendChild(grain);
    const ctx = grain.getContext('2d');
    let w = grain.width = 256;
    let h = grain.height = 256;
    const tickGrain = () => {
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i+1] = d[i+2] = v;
        d[i+3] = 18; // alpha
      }
      ctx.putImageData(img, 0, 0);
      setTimeout(() => requestAnimationFrame(tickGrain), 80); // ~12fps grain
    };
    tickGrain();
  }

  /* ---------- Split utilities ---------- */
  const splitChars = (el) => {
    if (el.dataset.split === 'done') return el.querySelectorAll('.ch > span');
    const walk = (node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...node.textContent].forEach(ch => {
          if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
          const wrap = document.createElement('span');
          wrap.className = 'ch';
          wrap.style.cssText = 'display:inline-block;overflow:hidden;line-height:inherit;vertical-align:bottom';
          const inner = document.createElement('span');
          inner.style.cssText = 'display:inline-block;will-change:transform,opacity';
          inner.textContent = ch;
          wrap.appendChild(inner);
          frag.appendChild(wrap);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.childNodes.length) {
        [...node.childNodes].forEach(walk);
      }
    };
    walk(el);
    el.dataset.split = 'done';
    return el.querySelectorAll('.ch > span');
  };

  const splitWords = (el) => {
    if (el.dataset.splitWords === 'done') return;
    const wrap = (node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(chunk => {
          if (/^\s+$/.test(chunk)) frag.appendChild(document.createTextNode(chunk));
          else if (chunk.length) {
            const w = document.createElement('span');
            w.className = 'w';
            w.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom';
            const inner = document.createElement('span');
            inner.style.cssText = 'display:inline-block;will-change:transform';
            inner.textContent = chunk;
            w.appendChild(inner);
            frag.appendChild(w);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.childNodes.length) {
        [...node.childNodes].forEach(wrap);
      }
    };
    wrap(el);
    el.dataset.splitWords = 'done';
    return el.querySelectorAll('.w > span');
  };

  /* ---------- GSAP animations ---------- */
  if (window.gsap && !prefersReducedMotion) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (lenis && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    /* === HERO — character-level reveal with 3D rotation === */
    const heroLines = $$('.hero-title .line');
    const heroChars = [];
    heroLines.forEach(line => {
      const inners = splitChars(line);
      if (inners) heroChars.push(...inners);
    });
    if (heroChars.length) {
      gsap.set(heroChars, { yPercent: 130, rotateX: -85, opacity: 0, transformPerspective: 800, transformOrigin: '0% 100%' });
      const playHero = () => {
        gsap.to(heroChars, {
          yPercent: 0, rotateX: 0, opacity: 1,
          duration: 1.2, ease: 'power4.out', stagger: { each: 0.018, from: 'start' },
          delay: 0.1
        });
      };
      // Trigger after loader hide
      const obs = new MutationObserver(() => {
        if (document.body.classList.contains('is-ready')) { playHero(); obs.disconnect(); }
      });
      obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      // Fallback in case loader removed before observer attaches
      setTimeout(() => {
        if (document.body.classList.contains('is-ready')) { playHero(); obs.disconnect(); }
      }, 100);
    }

    /* === Eyebrow + hero sub + ctas === */
    $$('.hero .eyebrow, .hero-sub, .hero-ctas').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out', delay: 0.7 + i * 0.15 }
      );
    });

    /* === Generic [data-reveal] === */
    $$('[data-reveal]').forEach(el => {
      if (el.closest('.hero')) return; // hero handled above
      gsap.fromTo(el,
        { opacity: 0, y: 64, scale: 0.98, filter: 'blur(6px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
          duration: 1.4, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    /* === [data-split-words] — sect-h flip-up reveal === */
    $$('[data-split-words]').forEach(h => {
      const inners = splitWords(h);
      if (!inners) return;
      gsap.set(inners, { yPercent: 130, rotate: 6, opacity: 0 });
      gsap.to(inners, {
        yPercent: 0, rotate: 0, opacity: 1,
        duration: 1.3, ease: 'power4.out', stagger: 0.06,
        scrollTrigger: { trigger: h, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });

    /* === Manifesto — pinned three-line crescendo === */
    const mani = $('#manifesto');
    if (mani) {
      const lines = $$('.m-line', mani);
      lines.forEach(l => splitWords(l));
      gsap.set(lines, { opacity: 0, y: 40 });
      gsap.set('.m-line .w > span', { yPercent: 130 });
      ScrollTrigger.create({
        trigger: mani,
        start: 'top top',
        end: '+=200%',
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          // 3 phases: 0-.33 line 1, .33-.66 line 2, .66-1 line 3
          lines.forEach((line, i) => {
            const localProg = Math.max(0, Math.min(1, (p - i * 0.30) / 0.30));
            const inners = $$('.w > span', line);
            gsap.set(line, { opacity: localProg < 0.05 ? 0 : 1, y: 40 - localProg * 40 });
            inners.forEach((sp, idx) => {
              const charDelay = idx / inners.length * 0.5;
              const charProg = Math.max(0, Math.min(1, (localProg - charDelay) / (1 - charDelay)));
              gsap.set(sp, { yPercent: 130 - charProg * 130, rotate: 8 - charProg * 8 });
            });
          });
        }
      });
    }

    /* === Velocity-based skew on big headings === */
    if (lenis) {
      let vel = 0;
      const skewables = $$('.sect-h, .mega');
      lenis.on('scroll', ({ velocity }) => {
        vel = velocity;
        const skew = gsap.utils.clamp(-12, 12, velocity * 0.18);
        gsap.to(skewables, { skewY: skew, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
      });
    }

    /* === Cards stagger reveal === */
    const cardSel = '.asse, .pilastro, .piano, .rcard, .contatto-card';
    $$(cardSel).forEach((c) => {
      const siblings = [...c.parentElement.children].filter(s => s.matches(cardSel));
      const i = siblings.indexOf(c);
      gsap.fromTo(c,
        { opacity: 0, y: 100, scale: 0.92, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
          duration: 1.4, ease: 'power4.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: c.parentElement, start: 'top 82%', toggleActions: 'play none none none' }
        }
      );
    });

    /* === Servizio rows — slide from left with progressive border === */
    $$('.servizio').forEach((s, i) => {
      gsap.fromTo(s,
        { opacity: 0, x: -80, filter: 'blur(8px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out',
          delay: (i % 4) * 0.06,
          scrollTrigger: { trigger: s, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    /* === Storia capitoli — capitolo per capitolo === */
    $$('.storia-cap').forEach((cap) => {
      const num = cap.querySelector('.cap-num');
      const h = cap.querySelector('.cap-h');
      const body = cap.querySelector('.cap-body');
      gsap.fromTo([num, h, body].filter(Boolean),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1,
          scrollTrigger: { trigger: cap, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    /* === Forwho lists — staggered list items === */
    $$('.forwho ul').forEach(ul => {
      const items = ul.querySelectorAll('li');
      gsap.fromTo(items,
        { opacity: 0, x: -30, filter: 'blur(4px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: ul, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    /* === Section labels with number badge pop === */
    $$('.section-label').forEach(label => {
      const num = label.querySelector('span');
      gsap.from(label, {
        opacity: 0, x: -60, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: label, start: 'top 92%' }
      });
      if (num) {
        gsap.from(num, {
          scale: 0, rotate: -180, opacity: 0,
          duration: 1.1, ease: 'back.out(2.5)', delay: 0.15,
          scrollTrigger: { trigger: label, start: 'top 92%' }
        });
      }
    });

    /* === Hero parallax === */
    const orb1 = $('.orb-1');
    const orb2 = $('.orb-2');
    if (orb1) gsap.to(orb1, { xPercent: 25, yPercent: 30, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (orb2) gsap.to(orb2, { xPercent: -22, yPercent: -28, duration: 24, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (hero) {
      gsap.to('.orb-1, .orb-2', {
        yPercent: 80, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero-inner', {
        yPercent: 30, scale: 0.92, opacity: 0.1, filter: 'blur(4px)',
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    /* === FAQ open/close letterspacing === */
    $$('.faq details').forEach(d => {
      d.addEventListener('toggle', () => {
        const ans = d.querySelector('.faq-answer');
        if (!ans) return;
        if (d.open) {
          gsap.fromTo(ans, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        }
      });
    });

    /* === CTA finale heading === */
    const ctaH = $('.cta-final .cta-h');
    if (ctaH) {
      const ws = splitWords(ctaH);
      if (ws) {
        gsap.set(ws, { yPercent: 130, rotate: 8 });
        gsap.to(ws, {
          yPercent: 0, rotate: 0, duration: 1.4, ease: 'power4.out', stagger: 0.06,
          scrollTrigger: { trigger: ctaH, start: 'top 90%', toggleActions: 'play none none none' }
        });
      }
    }
  } else {
    // No GSAP / reduced motion: ensure visibility
    $$('[data-reveal]').forEach(el => el.style.opacity = '1');
    document.body.classList.add('is-ready');
  }

  console.log('%c DAVIL ', 'background:#09090b;color:#f2efe9;font-weight:900;padding:4px 10px;border-radius:4px', 'v2 motion engine attivo.');
})();

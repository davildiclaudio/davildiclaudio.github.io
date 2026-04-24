/* ===== DAVIL — Life Leadership & Coaching =====
   JS: Lenis smooth scroll + GSAP reveal/split + custom cursor + micro-interactions
================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  const loader = $('#loader');
  const hideLoader = () => {
    if (!loader) return;
    setTimeout(() => loader.classList.add('hidden'), 1500);
    setTimeout(() => loader.remove(), 2400);
  };
  window.addEventListener('load', hideLoader);
  // Safety: in caso di load lento
  setTimeout(hideLoader, 3500);

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
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
      // chiudi menu mobile
      $('.nav-menu')?.classList.remove('open');
      $('.nav-toggle')?.classList.remove('open');
    });
  });

  /* ---------- Nav scroll state ---------- */
  const nav = $('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
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

  /* ---------- Custom cursor ---------- */
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  if (dot && ring && !matchMedia('(hover:none)').matches) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    tick();
    $$('a, button, [data-hover], .pillar, .ts-card, .principio, .servizio, .contatto-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ---------- GSAP animations ---------- */
  if (window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Hook ScrollTrigger to Lenis
    if (lenis && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    /* Hero title: pure CSS animation (see style.css .hero-title .line > span) */

    /* Elements with data-reveal */
    $$('[data-reveal]').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    /* Split headings into words and stagger */
    $$('[data-split-words]').forEach(h => {
      const raw = h.innerHTML;
      // preserve <br/>, <em>, etc by wrapping TEXT NODES only
      const wrapWords = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(chunk => {
            if (chunk.match(/\s+/)) { frag.appendChild(document.createTextNode(chunk)); }
            else if (chunk.length) {
              const w = document.createElement('span');
              w.className = 'w';
              w.style.display = 'inline-block';
              w.style.overflow = 'hidden';
              const inner = document.createElement('span');
              inner.style.display = 'inline-block';
              inner.style.willChange = 'transform';
              inner.textContent = chunk;
              w.appendChild(inner);
              frag.appendChild(w);
            }
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length) {
          [...node.childNodes].forEach(wrapWords);
        }
      };
      wrapWords(h);
      const inners = h.querySelectorAll('.w > span');
      gsap.set(inners, { yPercent: 110 });
      gsap.to(inners, {
        yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.04,
        scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    /* Parallax visuals */
    $$('[data-parallax]').forEach(el => {
      gsap.to(el, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    /* Orbs drift in hero */
    gsap.to('.orb-1', { xPercent: 20, yPercent: 15, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.orb-2', { xPercent: -15, yPercent: -20, duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    /* Pillar icon spin on scroll */
    $$('.pillar-icon img').forEach(img => {
      gsap.to(img, {
        rotate: 12,
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    });

    /* Section labels slide in */
    $$('.section-label').forEach(label => {
      gsap.from(label, {
        opacity: 0, x: -30, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: label, start: 'top 90%' }
      });
    });
  } else {
    // Fallback: show everything if GSAP fails to load
    $$('[data-reveal]').forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Image fallback: se il PNG manca, rimane il placeholder SVG di sfondo ---------- */
  $$('.principio-img img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none'; // scopre lo sfondo SVG decorativo
      const fig = img.closest('.principio-img');
      if (fig) fig.classList.add('principio-img-placeholder');
    });
  });

  /* Hero brand image fallback handled inline via onerror */

  console.log('%c DAVIL ', 'background:#2d2de0;color:#fff;font-weight:900;padding:4px 10px;border-radius:4px', 'Trasforma la tua realtà, guida la tua vita.');
})();

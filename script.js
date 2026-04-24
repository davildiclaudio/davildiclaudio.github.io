/* ===== DAVIL — Life Leadership & Coaching =====
   Lenis + GSAP ScrollTrigger · slideshow rauno-style · cinematic reveals
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
  const startHeroAnim = () => {
    $$('.hero-title .line').forEach((line, i) => {
      setTimeout(() => line.classList.add('is-animated'), 120 + i * 120);
    });
  };
  const hideLoader = () => {
    if (!loader) return;
    setTimeout(() => { loader.classList.add('hidden'); startHeroAnim(); }, 900);
    setTimeout(() => loader.remove(), 1800);
  };
  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 3200);

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
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
    $$('a, button, [data-hover], .pillar, .ts-card, .servizio, .contatto-card, .slide-nav').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ---------- Slideshow (rauno-style) ---------- */
  const SLIDE_FILES = [
    '001','002','003','004','005','006','009','010','011','012','013','014',
    '015','016','017','018','019','020','027','030','031','034','035','040',
    '041','042','048','049','050','051','052','065','071','073','074','075','076'
  ];
  const slideshow = $('#slideshow');
  if (slideshow) {
    const track = slideshow.querySelector('[data-slide-track]');
    const prevBtn = slideshow.querySelector('[data-slide-prev]');
    const nextBtn = slideshow.querySelector('[data-slide-next]');
    const currentEl = $('[data-slide-current]');
    const totalEl = $('[data-slide-total]');
    const progressEl = $('[data-slide-progress]');

    // Inject slides
    SLIDE_FILES.forEach((n, i) => {
      const s = document.createElement('div');
      s.className = 'slide' + (i === 0 ? ' is-current' : '');
      s.dataset.index = i;
      const img = document.createElement('img');
      img.alt = `Slide ${i + 1} — 7 Pilastri`;
      img.loading = i < 2 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.src = encodeURI(`assets/content/slides-corsi/7 Pilatri .${n}.jpeg`);
      s.appendChild(img);
      track.appendChild(s);
    });

    const slides = $$('.slide', track);
    let idx = 0;
    const total = slides.length;
    if (totalEl) totalEl.textContent = String(total).padStart(2, '0');

    const pad = (n) => String(n + 1).padStart(2, '0');
    const goTo = (n) => {
      idx = ((n % total) + total) % total;
      slides.forEach((s, i) => {
        s.classList.toggle('is-current', i === idx);
        s.classList.toggle('is-prev', i === (idx - 1 + total) % total);
        s.classList.toggle('is-next', i === (idx + 1) % total);
      });
      if (currentEl) currentEl.textContent = pad(idx);
      if (progressEl) progressEl.style.width = ((idx + 1) / total * 100) + '%';
    };
    goTo(0);

    prevBtn?.addEventListener('click', () => goTo(idx - 1));
    nextBtn?.addEventListener('click', () => goTo(idx + 1));

    // Keyboard
    const onKey = (e) => {
      const rect = slideshow.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(idx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(idx + 1); }
    };
    window.addEventListener('keydown', onKey);

    // Drag / swipe
    let dragStart = null;
    const onDown = (e) => { dragStart = (e.touches ? e.touches[0] : e).clientX; };
    const onUp = (e) => {
      if (dragStart === null) return;
      const endX = (e.changedTouches ? e.changedTouches[0] : e).clientX;
      const dx = endX - dragStart;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? idx + 1 : idx - 1);
      dragStart = null;
    };
    slideshow.addEventListener('mousedown', onDown);
    slideshow.addEventListener('mouseup', onUp);
    slideshow.addEventListener('mouseleave', () => dragStart = null);
    slideshow.addEventListener('touchstart', onDown, { passive: true });
    slideshow.addEventListener('touchend', onUp);
  }

  /* ---------- GSAP animations ---------- */
  if (window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    if (lenis && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    $$('[data-reveal]').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    /* Split headings into words and stagger */
    $$('[data-split-words]').forEach(h => {
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
        yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045,
        scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    /* Parallax visuals */
    $$('[data-parallax]').forEach(el => {
      gsap.to(el, {
        yPercent: -16,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* Orbs drift in hero */
    gsap.to('.orb-1', { xPercent: 18, yPercent: 12, duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.orb-2', { xPercent: -14, yPercent: -18, duration: 26, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    /* Hero parallax on scroll */
    gsap.to('.hero-bg', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-inner', {
      yPercent: 8,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* Pillar icon drift on scroll */
    $$('.pillar-icon img').forEach(img => {
      gsap.to(img, {
        rotate: 8, y: -6,
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 1.4 }
      });
    });

    /* Section labels slide in */
    $$('.section-label').forEach(label => {
      gsap.from(label, {
        opacity: 0, x: -30, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: label, start: 'top 90%' }
      });
    });
  } else {
    $$('[data-reveal]').forEach(el => el.classList.add('is-in'));
  }

  console.log('%c DAVIL ', 'background:#09090b;color:#f2efe9;font-weight:900;padding:4px 10px;border-radius:4px', 'Trasforma la tua realtà, guida la tua vita.');
})();

/* Ars Realis — app (React createElement calls) */
const {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;

// ============================================================
// COSMIC BACKDROP — Three.js (starfield + sacred geometry + portal)
//   + Canvas 2D "varianti" drifting
// ============================================================
function BrandSigil() {
  // Stella di David cosmica — due triangoli equilateri controrotanti (SMIL)
  // Geometria hexagram iscritta in viewBox 0-100, centro (50,50), raggio 40
  return React.createElement("div", { className: "brand-sigil" },
    React.createElement("svg", {
      viewBox: "0 0 100 100",
      className: "star-of-david",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true"
    },
      React.createElement("defs", null,
        React.createElement("linearGradient", {
          id: "sodGradUp", x1: "0%", y1: "0%", x2: "100%", y2: "100%"
        },
          React.createElement("stop", { offset: "0%", stopColor: "#22d3ee" }),
          React.createElement("stop", { offset: "50%", stopColor: "#a78bfa" }),
          React.createElement("stop", { offset: "100%", stopColor: "#ec4899" })
        ),
        React.createElement("linearGradient", {
          id: "sodGradDown", x1: "100%", y1: "0%", x2: "0%", y2: "100%"
        },
          React.createElement("stop", { offset: "0%", stopColor: "#ec4899" }),
          React.createElement("stop", { offset: "50%", stopColor: "#7c3aed" }),
          React.createElement("stop", { offset: "100%", stopColor: "#22d3ee" })
        ),
        React.createElement("radialGradient", {
          id: "sodCore", cx: "50%", cy: "50%", r: "50%"
        },
          React.createElement("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "0.9" }),
          React.createElement("stop", { offset: "60%", stopColor: "#ec4899", stopOpacity: "0.35" }),
          React.createElement("stop", { offset: "100%", stopColor: "#7c3aed", stopOpacity: "0" })
        )
      ),
      // Aura di fondo al centro
      React.createElement("circle", {
        cx: "50", cy: "50", r: "22",
        fill: "url(#sodCore)"
      }),
      // Triangolo verso l'alto — rotazione oraria
      React.createElement("polygon", {
        points: "50,10 84.64,70 15.36,70",
        fill: "none",
        stroke: "url(#sodGradUp)",
        strokeWidth: "2.6",
        strokeLinejoin: "round",
        strokeLinecap: "round"
      },
        React.createElement("animateTransform", {
          attributeName: "transform",
          type: "rotate",
          from: "0 50 50",
          to: "360 50 50",
          dur: "16s",
          repeatCount: "indefinite"
        })
      ),
      // Triangolo verso il basso — rotazione antioraria
      React.createElement("polygon", {
        points: "50,90 15.36,30 84.64,30",
        fill: "none",
        stroke: "url(#sodGradDown)",
        strokeWidth: "2.6",
        strokeLinejoin: "round",
        strokeLinecap: "round"
      },
        React.createElement("animateTransform", {
          attributeName: "transform",
          type: "rotate",
          from: "360 50 50",
          to: "0 50 50",
          dur: "16s",
          repeatCount: "indefinite"
        })
      ),
      // Punto cosmico al centro
      React.createElement("circle", {
        cx: "50", cy: "50", r: "2.4",
        fill: "#ffffff",
        opacity: "0.95"
      })
    )
  );
}

function MysticBackground() {
  const mountRef = useRef(null);
  const particlesRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof THREE === 'undefined') {
      console.warn('THREE non caricato');
      return;
    }
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const starScale = isMobile ? 0.28 : 1; // molto meno stelle su mobile per evitare stuttering
    const variantCount = isMobile ? 9 : 28;  // meno bolle → meno pressione GPU

    // -------------------------------------------------------
    // THREE.JS — scena 3D profonda
    // -------------------------------------------------------
    const host = mountRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05030f, 0.0018);
    const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 320;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile, // antialias OFF su mobile per fluidità
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false
    });
    // Cap DPR: su mobile massimo 1.25 per ridurre carico GPU ed evitare
    // pixelation da WebGL context loss (iOS Safari)
    const maxDpr = isMobile ? 1.25 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'three-canvas';
    host.appendChild(renderer.domElement);

    // Recovery da WebGL context loss (iOS Safari lo perde spesso quando
    // la memoria GPU è sotto pressione — causa "icona fantasma" bolle)
    const canvasEl = renderer.domElement;
    function onContextLost(e) {
      e.preventDefault();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }
    function onContextRestored() {
      if (!paused) tick();
    }
    canvasEl.addEventListener('webglcontextlost', onContextLost, false);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored, false);

    // ---- Starfield profondo (3 strati) ----
    function makeStars(count, spread, size, color) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = Math.pow(Math.random(), 0.6) * spread;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi) - spread * 0.2;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color, size, sizeAttenuation: true,
        transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      return new THREE.Points(geo, mat);
    }
    const starsFar   = makeStars(Math.round(1500 * starScale), 900, 1.4, 0xbcb0e8);
    const starsMid   = makeStars(Math.round(900 * starScale),  600, 1.9, 0xe0c8ff);
    const starsNear  = makeStars(Math.round(450 * starScale),  380, 2.6, 0xffffff);
    const starsPink  = makeStars(Math.round(220 * starScale),  520, 2.2, 0xf472b6);
    const starsCyan  = makeStars(Math.round(220 * starScale),  520, 2.2, 0x22d3ee);
    scene.add(starsFar, starsMid, starsNear, starsPink, starsCyan);

    // ---- Sacred geometry: icosaedro wireframe + torus rings ----
    const sacredGroup = new THREE.Group();
    const icoGeo = new THREE.IcosahedronGeometry(56, 1);
    const icoEdges = new THREE.EdgesGeometry(icoGeo);
    const icoMat = new THREE.LineBasicMaterial({
      color: 0xec4899, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const ico = new THREE.LineSegments(icoEdges, icoMat);
    sacredGroup.add(ico);

    const icoGeo2 = new THREE.IcosahedronGeometry(80, 0);
    const icoEdges2 = new THREE.EdgesGeometry(icoGeo2);
    const icoMat2 = new THREE.LineBasicMaterial({
      color: 0x22d3ee, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const ico2 = new THREE.LineSegments(icoEdges2, icoMat2);
    sacredGroup.add(ico2);

    // Anelli-portale
    const torusGeo = new THREE.TorusGeometry(110, 0.9, 16, 140);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const torus1 = new THREE.Mesh(torusGeo, torusMat);
    sacredGroup.add(torus1);

    const torusGeo2 = new THREE.TorusGeometry(135, 0.6, 12, 140);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0xec4899, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const torus2 = new THREE.Mesh(torusGeo2, torusMat2);
    torus2.rotation.x = Math.PI / 3;
    sacredGroup.add(torus2);

    const torusGeo3 = new THREE.TorusGeometry(165, 0.4, 12, 140);
    const torusMat3 = new THREE.MeshBasicMaterial({
      color: 0x22d3ee, transparent: true, opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    const torus3 = new THREE.Mesh(torusGeo3, torusMat3);
    torus3.rotation.x = -Math.PI / 4;
    torus3.rotation.z = Math.PI / 5;
    sacredGroup.add(torus3);

    // Posiziona il gruppo geometria sacra
    sacredGroup.position.set(0, 0, -40);
    scene.add(sacredGroup);

    // ---- Particelle energetiche orbitanti (meno su mobile) ----
    const orbGeo = new THREE.BufferGeometry();
    const ORBS = isMobile ? 55 : 140;
    const orbPos = new Float32Array(ORBS * 3);
    const orbSeed = [];
    for (let i = 0; i < ORBS; i++) {
      const r = 180 + Math.random() * 240;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      orbSeed.push({ r, theta, phi, speed: 0.08 + Math.random() * 0.18 });
      orbPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      orbPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      orbPos[i * 3 + 2] = r * Math.cos(phi);
    }
    orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPos, 3));
    const orbMat = new THREE.PointsMaterial({
      color: 0xf472b6, size: 3.2, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const orbs = new THREE.Points(orbGeo, orbMat);
    scene.add(orbs);

    // ---- Parallax su mouse ----
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    function onMouseMove(e) {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouseMove);

    // ---- Resize ----
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    // ---- Pausa quando la scheda è nascosta (risparmio batteria) ----
    let paused = false;
    function onVisibility() {
      paused = document.hidden;
      if (!paused && !rafId) tick();
    }
    document.addEventListener('visibilitychange', onVisibility);

    // ---- Loop animazione ----
    let rafId;
    const clock = new THREE.Clock();
    function tick() {
      if (paused) { rafId = null; return; }
      const t = clock.getElapsedTime();
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      camera.position.x = current.x * 30;
      camera.position.y = -current.y * 20;
      camera.lookAt(0, 0, 0);

      if (!reducedMotion) {
        starsFar.rotation.y  = t * 0.004;
        starsMid.rotation.y  = t * 0.008;
        starsNear.rotation.y = t * 0.014;
        starsPink.rotation.y = -t * 0.01;
        starsCyan.rotation.y = t * 0.012;

        ico.rotation.x = t * 0.12;
        ico.rotation.y = t * 0.18;
        ico2.rotation.x = -t * 0.08;
        ico2.rotation.y = t * 0.11;

        torus1.rotation.x = t * 0.15;
        torus1.rotation.y = t * 0.09;
        torus2.rotation.x = Math.PI / 3 + t * 0.07;
        torus2.rotation.z = t * 0.12;
        torus3.rotation.x = -Math.PI / 4 + t * 0.05;
        torus3.rotation.y = t * 0.08;

        // pulse alone su opacità torus
        torus1.material.opacity = 0.4 + Math.sin(t * 1.2) * 0.15;
        torus2.material.opacity = 0.3 + Math.sin(t * 1.6 + 1.2) * 0.12;
        torus3.material.opacity = 0.22 + Math.sin(t * 0.9 + 2.3) * 0.08;

        // orbit gli orbs attorno al centro
        const arr = orbGeo.attributes.position.array;
        for (let i = 0; i < ORBS; i++) {
          const o = orbSeed[i];
          o.theta += o.speed * 0.01;
          arr[i * 3]     = o.r * Math.sin(o.phi) * Math.cos(o.theta);
          arr[i * 3 + 1] = o.r * Math.sin(o.phi) * Math.sin(o.theta) + Math.sin(t * 0.5 + i) * 3;
          arr[i * 3 + 2] = o.r * Math.cos(o.phi);
        }
        orbGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }
    tick();

    // -------------------------------------------------------
    // CANVAS 2D — varianti soft-glow drifting
    // -------------------------------------------------------
    const pcanvas = particlesRef.current;
    let pctx = null;
    let pRaf = null;
    const variants = [];
    if (pcanvas) {
      // Cap DPR a 1.25 su mobile: evita "bolle pixelate" dovute a canvas
      // oversized che la GPU downscala in modo lossy
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);
      function resizeP() {
        pcanvas.width = Math.round(window.innerWidth * dpr);
        pcanvas.height = Math.round(window.innerHeight * dpr);
        pcanvas.style.width = window.innerWidth + 'px';
        pcanvas.style.height = window.innerHeight + 'px';
        if (pctx) {
          // Reset transform prima di riscalare (altrimenti lo scale si accumula)
          pctx.setTransform(1, 0, 0, 1, 0, 0);
          pctx.scale(dpr, dpr);
        }
      }
      pctx = pcanvas.getContext('2d');
      // resizeP applica setTransform + scale correttamente dopo aver settato width/height
      resizeP();
      window.addEventListener('resize', resizeP);
      const palette = ['rgba(124,58,237,', 'rgba(236,72,153,', 'rgba(34,211,238,', 'rgba(244,201,93,', 'rgba(167,139,250,'];
      for (let i = 0; i < variantCount; i++) {
        variants.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 40 + Math.random() * 90,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 0.06 + Math.random() * 0.12,
          phase: Math.random() * Math.PI * 2
        });
      }
      function pTick() {
        pctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const now = performance.now() * 0.001;
        for (let i = 0; i < variants.length; i++) {
          const v = variants[i];
          v.x += v.vx;
          v.y += v.vy;
          if (v.x < -v.r) v.x = window.innerWidth + v.r;
          if (v.x > window.innerWidth + v.r) v.x = -v.r;
          if (v.y < -v.r) v.y = window.innerHeight + v.r;
          if (v.y > window.innerHeight + v.r) v.y = -v.r;
          const breath = 0.7 + Math.sin(now * 0.6 + v.phase) * 0.3;
          const grd = pctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, v.r * breath);
          grd.addColorStop(0, v.color + (v.alpha * breath).toFixed(3) + ')');
          grd.addColorStop(1, v.color + '0)');
          pctx.fillStyle = grd;
          pctx.beginPath();
          pctx.arc(v.x, v.y, v.r * breath, 0, Math.PI * 2);
          pctx.fill();
        }
        // Linee di connessione sottili tra varianti vicine (spazio delle varianti)
        for (let i = 0; i < variants.length; i++) {
          for (let j = i + 1; j < variants.length; j++) {
            const dx = variants[i].x - variants[j].x;
            const dy = variants[i].y - variants[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 180) {
              pctx.strokeStyle = 'rgba(236,72,153,' + (0.05 * (1 - d / 180)).toFixed(3) + ')';
              pctx.lineWidth = 0.6;
              pctx.beginPath();
              pctx.moveTo(variants[i].x, variants[i].y);
              pctx.lineTo(variants[j].x, variants[j].y);
              pctx.stroke();
            }
          }
        }
        pRaf = requestAnimationFrame(pTick);
      }
      if (!reducedMotion) pTick();
    }

    // ---- Cleanup ----
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (rafId) cancelAnimationFrame(rafId);
      if (pRaf) cancelAnimationFrame(pRaf);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      [icoGeo, icoEdges, icoGeo2, icoEdges2, torusGeo, torusGeo2, torusGeo3, orbGeo,
       starsFar.geometry, starsMid.geometry, starsNear.geometry, starsPink.geometry, starsCyan.geometry
      ].forEach(g => { try { g.dispose(); } catch (e) {} });
      [icoMat, icoMat2, torusMat, torusMat2, torusMat3, orbMat,
       starsFar.material, starsMid.material, starsNear.material, starsPink.material, starsCyan.material
      ].forEach(m => { try { m.dispose(); } catch (e) {} });
      renderer.dispose();
    };
  }, []);
  return React.createElement("div", { className: "cosmic-bg" },
    React.createElement("div", { className: "nebula-gradient" }),
    React.createElement("div", { ref: mountRef, style: { position: 'absolute', inset: 0 } }),
    React.createElement("canvas", { ref: particlesRef, className: "particles-canvas" }),
    React.createElement("div", { className: "vignette" })
  );
}

// ============================================================
// APP SHELL — entry point
// ============================================================
function App() {
  const [route, setRoute] = useState(() => {
    try {
      return localStorage.getItem('ts_route') || 'home';
    } catch (e) {
      return 'home';
    }
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem('ts_route', route);
    } catch (e) {}
  }, [route]);

  // IntersectionObserver — anima card e titoli mentre entrano in viewport
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.card, .section-title, .timeline-dot, h1.text-6xl, h1.text-5xl, h2.text-5xl, h2.text-4xl');
    if (reducedMotion) {
      targets.forEach(el => el.classList.add('reveal', 'in'));
      return;
    }
    let i = 0;
    targets.forEach(el => {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i * 60, 420) + 'ms';
      i++;
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [route]);

  const handleSetRoute = (r) => {
    setRoute(r);
    setMobileNavOpen(false);
  };
  const nav = [{
    id: 'home',
    num: '00',
    label: 'Casa',
    sub: 'Punto di partenza',
    emoji: '🏛️'
  }, {
    id: 'storia',
    num: '01',
    label: 'Storia',
    sub: 'Cronologia 2004 → 2025',
    emoji: '🕰️'
  }, {
    id: 'tecniche',
    num: '02',
    label: 'Tecniche',
    sub: 'Pratica quotidiana',
    emoji: '✨'
  }, {
    id: 'glossario',
    num: '03',
    label: 'Glossario',
    sub: '42 concetti viventi',
    emoji: '📖'
  }, {
    id: 'diario',
    num: '04',
    label: 'Diario',
    sub: 'Il tuo transurfing',
    emoji: '✍️'
  }, {
    id: 'roadmap',
    num: '05',
    label: '52 Settimane',
    sub: 'Percorso di un anno',
    emoji: '🗺️'
  }, {
    id: 'chat',
    num: '06',
    label: 'Chat & Domande',
    sub: 'Chiedi al sistema',
    emoji: '💬'
  }, {
    id: 'flashcard',
    num: '07',
    label: 'Flash Card',
    sub: 'Quiz a risposta multipla',
    emoji: '🎴'
  }, {
    id: 'audio',
    num: '08',
    label: 'Audio Vocali',
    sub: 'Lezioni e appunti audio',
    emoji: '🎧'
  }, {
    id: 'risorse',
    num: '09',
    label: 'Risorse PDF',
    sub: 'Materiali scaricabili',
    emoji: '📚'
  }, {
    id: 'oracolo',
    num: '10',
    label: 'Oracolo',
    sub: "Consigli dall'Universo",
    emoji: '🌟'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-screen noise"
  }, /*#__PURE__*/React.createElement(MysticBackground, null), /*#__PURE__*/React.createElement("button", {
    className: "mobile-menu-btn" + (mobileNavOpen ? " open" : ""),
    "aria-label": mobileNavOpen ? "Chiudi menu" : "Apri menu",
    onClick: () => setMobileNavOpen(v => !v)
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, mobileNavOpen ?
    /*#__PURE__*/React.createElement("path", { d: "M18 6L6 18M6 6l12 12" }) :
    [
      /*#__PURE__*/React.createElement("line", { key: "l1", x1: "3", y1: "6", x2: "21", y2: "6" }),
      /*#__PURE__*/React.createElement("line", { key: "l2", x1: "3", y1: "12", x2: "21", y2: "12" }),
      /*#__PURE__*/React.createElement("line", { key: "l3", x1: "3", y1: "18", x2: "21", y2: "18" })
    ]
  )), /*#__PURE__*/React.createElement("div", {
    className: "mobile-nav-overlay" + (mobileNavOpen ? " open" : ""),
    onClick: () => setMobileNavOpen(false)
  }), /*#__PURE__*/React.createElement(Sidebar, {
    nav: nav,
    route: route,
    setRoute: handleSetRoute,
    mobileNavOpen: mobileNavOpen
  }), /*#__PURE__*/React.createElement("main", {
    className: "app-main app-main-layout flex-1"
  }, /*#__PURE__*/React.createElement(TopBar, {
    route: route,
    nav: nav
  }), /*#__PURE__*/React.createElement("div", {
    className: "content-pad fade-in",
    key: route
  }, route === 'home' && /*#__PURE__*/React.createElement(Home, {
    go: handleSetRoute
  }), route === 'storia' && /*#__PURE__*/React.createElement(Storia, null), route === 'tecniche' && /*#__PURE__*/React.createElement(Tecniche, null), route === 'glossario' && /*#__PURE__*/React.createElement(Glossario, null), route === 'diario' && /*#__PURE__*/React.createElement(Diario, null), route === 'roadmap' && /*#__PURE__*/React.createElement(Roadmap, null), route === 'chat' && /*#__PURE__*/React.createElement(Chat, null), route === 'flashcard' && /*#__PURE__*/React.createElement(FlashCard, null), route === 'audio' && /*#__PURE__*/React.createElement(Audio, null), route === 'risorse' && /*#__PURE__*/React.createElement(Risorse, null), route === 'oracolo' && /*#__PURE__*/React.createElement(Oracolo, null)), /*#__PURE__*/React.createElement(Footer, null)));
}
function Sidebar({
  nav,
  route,
  setRoute,
  mobileNavOpen
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar fixed top-0 left-0 w-72 h-screen overflow-y-auto scrollbar" + (mobileNavOpen ? " open" : ""),
    style: {
      background: 'linear-gradient(180deg, rgba(14,8,32,0.88), rgba(10,6,26,0.85))',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      borderRight: '1px solid rgba(180,150,240,0.16)',
      boxShadow: '12px 0 40px -20px rgba(124,58,237,0.35)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-6 pt-8 pb-6",
    style: {
      borderBottom: '1px solid rgba(180,150,240,0.16)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(BrandSigil, null), /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl serif font-semibold arcane-title",
    style: {
      color: 'var(--ink)'
    }
  }, "Ars Realis"), /*#__PURE__*/React.createElement("span", {
    className: "ru text-sm",
    style: { color: 'var(--gold-dim)' }
  }, "\u2726")), /*#__PURE__*/React.createElement("div", {
    className: "text-xs mt-1",
    style: {
      color: 'var(--ink-mute)',
      letterSpacing: '0.08em'
    }
  }, "COMMUNITY \xB7 STUDIO & PRATICA"), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-[11px]",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Dal ", /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--gold)'
    }
  }, "2004"), " al ", /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "2025"), " \u2014 5 libri + Tafti + aggiornamenti recenti.")), /*#__PURE__*/React.createElement("nav", {
    className: "py-3"
  }, nav.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: 'nav-item ' + (route === n.id ? 'active' : ''),
    onClick: () => setRoute(n.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-num"
  }, n.num), /*#__PURE__*/React.createElement("span", {
    className: "nav-emoji",
    style: { fontSize: '16px', marginRight: '8px', filter: 'saturate(0.85)' }
  }, n.emoji), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", null, n.label), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px]",
    style: {
      color: 'var(--ink-mute)'
    }
  }, n.sub))))), /*#__PURE__*/React.createElement("div", {
    className: "px-6 py-4 mt-4",
    style: {
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] uppercase tracking-widest mb-2",
    style: {
      color: 'var(--ink-mute)'
    }
  }, "Il principio Tafti"), /*#__PURE__*/React.createElement("div", {
    className: "serif italic text-sm leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "\xABNon volere qualcosa dalla realt\xE0. ", /*#__PURE__*/React.createElement("br", null), "Imposta la realt\xE0.\xBB"), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] mt-2 mono",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "\u2014 V. Zeland, ", /*#__PURE__*/React.createElement("span", {
    className: "italic"
  }, "Tafti la Sacerdotessa"))));
}
function TopBar({
  route,
  nav
}) {
  const current = nav.find(n => n.id === route);
  return /*#__PURE__*/React.createElement("div", {
    className: "topbar topbar-tight sticky top-0 z-20 py-4 flex items-center justify-between",
    style: {
      background: 'linear-gradient(180deg, rgba(14,8,32,0.78), rgba(14,8,32,0.55))',
      backdropFilter: 'blur(14px) saturate(140%)',
      WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      borderBottom: '1px solid rgba(180,150,240,0.16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "section-num"
  }, current?.num), /*#__PURE__*/React.createElement("span", {
    className: "text-lg serif"
  }, current?.label), /*#__PURE__*/React.createElement("span", {
    className: "text-xs",
    style: {
      color: 'var(--ink-mute)'
    }
  }, "/ ", current?.sub)), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] mono",
    style: {
      color: 'var(--ink-mute)'
    }
  }, new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "mt-20 px-10 py-10",
    style: {
      borderTop: '1px solid var(--line)',
      background: 'var(--bg-1)'
    }
  },
  /*#__PURE__*/React.createElement("div", {
    className: "mb-8 pb-8 text-xs leading-relaxed",
    style: {
      color: 'var(--ink-mute)',
      borderBottom: '1px solid var(--line)',
      maxWidth: '64rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono uppercase tracking-widest mb-3 text-[10px]",
    style: { color: 'var(--gold-dim)' }
  }, "Disclaimer"), /*#__PURE__*/React.createElement("p", {
    className: "mb-2",
    style: { color: 'var(--ink-dim)' }
  }, "Ars Realis \xE8 una community indipendente di studio e pratica ispirata al pensiero di Vadim Zeland (Reality Transurfing). Non \xE8 affiliata con l\u2019autore, con i suoi editori o con rappresentanti ufficiali."), /*#__PURE__*/React.createElement("p", {
    className: "mb-2"
  }, "Tutti i marchi registrati appartengono ai rispettivi proprietari. I contenuti di questo sito sono sintesi originali, commenti, discussioni e strumenti didattici prodotti dalla community per scopi educativi e non commerciali."), /*#__PURE__*/React.createElement("p", null, "Per il pensiero completo di Zeland, consigliamo l\u2019acquisto dei libri originali presso i rivenditori ufficiali.")),
  /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-between gap-6 text-xs",
    style: {
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "serif text-base mb-1",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Ars Realis \xB7 Community"), /*#__PURE__*/React.createElement("div", null, "Community indipendente di studio del Reality Transurfing di V. Zeland \xB7 non ufficiale, non affiliata \xB7 uso educativo")), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", null, "Vadim Zeland \xB7 \u0412\u0430\u0434\u0438\u043C \u0417\u0435\u043B\u0430\u043D\u0434 \xB7 ru: ", /*#__PURE__*/React.createElement("span", {
    className: "link-crimson"
  }, "zelands.ru"), " \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "link-crimson"
  }, "tserf.ru")), /*#__PURE__*/React.createElement("div", {
    className: "mt-1"
  }, "Dati salvati localmente nel tuo browser (localStorage)"))));
}

// ============================================================
// SHARED DATA — principi Tafti, citazioni, libri
// ============================================================
const TAFTI_QUOTES = [{
  q: "Non volete qualcosa dalla realtà. Impostate la realtà.",
  src: "Tafti, Rassegna dei principi"
}, {
  q: "La realtà è uno schermo. Sullo schermo proiettate la vostra attenzione.",
  src: "Cosa non ha detto Tafti"
}, {
  q: "Il sognatore è uno che si è addormentato nel sogno. Il Transurfer si sveglia dentro il film.",
  src: "Tafti, La presenza"
}, {
  q: "Volere e ottenere non sono la stessa cosa. Permettere e ricevere sì.",
  src: "Transurfing V"
}, {
  q: "I pendoli non sono entità astratte: sono strutture energetiche che si nutrono della vostra attenzione.",
  src: "Transurfing I"
}, {
  q: "L'intenzione esterna non è 'volere di più'. È 'volere meno, con chiarezza'.",
  src: "Transurfing III"
}, {
  q: "La treccia dietro le scapole non è metafisica. È il punto dove la vostra volontà diventa ordine.",
  src: "Tafti, La Metaforza"
}, {
  q: "Quando rifiuti, accetti. Quando accetti, rifiuti.",
  src: "Tafti, I principi di base"
}, {
  q: "Il mondo è uno specchio. Ma lo specchio ha un ritardo.",
  src: "Transurfing IV — Lo specchio duale"
}, {
  q: "Non siete vittime del film. Siete lo sceneggiatore che si è dimenticato di esserlo.",
  src: "Tafti la Sacerdotessa"
}, {
  q: "L'importanza è il filo che lega il manichino. Tagliate il filo.",
  src: "Transurfing II"
}, {
  q: "Il Proiettore non mostra: distingue. Distingue ciò che vi serve da ciò che vi distrae.",
  src: "Il Proiettore — Avanti nel Passato"
}, {
  q: "La scintilla del Creatore arde già. Non va accesa — va notata.",
  src: "Tafti, La Scintilla"
}, {
  q: "Siate i vostri spettatori. Poi siate il vostro regista. Poi lasciate che il film si giri.",
  src: "Trasferirsi, 2025"
}];
const BOOKS = [{
  y: 2004,
  ru: "Трансерфинг реальности. Ступень I: Пространство вариантов",
  it: "Transurfing della Realtà I — Spazio delle Varianti",
  era: "classic"
}, {
  y: 2004,
  ru: "Трансерфинг реальности. Ступень II: Шелест утренних звёзд",
  it: "Transurfing II — Fruscio delle stelle del mattino",
  era: "classic"
}, {
  y: 2005,
  ru: "Трансерфинг реальности. Ступень III: Вперёд в прошлое",
  it: "Transurfing III — Avanti nel Passato",
  era: "classic"
}, {
  y: 2005,
  ru: "Трансерфинг реальности. Ступень IV: Управление реальностью",
  it: "Transurfing IV — Controllo della Realtà",
  era: "classic"
}, {
  y: 2006,
  ru: "Трансерфинг реальности. Ступень V: Яблоки падают в небо",
  it: "Transurfing V — Le mele cadono nel cielo",
  era: "classic"
}, {
  y: 2007,
  ru: "Вершитель реальности",
  it: "Il Proiettore / Il Formatore della realtà",
  era: "expansion"
}, {
  y: 2010,
  ru: "Апокрифический Трансерфинг",
  it: "Il Transurfing Apocrifo",
  era: "expansion"
}, {
  y: 2012,
  ru: "Клибе. Трансерфинг — оружие иглой",
  it: "kLIBE — Scardinare il sistema tecnogeno",
  era: "expansion"
}, {
  y: 2013,
  ru: "чистое Питание",
  it: "čistoPitanie — Nutrizione Pulita",
  era: "expansion"
}, {
  y: 2018,
  ru: "Тафти жрица. Гуляние живьём в кинокартине",
  it: "Tafti la Sacerdotessa — Camminando dal vivo in un film",
  era: "tafti"
}, {
  y: 2018,
  ru: "Жрица Итфат",
  it: "La Sacerdotessa Itfat",
  era: "tafti"
}, {
  y: 2019,
  ru: "Чего не сказала Тафти",
  it: "Cosa non ha detto Tafti",
  era: "tafti"
}, {
  y: 2024,
  ru: "Тафти жрица 2. Управление реальностью",
  it: "Tafti la Sacerdotessa 2 — Controllo della realtà",
  era: "tafti"
}, {
  y: 2025,
  ru: "Трансерфинг себя",
  it: "Trasferire Sé Stessi / Trasferirsi",
  era: "tafti"
}];

// ============================================================
// HOME
// ============================================================
function Home({
  go
}) {
  const quote = TAFTI_QUOTES[new Date().getDate() % TAFTI_QUOTES.length];
  const cards = [{
    id: 'tecniche',
    num: '02',
    emoji: '🧘‍♂️',
    t: 'Inizia a praticare',
    d: '30+ tecniche dai libri classici e dall\'era Tafti, organizzate per difficoltà.',
    cta: 'Apri tecniche →'
  }, {
    id: 'glossario',
    num: '03',
    emoji: '📚',
    t: 'Capisci i termini',
    d: '42 concetti chiave, bilingue IT/RU, con collegamenti bidirezionali tra idee.',
    cta: 'Apri glossario →'
  }, {
    id: 'diario',
    num: '04',
    emoji: '📓',
    t: 'Tieni un diario',
    d: 'Registra intenzioni, coincidenze, pendoli, scivoli. Salvato localmente nel tuo browser.',
    cta: 'Apri diario →'
  }, {
    id: 'roadmap',
    num: '05',
    emoji: '🌗',
    t: '52 settimane',
    d: 'Un anno di pratica guidata, una settimana per volta. Senza fretta, senza saltare.',
    cta: 'Apri percorso →'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-16 hero-wrap anim-pulse",
    style: { padding: '14px 0 40px 0', position: 'relative' }
  },
    /* Decorative mandala SVG (rotating) */
    /*#__PURE__*/React.createElement("svg", {
      className: "hero-mandala anim-rotate",
      viewBox: "0 0 200 200",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true"
    },
      /*#__PURE__*/React.createElement("defs", null,
        /*#__PURE__*/React.createElement("radialGradient", { id: "mg", cx: "50%", cy: "50%", r: "50%" },
          /*#__PURE__*/React.createElement("stop", { offset: "0%", stopColor: "#c9a96a", stopOpacity: "0.55" }),
          /*#__PURE__*/React.createElement("stop", { offset: "60%", stopColor: "#a9243a", stopOpacity: "0.3" }),
          /*#__PURE__*/React.createElement("stop", { offset: "100%", stopColor: "#000", stopOpacity: "0" })
        )
      ),
      /*#__PURE__*/React.createElement("circle", { cx: "100", cy: "100", r: "92", fill: "url(#mg)" }),
      /* petal pattern */
      Array.from({length: 12}).map((_, i) => /*#__PURE__*/React.createElement("path", {
        key: i,
        d: "M100 20 Q 108 60 100 100 Q 92 60 100 20 Z",
        fill: "none",
        stroke: "#c9a96a",
        strokeWidth: "0.6",
        strokeOpacity: "0.55",
        transform: `rotate(${i * 30} 100 100)`
      })),
      Array.from({length: 6}).map((_, i) => /*#__PURE__*/React.createElement("circle", {
        key: 'c' + i,
        cx: "100", cy: "100",
        r: 18 + i * 14,
        fill: "none",
        stroke: "#c9a96a",
        strokeWidth: "0.3",
        strokeOpacity: 0.4 - i * 0.05
      })),
      /*#__PURE__*/React.createElement("circle", { cx: "100", cy: "100", r: "3", fill: "#d63a52" })
    ),
    /* Constellation (twinkling dots connected with faint lines) */
    /*#__PURE__*/React.createElement("svg", {
      className: "hero-constellation",
      viewBox: "0 0 280 200",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true"
    },
      /*#__PURE__*/React.createElement("g", { stroke: "#8c7848", strokeWidth: "0.4", strokeOpacity: "0.5" },
        /*#__PURE__*/React.createElement("line", { x1: "20", y1: "150", x2: "80", y2: "110" }),
        /*#__PURE__*/React.createElement("line", { x1: "80", y1: "110", x2: "140", y2: "140" }),
        /*#__PURE__*/React.createElement("line", { x1: "140", y1: "140", x2: "200", y2: "90" }),
        /*#__PURE__*/React.createElement("line", { x1: "200", y1: "90", x2: "255", y2: "125" }),
        /*#__PURE__*/React.createElement("line", { x1: "80", y1: "110", x2: "130", y2: "50" }),
        /*#__PURE__*/React.createElement("line", { x1: "130", y1: "50", x2: "200", y2: "90" })
      ),
      [
        { x: 20, y: 150, r: 2.5, d: 0 },
        { x: 80, y: 110, r: 3, d: 0.3 },
        { x: 140, y: 140, r: 2, d: 0.8 },
        { x: 200, y: 90, r: 3.5, d: 1.2 },
        { x: 255, y: 125, r: 2.5, d: 1.6 },
        { x: 130, y: 50, r: 2, d: 2.1 }
      ].map((s, i) => /*#__PURE__*/React.createElement("circle", {
        key: 's' + i,
        cx: s.x, cy: s.y, r: s.r,
        fill: "#c9a96a",
        className: "anim-twinkle",
        style: { animationDelay: s.d + 's' }
      }))
    ),
    /*#__PURE__*/React.createElement("div", {
    className: "section-num mb-3",
    style: { position: 'relative', zIndex: 1 }
  }, "00 \xB7 CASA ", /*#__PURE__*/React.createElement("span", { className: "anim-float-slow", style: { marginLeft: 6 } }, "✨")), /*#__PURE__*/React.createElement("h1", {
    className: "text-6xl serif leading-none mb-4 anim-blur-zoom-in",
    style: {
      letterSpacing: '-0.015em',
      position: 'relative',
      zIndex: 1
    }
  }, "Svegliarsi ", /*#__PURE__*/React.createElement("span", {
    className: "italic focus-reveal",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "dentro"), " il film."), /*#__PURE__*/React.createElement("p", {
    className: "text-lg max-w-2xl leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Uno strumento di lavoro per chi pratica il ", /*#__PURE__*/React.createElement("em", null, "Transurfing"), " di Vadim Zeland \u2014 non un riassunto, non un corso. Un luogo per tornare ogni giorno, applicare le tecniche, annotare ci\xF2 che osservi nello specchio della realt\xE0, e seguire il filo rosso dai libri del ", /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--gold)'
    }
  }, "2004"), " fino all'era ", /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "Tafti"), " (2018 \u2192 2025).")), /*#__PURE__*/React.createElement("div", {
    className: "card p-8 mb-14 relative glow-border anim-focus-loop"
  },/*#__PURE__*/React.createElement("div", {
    className: "quote-mark absolute -top-2 left-4"
  }, "\u201C"), /*#__PURE__*/React.createElement("div", {
    className: "serif italic text-2xl leading-snug pl-12 pr-4",
    style: {
      color: 'var(--ink)'
    }
  }, quote.q), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pl-12 text-xs mono",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "\u2014 ", quote.src, "  \xB7  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-mute)'
    }
  }, "citazione del giorno, ruota a mezzanotte"))), /*#__PURE__*/React.createElement("div", {
    className: "section-title mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "section-num"
  }, "COMINCIA DA"), /*#__PURE__*/React.createElement("span", {
    className: "section-rule"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-5 mb-16"
  }, cards.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "card card-hover hover-lift hover-blur-zoom p-6 cursor-pointer anim-slide-up",
    onClick: () => go(c.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-between mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "emoji-chip anim-float",
    style: { display: 'inline-flex' }
  }, c.emoji), /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, c.cta)), /*#__PURE__*/React.createElement("div", {
    className: "section-num mb-1"
  }, c.num), /*#__PURE__*/React.createElement("div", {
    className: "text-xl serif mb-2"
  }, c.t), /*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, c.d)))), /*#__PURE__*/React.createElement("div", {
    className: "section-title mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "section-num"
  }, "MAPPA RAPIDA \xB7 I QUATTRO MOVIMENTI"), /*#__PURE__*/React.createElement("span", {
    className: "section-rule"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-4 mb-16 stagger"
  }, [{
    n: 'I',
    t: 'Classico',
    y: '2004-06',
    c: 'var(--gold)',
    emoji: '🌊',
    d: 'Spazio delle Varianti, Pendoli, Intenzione esterna. Il «fuori di me» della realtà.'
  }, {
    n: 'II',
    t: 'Espansione',
    y: '2007-13',
    c: 'var(--ink-dim)',
    emoji: '🔭',
    d: 'Proiettore, Apocrifo, kLIBE, čistoPitanie. Il corpo e il mondo tecnogeno.'
  }, {
    n: 'III',
    t: 'Tafti',
    y: '2018-19',
    c: 'var(--crimson-bright)',
    emoji: '🔮',
    d: 'Sacerdotessa, Metaforza, Treccia. Dal «volere» all\'«impostare».'
  }, {
    n: 'IV',
    t: 'Ritorno',
    y: '2024-25',
    c: '#ee6278',
    emoji: '🕊️',
    d: 'Tafti 2, Trasferirsi. Gestione sistematica degli eventi, auto-transurfing.'
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.n,
    className: "card hover-lift p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-between mb-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif text-3xl",
    style: { color: p.c }
  }, p.n), /*#__PURE__*/React.createElement("span", {
    className: "anim-float", style: { fontSize: 20 }
  }, p.emoji)), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-medium",
    style: {
      color: 'var(--ink)'
    }
  }, p.t), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] mono mb-3",
    style: {
      color: 'var(--ink-mute)'
    }
  }, p.y), /*#__PURE__*/React.createElement("div", {
    className: "text-xs leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, p.d)))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 items-center"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: () => go('tecniche')
  }, "Comincia a praticare"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => go('storia')
  }, "Leggi la storia"), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    onClick: () => go('glossario')
  }, "Esplora il glossario")));
}

// ============================================================
// STORIA — timeline interattiva
// ============================================================
function Storia() {
  const [selected, setSelected] = useState(null);
  const eras = {
    classic: {
      label: 'Cinque Stadi',
      color: 'var(--gold)',
      note: 'Il nucleo dottrinale: la realtà come spazio di varianti e l\'arte di muoversi in esso senza farsi trascinare dai pendoli.'
    },
    expansion: {
      label: 'Espansione',
      color: 'var(--ink-dim)',
      note: 'Zeland allarga il sistema: strumenti pratici, critica del sistema tecnogeno, alimentazione, risveglio del corpo.'
    },
    tafti: {
      label: 'Era Tafti',
      color: 'var(--crimson-bright)',
      note: 'Svolta del 2018: dalla «metafora» dello spazio varianti alla pratica diretta della Metaforza e della Treccia. Il linguaggio cambia: non più «voglio» ma «imposto».'
    }
  };
  const events = [{
    y: 1984,
    t: 'Vadim Zeland lascia la fisica quantistica applicata',
    d: 'Dopo la laurea all\'Istituto Aeronautico, lavora su sistemi informatici. Gli anni ante-libro: letture esoteriche, sperimentazione personale, costruzione in silenzio della struttura del Transurfing.',
    era: 'pre'
  }, {
    y: 2004,
    ru: 'Трансерфинг реальности, Ступень I',
    t: 'Transurfing I — Spazio delle Varianti',
    d: 'Prima pubblicazione alla casa editrice Ves\' di San Pietroburgo. Introduce i concetti fondativi: linee di vita, pendoli, importanza interna/esterna, slide, intenzione esterna.',
    era: 'classic'
  }, {
    y: 2004,
    ru: 'Ступень II — Шелест утренних звёзд',
    t: 'Transurfing II — Fruscio delle stelle del mattino',
    d: 'Approfondisce le coordinate: dal visualizzare al «vivere l\'immagine dell\'obiettivo». Introduzione al frejling e alla rinuncia dell\'importanza.',
    era: 'classic'
  }, {
    y: 2005,
    ru: 'Ступень III — Вперёд в прошлое',
    t: 'Transurfing III — Avanti nel Passato',
    d: 'Teoria dei pendoli sviluppata. La tecnica della «diapositiva», il flusso delle varianti, la coordinazione dell\'intenzione.',
    era: 'classic'
  }, {
    y: 2005,
    ru: 'Ступень IV — Управление реальностью',
    t: 'Transurfing IV — Controllo della Realtà',
    d: 'Lo Specchio Duale. Forse il concetto più denso: la realtà risponde al tuo stato interiore con ritardo, come uno specchio impreciso.',
    era: 'classic'
  }, {
    y: 2006,
    ru: 'Ступень V — Яблоки падают в небо',
    t: 'Transurfing V — Le mele cadono nel cielo',
    d: 'Sintesi. Sistematizzazione di tutte le tecniche in un metodo operativo quotidiano.',
    era: 'classic'
  }, {
    y: 2007,
    ru: 'Вершитель реальности',
    t: 'Il Proiettore della Realtà',
    d: 'Libro-ponte. Zeland riformula il sistema introducendo la figura del «Vershitel\'» — colui che compie, che pronuncia. Primo anticipo del tema della Metaforza.',
    era: 'expansion'
  }, {
    y: 2010,
    ru: 'Апокрифический Трансерфинг',
    t: 'Il Transurfing Apocrifo',
    d: 'Raccolta di materiali, dialoghi, chiarimenti. Il Transurfing si apre a domande del lettore.',
    era: 'expansion'
  }, {
    y: 2012,
    ru: 'Клибе',
    t: 'kLIBE — Scardinare il sistema tecnogeno',
    d: 'Svolta critica. Zeland denuncia il sistema «tecnogeno» (cibo, media, relazioni dipendenti) come macchina che nutre pendoli. kLIBE = «liberazione» (la parola russa klibe è l\'inverso di kletka, «gabbia»).',
    era: 'expansion'
  }, {
    y: 2013,
    ru: 'чистое Питание',
    it: 'čistoPitanie',
    t: 'čistoPitanie — Nutrizione Pulita',
    d: 'Applicazione concreta di kLIBE: ricostruzione del rapporto col cibo crudo/vivo come liberazione energetica. Base per la pratica corporea che verrà.',
    era: 'expansion'
  }, {
    y: 2018,
    ru: 'Тафти жрица',
    t: 'Tafti la Sacerdotessa — Camminando dal vivo in un film',
    d: 'Punto di svolta. Zeland introduce la figura allegorica di Tafti, una sacerdotessa antico-egizia che si rivolge direttamente al lettore. Nasce la Metaforza, la Treccia, i principi invertiti (volere↔dare, accettare↔rifiutare). Il sistema si fa molto più pratico e meno teorico.',
    era: 'tafti'
  }, {
    y: 2018,
    ru: 'Жрица Итфат',
    t: 'La Sacerdotessa Itfat',
    d: 'Compagno di Tafti. Racconto-cornice della sacerdotessa Itfat: il sistema espresso in forma narrativa, quasi iniziatica.',
    era: 'tafti'
  }, {
    y: 2019,
    ru: 'Чего не сказала Тафти',
    t: 'Cosa non ha detto Tafti',
    d: 'Q&A sistematico. Zeland risponde alle domande ricevute dopo Tafti: posizione esatta della Treccia, come lavorare con gli Schermi, Lucciole, Realizzazione 1 e 2, Manichino, relazioni, soldi, missione.',
    era: 'tafti'
  }, {
    y: 2024,
    ru: 'Тафти жрица 2. Управление реальностью',
    t: 'Tafti la Sacerdotessa 2 — Controllo della realtà',
    d: 'Ritorno dopo 5 anni. Le 8 Regole della Metaforza, tecnica sistematica per «gestire gli eventi» — controllo consapevole del flusso — invece di subirli. Molto più strutturato del primo Tafti.',
    era: 'tafti'
  }, {
    y: 2025,
    ru: 'Трансерфинг себя',
    t: 'Trasferirsi / Transurfing di Sé',
    d: 'Ultimo libro pubblicato. L\'attenzione si sposta: dal controllo della realtà esterna alla curatela di sé. Auto-osservazione, ruoli interni, il «Sé-spettatore» e il «Sé-attore».',
    era: 'tafti'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-num mb-2"
  }, "01 \xB7 STORIA"), /*#__PURE__*/React.createElement("h2", {
    className: "text-5xl serif mb-4",
    style: {
      letterSpacing: '-0.01em'
    }
  }, "Ventuno anni di ", /*#__PURE__*/React.createElement("span", {
    className: "italic",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "un modello che cambia"), "."), /*#__PURE__*/React.createElement("p", {
    className: "text-base max-w-3xl mb-10 leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Il Transurfing non \xE8 un libro: \xE8 una ", /*#__PURE__*/React.createElement("strong", null, "linea di sviluppo"), " che Vadim Zeland ha scritto, riscritto, tradito e rifondato per due decenni. Seleziona un evento per leggere i dettagli. Colori diversi indicano le tre ere del sistema."), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 mb-10 text-xs"
  }, Object.entries(eras).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "flex items-center gap-2 px-3 py-1.5",
    style: {
      background: 'var(--bg-2)',
      border: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full",
    style: {
      background: v.color
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: v.color
    },
    className: "font-medium"
  }, v.label)))), /*#__PURE__*/React.createElement("div", {
    className: "relative grid grid-cols-[auto_1fr] gap-x-6 gap-y-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute left-[88px] top-2 bottom-2 vline"
  }), events.map((ev, i) => {
    const era = eras[ev.era] || eras.classic;
    const isSel = selected === i;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start pt-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-16 text-right mono text-sm",
      style: {
        color: ev.era === 'tafti' ? 'var(--crimson-bright)' : 'var(--ink-dim)'
      }
    }, ev.y), /*#__PURE__*/React.createElement("div", {
      className: "w-6 flex justify-center pt-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "timeline-dot " + (ev.era === 'tafti' ? 'tafti' : ''),
      style: {
        background: era.color,
        boxShadow: `0 0 0 4px ${era.color}22`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "pb-8 cursor-pointer",
      onClick: () => setSelected(isSel ? null : i)
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline gap-3 flex-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "serif text-xl leading-snug",
      style: {
        color: isSel ? 'var(--ink)' : 'var(--ink-dim)'
      }
    }, ev.t), ev.ru && /*#__PURE__*/React.createElement("span", {
      className: "ru text-sm", lang: "ru"
    }, "\xB7 ", ev.ru), /*#__PURE__*/React.createElement("span", {
      className: "chip",
      style: {
        color: era.color,
        borderColor: era.color + '40'
      }
    }, era.label)), isSel && /*#__PURE__*/React.createElement("div", {
      className: "mt-3 pl-0 fade-in"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm leading-relaxed",
      style: {
        color: 'var(--ink-dim)'
      }
    }, ev.d), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 text-[11px] mono",
      style: {
        color: 'var(--ink-mute)'
      }
    }, "Nota era \xB7 ", era.note))));
  })), /*#__PURE__*/React.createElement("div", {
    className: "card p-6 mt-10 glow-border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest mb-2",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Perch\xE9 la svolta del 2018?"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Nei primi cinque libri Zeland ha costruito la ", /*#__PURE__*/React.createElement("em", null, "geometria"), " del Transurfing: lo spazio varianti, i pendoli, lo specchio duale. Ma molti lettori si fermavano alla teoria. Con ", /*#__PURE__*/React.createElement("strong", null, "Tafti"), " (2018) cambia strategia: introduce una voce narrativa (una sacerdotessa che ti parla direttamente) e inverte i verbi: da \xABvoglio\xBB a \xABimposto\xBB, da \xABvisualizzo\xBB a \xABagisco nell\\'immagine\xBB. Nasce la ", /*#__PURE__*/React.createElement("strong", null, "Metaforza"), " \u2014 la forza che nella tradizione classica si chiamava \xABintenzione esterna\xBB, ora concreta, localizzata (la ", /*#__PURE__*/React.createElement("em", null, "Treccia"), " dietro le scapole), attivabile in pochi secondi. Con ", /*#__PURE__*/React.createElement("strong", null, "Tafti 2"), " (2024) e ", /*#__PURE__*/React.createElement("strong", null, "Trasferirsi"), " (2025) il sistema diventa pi\xF9 chirurgico: 8 regole, protocolli quotidiani, auto-osservazione.")));
}
// ============================================================
// TECNICHE — cuore dell'app
// ============================================================
const TECNICHE = [
// BASE — classiche, accessibili
{
  id: 't01',
  livello: 'base',
  era: 'classic',
  cat: 'Attenzione',
  titolo: 'Svegliarsi nel film',
  ru: 'Просыпание',
  q: 'Ricordati a te stesso molte volte al giorno.',
  come: 'Più volte al giorno, fai questo gesto mentale: fermati, nota che stai vivendo una scena del film. Chiedi: «Sono io qui? O sto solo recitando un copione automatico?» Bastano 3 secondi.',
  quando: 'Ogni volta che noti un cambio di contesto: entri in una stanza, finisci una telefonata, apri lo schermo.',
  perche: 'È la tecnica radice. Senza presenza, nessun\'altra tecnica funziona. Il sistema Tafti ruota intero attorno a questo: chi dorme nel film non può riscriverlo.',
  avvertenza: 'Non è meditazione. Non chiudere gli occhi. Resta nella scena.'
}, {
  id: 't02',
  livello: 'base',
  era: 'classic',
  cat: 'Pendoli',
  titolo: 'Identificare un pendolo',
  q: 'Chi si sta nutrendo della tua attenzione in questo momento?',
  come: 'Quando ti ritrovi emotivamente carico (rabbia, paura, entusiasmo collettivo, indignazione, ammirazione smodata), fermati e chiedi: «Dove sta andando la mia energia?». Se trovi una struttura (squadra, partito, gruppo, ideologia, un dramma ripetuto) che cresce mentre la tua energia si svuota, hai identificato un pendolo.',
  quando: 'Notizie, social, conversazioni infuocate, famiglia, lavoro.',
  perche: 'Un pendolo non identificato ti manovra. Uno identificato può essere spento o usato.'
}, {
  id: 't03',
  livello: 'base',
  era: 'classic',
  cat: 'Pendoli',
  titolo: 'Spegnere un pendolo',
  q: 'Ritira l\'attenzione — senza dichiarare guerra.',
  come: 'Non combattere il pendolo (questo lo nutre). Diventa invisibile: agisci come se non esistesse, togli il pensiero, non partecipare al pettegolezzo, non difenderti se non strettamente necessario. Zeland lo chiama «cadere dal pendolo» — lasciarsi attraversare senza resistenza invece di opporvisi.',
  quando: 'Dopo aver identificato il pendolo.',
  perche: 'I pendoli vivono di oscillazione emotiva. Senza oscillazione, si dissipano.',
  avvertenza: 'Non è fuga. È non-partecipazione attiva.'
}, {
  id: 't04',
  livello: 'base',
  era: 'classic',
  cat: 'Importanza',
  titolo: 'Ridurre l\'importanza',
  q: 'Cosa ti importa troppo?',
  come: 'Individua dove stai investendo «potenziali eccedenti»: desiderio troppo forte di un risultato, paura troppo forte di perderlo, auto-svalutazione, auto-esaltazione. Riconosciuto, diminuisci volutamente la carica: «Va bene in entrambi i casi. Posso vivere senza. Posso vivere con.»',
  quando: 'Prima di un colloquio, un appuntamento, un esame, una conversazione difficile.',
  perche: 'Le «forze di equilibrio» intervengono per bilanciare ogni eccesso di importanza, producendo spesso l\'opposto di ciò che vuoi.'
}, {
  id: 't05',
  livello: 'base',
  era: 'classic',
  cat: 'Visione',
  titolo: 'Creare uno Slide',
  ru: 'слайд',
  q: 'Vivi l\'immagine, non ricordarla.',
  come: 'Costruisci una breve scena mentale (10-20 secondi) dell\'obiettivo già raggiunto. NON «guardi» la scena — ci sei dentro. Annusa, tocca, senti. Ripeti la scena più volte al giorno, tenendola leggera. Senza ansia, senza pretesa.',
  quando: 'Mattina appena sveglio, sera prima di dormire, e nei momenti vuoti della giornata.',
  perche: 'Lo slide è un trasmettitore di frequenza: ti accorda alla linea di vita dove l\'obiettivo è reale. La scintilla non è volerlo: è essere già dentro.',
  avvertenza: 'Se la scena ti mette ansia, è carica. Riduci l\'importanza (t04) prima.'
}, {
  id: 't06',
  livello: 'base',
  era: 'classic',
  cat: 'Intenzione',
  titolo: 'Frejling — il gesto di dare',
  ru: 'фрейлинг',
  q: 'Chiedi a te stesso cosa puoi dare, non cosa vuoi.',
  come: 'Ribalta il desiderio di ottenere. Se vuoi amore, dona attenzione pulita. Se vuoi denaro, offri valore senza calcolo. Se vuoi rispetto, rispetta per primo e senza attendere ritorno. Il ritorno accade, ma non è il motore.',
  quando: 'In ogni relazione umana.',
  perche: 'Il desiderio di ottenere crea una corrente di aspirazione che respinge. Il frejling crea un vuoto attrattivo.'
}, {
  id: 't07',
  livello: 'base',
  era: 'classic',
  cat: 'Coordinazione',
  titolo: 'Coordinare l\'intenzione',
  q: 'Accetta ciò che accade come materiale grezzo.',
  come: 'Quando succede qualcosa di inatteso — positivo o negativo — evita la reazione istintiva di rigetto. Dì internamente: «Si incastra nel piano. Lavoro con questo.» Cerca il ruolo che l\'evento può avere nella tua direzione.',
  quando: 'Imprevisti, ritardi, ostacoli.',
  perche: 'L\'universo spesso porta la meta per una strada che non è quella che immaginavi. La rigidità spezza il corridoio.'
}, {
  id: 't08',
  livello: 'base',
  era: 'classic',
  cat: 'Specchio',
  titolo: 'Specchio Duale — esperimento breve',
  ru: 'дуальное зеркало',
  q: 'Il mondo riflette con ritardo.',
  come: 'Per 3 giorni, mantieni lo stesso stato interno (scelta tu: allegria, gratitudine, sicurezza tranquilla). Non forzato, solo restaurato ogni volta che te ne accorgi. Osserva come le persone attorno e gli eventi cominciano, con ritardo, a riflettere quello stato.',
  quando: 'Sperimento di 3-5 giorni.',
  perche: 'Lo specchio non reagisce al tuo volere — reagisce al tuo stato stabile. E ha un ritardo di ore o giorni.'
},
// TECNICHE — intermedie, più operative
{
  id: 't09',
  livello: 'tecnica',
  era: 'classic',
  cat: 'Intenzione',
  titolo: 'Il corridoio delle varianti',
  q: 'Segui il flusso delle varianti, non la mappa.',
  come: 'Formula la direzione generale (es. «più creatività nella mia vita»), non il dettaglio («entro marzo firmo il contratto X con l\'azienda Y»). Poi segui i segni: invitando ciò che si presenta con facilità, rifiutando senza drammi ciò che si presenta con attrito.',
  quando: 'Decisioni di medio termine (settimane, mesi).',
  perche: 'Il «corridoio» è la linea di vita di minor resistenza verso la tua meta. Non si forza — si ascolta.'
}, {
  id: 't10',
  livello: 'tecnica',
  era: 'classic',
  cat: 'Obiettivi',
  titolo: 'L\'albero degli obiettivi',
  q: 'L\'obiettivo è tuo o è un pendolo?',
  come: 'Per ogni obiettivo importante, chiedi: «Mi illumina davvero, o è un pendolo che vuole essere seguito?». Poi: «Questo è la cima o un gradino?». Lavora solo sulla cima. I gradini si sistemano da soli.',
  quando: 'Annualmente e nei punti di svolta.',
  perche: 'Molti falliscono non perché non si impegnano ma perché combattono per obiettivi di altri (pendoli familiari, sociali, ideologici).'
}, {
  id: 't11',
  livello: 'tecnica',
  era: 'classic',
  cat: 'Attenzione',
  titolo: 'Tenere la forma',
  ru: 'удержание формы',
  q: 'Chi stai interpretando in questa scena?',
  come: 'Prima di entrare in una situazione importante, definisci mentalmente il «ruolo» che vuoi interpretare (sicuro, caldo, fermo, giocoso). Mantieni la forma come un attore trattiene un personaggio — senza recitare, semplicemente essendo.',
  quando: 'Riunioni, appuntamenti, confronti, momenti di crisi.',
  perche: 'Se non scegli il tuo ruolo, i pendoli lo sceglieranno per te.'
}, {
  id: 't12',
  livello: 'tecnica',
  era: 'expansion',
  cat: 'Corpo',
  titolo: 'Pulizia del corpo tecnogeno',
  q: 'Cosa mangia te mentre credi di nutrirti?',
  come: 'Per 30 giorni: elimina almeno due elementi del sistema tecnogeno (zucchero raffinato, cibo confezionato, uno dei social, TV serale, alcol). Sostituisci con: alimenti vivi, movimento all\'aperto, silenzio.',
  quando: 'Un ciclo all\'anno, minimo.',
  perche: 'Il corpo tecnogeno nutre pendoli. Il corpo vivente ha più energia libera per lo slide.',
  avvertenza: 'Non è ideologia alimentare. È liberazione di energia.'
}, {
  id: 't13',
  livello: 'tecnica',
  era: 'classic',
  cat: 'Relazioni',
  titolo: 'Permesso — a sé, agli altri',
  q: 'A chi non hai ancora dato il permesso di essere ciò che è?',
  come: 'Identifica una persona vicina che inconsciamente «vuoi cambiare». Dichiara internamente: «Ti permetto di essere esattamente come sei. Non ti devo correggere.» Poi fallo anche con te: «Permetto a me stesso di essere imperfetto, lento, confuso, in cambiamento.»',
  quando: 'Tensioni relazionali e auto-giudizio.',
  perche: 'Il non-permesso è un filo dell\'importanza. Tagliato, la relazione (con altri e con sé) si libera.'
}, {
  id: 't14',
  livello: 'tecnica',
  era: 'expansion',
  cat: 'Attenzione',
  titolo: 'Il Proiettore — distinguere',
  ru: 'вершитель',
  q: 'Cosa appartiene al tuo film, cosa al film degli altri?',
  come: 'Al termine della giornata, ripassa: cosa ho visto oggi che era MIO (connesso alla mia direzione) e cosa era rumore di pendoli altrui? Distinguere, non giudicare. Scrivere.',
  quando: 'Ogni sera, 5 minuti.',
  perche: 'Il Proiettore (Vershitel\') è la funzione che distingue. Senza distinzione, la tua attenzione si disperde in ogni pendolo che passa.'
}, {
  id: 't15',
  livello: 'tecnica',
  era: 'tafti',
  cat: 'Metaforza',
  titolo: 'Protocollo base della Treccia',
  ru: 'косица намерения',
  q: 'Dove senti il punto tra le scapole?',
  come: '1. Ricorda te stesso (t01). 2. Sposta l\'attenzione dietro di te, un palmo sopra l\'area tra le scapole. 3. Da lì, non «chiedi» — imposti: «Accade X». Una frase breve, concreta, al presente. 4. Rimani in quel punto 10-30 secondi, poi dimentica.',
  quando: 'Al risveglio, prima di un evento, prima di dormire.',
  perche: 'La Treccia è il punto dove l\'intenzione interna e l\'intenzione esterna si uniscono. Non è metafisico — è un punto di attenzione strutturato.',
  avvertenza: 'Non è visualizzazione potente. È leggero, quasi casuale. Se spingi, stai di nuovo «volendo».'
}, {
  id: 't16',
  livello: 'tecnica',
  era: 'tafti',
  cat: 'Metaforza',
  titolo: 'Volere → Dare',
  q: 'Trasforma ogni «voglio» in «do».',
  come: 'Quando ti sorprendi a dire «voglio X», riformula: «Do X al mondo / a me / a questa situazione». Anche se non ha senso logico, tieni la forma. «Voglio amore» → «Do amore». «Voglio riconoscimento» → «Do riconoscimento agli altri prima». «Voglio soldi» → «Do valore».',
  quando: 'Ogni volta che identifichi un «voglio».',
  perche: 'Prima delle quattro inversioni Tafti. Il «voglio» crea correnti di aspirazione che respingono; il «do» apre canali.'
}, {
  id: 't17',
  livello: 'tecnica',
  era: 'tafti',
  cat: 'Metaforza',
  titolo: 'Rifiutare → Accettare',
  q: 'Ciò che non accetti ti definisce.',
  come: 'Prendi una cosa della tua vita che rifiuti con forza (una persona, una situazione, una parte di te). Per una settimana, pratica l\'accettazione: non approvazione, solo «è così». Osserva cosa cambia.',
  quando: 'Quando la resistenza domina la giornata.',
  perche: 'Seconda inversione Tafti. Il rifiuto crea legame. L\'accettazione libera scelta.'
}, {
  id: 't18',
  livello: 'tecnica',
  era: 'tafti',
  cat: 'Attenzione',
  titolo: 'Gli Schermi — dentro e fuori',
  q: 'Stai guardando il film, o lo stai proiettando?',
  come: 'Nota che hai due schermi: uno «esterno» (ciò che vedi) e uno «interno» (ciò che immagini, ricordi, temi). Per 10 minuti, pratica lo spostamento cosciente: 30 secondi sullo schermo esterno (guarda davvero), 30 secondi sullo schermo interno (che proietto?). Alterna.',
  quando: 'Pausa lavoro, in strada, in attesa.',
  perche: 'Chi non distingue gli schermi è uno spettatore passivo. Chi li distingue comincia a montare il film.'
}, {
  id: 't19',
  livello: 'tecnica',
  era: 'tafti',
  cat: 'Metaforza',
  titolo: 'Impostare l\'immagine',
  ru: 'установка образа',
  q: 'Non chiedere l\'immagine — pronunciala.',
  come: 'Formula l\'obiettivo come scena, brevemente, al presente, dalla Treccia: «Si apre la porta. Entro. Loro dicono sì.» Tre secondi. Poi lascia andare. Nessun rituale prolungato, nessuna emozione forzata.',
  quando: 'Prima di un\'azione decisiva.',
  perche: 'La forza è nella brevità e nella posizione (dalla Treccia, non dalla testa).'
}, {
  id: 't20',
  livello: 'tecnica',
  era: 'tafti',
  cat: 'Corpo',
  titolo: 'La Scintilla del Creatore',
  ru: 'искра Творца',
  q: 'Non devi accendere niente.',
  come: 'Siediti tranquillo, 2 minuti. Non cercare la scintilla — NOTALA. È già lì. Non è metaforica, è una qualità di presenza viva al centro del petto. Respira piano e lasciale spazio.',
  quando: 'Quando ti senti vuoto, automatico, «non-te».',
  perche: 'La Scintilla non è da creare. È la funzione che distingue te dal personaggio. Ricordatene è sufficiente.'
},
// AVANZATE — dall'era Tafti, più sottili
{
  id: 't21',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Metaforza',
  titolo: 'Il metodo dei tre conseguimenti',
  q: 'Dicilo tre volte dalla Treccia.',
  come: 'Dall\'attenzione dietro le scapole, pronuncia internamente la stessa impostazione in tre formulazioni diverse, con intervallo breve tra una e l\'altra. Esempio: «Si apre il passaggio. / Il passaggio si apre. / Attraverso il passaggio.» Non ripetizione ossessiva — tre modi dello stesso gesto.',
  quando: 'Per impostazioni importanti (svolte, incontri chiave).',
  perche: 'La triplicazione chiude il cerchio della pronuncia. Una volta non basta; due sospende; tre completa.'
}, {
  id: 't22',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Metaforza',
  titolo: 'Tecnica dei tre movimenti',
  q: 'Piccolo, medio, grande.',
  come: 'Per un obiettivo complesso, pronuncia tre impostazioni a tre scale: il passo immediato (oggi), il passo intermedio (settimana/mese), la direzione grande (anno/vita). Dalla Treccia, una alla volta, poche ore di distanza.',
  quando: 'All\'inizio di un progetto serio.',
  perche: 'Lavorare solo sul grande lascia il piccolo scoperto. Lavorare solo sul piccolo non orienta. I tre livelli si tengono.'
}, {
  id: 't23',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Seguire',
  titolo: 'Seguire — e quando smettere',
  ru: 'следование',
  q: 'La Forza non spinge mai — invita.',
  come: 'Dopo un\'impostazione, osserva che cosa si presenta. Se si presenta con facilità, SEGUI (prenoti subito, scrivi, dici sì). Se si presenta con attrito continuato, SMETTI (non è la strada, anche se è plausibile).',
  quando: 'Ore e giorni successivi a un\'impostazione seria.',
  perche: 'La Forza non fa miracoli — offre corridoi. Il miracolo sta nell\'accettare ciò che offre.',
  avvertenza: 'Attenzione a non scambiare «attrito iniziale» con «attrito continuato».'
}, {
  id: 't24',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Relazioni',
  titolo: 'Il Manichino',
  ru: 'манекен',
  q: 'Chi tira le tue fila?',
  come: 'Identifica i «fili» (obblighi automatici, attese altrui che segui senza decidere, reazioni codificate). Uno per volta, recidi: dichiarativamente, consapevolmente. Non combattere il filo — riconoscilo e togli il consenso.',
  quando: 'Quando ti senti vivere la vita di qualcun altro.',
  perche: 'Il Manichino è l\'insieme delle funzioni automatiche che rispondono al tirare dei pendoli. Un transurfer ne è consapevole.'
}, {
  id: 't25',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Attenzione',
  titolo: 'Le Lucciole',
  ru: 'светлячки',
  q: 'Piccoli bagliori di consapevolezza.',
  come: 'Durante la giornata, nota i momenti di «accensione» improvvisa: una frase colta per caso, un volto, un numero che si ripete, un déjà-vu. Non interpretarli — annotali soltanto. Con il tempo, emerge un pattern: sono indicatori di linea di vita.',
  quando: 'Ogni giorno, passivamente.',
  perche: 'Le Lucciole sono segnali dello spazio varianti. Non profetici — orientativi.'
}, {
  id: 't26',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Attenzione',
  titolo: 'Realizzazione 1 — il momento dell\'azione',
  q: 'Quando il tempo di pensare è finito.',
  come: 'Identifica il momento esatto in cui devi AGIRE (firmare, dire, chiamare, andare). In quel momento, NON pensare. Esegui. La pronuncia dalla Treccia va prima; l\'azione va senza interrogazione.',
  quando: 'Momenti decisivi.',
  perche: 'Realizzazione 1 è la fase esecutiva: qui l\'eccesso di riflessione è tradimento dell\'impostazione.'
}, {
  id: 't27',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Attenzione',
  titolo: 'Realizzazione 2 — dopo',
  q: 'Non tirare a te il risultato.',
  come: 'Dopo aver agito, chiudi. Non rianimare mentalmente la scena («avrei dovuto dire…», «e se non succede…»). Dichiara: «È fatto. Lo spazio si occupa del resto.»',
  quando: 'Dopo ogni azione importante.',
  perche: 'Il pensiero post-azione richiama il risultato nell\'attenzione, spesso in forma ansiosa, e rompe il corridoio già aperto.'
}, {
  id: 't28',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Vita',
  titolo: 'La Missione',
  ru: 'предназначение',
  q: 'Cosa fai quando smetti di chiederti cosa fare?',
  come: 'Per 30 giorni, tieni un registro di quando il tempo «scompare» (flow) e quando ti senti al posto giusto. Non cercare grandi rivelazioni — accumula osservazioni. Il pattern emerge.',
  quando: 'Un ciclo di osservazione, poi rilettura.',
  perche: 'La missione non è una vocazione mitologica. È la direzione dove la tua energia scorre senza resistenza.'
}, {
  id: 't29',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Metaforza',
  titolo: 'Le 8 Regole della Metaforza',
  q: 'Dal libro Tafti 2 (2024).',
  come: '1) Presenza — essere qui. 2) Impostare, non volere. 3) Dalla Treccia, non dalla testa. 4) Breve, non lungo. 5) Leggero, non carico. 6) Triplice. 7) Seguire. 8) Dimenticare dopo. Pratica una regola per settimana per 8 settimane.',
  quando: 'Ciclo di 8 settimane, poi ripeti.',
  perche: 'Zeland ha dato una struttura operativa in Tafti 2 per evitare le ambiguità del primo Tafti.',
  avvertenza: 'Lista sintetica e interpretativa: leggi sempre il libro originale per le sfumature.'
}, {
  id: 't30',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Vita',
  titolo: 'Trasferirsi — sé spettatore / sé attore',
  ru: 'трансерфинг себя',
  q: 'Chi osserva adesso?',
  come: 'Durante la giornata, distingui tre funzioni: 1) il Sé-attore (che agisce nella scena), 2) il Sé-spettatore (che guarda dal pubblico), 3) il Sé-regista (che sceglie la scena successiva). Pratica passare tra le tre, consapevolmente.',
  quando: 'Una volta al giorno, 5 minuti.',
  perche: 'È la tecnica chiave di «Transurfing di Sé» (2025). Il film non lo guardi più solo — lo co-dirigi.'
}, {
  id: 't31',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Corpo',
  titolo: 'Sacerdotessa Itfat — stato di presenza regale',
  ru: 'Жрица Итфат',
  q: 'Entrare nel ruolo.',
  come: 'Per pochi minuti, assumi fisicamente la postura di qualcuno che non ha niente da dimostrare: spalle aperte, sguardo calmo, respiro lento, passo non affrettato. Non recitare — «diventa» la persona che già sa.',
  quando: 'Prima di situazioni dove è forte la tentazione di cercare approvazione.',
  perche: 'Itfat è una figura allegorica. La pratica è concretissima: il corpo trasmette segnale più rapido della mente.'
}, {
  id: 't32',
  livello: 'avanzato',
  era: 'tafti',
  cat: 'Metaforza',
  titolo: 'Addormentarsi → Svegliarsi',
  q: 'La quarta inversione Tafti.',
  come: 'Ogni volta che ti accorgi di essere «caduto» nel film (reazione automatica, pilota automatico, inerzia), non giudicarti — usa il riconoscimento stesso come pulsante di risveglio. «Ah, mi ero addormentato. Eccomi.»',
  quando: 'In continuazione.',
  perche: 'Quarta e conclusiva delle inversioni Tafti. Le prime tre non reggono senza questa.'
}];
function Tecniche() {
  const [livello, setLivello] = useState('tutti');
  const [cat, setCat] = useState('tutte');
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState('');
  const livelli = [{
    id: 'tutti',
    label: 'Tutti',
    tag: null
  }, {
    id: 'base',
    label: 'Base — inizia qui',
    tag: 'base'
  }, {
    id: 'tecnica',
    label: 'Tecniche — più operative',
    tag: 'tech'
  }, {
    id: 'avanzato',
    label: 'Avanzate — era Tafti',
    tag: 'adv'
  }];
  const categorie = ['tutte', ...new Set(TECNICHE.map(t => t.cat))];
  const filtered = TECNICHE.filter(t => {
    if (livello !== 'tutti' && t.livello !== livello) return false;
    if (cat !== 'tutte' && t.cat !== cat) return false;
    if (q && !(t.titolo + ' ' + t.q + ' ' + (t.come || '') + ' ' + (t.ru || '')).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const countByLevel = l => TECNICHE.filter(t => t.livello === l).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-num mb-2"
  }, "02 \xB7 TECNICHE"), /*#__PURE__*/React.createElement("h2", {
    className: "text-5xl serif mb-4",
    style: {
      letterSpacing: '-0.01em'
    }
  }, TECNICHE.length, " tecniche per ", /*#__PURE__*/React.createElement("span", {
    className: "italic",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "ogni giorno"), "."), /*#__PURE__*/React.createElement("p", {
    className: "text-base max-w-3xl mb-10 leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Estratte dai 5 libri classici e dai libri Tafti (2018-2025). Ogni tecnica \xE8 formulata come pratica concreta, non come spiegazione teorica. Livello ", /*#__PURE__*/React.createElement("strong", null, "base"), ": ", countByLevel('base'), " tecniche di presenza e di lettura del mondo. Livello ", /*#__PURE__*/React.createElement("strong", null, "tecnica"), ": ", countByLevel('tecnica'), " tecniche operative. Livello ", /*#__PURE__*/React.createElement("strong", null, "avanzato"), ": ", countByLevel('avanzato'), " tecniche dell\\'era Tafti."), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-4 flex-wrap"
  }, livelli.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.id,
    className: "btn " + (livello === l.id ? 'primary' : 'ghost'),
    onClick: () => setLivello(l.id)
  }, l.label, l.id !== 'tutti' && /*#__PURE__*/React.createElement("span", {
    className: "ml-2 mono text-[10px]",
    style: {
      opacity: 0.6
    }
  }, countByLevel(l.id))))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 mb-8 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Cerca una tecnica, una parola, un termine russo\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("select", {
    value: cat,
    onChange: e => setCat(e.target.value),
    className: "max-w-[240px]"
  }, categorie.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c === 'tutte' ? 'Tutte le categorie' : c)))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, filtered.map(t => {
    const isOpen = open === t.id;
    const tag = t.livello === 'base' ? 'base' : t.livello === 'tecnica' ? 'tech' : 'adv';
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      className: "card " + (isOpen ? 'glow-border' : 'card-hover')
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-5 cursor-pointer",
      onClick: () => setOpen(isOpen ? null : t.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline justify-between gap-4 flex-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline gap-3 flex-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono text-xs",
      style: {
        color: 'var(--ink-mute)'
      }
    }, t.id.toUpperCase()), /*#__PURE__*/React.createElement("span", {
      className: "serif text-xl"
    }, t.titolo), t.ru && /*#__PURE__*/React.createElement("span", {
      className: "ru text-base"
    }, "\xB7 ", t.ru)), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 items-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag " + tag
    }, t.livello), /*#__PURE__*/React.createElement("span", {
      className: "chip"
    }, t.cat), t.era === 'tafti' && /*#__PURE__*/React.createElement("span", {
      className: "tag tafti"
    }, "Tafti"), /*#__PURE__*/React.createElement("span", {
      className: "chevron text-sm",
      style: {
        color: 'var(--ink-mute)'
      }
    }, "\u203A"))), /*#__PURE__*/React.createElement("div", {
      className: "serif italic text-base mt-2",
      style: {
        color: 'var(--ink-dim)'
      }
    }, "\xAB", t.q, "\xBB")), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "px-5 pb-6 fade-in",
      style: {
        borderTop: '1px solid var(--line)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-[120px_1fr] gap-x-4 gap-y-4 pt-5 text-sm leading-relaxed"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mono uppercase text-[10px] tracking-widest pt-1",
      style: {
        color: 'var(--gold-dim)'
      }
    }, "Come"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--ink)'
      }
    }, t.come), /*#__PURE__*/React.createElement("div", {
      className: "mono uppercase text-[10px] tracking-widest pt-1",
      style: {
        color: 'var(--gold-dim)'
      }
    }, "Quando"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--ink-dim)'
      }
    }, t.quando), /*#__PURE__*/React.createElement("div", {
      className: "mono uppercase text-[10px] tracking-widest pt-1",
      style: {
        color: 'var(--gold-dim)'
      }
    }, "Perch\xE9"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--ink-dim)'
      }
    }, t.perche), t.avvertenza && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "mono uppercase text-[10px] tracking-widest pt-1",
      style: {
        color: 'var(--crimson-bright)'
      }
    }, "Attenzione"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--ink-dim)',
        borderLeft: '2px solid var(--crimson)',
        paddingLeft: '12px'
      }
    }, t.avvertenza)))));
  })), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-center py-20",
    style: {
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif italic text-xl"
  }, "Nessuna tecnica trovata per questo filtro."), /*#__PURE__*/React.createElement("div", {
    className: "text-xs mt-2"
  }, "Prova \xABTutti\xBB o svuota la ricerca.")));
}
// ============================================================
// GLOSSARIO — 54 concetti con link bidirezionali
// ============================================================
const GLOSSARIO = [
// FONDAMENTI
{
  id: 'g01',
  sez: 'Fondamenti',
  it: 'Spazio delle Varianti',
  ru: 'Пространство вариантов',
  def: 'Campo informativo fuori dal tempo che contiene tutti gli stati possibili della realtà — passati, presenti, futuri. Non si crea: si seleziona. L\'attenzione accordata a certe frequenze determina il settore che si materializza come vissuto.',
  link: ['Linea di Vita', 'Settore', 'Varianti', 'Flusso delle varianti']
}, {
  id: 'g02',
  sez: 'Fondamenti',
  it: 'Linea di Vita',
  ru: 'Линия жизни',
  def: 'Traiettoria continua di settori dello spazio delle varianti con caratteristiche energetiche omogenee. Si «passa da una linea all\'altra» modulando la frequenza interna.',
  link: ['Spazio delle Varianti', 'Settore', 'Trasferimento']
}, {
  id: 'g03',
  sez: 'Fondamenti',
  it: 'Settore',
  ru: 'Сектор',
  def: 'Unità minima dello spazio delle varianti — un fotogramma-stato con scenari + decorazioni propri. Ogni settore ha una sua «tonalità energetica»: spostarsi nella realtà significa cambiare settore, non alterarlo.',
  link: ['Spazio delle Varianti', 'Linea di Vita', 'Trasferimento']
}, {
  id: 'g04',
  sez: 'Fondamenti',
  it: 'Pendolo',
  ru: 'Маятник',
  def: 'Entità energetica informazionale generata quando più menti convergono sulla stessa frequenza emotiva. Vive della tua attenzione: ti aggancia con un «amo» (paura, identificazione, indignazione) e oscilla più ampio quanto più reagisci. Cade quando smetti di rispondere — nemmeno in opposizione.',
  link: ['Potenziali Eccedenti', 'Importanza', 'Forze di Equilibrio', 'Cadere dal Pendolo', 'Ipnosi Sociale']
}, {
  id: 'g05',
  sez: 'Fondamenti',
  it: 'Potenziali Eccedenti',
  ru: 'Избыточные потенциалы',
  def: 'Cariche emotive sproporzionate attribuite a cose, persone, idee. Attirano forze di equilibrio che tendono a cancellarle — spesso facendoci ottenere il contrario.',
  link: ['Importanza', 'Forze di Equilibrio', 'Pendolo']
}, {
  id: 'g06',
  sez: 'Fondamenti',
  it: 'Importanza',
  ru: 'Важность',
  def: 'Prima causa dei potenziali eccedenti. Può essere interna (quanto ti giudichi importante o meno) o esterna (quanto giudichi importanti oggetti/eventi).',
  link: ['Potenziali Eccedenti', 'Forze di Equilibrio', 'Ridurre l\'Importanza']
}, {
  id: 'g07',
  sez: 'Fondamenti',
  it: 'Forze di Equilibrio',
  ru: 'Равновесные силы',
  def: 'Meccanismo impersonale che dissipa ogni eccesso. Se vuoi troppo, riceverai meno; se temi troppo, otterrai ciò che temi. Non è punizione — è equilibrio.',
  link: ['Potenziali Eccedenti', 'Importanza']
}, {
  id: 'g08',
  sez: 'Fondamenti',
  it: 'Intenzione Interna',
  ru: 'Внутреннее намерение',
  def: 'Sforzo di agire direttamente sul mondo per ottenere. È utile per i gesti quotidiani, inutile per cambiare linea di vita.',
  link: ['Intenzione Esterna', 'Metaforza']
}, {
  id: 'g09',
  sez: 'Fondamenti',
  it: 'Intenzione Esterna',
  ru: 'Внешнее намерение',
  def: 'Principio cardine di Zeland: non lo sforzo di cambiare il mondo, ma la decisione unificata di Anima e Ragione che «permette» alla variante di realizzarsi. Non è volere di più — è accogliere come già accaduto. In Tafti si concretizza operativamente come Metaforza.',
  link: ['Intenzione Interna', 'Metaforza', 'Scintilla del Creatore', 'Anima e Ragione']
}, {
  id: 'g10',
  sez: 'Fondamenti',
  it: 'Frazione di Vento',
  ru: 'Ветер',
  def: 'Metafora di Zeland per il flusso delle varianti: ti muove se ti lasci trasportare senza resistere. Chi si oppone lotta contro il vento.',
  link: ['Flusso delle varianti', 'Coordinamento']
}, {
  id: 'g11',
  sez: 'Fondamenti',
  it: 'Flusso delle Varianti',
  ru: 'Поток вариантов',
  def: 'Corrente attraverso cui le varianti si realizzano naturalmente. Segui il flusso = scegli ciò che si presenta con facilità.',
  link: ['Corridoio delle Varianti', 'Frazione di Vento']
}, {
  id: 'g12',
  sez: 'Fondamenti',
  it: 'Corridoio delle Varianti',
  ru: 'Коридор вариантов',
  def: 'Sequenza di linee di vita compatibili con il tuo obiettivo e attraversabili con minima resistenza.',
  link: ['Flusso delle Varianti', 'Obiettivo', 'Porta']
},
// TECNICHE
{
  id: 'g13',
  sez: 'Tecniche',
  it: 'Slide (Diapositiva)',
  ru: 'Слайд',
  def: 'Scena sintetica dell\'obiettivo già raggiunto, vissuta dall\'interno — non una visualizzazione intensa ma un abitare leggero per pochi secondi. Ripetuta con regolarità e senza importanza, entra per risonanza. Visualizzare con forza è il modo classico di sabotarla, perché alza l\'importanza e attiva le forze di equilibrio.',
  link: ['Visualizzazione', 'Obiettivo', 'Importanza']
}, {
  id: 'g14',
  sez: 'Tecniche',
  it: 'Frejling',
  ru: 'Фрейлинг',
  def: 'Tecnica di inversione: invece di chiedere ciò che vuoi, offri ciò che vorresti ricevere. Crea vuoto attrattivo invece di corrente respingente.',
  link: ['Intenzione Esterna', 'Volere→Dare']
}, {
  id: 'g15',
  sez: 'Tecniche',
  it: 'Coordinamento dell\'Intenzione',
  ru: 'Координация намерения',
  def: 'Accettare ogni evento come parte utile del proprio cammino invece di classificarlo buono/cattivo.',
  link: ['Coordinamento degli Stati', 'Accettare']
}, {
  id: 'g16',
  sez: 'Tecniche',
  it: 'Coordinamento degli Stati',
  ru: 'Координация состояний',
  def: 'Mantenere stabile il proprio stato interno indipendentemente dagli eventi esterni. Base per lo specchio duale.',
  link: ['Specchio Duale', 'Tenere la Forma']
}, {
  id: 'g17',
  sez: 'Tecniche',
  it: 'Cadere dal Pendolo',
  ru: 'Проваливание маятника',
  def: 'Non-partecipazione cosciente al gioco del pendolo. Né combattere né assecondare: togliere attenzione.',
  link: ['Pendolo', 'Attenzione']
}, {
  id: 'g18',
  sez: 'Tecniche',
  it: 'Tenere la Forma',
  ru: 'Удержание формы',
  def: 'Mantenere il ruolo interiore scelto invece di essere definito dalla situazione.',
  link: ['Ruolo', 'Coordinamento degli Stati']
}, {
  id: 'g19',
  sez: 'Tecniche',
  it: 'Ridurre l\'Importanza',
  ru: 'Снижение важности',
  def: 'Atto volontario di sdrammatizzazione. «Va bene in entrambi i casi» è la formula più pura.',
  link: ['Importanza', 'Potenziali Eccedenti']
}, {
  id: 'g20',
  sez: 'Tecniche',
  it: 'Obiettivo / Porta',
  ru: 'Цель / Дверь',
  def: 'L\'obiettivo è il fine; la Porta è la linea di vita che vi conduce. Confondere i due è l\'errore tipico — si fissa la Porta invece dell\'Obiettivo.',
  link: ['Corridoio delle Varianti', 'Slide']
},
// AVANZATI (classici)
{
  id: 'g21',
  sez: 'Avanzati',
  it: 'Specchio Duale',
  ru: 'Дуальное зеркало',
  def: 'Legge di risonanza — non morale, causale — per cui la realtà fisica (lato reale) riflette la realtà mentale (lato immaginario) con un ritardo. Regola operativa del Transurfing III: «lascia andare l\'immagine» — modifichi lo stato interno, non forzi il riflesso. Se i tuoi sentimenti non sono armoniosi, la realtà non lo sarà.',
  link: ['Coordinamento degli Stati', 'Amalgama', 'Lascia andare l\'immagine']
}, {
  id: 'g22',
  sez: 'Avanzati',
  it: 'Amalgama',
  ru: 'Амальгама',
  def: 'Sostanza metaforica dello specchio: la fusione di pensiero e ambiente che forma la realtà vissuta. Cambiare l\'amalgama cambia il riflesso. Nei forum russi il termine indica anche la soglia di saturazione in cui una pratica nuova, dopo alcuni giorni di ripetizione leggera, smette di essere sforzo e diventa stato di fondo — non una regola fissa di 42 giorni ma il momento in cui il corpo «entra» in una nuova frequenza.',
  link: ['Specchio Duale']
}, {
  id: 'g23',
  sez: 'Avanzati',
  it: 'Proiettore / Vershitel\'',
  ru: 'Вершитель реальности',
  def: 'Funzione di «colui che compie»: forma pre-Tafti della Metaforza. Chi pronuncia, distingue, agisce nel punto giusto.',
  link: ['Metaforza', 'Vershitel\'']
}, {
  id: 'g24',
  sez: 'Avanzati',
  it: 'Sistema Tecnogeno',
  ru: 'Техногенная система',
  def: 'Insieme dei dispositivi sociali, alimentari, mediatici che nutre pendoli automaticamente. Oggetto di critica in kLIBE e čistoPitanie.',
  link: ['Pendolo', 'kLIBE', 'čistoPitanie']
}, {
  id: 'g25',
  sez: 'Avanzati',
  it: 'kLIBE',
  ru: 'Клибе',
  def: 'Liberazione dal sistema tecnogeno. Tecnica di «scardinamento» del consenso automatico.',
  link: ['Sistema Tecnogeno', 'čistoPitanie']
}, {
  id: 'g26',
  sez: 'Avanzati',
  it: 'čistoPitanie',
  ru: 'чистое Питание',
  def: 'Pratica alimentare del cibo vivo come liberazione energetica. Non ideologia dietetica — recupero di energia libera per la pratica.',
  link: ['Sistema Tecnogeno', 'kLIBE']
}, {
  id: 'g27',
  sez: 'Avanzati',
  it: 'Apocrifo',
  ru: 'Апокрифический',
  def: 'Raccolta di materiali, lettere, domande e chiarimenti successivi al canone dei 5 libri (Transurfing 1-5). Integra, non sostituisce — spesso chiarisce punti che i libri avevano lasciato aperti sull\'intenzione esterna e sulle forze di equilibrio.',
  link: ['Transurfing', 'Intenzione Esterna']
},
// TAFTI
{
  id: 'g28',
  sez: 'Tafti',
  it: 'Tafti la Sacerdotessa',
  ru: 'Тафти жрица',
  def: 'Figura allegorica introdotta nel 2018. Voce narrante che si rivolge al lettore in seconda persona. Segna il passaggio dalla geometria (5 stadi) alla pratica diretta.',
  link: ['Sacerdotessa Itfat', 'Metaforza', 'Treccia']
}, {
  id: 'g29',
  sez: 'Tafti',
  it: 'Sacerdotessa Itfat',
  ru: 'Жрица Итфат',
  def: 'Altra figura dell\'universo Tafti. Rappresenta lo stato di presenza regale, autorevole, senza bisogno di approvazione.',
  link: ['Tafti la Sacerdotessa', 'Presenza']
}, {
  id: 'g30',
  sez: 'Tafti',
  it: 'Metaforza',
  ru: 'Метасила',
  def: 'Forma concreta dell\'intenzione esterna nell\'era Tafti. È la Forza che agisce «oltre» la volontà personale, attivabile dalla Treccia.',
  link: ['Intenzione Esterna', 'Treccia', 'Forza', 'Impostazione dell\'Immagine']
}, {
  id: 'g31',
  sez: 'Tafti',
  it: 'Treccia dell\'Intenzione',
  ru: 'Косица намерения / Плейт',
  def: 'Punto soggettivo dietro le scapole dal quale si «pronuncia» l\'impostazione. Non anatomico in senso stretto: è un punto di attenzione strutturato.',
  link: ['Metaforza', 'Impostazione dell\'Immagine', 'Scintilla del Creatore']
}, {
  id: 'g32',
  sez: 'Tafti',
  it: 'Impostazione dell\'Immagine',
  ru: 'Установка образа',
  def: 'Atto di pronunciare internamente, dalla Treccia, la scena-obiettivo già compiuta. Breve, leggera, al presente.',
  link: ['Treccia', 'Metaforza', 'Slide']
}, {
  id: 'g33',
  sez: 'Tafti',
  it: 'Scintilla del Creatore',
  ru: 'Искра Творца',
  def: 'Qualità di presenza viva al centro del petto. Non da creare — da notare. Distingue te dal personaggio automatico.',
  link: ['Presenza', 'Metaforza']
}, {
  id: 'g34',
  sez: 'Tafti',
  it: 'Presenza',
  ru: 'Присутствие',
  def: 'Stato di consapevolezza dentro la scena del film-realtà. Radice di tutte le pratiche Tafti.',
  link: ['Svegliarsi nel Film', 'Scintilla del Creatore']
}, {
  id: 'g35',
  sez: 'Tafti',
  it: 'Svegliarsi nel Film',
  ru: 'Просыпание в кинокартине',
  def: 'Gesto mentale fondamentale: accorgersi di essere in una scena anziché riviverla automaticamente.',
  link: ['Presenza', 'Schermi']
}, {
  id: 'g36',
  sez: 'Tafti',
  it: 'Gli Schermi',
  ru: 'Экраны',
  def: 'Schermo esterno (ciò che accade realmente) e schermo interno (ciò che la mente monta: pensieri, proiezioni, ricordi, timori). La pratica Tafti non è controllarli ma distinguerli consapevolmente — risvegliarsi dalla confusione automatica che li sovrappone. La regia viene dopo il risveglio, non prima.',
  link: ['Attenzione', 'Presenza', 'Svegliarsi nel Film']
}, {
  id: 'g37',
  sez: 'Tafti',
  it: 'Realizzazione 1',
  ru: 'Реализация 1',
  def: 'Fase esecutiva dopo l\'impostazione. Qui si agisce senza più interrogarsi.',
  link: ['Realizzazione 2', 'Impostazione dell\'Immagine']
}, {
  id: 'g38',
  sez: 'Tafti',
  it: 'Realizzazione 2',
  ru: 'Реализация 2',
  def: 'Fase post-azione. Chiudere la scena, non «tirare a sé» il risultato con il pensiero.',
  link: ['Realizzazione 1']
}, {
  id: 'g39',
  sez: 'Tafti',
  it: 'Le Lucciole',
  ru: 'Светлячки',
  def: 'Segnali sottili dello spazio varianti che illuminano brevemente: coincidenze, frasi, numeri, volti. Confermano o correggono la direzione senza chiedere interpretazione: la ricorrenza E IL MESSAGGIO. Non costruirci sopra una narrazione — nota i pattern e basta.',
  link: ['Attenzione', 'Flusso delle Varianti']
}, {
  id: 'g40',
  sez: 'Tafti',
  it: 'Il Manichino',
  ru: 'Манекен',
  def: 'Insieme delle funzioni automatiche che rispondono ai «fili» dei pendoli. Riconoscerli è il primo passo per recidere.',
  link: ['Pendolo', 'Ruolo']
}, {
  id: 'g41',
  sez: 'Tafti',
  it: 'Volere → Dare (e le altre 3 inversioni)',
  ru: 'Хотеть → Давать',
  def: 'Le 4 inversioni Tafti: volere→dare, rifiutare→accettare, addormentarsi→svegliarsi, più la quarta soglia del «pronunciare invece di chiedere».',
  link: ['Frejling', 'Accettare', 'Svegliarsi nel Film']
}, {
  id: 'g42',
  sez: 'Tafti',
  it: 'Trasferirsi (Sé)',
  ru: 'Трансерфинг себя',
  def: 'Ultimo movimento (2025). Transurfing rivolto a sé stessi: Sé-attore, Sé-spettatore, Sé-regista.',
  link: ['Presenza', 'Ruolo']
},
// FONDAMENTI — aggiunte tecniche
{
  id: 'g43',
  sez: 'Fondamenti',
  it: 'Anima e Ragione',
  ru: 'Душа и Разум',
  def: 'Dualità interna fondamentale nel modello di Zeland. La Ragione procede per induzione, controllo, paura: opera con l\'intenzione interna. L\'Anima «sa» per risonanza diretta con lo spazio varianti — non pensa, percepisce. L\'unità delle due (consenso Anima-Ragione) è la precondizione perché l\'intenzione esterna funzioni: se si contraddicono, la Metaforza resta muta.',
  link: ['Intenzione Esterna', 'Intenzione Interna', 'Scintilla del Creatore', 'Flusso delle Varianti']
}, {
  id: 'g44',
  sez: 'Fondamenti',
  it: 'Zona di Conforto',
  ru: 'Зона комфорта',
  def: 'Perimetro energetico dentro cui il sistema tecnogeno e i pendoli ti mantengono «funzionale». Non è comodità: è il set di linee di vita dove sei prevedibile e produttivo per gli altri. La nuova variante è sempre appena fuori dal bordo — uscire senza violenza richiede coordinamento degli stati, non strappo.',
  link: ['Sistema Tecnogeno', 'Coordinamento degli Stati', 'Pendolo', 'Sentinelle del Sogno']
}, {
  id: 'g45',
  sez: 'Fondamenti',
  it: 'Onda di Successo',
  ru: 'Полоса удачи',
  def: 'Sequenza continua di settori a frequenza coerente con il tuo stato interno. Non è «fortuna casuale»: è il risultato del non essere uscito dalla tua frequenza. Si perde nel momento in cui si attiva l\'importanza («finalmente!»): l\'eccesso di carica chiama le forze di equilibrio.',
  link: ['Linea di Vita', 'Coordinamento degli Stati', 'Flusso delle Varianti', 'Forze di Equilibrio']
},
// TECNICHE — aggiunte
{
  id: 'g46',
  sez: 'Tecniche',
  it: 'Cristallizzazione dell\'Obiettivo',
  ru: 'Кристаллизация цели',
  def: 'Maturazione dello slide: da immagine episodica a stato abitato in modo quasi continuo. La cristallizzazione non avviene pensando — avviene lasciando che lo slide impregni i gesti ordinari. Segnale di maturità: quando smetti di «chiederti se sta funzionando».',
  link: ['Slide (Diapositiva)', 'Tenere la Forma', 'Impostazione dell\'Immagine']
}, {
  id: 'g47',
  sez: 'Tecniche',
  it: 'Anticipare il Vuoto',
  ru: 'Пустота перед намерением',
  def: 'Prima di ogni impostazione, creare un istante di silenzio interno totale. Il vuoto non è assenza — è la condizione perché la frase parta dalla Treccia e non dalla testa. Senza il vuoto, l\'impostazione è rumore travestito.',
  link: ['Intenzione Esterna', 'Metaforza', 'Impostazione dell\'Immagine', 'Treccia dell\'Intenzione']
}, {
  id: 'g48',
  sez: 'Tecniche',
  it: 'Stereotipo',
  ru: 'Стереотип',
  def: 'Schema automatico di risposta: ruolo, reazione, opinione pre-impostati. I pendoli si nutrono degli stereotipi come di condotti di energia — riconoscerne uno attivo, senza combatterlo, è già scollegamento. Più sottile del «Manichino»: lo stereotipo è la forma, il Manichino è l\'insieme.',
  link: ['Il Manichino', 'Pendolo', 'Cadere dal Pendolo', 'Ruolo']
},
// AVANZATI — aggiunte
{
  id: 'g49',
  sez: 'Avanzati',
  it: 'Ipnosi Sociale',
  ru: 'Социальный гипноз',
  def: 'Consenso automatico indotto dai pendoli collettivi: rende «ovvie» opinioni, paure, reazioni che hai ereditato senza scelta. Non si vince argomentando (conferma il pendolo) — si dissolve con la presenza e con il rifiuto di partecipare al gioco.',
  link: ['Pendolo', 'Sistema Tecnogeno', 'Svegliarsi nel Film', 'Cadere dal Pendolo']
}, {
  id: 'g50',
  sez: 'Avanzati',
  it: 'Sentinelle del Sogno',
  ru: 'Стражи сна',
  def: 'Figure interiori (o esterne, ma specchio) che ti riportano al ruolo consueto quando stai uscendo dalla zona di conforto. Riconoscerle è disattivarne il comando: non sono nemici, sono il sistema che difende l\'equilibrio vecchio.',
  link: ['Zona di Conforto', 'Il Manichino', 'Coordinamento degli Stati', 'Stereotipo']
}, {
  id: 'g51',
  sez: 'Avanzati',
  it: 'Energia Libera',
  ru: 'Свободная энергия',
  def: 'Quota di energia non dispersa su pendoli, stress, importanza o digestione pesante. È il carburante della Metaforza e del passaggio tra linee di vita: senza di essa le impostazioni restano parole. Si recupera con čistoPitanie, silenzio, sonno e riduzione dell\'importanza.',
  link: ['čistoPitanie', 'Sistema Tecnogeno', 'Intenzione Esterna', 'Metaforza']
},
// TAFTI — aggiunte
{
  id: 'g52',
  sez: 'Tafti',
  it: 'Glifi',
  ru: 'Глифы',
  def: 'Segni-traccia sottili che la realtà deposita dopo un\'impostazione riuscita: una parola ripetuta, un oggetto ricorrente, una coincidenza. Non oracoli da decifrare — indicatori di risonanza che confermano la direzione.',
  link: ['Le Lucciole', 'Flusso delle Varianti', 'Presenza']
}, {
  id: 'g53',
  sez: 'Tafti',
  it: 'Fruscio delle Stelle del Mattino',
  ru: 'Шелест утренних звёзд',
  def: 'Frequenza sottilissima dello spazio varianti percepibile solo in silenzio presente. Titolo e motivo poetico di Zeland: non tecnica, ma qualità di ascolto — come se la realtà stessa stesse sussurrando il prossimo passo prima che la Ragione lo pensi.',
  link: ['Presenza', 'Scintilla del Creatore', 'Flusso delle Varianti', 'Anima e Ragione']
}, {
  id: 'g54',
  sez: 'Tafti',
  it: 'Il Sigillo',
  ru: 'Печать',
  def: 'Momento in cui l\'impostazione «cristallizza» e la scena inizia ad auto-realizzarsi senza ulteriore sforzo. Lo si riconosce da un\'improvvisa quiete del volere: non ti chiedi più se funzionerà. Segnale tecnico che puoi passare a Realizzazione 2.',
  link: ['Cristallizzazione dell\'Obiettivo', 'Impostazione dell\'Immagine', 'Realizzazione 2', 'Metaforza']
}];
// Grafo del glossario — rete neuronale organica moderna, ispirata a Obsidian Graph View.
// Layout: simulazione force-directed leggera (repulsione coulombiana + molle sui link + gravità
// verso il centro del cluster + safe-zone del core). Risultato stabile e organico,
// con spazio sotto per le label anche sui cluster bassi.
function ObsidianGraph({ selected, onSelect }) {
  const sezioniList = ['Fondamenti', 'Tecniche', 'Avanzati', 'Tafti'];
  const sezColors = {
    'Fondamenti': '#f4c95d',
    'Tecniche': '#a78bfa',
    'Avanzati': '#67e8f9',
    'Tafti': '#f472b6'
  };
  // viewBox allargato (1100×920) → i cluster in basso hanno 90px di padding sotto per le label.
  const VB = { w: 1100, h: 920 };
  const clusters = {
    'Fondamenti': { cx: 240, cy: 235, rx: 165, ry: 160, rot: -0.15 },
    'Tecniche':   { cx: 860, cy: 235, rx: 165, ry: 160, rot:  0.12 },
    'Avanzati':   { cx: 240, cy: 705, rx: 165, ry: 140, rot:  0.25 },
    'Tafti':      { cx: 860, cy: 705, rx: 165, ry: 140, rot: -0.22 }
  };
  const CORE = { cx: 550, cy: 470, safeR: 180 };

  // Indice collegamenti per weight-based sizing
  const linkCount = {};
  GLOSSARIO.forEach(g => {
    linkCount[g.id] = (g.link || []).length;
    (g.link || []).forEach(linkName => {
      const t = GLOSSARIO.find(x => x.it === linkName);
      if (t) linkCount[t.id] = (linkCount[t.id] || 0) + 1;
    });
  });
  const maxLinks = Math.max(...Object.values(linkCount), 1);

  const connessioni = [];
  GLOSSARIO.forEach(g => {
    (g.link || []).forEach(linkName => {
      const target = GLOSSARIO.find(x => x.it === linkName || x.it.toLowerCase() === linkName.toLowerCase());
      if (target && g.id < target.id) {
        connessioni.push({ a: g.id, b: target.id });
      }
    });
  });

  // Simulazione force-directed leggera, memoizzata → gira solo al primo montaggio.
  // Regole: repulsione coulombiana ~1/d², molla attrattiva sui link (lung. riposo ~80),
  // gravità radiale verso il centro cluster, safe-zone attorno al core.
  const positions = React.useMemo(() => {
    // Posizioni iniziali su ellisse del cluster
    const nodes = {};
    sezioniList.forEach(sez => {
      const items = GLOSSARIO.filter(g => g.sez === sez);
      const c = clusters[sez];
      const n = items.length;
      items.forEach((g, i) => {
        const angle = (2 * Math.PI * i) / n + c.rot - Math.PI / 2;
        const rFactor = i % 2 === 0 ? 0.92 : 1.04;
        const x = c.cx + c.rx * rFactor * Math.cos(angle);
        const y = c.cy + c.ry * rFactor * Math.sin(angle);
        const seed = (g.id.charCodeAt(1) + (g.id.charCodeAt(2) || 0)) % 23;
        nodes[g.id] = {
          id: g.id, sez, color: sezColors[sez], term: g,
          x, y, vx: 0, vy: 0, phase: seed, angle,
          w: (linkCount[g.id] || 0) / maxLinks
        };
      });
    });
    const nodeArr = Object.values(nodes);
    const edgeArr = connessioni
      .map(c => ({ s: nodes[c.a], t: nodes[c.b] }))
      .filter(e => e.s && e.t);

    const ITERS = 140;
    const REPULSE = 520;        // costante coulombiana
    const REST_LEN = 78;         // lunghezza riposo molla
    const LINK_K = 0.012;        // rigidità molla
    const GRAV_K = 0.006;        // gravità al centro cluster
    const DAMP = 0.78;
    const MAX_STEP = 4.5;
    for (let iter = 0; iter < ITERS; iter++) {
      // Repulsione tra tutti i nodi
      for (let i = 0; i < nodeArr.length; i++) {
        for (let j = i + 1; j < nodeArr.length; j++) {
          const A = nodeArr[i], B = nodeArr[j];
          let dx = B.x - A.x;
          let dy = B.y - A.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) { d2 = 1; dx = 0.5; dy = 0.5; }
          const d = Math.sqrt(d2);
          // Repulsione più forte tra nodi dello stesso cluster per evitare ammassi
          const sameCluster = A.sez === B.sez ? 1.15 : 0.9;
          const f = (REPULSE * sameCluster) / d2;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          A.vx -= fx; A.vy -= fy;
          B.vx += fx; B.vy += fy;
        }
      }
      // Attrazione lungo link
      edgeArr.forEach(e => {
        const dx = e.t.x - e.s.x;
        const dy = e.t.y - e.s.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = (d - REST_LEN) * LINK_K;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        e.s.vx += fx; e.s.vy += fy;
        e.t.vx -= fx; e.t.vy -= fy;
      });
      // Gravità verso centro cluster
      nodeArr.forEach(n => {
        const c = clusters[n.sez];
        n.vx += (c.cx - n.x) * GRAV_K;
        n.vy += (c.cy - n.y) * GRAV_K;
      });
      // Repulsione dal core (come "nodo" massivo)
      nodeArr.forEach(n => {
        const dx = n.x - CORE.cx;
        const dy = n.y - CORE.cy;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < CORE.safeR + 40) {
          const f = 3.8;
          n.vx += (dx / d) * f;
          n.vy += (dy / d) * f;
        }
      });
      // Update con damping e step limitato
      nodeArr.forEach(n => {
        n.vx *= DAMP; n.vy *= DAMP;
        const sx = Math.max(-MAX_STEP, Math.min(MAX_STEP, n.vx));
        const sy = Math.max(-MAX_STEP, Math.min(MAX_STEP, n.vy));
        n.x += sx; n.y += sy;
      });
      // Safe-zone core
      nodeArr.forEach(n => {
        const dx = n.x - CORE.cx;
        const dy = n.y - CORE.cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CORE.safeR && d > 0.01) {
          n.x = CORE.cx + (dx / d) * CORE.safeR;
          n.y = CORE.cy + (dy / d) * CORE.safeR;
        }
      });
      // Margini viewBox (non uscire)
      nodeArr.forEach(n => {
        n.x = Math.max(60, Math.min(VB.w - 60, n.x));
        n.y = Math.max(60, Math.min(VB.h - 80, n.y));
      });
    }
    return nodes;
  }, []);
  const selTerm = selected ? GLOSSARIO.find(g => g.id === selected) : null;
  const selLinks = selTerm ? (selTerm.link || []).map(n => GLOSSARIO.find(g => g.it === n)).filter(Boolean) : [];
  const relatedIds = new Set(selLinks.map(g => g.id));

  // Label placement direzionale: per ogni nodo, parto dalla direzione radiale
  // rispetto al centro cluster e la aggiusto per evitare overlap con altri nodi.
  // Se il nodo sta nella metà inferiore del viewBox, forzo la label sopra (per
  // non farla uscire fuori viewBox).
  const labelPositions = {};
  GLOSSARIO.forEach(g => {
    const p = positions[g.id];
    if (!p) return;
    const c = clusters[p.sez];
    const weight = (linkCount[g.id] || 0) / maxLinks;
    const baseR = 6 + weight * 6;
    let dx = p.x - c.cx;
    let dy = p.y - c.cy;
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    let dirX = dx / len;
    let dirY = dy / len;
    // Se la direzione radiale spingerebbe la label fuori dal viewBox in basso,
    // la rifletto verso l'alto per restare dentro.
    if (p.y > 720 && dirY > 0) dirY = -Math.abs(dirY);
    if (p.y < 120 && dirY < 0) dirY =  Math.abs(dirY);
    const charW = 6.2;
    const w = g.it.length * charW;
    const h = 14;
    const OFF = baseR + 14;
    labelPositions[g.id] = {
      lx: p.x + dirX * OFF,
      ly: p.y + dirY * OFF,
      dirX: dirX,
      dirY: dirY,
      w: w,
      h: h,
      anchor: Math.abs(dirX) < 0.15 ? "middle" : (dirX > 0 ? "start" : "end"),
      baseR: baseR,
      nodeX: p.x,
      nodeY: p.y
    };
  });
  // Pass iterativo: se due label si sovrappongono, le allontano lungo l'asse che le separa.
  // Inoltre, le allontano dal nodo stesso se necessario, senza lasciare il cluster.
  const labelIds = Object.keys(labelPositions);
  const iterations = 24;
  const pushStep = 1.8;
  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;
    for (let i = 0; i < labelIds.length; i++) {
      const a = labelPositions[labelIds[i]];
      // Mezze dimensioni bounding (in base all'anchor per asse x)
      const ahw = a.w / 2;
      const ahh = a.h / 2;
      // Centro effettivo del testo secondo l'anchor
      const acx = a.anchor === "start" ? a.lx + ahw : (a.anchor === "end" ? a.lx - ahw : a.lx);
      const acy = a.ly;
      for (let j = i + 1; j < labelIds.length; j++) {
        const b = labelPositions[labelIds[j]];
        const bhw = b.w / 2;
        const bhh = b.h / 2;
        const bcx = b.anchor === "start" ? b.lx + bhw : (b.anchor === "end" ? b.lx - bhw : b.lx);
        const bcy = b.ly;
        const ddx = bcx - acx;
        const ddy = bcy - acy;
        // Distanza minima richiesta (bounding box AABB)
        const minDX = ahw + bhw + 4;
        const minDY = ahh + bhh + 2;
        const overlapX = minDX - Math.abs(ddx);
        const overlapY = minDY - Math.abs(ddy);
        if (overlapX > 0 && overlapY > 0) {
          // Se ci sono sovrapposizioni su entrambi gli assi, li allontano sull'asse di minor
          // overlap (in modo da fare il minimo spostamento), preferendo y (verticale) per leggibilità.
          if (overlapY <= overlapX) {
            const sign = ddy === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(ddy);
            a.ly -= sign * pushStep;
            b.ly += sign * pushStep;
          } else {
            const sign = ddx === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(ddx);
            a.lx -= sign * pushStep;
            b.lx += sign * pushStep;
          }
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "obs-wrap"
  },
    /*#__PURE__*/React.createElement("div", {
      className: "obs-header"
    },
      /*#__PURE__*/React.createElement("div", { className: "obs-header-title" },
        /*#__PURE__*/React.createElement("span", { className: "obs-header-count" }, GLOSSARIO.length),
        /*#__PURE__*/React.createElement("span", { className: "obs-header-label" }, "termini · "),
        /*#__PURE__*/React.createElement("span", { className: "obs-header-conn" }, connessioni.length + " collegamenti")
      ),
      /*#__PURE__*/React.createElement("div", { className: "obs-legend-inline" },
        sezioniList.map(sez => /*#__PURE__*/React.createElement("span", {
          key: "leg-" + sez,
          className: "obs-chip",
          style: { "--chip-color": sezColors[sez] }
        }, sez))
      )
    ),
    /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 1100 920",
      className: "obs-graph",
      preserveAspectRatio: "xMidYMid meet",
      xmlns: "http://www.w3.org/2000/svg"
    },
      /*#__PURE__*/React.createElement("defs", null,
        // Gradients per cluster "alone"
        sezioniList.map(sez => /*#__PURE__*/React.createElement("radialGradient", {
          key: "grad-" + sez, id: "cl-grad-" + sez, cx: "50%", cy: "50%", r: "50%"
        },
          /*#__PURE__*/React.createElement("stop", { offset: "0%", stopColor: sezColors[sez], stopOpacity: "0.24" }),
          /*#__PURE__*/React.createElement("stop", { offset: "55%", stopColor: sezColors[sez], stopOpacity: "0.07" }),
          /*#__PURE__*/React.createElement("stop", { offset: "100%", stopColor: sezColors[sez], stopOpacity: "0" })
        )),
        // Gradient delle linee attive (flow luminoso)
        /*#__PURE__*/React.createElement("linearGradient", { id: "edge-flow", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
          /*#__PURE__*/React.createElement("stop", { offset: "0%", stopColor: "#f472b6", stopOpacity: "0.9" }),
          /*#__PURE__*/React.createElement("stop", { offset: "50%", stopColor: "#ffffff", stopOpacity: "1" }),
          /*#__PURE__*/React.createElement("stop", { offset: "100%", stopColor: "#a78bfa", stopOpacity: "0.9" })
        ),
        // Glow del core
        /*#__PURE__*/React.createElement("radialGradient", { id: "core-body", cx: "38%", cy: "30%", r: "75%" },
          /*#__PURE__*/React.createElement("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "1" }),
          /*#__PURE__*/React.createElement("stop", { offset: "22%", stopColor: "#f472b6", stopOpacity: "0.9" }),
          /*#__PURE__*/React.createElement("stop", { offset: "55%", stopColor: "#7c3aed", stopOpacity: "0.75" }),
          /*#__PURE__*/React.createElement("stop", { offset: "100%", stopColor: "#0b0622", stopOpacity: "1" })
        ),
        /*#__PURE__*/React.createElement("radialGradient", { id: "core-aura", cx: "50%", cy: "50%", r: "50%" },
          /*#__PURE__*/React.createElement("stop", { offset: "0%", stopColor: "#f472b6", stopOpacity: "0" }),
          /*#__PURE__*/React.createElement("stop", { offset: "60%", stopColor: "#f472b6", stopOpacity: "0.28" }),
          /*#__PURE__*/React.createElement("stop", { offset: "100%", stopColor: "#22d3ee", stopOpacity: "0" })
        ),
        // Glow tenue per ogni nodo (bloom)
        /*#__PURE__*/React.createElement("filter", { id: "soft-glow", x: "-50%", y: "-50%", width: "200%", height: "200%" },
          /*#__PURE__*/React.createElement("feGaussianBlur", { stdDeviation: "3", result: "blur" }),
          /*#__PURE__*/React.createElement("feMerge", null,
            /*#__PURE__*/React.createElement("feMergeNode", { in: "blur" }),
            /*#__PURE__*/React.createElement("feMergeNode", { in: "SourceGraphic" })
          )
        ),
        // Glow intenso (nodi selezionati / alto peso)
        /*#__PURE__*/React.createElement("filter", { id: "node-bloom", x: "-80%", y: "-80%", width: "260%", height: "260%" },
          /*#__PURE__*/React.createElement("feGaussianBlur", { stdDeviation: "5", result: "b1" }),
          /*#__PURE__*/React.createElement("feGaussianBlur", { stdDeviation: "9", in: "SourceGraphic", result: "b2" }),
          /*#__PURE__*/React.createElement("feMerge", null,
            /*#__PURE__*/React.createElement("feMergeNode", { in: "b2" }),
            /*#__PURE__*/React.createElement("feMergeNode", { in: "b1" }),
            /*#__PURE__*/React.createElement("feMergeNode", { in: "SourceGraphic" })
          )
        ),
        // Griglia sottile di sfondo stile Obsidian
        /*#__PURE__*/React.createElement("pattern", { id: "obs-grid", width: "40", height: "40", patternUnits: "userSpaceOnUse" },
          /*#__PURE__*/React.createElement("path", { d: "M 40 0 L 0 0 0 40", fill: "none", stroke: "rgba(180,150,240,0.04)", strokeWidth: "0.5" })
        )
      ),
      // Griglia di sfondo
      /*#__PURE__*/React.createElement("rect", { x: 0, y: 0, width: VB.w, height: VB.h, fill: "url(#obs-grid)" }),
      // Alone di cluster (aura colorata)
      sezioniList.map(sez => {
        const c = clusters[sez];
        return /*#__PURE__*/React.createElement("ellipse", {
          key: "aura-" + sez,
          cx: c.cx, cy: c.cy, rx: c.rx + 60, ry: c.ry + 60,
          fill: "url(#cl-grad-" + sez + ")",
          className: "obs-cluster-aura"
        });
      }),
      // Label cluster (grande, elegante) — posizione adattiva sopra/sotto
      sezioniList.map(sez => {
        const c = clusters[sez];
        // Cluster in alto → label sopra; cluster in basso → label sotto (più spazio)
        const labelY = c.cy < VB.h / 2 ? c.cy - c.ry - 42 : c.cy + c.ry + 58;
        return /*#__PURE__*/React.createElement("text", {
          key: "clab-" + sez,
          x: c.cx, y: labelY,
          textAnchor: "middle",
          className: "obs-cluster-label",
          style: { fill: sezColors[sez] }
        }, sez);
      }),
      // Linee connessioni (curve bezier) — fade staggerato in mount
      connessioni.map((c, i) => {
        const p1 = positions[c.a];
        const p2 = positions[c.b];
        if (!p1 || !p2) return null;
        const isActive = selected && (c.a === selected || c.b === selected);
        const dimmed = selected && !isActive;
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const nx = -dy * 0.12;
        const ny = dx * 0.12;
        const d = "M " + p1.x + " " + p1.y + " Q " + (mx + nx) + " " + (my + ny) + " " + p2.x + " " + p2.y;
        return /*#__PURE__*/React.createElement("path", {
          key: "edge-" + i,
          d: d,
          className: "obs-edge" + (isActive ? " obs-edge-active" : "") + (dimmed ? " obs-edge-dim" : ""),
          fill: "none",
          style: { animationDelay: ((i % 12) * 0.06) + "s" }
        });
      }),
      // Nodo centrale Ars Realis (core) — posizionato al centro effettivo
      /*#__PURE__*/React.createElement("g", {
        transform: "translate(" + CORE.cx + "," + CORE.cy + ")",
        style: { cursor: 'pointer' },
        onClick: () => onSelect(null),
        className: "obs-core-group"
      },
        /*#__PURE__*/React.createElement("circle", { cx: 0, cy: 0, r: 140, fill: "url(#core-aura)", className: "obs-core-aura" }),
        /*#__PURE__*/React.createElement("circle", { cx: 0, cy: 0, r: 92, fill: "none", stroke: "rgba(236,72,153,0.22)", strokeWidth: 0.8, strokeDasharray: "1 4", className: "obs-core-ring-a" }),
        /*#__PURE__*/React.createElement("circle", { cx: 0, cy: 0, r: 108, fill: "none", stroke: "rgba(236,72,153,0.16)", strokeWidth: 0.6, strokeDasharray: "1 6", className: "obs-core-orbit" }),
        /*#__PURE__*/React.createElement("circle", { cx: 0, cy: 0, r: 124, fill: "none", stroke: "rgba(167,139,250,0.12)", strokeWidth: 0.5, strokeDasharray: "2 10", className: "obs-core-ring-b" }),
        /*#__PURE__*/React.createElement("circle", { cx: 0, cy: 0, r: 76, fill: "url(#core-body)", filter: "url(#soft-glow)" }),
        /*#__PURE__*/React.createElement("circle", { cx: 0, cy: 0, r: 76, fill: "none", stroke: "rgba(255,255,255,0.5)", strokeWidth: 0.8 }),
        /*#__PURE__*/React.createElement("text", {
          x: 0, y: -4, textAnchor: "middle", className: "obs-core-ars"
        }, "Ars"),
        /*#__PURE__*/React.createElement("text", {
          x: 0, y: 24, textAnchor: "middle", className: "obs-core-realis"
        }, "Realis"),
        /*#__PURE__*/React.createElement("text", {
          x: 0, y: 48, textAnchor: "middle", className: "obs-core-tag"
        }, "· RETE ·")
      ),
      // Nodi
      GLOSSARIO.map((g, idx) => {
        const p = positions[g.id];
        if (!p) return null;
        const isSelected = selected === g.id;
        const isRelated = relatedIds.has(g.id);
        const dimmed = selected && !isSelected && !isRelated;
        const weight = (linkCount[g.id] || 0) / maxLinks;
        const baseR = 5.5 + weight * 7;
        const r = isSelected ? baseR + 5 : (isRelated ? baseR + 2.5 : baseR);
        const lp = labelPositions[g.id] || { lx: p.x, ly: p.y, anchor: "middle", dirX: 0, dirY: 1 };
        const lx = lp.lx;
        const ly = lp.ly;
        const anchor = lp.anchor;
        const leaderDist = Math.sqrt((lx - p.x) * (lx - p.x) + (ly - p.y) * (ly - p.y));
        const needsLeader = leaderDist > (baseR + 20);
        // Delay staggerato per mount animato (entrata progressiva dei nodi)
        const mountDelay = ((idx % 14) * 0.05);

        return /*#__PURE__*/React.createElement("g", {
          key: g.id,
          onClick: () => onSelect(g.id),
          style: {
            cursor: 'pointer',
            animationDelay: (p.phase * 0.3) + "s, " + mountDelay + "s, " + (p.phase * 0.3) + "s"
          },
          className: "obs-node-group" + (isSelected ? " selected" : "") + (isRelated ? " related" : "") + (dimmed ? " dimmed" : "")
        },
          // Alone morbido sempre visibile (soft halo) per tutti i nodi
          !dimmed && /*#__PURE__*/React.createElement("circle", {
            cx: p.x, cy: p.y, r: r + 10 + weight * 6,
            fill: p.color, fillOpacity: isSelected ? 0.22 : (isRelated ? 0.15 : 0.08),
            stroke: "none",
            className: "obs-node-halo"
          }),
          // pulse ring per selezionato
          isSelected && /*#__PURE__*/React.createElement("circle", {
            cx: p.x, cy: p.y, r: r + 22,
            fill: "none", stroke: p.color, strokeOpacity: 0.35, strokeWidth: 1.1,
            className: "obs-node-ping"
          }),
          isSelected && /*#__PURE__*/React.createElement("circle", {
            cx: p.x, cy: p.y, r: r + 11,
            fill: "none", stroke: p.color, strokeOpacity: 0.55, strokeWidth: 1.2
          }),
          // Core del nodo con filter bloom per peso alto
          /*#__PURE__*/React.createElement("circle", {
            cx: p.x, cy: p.y, r: r,
            fill: isSelected ? "#ffffff" : p.color,
            stroke: isSelected ? p.color : "rgba(5,3,15,0.7)",
            strokeWidth: isSelected ? 2.5 : 0.9,
            filter: (weight > 0.55 || isSelected) ? "url(#node-bloom)" : undefined,
            className: "obs-node-core"
          }),
          // Leader line sottile
          needsLeader && /*#__PURE__*/React.createElement("line", {
            x1: p.x + lp.dirX * (baseR + 2),
            y1: p.y + lp.dirY * (baseR + 2),
            x2: lx - (anchor === "start" ? -3 : (anchor === "end" ? 3 : 0)),
            y2: ly,
            stroke: p.color,
            strokeOpacity: dimmed ? 0.06 : (isSelected || isRelated ? 0.5 : 0.22),
            strokeWidth: 0.7,
            strokeDasharray: "1 3",
            className: "obs-node-leader"
          }),
          // Label
          /*#__PURE__*/React.createElement("text", {
            x: lx, y: ly + 4,
            textAnchor: anchor,
            className: "obs-node-label",
            style: {
              fill: isSelected ? "#ffffff" : (isRelated ? p.color : "rgba(224,214,248,0.9)"),
              fontSize: isSelected ? "15px" : (isRelated ? "13px" : "11.5px"),
              fontWeight: isSelected ? 600 : (isRelated ? 500 : 400)
            }
          }, g.it)
        );
      })
    ),
    /*#__PURE__*/React.createElement("div", {
      className: "obs-hint"
    }, selTerm
      ? /*#__PURE__*/React.createElement(React.Fragment, null,
          /*#__PURE__*/React.createElement("span", { className: "obs-hint-selected" }, selTerm.it),
          " · ",
          selLinks.length + " collegamenti attivi · ",
          /*#__PURE__*/React.createElement("span", {
            className: "obs-hint-reset",
            onClick: () => onSelect(null)
          }, "reset grafo")
        )
      : "clicca un termine per esplorare la rete di connessioni"
    ),
    // ── Fallback mobile: lista animata Obsidian-style ─────────────────
    // Sotto i 640px il grafo SVG diventa illeggibile (scale 0.32 = testo 3.7px).
    // Mostriamo invece 4 cluster-card con chip cliccabili, stesso behavior di selezione.
    /*#__PURE__*/React.createElement("div", {
      className: "obs-mobile-list"
    },
      sezioniList.map((sez, cIdx) => {
        const termini = GLOSSARIO.filter(g => g.sez === sez);
        return /*#__PURE__*/React.createElement("div", {
          key: "mobcl-" + sez,
          className: "obs-mobile-cluster",
          style: {
            "--cluster-color": sezColors[sez],
            animationDelay: (cIdx * 0.12) + "s"
          }
        },
          /*#__PURE__*/React.createElement("div", {
            className: "obs-mobile-cluster-head"
          },
            /*#__PURE__*/React.createElement("span", {
              className: "obs-mobile-cluster-dot"
            }),
            /*#__PURE__*/React.createElement("span", {
              className: "obs-mobile-cluster-name"
            }, sez),
            /*#__PURE__*/React.createElement("span", {
              className: "obs-mobile-cluster-count"
            }, termini.length + " termini")
          ),
          /*#__PURE__*/React.createElement("div", {
            className: "obs-mobile-chips"
          },
            termini.map((g, tIdx) => {
              const isSelected = g.id === selected;
              const isRelated = selected && (() => {
                const selT = GLOSSARIO.find(x => x.id === selected);
                if (!selT) return false;
                return (selT.link || []).includes(g.it) || (g.link || []).includes(selT.it);
              })();
              return /*#__PURE__*/React.createElement("button", {
                key: "mobchip-" + g.id,
                className: "obs-mobile-chip" +
                  (isSelected ? " is-selected" : "") +
                  (isRelated ? " is-related" : ""),
                style: {
                  animationDelay: ((cIdx * 0.12) + (tIdx * 0.025) + 0.2) + "s"
                },
                onClick: () => onSelect(isSelected ? null : g.id)
              },
                /*#__PURE__*/React.createElement("span", {
                  className: "obs-mobile-chip-bullet"
                }),
                g.it,
                (g.link || []).length > 0 && /*#__PURE__*/React.createElement("span", {
                  className: "obs-mobile-chip-links"
                }, (g.link || []).length)
              );
            })
          )
        );
      })
    )
  );
}
function Glossario() {
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState('');
  const [sez, setSez] = useState('tutte');
  const sezioni = ['tutte', 'Fondamenti', 'Tecniche', 'Avanzati', 'Tafti'];
  const filtered = GLOSSARIO.filter(g => {
    if (sez !== 'tutte' && g.sez !== sez) return false;
    if (q && !(g.it + ' ' + g.ru + ' ' + g.def).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const findByName = name => GLOSSARIO.find(g => g.it.toLowerCase().includes(name.toLowerCase()) || g.ru.toLowerCase().includes(name.toLowerCase()));
  const selected = sel ? GLOSSARIO.find(g => g.id === sel) : null;
  const sezColor = {
    'Fondamenti': 'var(--gold)',
    'Tecniche': '#b291d9',
    'Avanzati': 'var(--ink-dim)',
    'Tafti': 'var(--crimson-bright)'
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-num mb-2"
  }, "03 \xB7 GLOSSARIO"), /*#__PURE__*/React.createElement("h2", {
    className: "text-5xl serif mb-4",
    style: {
      letterSpacing: '-0.01em'
    }
  }, GLOSSARIO.length, " concetti, ", /*#__PURE__*/React.createElement("span", {
    className: "italic",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "un sistema"), "."), /*#__PURE__*/React.createElement("p", {
    className: "text-base max-w-3xl mb-10 leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Ogni termine con nome italiano e originale russo. I collegamenti ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "crimson"), " portano a concetti correlati: il glossario \xE8 una rete, non una lista."), /*#__PURE__*/React.createElement("div", {
    className: "mb-10"
  }, /*#__PURE__*/React.createElement(ObsidianGraph, {
    selected: sel,
    onSelect: (id) => setSel(id)
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-4 mb-6"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Cerca: Pendolo, \u041C\u0430\u044F\u0442\u043D\u0438\u043A, Metaforza, Treccia\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-8 flex-wrap"
  }, sezioni.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: "btn " + (sez === s ? 'primary' : 'ghost'),
    onClick: () => setSez(s)
  }, s === 'tutte' ? 'Tutte le sezioni' : s))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-[1fr_400px] gap-8"
  }, /*#__PURE__*/React.createElement("div", null, sezioni.slice(1).map(s => {
    const items = filtered.filter(g => g.sez === s);
    if (items.length === 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: s,
      className: "mb-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title mb-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono text-xs uppercase tracking-widest",
      style: {
        color: sezColor[s]
      }
    }, s), /*#__PURE__*/React.createElement("span", {
      className: "mono text-[10px]",
      style: {
        color: 'var(--ink-mute)'
      }
    }, "\xB7 ", items.length), /*#__PURE__*/React.createElement("span", {
      className: "section-rule"
    })), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1"
    }, items.map(g => /*#__PURE__*/React.createElement("div", {
      key: g.id,
      className: "px-3 py-2 cursor-pointer flex items-baseline justify-between gap-4 " + (sel === g.id ? '' : ''),
      style: {
        background: sel === g.id ? 'var(--bg-2)' : 'transparent',
        borderLeft: sel === g.id ? '2px solid var(--crimson)' : '2px solid transparent'
      },
      onClick: () => {
        setSel(g.id);
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
          setTimeout(() => {
            const el = document.querySelector('.glossary-aside');
            if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 60);
        }
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "serif text-lg",
      style: {
        color: sel === g.id ? 'var(--ink)' : 'var(--ink-dim)'
      }
    }, g.it), /*#__PURE__*/React.createElement("div", {
      className: "ru text-sm"
    }, g.ru)), /*#__PURE__*/React.createElement("span", {
      className: "mono text-[10px]",
      style: {
        color: 'var(--ink-mute)'
      }
    }, g.id)))));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "serif italic text-center py-20",
    style: {
      color: 'var(--ink-mute)'
    }
  }, "Nessun concetto trovato.")), /*#__PURE__*/React.createElement("aside", {
    className: "sticky top-24 self-start glossary-aside"
  }, !selected && /*#__PURE__*/React.createElement("div", {
    className: "card p-8 text-center glossary-empty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote-mark mb-2"
  }, "\u201C"), /*#__PURE__*/React.createElement("div", {
    className: "serif italic text-lg leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Seleziona un concetto dall\\'elenco.", /*#__PURE__*/React.createElement("br", null), "Ogni definizione apre porte verso altre.")), selected && /*#__PURE__*/React.createElement("div", {
    className: "card p-6 fade-in glow-border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chip mb-3",
    style: {
      color: sezColor[selected.sez]
    }
  }, selected.sez), /*#__PURE__*/React.createElement("div", {
    className: "serif text-3xl leading-none mb-1",
    style: {
      letterSpacing: '-0.01em'
    }
  }, selected.it), /*#__PURE__*/React.createElement("div", {
    className: "ru text-base mb-5", lang: "ru"
  }, selected.ru),/*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed mb-6",
    style: {
      color: 'var(--ink)'
    }
  }, selected.def), selected.link && selected.link.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono uppercase text-[10px] tracking-widest mb-2",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Collegato a"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, selected.link.map(ln => {
    const target = findByName(ln);
    return /*#__PURE__*/React.createElement("span", {
      key: ln,
      onClick: () => target && setSel(target.id),
      className: "chip " + (target ? 'crimson' : ''),
      style: {
        cursor: target ? 'pointer' : 'default',
        opacity: target ? 1 : 0.4
      }
    }, ln);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-4 text-[10px] mono",
    style: {
      color: 'var(--ink-mute)',
      borderTop: '1px solid var(--line)'
    }
  }, "Concetto ", selected.id.toUpperCase(), " \xB7 sez. ", selected.sez)))));
}
// ============================================================
// DIARIO — persistente in localStorage
// ============================================================
const DIARIO_TIPI = [{
  id: 'intenzione',
  label: 'Intenzione impostata',
  color: 'var(--gold)',
  icon: '◆'
}, {
  id: 'coincidenza',
  label: 'Coincidenza / Lucciola',
  color: '#ee6278',
  icon: '✦'
}, {
  id: 'pendolo',
  label: 'Pendolo notato',
  color: 'var(--ink-dim)',
  icon: '○'
}, {
  id: 'specchio',
  label: 'Specchio — riflesso osservato',
  color: '#b291d9',
  icon: '◎'
}, {
  id: 'osservazione',
  label: 'Osservazione libera',
  color: 'var(--ink)',
  icon: '·'
}, {
  id: 'corpo',
  label: 'Nota del corpo / čistoPitanie',
  color: '#7fb87f',
  icon: '▲'
}];
function Diario() {
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ts_diario') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [tipo, setTipo] = useState('intenzione');
  const [testo, setTesto] = useState('');
  const [tecnicaRef, setTecnicaRef] = useState('');
  const [filter, setFilter] = useState('tutti');
  useEffect(() => {
    try {
      localStorage.setItem('ts_diario', JSON.stringify(entries));
    } catch (e) {}
  }, [entries]);
  const add = () => {
    if (!testo.trim()) return;
    const entry = {
      id: Date.now(),
      data: new Date().toISOString(),
      tipo,
      testo: testo.trim(),
      tecnica: tecnicaRef || null
    };
    setEntries([entry, ...entries]);
    setTesto('');
    setTecnicaRef('');
  };
  const remove = id => {
    if (confirm('Eliminare questa voce del diario?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diario-transurfing-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const importJson = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (Array.isArray(data)) {
          if (confirm(`Importare ${data.length} voci? Saranno aggiunte alle esistenti.`)) {
            setEntries([...data, ...entries]);
          }
        }
      } catch (err) {
        alert('File non valido.');
      }
    };
    r.readAsText(f);
  };
  const clearAll = () => {
    if (confirm('Sicuro di voler cancellare TUTTE le voci? L\'azione non si può annullare. Considera di esportare prima.')) {
      setEntries([]);
    }
  };
  const filtered = filter === 'tutti' ? entries : entries.filter(e => e.tipo === filter);
  const tipoMap = Object.fromEntries(DIARIO_TIPI.map(t => [t.id, t]));
  const stats = DIARIO_TIPI.map(t => ({
    ...t,
    n: entries.filter(e => e.tipo === t.id).length
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-num mb-2"
  }, "04 \xB7 DIARIO"), /*#__PURE__*/React.createElement("h2", {
    className: "text-5xl serif mb-4",
    style: {
      letterSpacing: '-0.01em'
    }
  }, "Il tuo ", /*#__PURE__*/React.createElement("span", {
    className: "italic",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "film"), ", annotato."), /*#__PURE__*/React.createElement("p", {
    className: "text-base max-w-3xl mb-4 leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Lo specchio duale ha un ritardo di ore o giorni: scrivere ogni giorno \xE8 il modo pi\xF9 concreto per ", /*#__PURE__*/React.createElement("em", null, "vederlo"), ". Annota intenzioni impostate, coincidenze, pendoli individuati, riflessi nello specchio, osservazioni del corpo."), /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono mb-8",
    style: {
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "localStorage"), " \u2014 le tue voci restano nel browser, non lasciano mai il tuo dispositivo."), /*#__PURE__*/React.createElement("div", {
    className: "card p-6 mb-10 glow-border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest mb-4",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Nuova voce"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 flex-wrap mb-4"
  }, DIARIO_TIPI.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: "btn " + (tipo === t.id ? 'primary' : 'ghost'),
    onClick: () => setTipo(t.id)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.color,
      marginRight: '8px'
    }
  }, t.icon), t.label))), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    placeholder: "Cosa hai osservato oggi? Sii specifico. Niente teoria.",
    value: testo,
    onChange: e => setTesto(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 mt-3 items-center"
  }, /*#__PURE__*/React.createElement("select", {
    value: tecnicaRef,
    onChange: e => setTecnicaRef(e.target.value),
    className: "max-w-[280px]"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 Tecnica riferita (facoltativo) \u2014"), TECNICHE.map(t => /*#__PURE__*/React.createElement("option", {
    key: t.id,
    value: t.id
  }, t.id.toUpperCase(), " \u2014 ", t.titolo))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: add
  }, "Aggiungi al diario"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-[1fr_280px] gap-8"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-6 flex-wrap"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn " + (filter === 'tutti' ? 'primary' : 'ghost'),
    onClick: () => setFilter('tutti')
  }, "Tutte ", /*#__PURE__*/React.createElement("span", {
    className: "ml-2 mono text-[10px]",
    style: {
      opacity: 0.7
    }
  }, entries.length)), DIARIO_TIPI.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: "btn " + (filter === t.id ? 'primary' : 'ghost'),
    onClick: () => setFilter(t.id)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.color,
      marginRight: '6px'
    }
  }, t.icon), t.label.split('—')[0].trim()))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "card p-12 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote-mark mb-3"
  }, "\u201C"), /*#__PURE__*/React.createElement("div", {
    className: "serif italic text-xl leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, entries.length === 0 ? 'Il diario è vuoto. La prima voce apre il corridoio.' : 'Nessuna voce di questo tipo. Prova un altro filtro.')), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, filtered.map(e => {
    const t = tipoMap[e.tipo] || tipoMap.osservazione;
    const tech = e.tecnica ? TECNICHE.find(x => x.id === e.tecnica) : null;
    const d = new Date(e.data);
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      className: "card p-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline justify-between gap-3 mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline gap-3 flex-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: t.color,
        fontSize: '20px'
      }
    }, t.icon), /*#__PURE__*/React.createElement("span", {
      className: "mono text-xs uppercase tracking-widest",
      style: {
        color: t.color
      }
    }, t.label), /*#__PURE__*/React.createElement("span", {
      className: "text-xs mono",
      style: {
        color: 'var(--ink-mute)'
      }
    }, d.toLocaleString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }))), /*#__PURE__*/React.createElement("button", {
      className: "text-xs mono",
      style: {
        color: 'var(--ink-mute)',
        cursor: 'pointer'
      },
      onClick: () => remove(e.id)
    }, "\u2715 elimina")), /*#__PURE__*/React.createElement("div", {
      className: "text-sm leading-relaxed whitespace-pre-wrap",
      style: {
        color: 'var(--ink)'
      }
    }, e.testo), tech && /*#__PURE__*/React.createElement("div", {
      className: "mt-3 pt-3 text-[11px]",
      style: {
        borderTop: '1px solid var(--line)',
        color: 'var(--gold-dim)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono"
    }, "\u21AA tecnica ", tech.id.toUpperCase(), ":"), ' ', /*#__PURE__*/React.createElement("span", {
      className: "italic serif text-sm",
      style: {
        color: 'var(--gold)'
      }
    }, tech.titolo)));
  }))), /*#__PURE__*/React.createElement("aside", {
    className: "sticky top-24 self-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card p-5 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono uppercase text-[10px] tracking-widest mb-3",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Il tuo diario"), /*#__PURE__*/React.createElement("div", {
    className: "serif text-4xl",
    style: {
      color: entries.length > 0 ? 'var(--crimson-bright)' : 'var(--ink-mute)'
    }
  }, entries.length), /*#__PURE__*/React.createElement("div", {
    className: "text-xs mt-1",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "voci totali"), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-4 space-y-2",
    style: {
      borderTop: '1px solid var(--line)'
    }
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "flex items-center justify-between text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: s.color
    }
  }, s.icon, " ", s.label.split('—')[0].trim()), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--ink-dim)'
    }
  }, s.n))))), /*#__PURE__*/React.createElement("div", {
    className: "card p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono uppercase text-[10px] tracking-widest mb-3",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Backup"), /*#__PURE__*/React.createElement("button", {
    className: "btn w-full mb-2",
    style: {
      display: 'block',
      width: '100%'
    },
    onClick: exportJson
  }, "\u2193 Esporta come JSON"), /*#__PURE__*/React.createElement("label", {
    className: "btn ghost w-full text-center block cursor-pointer",
    style: {
      display: 'block'
    }
  }, "\u2191 Importa da JSON", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "application/json",
    onChange: importJson,
    style: {
      display: 'none'
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost w-full mt-4 text-xs",
    style: {
      display: 'block',
      width: '100%',
      color: 'var(--crimson-bright)'
    },
    onClick: clearAll
  }, "Cancella tutto")))));
}
// ============================================================
// ROADMAP — 52 settimane
// ============================================================
const SETTIMANE = [
// Blocco I — FONDAMENTA (1-13)
{
  n: 1,
  blocco: 1,
  tema: 'Svegliarsi nel film',
  pratica: 'Più volte al giorno, ricordati di essere in una scena. 3 secondi di presenza.',
  tec: ['t01']
}, {
  n: 2,
  blocco: 1,
  tema: 'Osservare senza giudicare',
  pratica: 'Per una settimana, solo osservazione. Nessuna intenzione formulata.',
  tec: ['t01', 't18']
}, {
  n: 3,
  blocco: 1,
  tema: 'Gli Schermi',
  pratica: 'Distinguere lo schermo esterno da quello interno 3 volte al giorno.',
  tec: ['t18']
}, {
  n: 4,
  blocco: 1,
  tema: 'Identificare un pendolo',
  pratica: 'Un pendolo al giorno. Scrivere quale e in che forma ti ha agganciato.',
  tec: ['t02']
}, {
  n: 5,
  blocco: 1,
  tema: 'Cadere dal primo pendolo',
  pratica: 'Scegli UN pendolo forte e smetti di alimentarlo per 7 giorni.',
  tec: ['t02', 't03']
}, {
  n: 6,
  blocco: 1,
  tema: 'Ridurre l\'importanza',
  pratica: 'Trova la situazione con più carico e applica la formula «va bene in entrambi i casi».',
  tec: ['t04']
}, {
  n: 7,
  blocco: 1,
  tema: 'Il primo slide',
  pratica: 'Costruisci una scena mentale dell\'obiettivo raggiunto. Ripetila 2 volte al giorno.',
  tec: ['t05']
}, {
  n: 8,
  blocco: 1,
  tema: 'Frejling — dare prima',
  pratica: 'In ogni relazione questa settimana: offri prima di chiedere.',
  tec: ['t06', 't16']
}, {
  n: 9,
  blocco: 1,
  tema: 'Coordinare l\'intenzione',
  pratica: 'Accogli ogni imprevisto con: «Si incastra nel piano».',
  tec: ['t07']
}, {
  n: 10,
  blocco: 1,
  tema: 'Tenere la forma',
  pratica: 'Scegli un ruolo (calmo, deciso, caldo) e mantienilo nelle tre situazioni-chiave della settimana.',
  tec: ['t11']
}, {
  n: 11,
  blocco: 1,
  tema: 'Specchio Duale — prima prova',
  pratica: 'Mantieni UNO stato interno (gratitudine / sicurezza) per 5 giorni. Osserva.',
  tec: ['t08']
}, {
  n: 12,
  blocco: 1,
  tema: 'Albero degli obiettivi',
  pratica: 'Chiarisci i tuoi 3 obiettivi reali vs. quelli dei pendoli.',
  tec: ['t10']
}, {
  n: 13,
  blocco: 1,
  tema: 'Revisione · blocco I',
  pratica: 'Rileggi diario. Cosa è cambiato? Che tecnica è entrata nella pelle?',
  tec: []
},
// Blocco II — LAVORO DEL CORPO (14-26)
{
  n: 14,
  blocco: 2,
  tema: 'Pulizia del sistema tecnogeno',
  pratica: 'Elimina due elementi tecnogeni (zucchero, social, TV sera, etc.)',
  tec: ['t12']
}, {
  n: 15,
  blocco: 2,
  tema: 'Un pasto vivo al giorno',
  pratica: 'Un pasto al giorno di cibo crudo/vivo. Osservazione.',
  tec: ['t12']
}, {
  n: 16,
  blocco: 2,
  tema: 'Movimento all\'aperto',
  pratica: '30 minuti/giorno fuori, senza musica/telefono. Solo ambiente.',
  tec: ['t01']
}, {
  n: 17,
  blocco: 2,
  tema: 'Silenzio',
  pratica: '20 minuti di silenzio assoluto al giorno. Non meditazione: silenzio.',
  tec: ['t20']
}, {
  n: 18,
  blocco: 2,
  tema: 'La Scintilla del Creatore',
  pratica: '2 min/giorno: non cercarla — notala. Centro del petto.',
  tec: ['t20']
}, {
  n: 19,
  blocco: 2,
  tema: 'Il Proiettore — distinzione serale',
  pratica: 'Ogni sera, 5 min: cos\'era mio oggi e cos\'era rumore di pendoli?',
  tec: ['t14']
}, {
  n: 20,
  blocco: 2,
  tema: 'Permesso',
  pratica: 'Dichiara a una persona vicina (internamente) il permesso di essere com\'è.',
  tec: ['t13']
}, {
  n: 21,
  blocco: 2,
  tema: 'Permesso a sé stessi',
  pratica: 'Stessa pratica, rivolta a te. Per ogni giorno della settimana.',
  tec: ['t13']
}, {
  n: 22,
  blocco: 2,
  tema: 'Rifiutare → Accettare (Tafti)',
  pratica: 'Prendi una cosa che rifiuti con forza. Accettala una settimana.',
  tec: ['t17']
}, {
  n: 23,
  blocco: 2,
  tema: 'Il corridoio delle varianti',
  pratica: 'Formula una direzione (non un dettaglio) e segui i segni.',
  tec: ['t09']
}, {
  n: 24,
  blocco: 2,
  tema: 'Lucciole',
  pratica: 'Tieni il registro delle coincidenze per 7 giorni. Non interpretare.',
  tec: ['t25']
}, {
  n: 25,
  blocco: 2,
  tema: 'Manichino — un filo reciso',
  pratica: 'Individua un filo del Manichino (obbligo automatico) e reciderlo.',
  tec: ['t24']
}, {
  n: 26,
  blocco: 2,
  tema: 'Revisione · blocco II',
  pratica: 'Metà anno. Cosa si è aperto? Cosa non ha ancora mosso?',
  tec: []
},
// Blocco III — METAFORZA (27-39)
{
  n: 27,
  blocco: 3,
  tema: 'Trovare la Treccia',
  pratica: 'Mattina & sera, sposta l\'attenzione dietro le scapole. Nessuna impostazione ancora.',
  tec: ['t15']
}, {
  n: 28,
  blocco: 3,
  tema: 'Prima impostazione',
  pratica: 'Una volta al giorno, dalla Treccia, UNA frase al presente. Breve. Poi dimentica.',
  tec: ['t15', 't19']
}, {
  n: 29,
  blocco: 3,
  tema: 'Regola 1 — Presenza',
  pratica: 'Prima dell\'impostazione: sono qui? Se no, prima torna.',
  tec: ['t29', 't34']
}, {
  n: 30,
  blocco: 3,
  tema: 'Regola 2 — Impostare, non volere',
  pratica: 'Notare ogni «voglio» e trasformarlo.',
  tec: ['t16', 't29']
}, {
  n: 31,
  blocco: 3,
  tema: 'Regola 3 — Dalla Treccia',
  pratica: 'Ogni impostazione da dietro le scapole, non dalla testa.',
  tec: ['t15', 't29']
}, {
  n: 32,
  blocco: 3,
  tema: 'Regola 4 — Breve',
  pratica: 'Nessuna impostazione più lunga di 5 secondi. Se è lunga, è dubbio.',
  tec: ['t19', 't29']
}, {
  n: 33,
  blocco: 3,
  tema: 'Regola 5 — Leggero',
  pratica: 'Se spingi, stai di nuovo volendo. Leggerezza assoluta.',
  tec: ['t29']
}, {
  n: 34,
  blocco: 3,
  tema: 'Regola 6 — Triplice',
  pratica: 'Metodo dei tre conseguimenti. Tre formulazioni, non ripetizione.',
  tec: ['t21', 't29']
}, {
  n: 35,
  blocco: 3,
  tema: 'Regola 7 — Seguire',
  pratica: 'Dopo ogni impostazione, agisci sul primo corridoio che si apre.',
  tec: ['t23', 't29']
}, {
  n: 36,
  blocco: 3,
  tema: 'Regola 8 — Dimenticare',
  pratica: 'Non tirare a te il risultato col pensiero. Chiusura.',
  tec: ['t27', 't29']
}, {
  n: 37,
  blocco: 3,
  tema: 'Tecnica dei tre movimenti',
  pratica: 'Un obiettivo, tre scale: oggi / mese / anno.',
  tec: ['t22']
}, {
  n: 38,
  blocco: 3,
  tema: 'Itfat — postura regale',
  pratica: 'In situazioni di tentazione-d\'approvazione: postura di chi sa già.',
  tec: ['t31']
}, {
  n: 39,
  blocco: 3,
  tema: 'Revisione · blocco III',
  pratica: 'Le 8 regole: quale è più difficile? Quale più naturale?',
  tec: []
},
// Blocco IV — TRANSURFING DI SÉ (40-52)
{
  n: 40,
  blocco: 4,
  tema: 'Sé-attore',
  pratica: 'Osserva te stesso come attore che interpreta una scena. Un giorno intero.',
  tec: ['t30']
}, {
  n: 41,
  blocco: 4,
  tema: 'Sé-spettatore',
  pratica: 'Un giorno intero dal pubblico: guarda senza intervenire.',
  tec: ['t30']
}, {
  n: 42,
  blocco: 4,
  tema: 'Sé-regista',
  pratica: 'Scegli la scena successiva: cosa deve succedere? Impostala.',
  tec: ['t30', 't19']
}, {
  n: 43,
  blocco: 4,
  tema: 'Addormentarsi → Svegliarsi',
  pratica: 'Ogni volta che ti scopri in automatico: uso come pulsante.',
  tec: ['t32']
}, {
  n: 44,
  blocco: 4,
  tema: 'Missione — osservazione',
  pratica: 'Registra quando il tempo scompare. Non cerca — osserva.',
  tec: ['t28']
}, {
  n: 45,
  blocco: 4,
  tema: 'Missione — pattern',
  pratica: 'Rileggi le note della settimana. Cosa emerge?',
  tec: ['t28']
}, {
  n: 46,
  blocco: 4,
  tema: 'Realizzazione 1',
  pratica: 'In un\'azione decisiva: esegui senza interrogare.',
  tec: ['t26']
}, {
  n: 47,
  blocco: 4,
  tema: 'Realizzazione 2',
  pratica: 'Dopo un\'azione: chiudi. Non rianimare mentalmente.',
  tec: ['t27']
}, {
  n: 48,
  blocco: 4,
  tema: 'Pendolo residuale',
  pratica: 'Torna sul pendolo più forte. È ancora presente? Come?',
  tec: ['t02', 't03']
}, {
  n: 49,
  blocco: 4,
  tema: 'Intenzione di fine anno',
  pratica: 'Dalla Treccia, la prossima direzione. Non elenchi — una linea.',
  tec: ['t15', 't19', 't21']
}, {
  n: 50,
  blocco: 4,
  tema: 'Silenzio e presenza',
  pratica: 'Un giorno senza telefono né parlato. Schermo interno & esterno.',
  tec: ['t18']
}, {
  n: 51,
  blocco: 4,
  tema: 'Gratitudine come stato',
  pratica: 'Non elencare cose: essere grati come base della settimana.',
  tec: ['t08']
}, {
  n: 52,
  blocco: 4,
  tema: 'Revisione annuale',
  pratica: 'Rileggi diario completo. Cosa è diventato carne? Cosa resta parola?',
  tec: []
}];
// Descrizioni dettagliate per ogni settimana: obiettivo, pratica_quotidiana, misura, trappola
const DETTAGLI_SETTIMANE = {
  1: {
    obiettivo: 'Recuperare la coscienza che stai dentro un film.',
    pratica_quotidiana: 'Imposta 5 sveglie silenziose nel giorno. Ad ogni suono, fermati 3 secondi, nomina mentalmente la scena («sono in cucina, sto facendo X») e torna.',
    misura: 'Sera: quante volte su 5 hai davvero notato la scena? Scrivi il numero.',
    trappola: 'Confondere il ricordare con l\'autogiudizio. Se arriva il «dovrei essere più presente», l\'attenzione è ancora scappata. Solo: scena, corpo, respiro.'
  },
  2: {
    obiettivo: 'Riscoprire lo sguardo prima che diventi giudizio.',
    pratica_quotidiana: 'Tre finestre di 10 minuti al giorno (mattina, pomeriggio, sera) di sola osservazione: persone, oggetti, sensazioni. Nessuna azione interna, nessuna interpretazione.',
    misura: 'Annota alla fine del giorno: una scena osservata senza etichettare.',
    trappola: 'Spacciare commento per osservazione. Se nella testa c\'è «che bello», «che brutto», «avrebbe dovuto», stai commentando: torna a guardare.'
  },
  3: {
    obiettivo: 'Distinguere schermo interno (pensieri, immagini) da schermo esterno (ambiente reale).',
    pratica_quotidiana: 'Tre volte al giorno fermati e nomina: «Sto guardando lo schermo interno» o «Sto guardando lo schermo esterno». Nessuna correzione — solo riconoscimento.',
    misura: 'Quante volte al giorno sorprendi lo sguardo fisso nel vuoto mentre la testa monta una scena?',
    trappola: 'Voler «pulire» lo schermo interno. Non serve spegnerlo — serve sapere quale dei due stai guardando.'
  },
  4: {
    obiettivo: 'Rendere visibile almeno un pendolo che ti usa.',
    pratica_quotidiana: 'Ogni sera, 5 minuti con il diario: identifica UN pendolo della giornata (lavoro, famiglia, news, un gruppo) e descrivi l\'amo con cui ti ha agganciato.',
    misura: 'A fine settimana dovresti avere 7 voci con nome del pendolo + amo usato.',
    trappola: 'Trasformare l\'esercizio in accusa morale. I pendoli non sono cattivi — sono funzionali a sé stessi. Tu stai imparando a vederli, non a combatterli.'
  },
  5: {
    obiettivo: 'Smettere di alimentare un pendolo senza lottarci contro.',
    pratica_quotidiana: 'Scegli il pendolo più forte emerso in settimana 4. Per 7 giorni: nessuna reazione emotiva, nessuna discussione, nessuna condivisione. Risposte neutre, mono-sillabiche se serve.',
    misura: 'Al 4° giorno dovresti sentire una leggera caduta di carico. Se aumenta, stai ancora combattendo.',
    trappola: 'Rispondere con freddezza ostile: è ancora reazione. Obiettivo: indifferenza curiosa, non chiusura.'
  },
  6: {
    obiettivo: 'Abbassare il carico emotivo su una situazione chiave.',
    pratica_quotidiana: 'Identifica la situazione con più peso attuale. Scrivi 3 volte al giorno: «Va bene se accade A. Va bene se accade B.» Dillo fino a sentire che smette di mentire.',
    misura: 'La tensione nel petto/stomaco quando pensi a quella situazione si riduce di almeno il 30%.',
    trappola: 'Usare la formula come tecnica di rimozione. Non stai negando la preferenza — stai togliendo il perché-deve-andare-per-forza-così.'
  },
  7: {
    obiettivo: 'Costruire una scena-slide che puoi abitare, non solo descrivere.',
    pratica_quotidiana: 'Mattina e prima di dormire, 3 minuti: entra nella scena dell\'obiettivo raggiunto. Cosa vedi a sinistra? Odori? Temperatura? Chi è con te? Cosa stai facendo CON LE MANI?',
    misura: 'Dopo 4 giorni la scena ha dettagli sensoriali stabili (almeno 5).',
    trappola: 'Visualizzare come spettatore al cinema. Lo slide è dall\'interno, dal corpo che ci sta vivendo.'
  },
  8: {
    obiettivo: 'Rovesciare il riflesso del chiedere → dare per primo.',
    pratica_quotidiana: 'In ogni scambio di questa settimana, offri per primo: attenzione, ascolto, un complimento reale, un aiuto concreto. Prima di chiedere qualsiasi cosa.',
    misura: 'Fine settimana: conta le volte che ti sei accorto dell\'impulso «prima mi serve…» e hai ribaltato.',
    trappola: 'Dare con aspettativa di ricambio. Frejling non è investimento: è un modo di stare.'
  },
  9: {
    obiettivo: 'Trasformare gli imprevisti da ostacolo in tassello.',
    pratica_quotidiana: 'Di fronte a ogni imprevisto (ritardo, cambio, rifiuto), dì internamente: «Si incastra nel piano». Poi aspetta 24h prima di concludere se è stato negativo.',
    misura: 'A fine settimana, quanti degli imprevisti si sono rivelati utili o neutri entro 48h?',
    trappola: 'Farla diventare rassegnazione. Non «va tutto bene così com\'è» — «questa cosa ha un posto nell\'arrivo, anche se ora non lo vedo».'
  },
  10: {
    obiettivo: 'Scegliere e mantenere un tono di base che non ti faccia reagire.',
    pratica_quotidiana: 'Scegli UNO stato (calmo, deciso, caldo). Identifica le 3 situazioni della settimana che normalmente ti sbilanciano. Lì, mantieni quello stato — non il contenuto delle risposte.',
    misura: 'Nelle 3 situazioni chiave, sei uscito senza lasciare la forma?',
    trappola: 'Confondere mantenere la forma con recitare. Non finto-calmo — calmo davvero, perché la situazione non ha il peso che aveva.'
  },
  11: {
    obiettivo: 'Mettere uno stato interno al centro e osservare cosa risponde fuori.',
    pratica_quotidiana: 'Scegli UNO: gratitudine o sicurezza. Per 5 giorni, riportati a quello stato 10 volte al giorno (sveglie silenziose). Non quando ti va — sempre.',
    misura: 'Giorno 5: il mondo esterno ti offre almeno 2 conferme dello stato (gentilezza se gratitudine, rispetto se sicurezza).',
    trappola: 'Forzare lo stato. Non stai facendo finta: stai richiamando lo stato che già c\'è e lo stai abitando più a lungo.'
  },
  12: {
    obiettivo: 'Separare i tuoi obiettivi reali dagli obiettivi che i pendoli ti hanno venduto.',
    pratica_quotidiana: 'Scrivi 10 obiettivi. Per ognuno, rispondi a: «Lo vorrei ancora se nessuno lo sapesse mai?». Cerchia solo quelli che passano.',
    misura: 'Dovrebbero restare 3 (massimo 5). Se ne restano 8, hai ancora il piede dentro pendoli.',
    trappola: 'Rispondere quello che vorresti volere. La domanda-filtro è: funziona solo se sei onesto quando non guarda nessuno.'
  },
  13: {
    obiettivo: 'Chiudere il blocco I con una revisione che pesi ciò che è diventato pelle.',
    pratica_quotidiana: 'Un\'ora totale nella settimana: rileggi il diario delle prime 12 settimane. Per ogni settimana scrivi una riga: «Questo è entrato» / «Questo è ancora parola».',
    misura: 'Alla fine hai 2 liste e una decisione: quale settimana ripetere prima di andare avanti.',
    trappola: 'Correre al blocco II senza revisione. La pratica non ripetuta si dissolve in 3 mesi.'
  },
  14: {
    obiettivo: 'Ridurre il carico del sistema tecnogeno su corpo e attenzione.',
    pratica_quotidiana: 'Elimina 2 elementi (zucchero aggiunto, social dopo cena, TV prima di dormire, caffè al mattino — scegli due). Sostituiscili con: acqua, camminata, lettura, silenzio.',
    misura: 'Giorno 5: il sonno migliora e la testa è più pulita al risveglio.',
    trappola: 'Vedere la dieta come privazione. Lo stai facendo per liberare energia, non per punirti.'
  },
  15: {
    obiettivo: 'Portare cibo vivo nel sistema, senza rivoluzioni alimentari.',
    pratica_quotidiana: 'Un pasto al giorno è di crudo fresco: insalata ricca, frutta, frutta secca, verdure crude con olio buono. Mangialo lentamente, masticando.',
    misura: 'A fine settimana, la digestione di quel pasto è leggera e segue un\'onda di energia, non di sonno.',
    trappola: 'Pretendere di passare tutto crudo. Uno. Solo uno. Ma vero.'
  },
  16: {
    obiettivo: 'Uscire ogni giorno dall\'ambiente artificiale e rientrare nel ritmo naturale.',
    pratica_quotidiana: '30 minuti all\'aperto ogni giorno. Senza musica, senza podcast, senza telefono. Cammina, ascolta, guarda. Se piove, meglio: senti l\'acqua.',
    misura: 'Quante volte ti sei accorto di un dettaglio che non avevi mai notato nel tuo quartiere/percorso?',
    trappola: 'Trasformarlo in allenamento. Non è cardio — è ricucitura.'
  },
  17: {
    obiettivo: 'Fare spazio al silenzio assoluto, senza riempirlo con tecnica.',
    pratica_quotidiana: '20 minuti di silenzio al giorno: seduto, sdraiato, in macchina ferma. Niente meditazione guidata, niente musica ambient, niente app. Silenzio e basta.',
    misura: 'Al 4° giorno il silenzio smette di essere ansioso e diventa spazio.',
    trappola: 'Sostituire silenzio con lo-fi o suoni naturali. Il punto è proprio stare senza stimolo.'
  },
  18: {
    obiettivo: 'Rendere percepibile la Scintilla del Creatore come punto di riferimento.',
    pratica_quotidiana: '2 minuti, mattina e sera: sposta l\'attenzione al centro del petto. Non cercare nulla — solo stai lì. Se senti un puntino caldo, resta con quello.',
    misura: 'Al 5° giorno c\'è un\'orientazione spontanea verso il centro quando sei agitato.',
    trappola: 'Aspettarsi una luce o una visione. La Scintilla è percezione sottile di centro, non spettacolo.'
  },
  19: {
    obiettivo: 'Distinguere ogni sera cos\'è stato tuo e cos\'è stato rumore del pendolo.',
    pratica_quotidiana: '5 minuti ogni sera: ripercorri la giornata. Per ogni emozione forte chiedi: «Veniva da me o dal pendolo?». Segna sul diario con due simboli diversi.',
    misura: 'A fine settimana, la proporzione tra «mio» e «pendolo» dovrebbe sorprenderti.',
    trappola: 'Giudicare il risultato. Serve solo vederlo — il giudizio ri-aggancia.'
  },
  20: {
    obiettivo: 'Smettere di volere che qualcuno di vicino sia diverso.',
    pratica_quotidiana: 'Scegli UNA persona vicina. Per 7 giorni, internamente, dagli permesso di essere com\'è: «Ti do il permesso di essere X». Niente ristrutturazione, niente pedagogia.',
    misura: 'A fine settimana, il respiro in sua presenza è più lungo. Lei si rilassa senza saperne il motivo.',
    trappola: 'Farlo per farla cambiare. Se c\'è secondo fine, il permesso non è permesso.'
  },
  21: {
    obiettivo: 'Darti il permesso di essere come sei, senza campagna di miglioramento.',
    pratica_quotidiana: 'Mattina e sera, ad alta voce se possibile: «Mi do il permesso di essere X» (scegli una qualità che rifiuti in te). Osserva chi si agita dentro.',
    misura: 'Al 4° giorno scende il tono interno di auto-attacco. Si alza un po\' di tenerezza.',
    trappola: 'Scambiarlo per rinuncia a crescere. Permettersi non significa rassegnarsi — significa smettere di combattere a vuoto.'
  },
  22: {
    obiettivo: 'Scendere dal rifiuto come posizione identitaria.',
    pratica_quotidiana: 'Prendi UNA cosa/persona che rifiuti con forza. Per 7 giorni: accettala come dato di fatto. Nessuna approvazione — accettazione.',
    misura: 'Scende l\'energia spesa per il rifiuto. Se ne libera attenzione per altro.',
    trappola: 'Confondere accettare con condividere. Accetti che esista, non che sia giusto.'
  },
  23: {
    obiettivo: 'Impostare una direzione e seguire i segni del corridoio, non il piano.',
    pratica_quotidiana: 'Formula una direzione in una frase (non un dettaglio). Per 7 giorni: nota i segnali che la direzione offre e agisci sui primi due che si presentano.',
    misura: 'Al 5° giorno due coincidenze ti hanno aperto una porta che il piano non prevedeva.',
    trappola: 'Decidere in anticipo come deve aprirsi. Il corridoio si vede camminandolo.'
  },
  24: {
    obiettivo: 'Allenare la vista per le lucciole (piccole coincidenze significative).',
    pratica_quotidiana: 'Porta in tasca un taccuino. Ogni volta che una coincidenza ti salta all\'occhio (nome, numero, frase sentita due volte), scrivila. Senza interpretare.',
    misura: 'A fine settimana hai una lista di 7-15 lucciole, senza commento.',
    trappola: 'Cercare significati. Per ora le raccogli — il significato emerge dal pattern, mai dall\'analisi della singola.'
  },
  25: {
    obiettivo: 'Recidere un filo del Manichino — un obbligo automatico che non è mai stato scelto.',
    pratica_quotidiana: 'Identifica un «devo» che fai senza averlo mai deciso (telefonata di cortesia, ruolo familiare, apparenza sociale). Per 7 giorni: non lo fai. Osserva chi si lamenta.',
    misura: 'Al 3° giorno qualcuno nota. Al 7° giorno è già nuova normalità, o è tornato il filo — scegli consapevolmente.',
    trappola: 'Recidere per ribellione. Se tagli con rabbia, ricresce. Si taglia con leggerezza.'
  },
  26: {
    obiettivo: 'Metà anno. Vedere cosa si è mosso davvero e cosa è rimasto sul foglio.',
    pratica_quotidiana: 'Un\'ora totale nella settimana. Rileggi il diario dalle settimane 14 a 25. Scrivi: «Questo è carne», «Questo è parola», «Questo è rumore».',
    misura: 'Alla fine hai 3 liste e un disegno del territorio.',
    trappola: 'Bocciarti. Il blocco II è tosto — se metà è parola, è normale. Il blocco III ne riprende alcuni.'
  },
  27: {
    obiettivo: 'Localizzare la Treccia come zona percepibile dietro le scapole.',
    pratica_quotidiana: 'Mattina e sera, 2 minuti: sposta l\'attenzione dietro la schiena, sopra le scapole. Non fare nulla. Solo percepire che quella zona esiste.',
    misura: 'Al 4° giorno percepisci un leggero calore o densità lì.',
    trappola: 'Passare subito alle impostazioni. Ora si localizza soltanto — la Metaforza si costruisce su questa percezione.'
  },
  28: {
    obiettivo: 'Fare la prima impostazione dalla Treccia, breve e poi dimenticarla.',
    pratica_quotidiana: 'Una volta al giorno: attenzione alla Treccia. Da lì, UNA frase al presente indicativo (es: «Sono accolto nel mio lavoro»). Poi esci. Non la rievocare.',
    misura: 'Al 5° giorno notti i primi segnali — anche piccoli, anche laterali.',
    trappola: 'Tornarci con la mente durante il giorno. Non è affermazione ripetuta: è impostazione e dimenticare.'
  },
  29: {
    obiettivo: 'Non impostare mai da fuori di te. Prima si torna.',
    pratica_quotidiana: 'Prima di ogni impostazione: fermati, respira, chiedi «sono qui?». Se la risposta è no, prima si torna (3-5 respiri), poi si imposta.',
    misura: 'Ogni impostazione della settimana è preceduta da un «atterraggio» reale.',
    trappola: 'Saltare la verifica per fretta. L\'impostazione da testa disattenta rinforza il rumore.'
  },
  30: {
    obiettivo: 'Scollare ogni «voglio» e trasformarlo in impostazione.',
    pratica_quotidiana: 'Porta con te il diario. Ogni volta che ti accorgi di un «voglio», scrivi la frase. Poi riscrivila come impostazione presente: non «voglio X» → «sono Y».',
    misura: 'A fine settimana, 10-20 «voglio» tradotti.',
    trappola: 'Fare la traduzione velocemente per passare oltre. Tradurre è il lavoro — la traduzione nuova abita un punto diverso del corpo.'
  },
  31: {
    obiettivo: 'Ogni impostazione parte dalla Treccia, mai dalla testa.',
    pratica_quotidiana: 'Prima di impostare: attenzione dietro le scapole, poi la frase. Se ti accorgi che la frase è partita dalla testa, ricomincia.',
    misura: 'Al 5° giorno senti la differenza qualitativa tra le due.',
    trappola: 'Voler «convincere» l\'universo con una frase ben costruita. Dalla Treccia si dice, non si convince.'
  },
  32: {
    obiettivo: 'Se l\'impostazione è lunga, è dubbio. Andare al breve.',
    pratica_quotidiana: 'Tutte le impostazioni di questa settimana hanno max 5 secondi. Se ti viene più lunga, è segno che non ci credi. Ristringi fino a essenziale.',
    misura: 'Ogni impostazione, cronometrata, sta sotto i 5 secondi.',
    trappola: 'Comprimere artificialmente. Breve è risultato, non forzatura — se è lunga, è perché argomenti ancora.'
  },
  33: {
    obiettivo: 'Disimparare a spingere. Impostare leggero.',
    pratica_quotidiana: 'Prima di impostare, sorridi un pelo. Imposta come se fosse già. Se senti sforzo nella gola o nella fronte, stai volendo ancora.',
    misura: 'Le impostazioni di questa settimana lasciano il corpo più largo, non più teso.',
    trappola: 'Scambiare leggerezza con superficialità. Leggero = senza peso. Non = senza cura.'
  },
  34: {
    obiettivo: 'Triplicare la qualità dell\'impostazione, non ripeterla.',
    pratica_quotidiana: 'Per un obiettivo, formula 3 frasi diverse (stato, qualità, azione). Usa una al mattino, una a metà giornata, una la sera. Mai la stessa due volte.',
    misura: 'Alla fine della settimana hai 3 angolazioni distinte dello stesso obiettivo.',
    trappola: 'Ripetere con le stesse parole. La ripetizione meccanica è rumore.'
  },
  35: {
    obiettivo: 'Agire sul primo corridoio che si apre dopo l\'impostazione.',
    pratica_quotidiana: 'Per 7 giorni: dopo ogni impostazione, resta attento alle prossime 24h. Al primo segnale (email, incontro, pensiero persistente), agisci subito. Non aspettare il «momento giusto».',
    misura: 'Hai risposto almeno a 5 segnali con azione concreta entro 24h.',
    trappola: 'Aspettare il corridoio perfetto. Il primo basta.'
  },
  36: {
    obiettivo: 'Dimenticare dopo. Chiudere senza tirare mentalmente.',
    pratica_quotidiana: 'Dopo ogni impostazione: distrazione intenzionale. Passeggiata, musica, faccenda manuale. Se la mente torna lì, riportala al compito presente.',
    misura: 'Alla fine della settimana, il numero di volte che sei tornato mentalmente sugli obiettivi è almeno dimezzato.',
    trappola: 'Controllare se funziona. Ogni «sta arrivando?» è spingere dalla testa.'
  },
  37: {
    obiettivo: 'Collocare un obiettivo su tre scale temporali coerenti.',
    pratica_quotidiana: 'Scegli un obiettivo. Definisci: cosa faccio oggi (mossa minima), cosa è questo mese (capitolo), cosa è quest\'anno (arco). Tutto coerente.',
    misura: 'Alla fine della settimana, la mossa di oggi è stata fatta tutti i 7 giorni.',
    trappola: 'Pianificare bene e non muoversi oggi. La scala dell\'anno si regge sul gesto di oggi.'
  },
  38: {
    obiettivo: 'Itfat — postura di chi sa già, senza dover convincere nessuno.',
    pratica_quotidiana: 'Nelle situazioni dove solitamente cerchi approvazione: postura eretta, mento parallelo, mani rilassate, meno parole. Tu sai. Non lo dimostri.',
    misura: 'Alla fine della settimana, è scesa la quantità di parole dette in quelle situazioni.',
    trappola: 'Recitare il regale. Itfat non è altezzosità — è basta-non-cercare-approvazione.'
  },
  39: {
    obiettivo: 'Revisione del blocco III. Quale regola è in te? Quale resiste?',
    pratica_quotidiana: 'Nell\'arco della settimana, rileggi dai diari i giorni di ogni regola (27-38). Segna: verde (entrata), gialla (in corso), rossa (resiste).',
    misura: 'Hai un quadro visivo delle 8 regole e sai quale ripetere.',
    trappola: 'Voler essere tutto verde. Alcune regole richiedono un anno — non 7 giorni.'
  },
  40: {
    obiettivo: 'Vivere un giorno da Sé-attore, presente alla parte che stai recitando.',
    pratica_quotidiana: 'Scegli un giorno. Per 24h osserva ogni tua azione come un attore: «Sto facendo X nella scena Y, il mio ruolo ora è Z». Non giudicare il ruolo — nota che c\'è.',
    misura: 'Alla fine del giorno, hai identificato almeno 3 ruoli diversi che hai interpretato.',
    trappola: 'Cadere nel cinismo («è tutto finto»). No: stai vedendo che reciti, non che non sei nessuno.'
  },
  41: {
    obiettivo: 'Un giorno da Sé-spettatore. Guardare senza intervenire.',
    pratica_quotidiana: 'Scegli un giorno. Per 24h sposta la sedia dalla scena alla platea. Gli eventi succedono. Reagisci al minimo, agisci al minimo. Osserva.',
    misura: 'Al pomeriggio, è sceso il respiro. Qualcuno ti percepisce come presente ma non invadente.',
    trappola: 'Confonderla con passività depressa. Spettatore è attivo — sta guardando con attenzione, non sta spento.'
  },
  42: {
    obiettivo: 'Un giorno da Sé-regista. Scegliere la scena successiva.',
    pratica_quotidiana: 'Al mattino decidi UNA scena della giornata che dirigi tu (una conversazione, un\'ora di lavoro, una cena). Imposta. Poi la vivi come regista: tempo, tono, inquadratura.',
    misura: 'La scena è successa come l\'avevi impostata, in forma simile.',
    trappola: 'Voler dirigere tutta la giornata. Una scena, tutta intera, dirigi. Il resto, vivi.'
  },
  43: {
    obiettivo: 'Usare l\'«addormentamento» come pulsante di risveglio.',
    pratica_quotidiana: 'Ogni volta che ti scopri in automatico (scrolling, autopilota alla guida, a tavola senza gusto), dì mentalmente «eccolo» e ritorna per 3 respiri. Poi continua.',
    misura: 'Il numero di volte che ti accorgi di essere in automatico cresce ogni giorno.',
    trappola: 'Rimproverarti per l\'automatismo. Il punto è accorgersi, non non cadere.'
  },
  44: {
    obiettivo: 'Registrare senza cercare i momenti in cui il tempo scompare.',
    pratica_quotidiana: 'Porta un taccuino. Quando ti accorgi che sono passate ore senza fatica (attività assorbente), annota: cosa stavi facendo, con chi, dove.',
    misura: 'Alla fine della settimana hai 4-10 voci.',
    trappola: 'Interpretarle subito come «missione». Per ora si raccolgono — il pattern si vede tra 7 giorni.'
  },
  45: {
    obiettivo: 'Rileggere le registrazioni e far emergere il pattern.',
    pratica_quotidiana: 'Un\'ora nella settimana. Metti le voci della settimana 44 su un foglio. Cerchi ricorrenze: persone, tipi di attività, luoghi, ore del giorno.',
    misura: 'Emerge almeno un filo che unisce 3 voci.',
    trappola: 'Cercare una missione monumentale. A volte è: cucinare per altri. A volte: riparare oggetti. Piccolo e vero batte grande e retorico.'
  },
  46: {
    obiettivo: 'Realizzazione 1: agire senza interrogare, quando è il momento.',
    pratica_quotidiana: 'Quando una decisione è chiara, esegui immediatamente (massimo 2 minuti dal riconoscimento). Non rivedere pro-contro. La chiarezza è già la lista pro-contro.',
    misura: 'Almeno 3 azioni decisive della settimana sono state eseguite subito.',
    trappola: 'Spacciare impulsi per chiarezza. Chiarezza = silenzio dentro che indica. Impulso = agitazione che spinge. Differiscono.'
  },
  47: {
    obiettivo: 'Realizzazione 2: chiudere dopo aver agito.',
    pratica_quotidiana: 'Dopo un\'azione importante: chiudi la cartella. Niente «ho fatto bene?», niente «dovevo dire anche…». Se torna, torna a un\'azione manuale del presente.',
    misura: 'La quantità di rumination post-azione è almeno dimezzata.',
    trappola: 'Chiudere a forza. Se torna davvero e insistente, scrivi 3 righe sul diario e chiudi la pagina fisicamente.'
  },
  48: {
    obiettivo: 'Tornare sul pendolo principale di inizio anno. Quanto pesa ora?',
    pratica_quotidiana: 'Identifica il pendolo della settimana 4-5. Per 7 giorni: mettilo deliberatamente nella tua giornata. Osserva: risponde come prima o meno?',
    misura: 'Il carico è sceso almeno al 50% dell\'iniziale.',
    trappola: 'Scoprire che è invariato e scoraggiarti. Alcuni pendoli richiedono 2 anni. L\'importante è vedere il delta, non il finale.'
  },
  49: {
    obiettivo: 'Impostare la direzione per il prossimo anno dalla Treccia.',
    pratica_quotidiana: 'Una volta nella settimana, seduto, in silenzio. Attenzione alla Treccia. Una linea — non elenco — per il prossimo anno. Scrivila una volta. Basta.',
    misura: 'Hai una frase che ti fa stare più largo nel petto quando la rileggi.',
    trappola: 'Aggiornare e limare per giorni. La prima linea reale vale più di 20 linee ottimizzate.'
  },
  50: {
    obiettivo: 'Un giorno intero senza telefono e senza parola. Solo schermo interno e esterno.',
    pratica_quotidiana: 'Un giorno scelto. Dalla mattina alla sera: niente telefono (solo emergenze), niente parlato con altri. Se serve, scrivi su foglietti. Osserva cosa emerge.',
    misura: 'La sera percepisci i due schermi come distinti, senza sforzo.',
    trappola: 'Usarlo come ritiro spirituale solenne. No — giornata normale, senza i due dispositivi più usati.'
  },
  51: {
    obiettivo: 'Abitare la gratitudine come stato, non come pratica.',
    pratica_quotidiana: 'Niente lista, niente elenchi. Al mattino, 2 minuti, entra in gratitudine come atmosfera. Nella giornata, torna a quell\'atmosfera 4 volte.',
    misura: 'Al 5° giorno, incontri con altri hanno un tono diverso senza che tu faccia nulla.',
    trappola: 'Elencare (elencare è testa — stato è corpo). Se scivoli a elencare, chiudi gli occhi e richiama la sensazione.'
  },
  52: {
    obiettivo: 'Revisione annuale. Vedere il territorio attraversato.',
    pratica_quotidiana: '3 ore totali nella settimana. Rileggi tutto il diario delle 52 settimane. Scrivi un testo libero: «Cosa è diventato carne. Cosa resta parola. Cosa è nuovo.»',
    misura: 'Il testo è più lungo di quanto pensavi. La persona che lo scrive non è quella che ha iniziato.',
    trappola: 'Voler concludere con una sintesi definitiva. L\'anno è un passo — non il cammino. Chiudilo come si chiude un capitolo.'
  }
};
// Programma giorno per giorno — 7 passi per ogni settimana.
// Attinge al lessico operativo della community russa, tradotto in italiano:
// stop-secondo, intenzione mattutina, revisione serale, telecomando di stato,
// amalgama (soglia di saturazione di una pratica), slide abitato, diario delle transizioni,
// specchio, increspature sull'acqua (lucciole).
const GIORNI_SETTIMANE = {
  1: [
    { g: 1, t: 'Installare l\'ancora', d: '5 sveglie silenziose sul telefono a orari dispari (es. 9:47, 11:13, 14:22, 16:38, 19:09). Al suono: «sono nella scena X» e 3 respiri. Niente di più.' },
    { g: 2, t: 'Ancore fisiche', d: 'Scegli 3 gesti ricorrenti (bere, aprire una porta, sederti): ognuno diventa un stop-secondo. Nota dove sei, cosa tocchi, come respiri.' },
    { g: 3, t: 'Proof-of-presence', d: 'Ogni volta che passi da un\'attività all\'altra, 3 secondi di stop e nomina ad alta voce cosa stai per fare. Rompe il pilota automatico del Manichino.' },
    { g: 4, t: 'Sveglia casuale', d: 'Imposta timer ogni 90 minuti. Al segnale: dove è la mia attenzione? Se è sullo schermo interno (pensieri), torna all\'esterno (ambiente) per 20 secondi.' },
    { g: 5, t: 'Soglia amalgama', d: 'Al quinto giorno la presenza smette di essere un compito e diventa fondo. Se non è così, stai rincorrendo l\'idea di presenza — lascia cadere il concetto e resta col corpo.' },
    { g: 6, t: 'Revisione serale', d: '5 min prima di dormire: quante volte hai ricordato la scena oggi? Segna numero sul diario. Niente analisi — solo il numero grezzo.' },
    { g: 7, t: 'Sintesi del corpo', d: 'Senza rivedere il diario: chiudi gli occhi e richiama 3 scene di cui hai memoria sensoriale (luce, odore, temperatura). Queste sono entrate.' }
  ],
  2: [
    { g: 1, t: 'Osservazione passeggera', d: '10 minuti al mattino in un luogo comune (caffetteria, stazione). Registra solo dati: colori, suoni, gesti. Vietato aggettivare.' },
    { g: 2, t: 'Nominare senza etichetta', d: 'Ogni volta che senti un «che bello / che brutto», sostituiscilo con una descrizione fisica («luce calda che scende»). L\'aggettivo è giudizio; la descrizione è guardare.' },
    { g: 3, t: 'Finestra pomeriggio', d: 'Seconda finestra da 10 min a metà pomeriggio. Aggiungi l\'ascolto: conta i livelli sonori distinti che riesci a separare.' },
    { g: 4, t: 'Osservarsi osservare', d: 'Introduci il doppio sguardo: guardi la scena, e noti chi guarda. Non due tempi — un movimento unico, appena accennato.' },
    { g: 5, t: 'Finestra notturna', d: '10 minuti al buio, alla finestra. Lascia che l\'occhio si abitui. Osservi l\'invisibile emergere — è la frequenza-base di cui parla Transurfing III.' },
    { g: 6, t: 'Diario senza aggettivi', d: 'Scrivi un paragrafo sulla giornata senza usare aggettivi valutativi («bello», «noioso», «intenso»). Solo verbi, sostantivi, dati fisici. Rileggilo: è più vero?' },
    { g: 7, t: 'Prova dello specchio', d: 'Guarda una persona con cui hai tensione. Esercita l\'osservazione pura per 60 secondi. Se parte il commento, torna alla descrizione fisica. La tensione ha già mollato un grado.' }
  ],
  3: [
    { g: 1, t: 'Schermo interno mappato', d: 'Stampa una riga ogni ora per 6 ore: «interno» o «esterno». Niente altro. A fine giornata conta quante volte l\'attenzione era rivolta dove.' },
    { g: 2, t: 'Sguardo ancorato', d: 'Quando ti sorprendi con lo sguardo fisso nel vuoto, fissa invece un oggetto fisico (tazza, albero) e contalo in dettaglio: 5 caratteristiche. Atterri.' },
    { g: 3, t: 'Treno schermo interno', d: 'Per 20 min di viaggio (bus, treno, attesa), nota ogni volta che la mente monta una scena. Non la blocchi — solo annotazione mentale: «montaggio, montaggio, montaggio».' },
    { g: 4, t: 'Riga di confine', d: 'Immagina una linea verticale davanti ai tuoi occhi. Dietro = interno. Davanti = esterno. 3 volte al giorno, chiediti: «Dove sono ora?» e torna alla linea.' },
    { g: 5, t: 'Dialogo dei due schermi', d: 'Scrivi una conversazione tra i due schermi come dialogo teatrale (15 righe). «Interno dice: …». Quale dei due guida la tua giornata?' },
    { g: 6, t: 'Silenzio dello schermo interno', d: '10 min in cui, appena emerge un\'immagine interna, la congedi con un leggero sorriso. Non la combatti — la lasci passare. Lo schermo esterno resta limpido.' },
    { g: 7, t: 'Sintesi', d: 'Scrivi una riga: «Oggi ho guardato di più lo schermo ___». La risposta onesta è il dato su cui poggia la settimana prossima.' }
  ],
  4: [
    { g: 1, t: 'Mappa delle gravità', d: 'Disegna 6 cerchi sul diario: lavoro, famiglia, news, social, un gruppo, denaro. Oggi nota solo dove la tua attenzione cade di più. Niente giudizio.' },
    { g: 2, t: 'Il primo amo', d: 'Identifica UN pendolo concreto della giornata e scrivi l\'amo: «indignazione», «paura di perdere», «identificazione di gruppo», «senso di colpa». La parola esatta basta.' },
    { g: 3, t: 'Due amos', d: 'Oggi nominane due. Nota che possono essere lo stesso pendolo che tira da due angoli (es. lavoro → paura di perdere + senso di colpa).' },
    { g: 4, t: 'Pendolo fisico', d: 'Dove lo senti nel corpo? Stomaco? Gola? Petto? Scrivilo. I pendoli non sono astratti — prendono territorio corporeo.' },
    { g: 5, t: 'Lexicon del pendolo', d: 'Ogni pendolo ha un suo vocabolario ricorrente («dovresti», «tutti lo fanno», «è importante»). Scrivi 5 frasi-tipo che oggi ti sono arrivate. Da chi?' },
    { g: 6, t: 'Foto-pendolo', d: 'Fai «foto mentali» del tuo feed social/news per 10 min. Quali ami si ripetono? I pendoli digitali hanno pattern micro-ritmici molto chiari.' },
    { g: 7, t: 'Lista dei sette', d: 'A fine settimana: 7 pendoli nominati, 7 ami catalogati. Non devi scegliere — solo avere il censimento davanti.' }
  ],
  5: [
    { g: 1, t: 'Scelta del bersaglio', d: 'Dei 7 pendoli della settimana 4, scegli il più pesante. Scrivi il suo nome in alto sul diario, cerchialo. È il solo su cui lavori 7 giorni.' },
    { g: 2, t: 'Non-risposta', d: 'Oggi, ogni volta che il pendolo-bersaglio ti aggancia: silenzio esterno + respiro lento. Niente argomenti, niente post, niente sfogo. Osserva il disagio salire e scendere.' },
    { g: 3, t: 'Segnale debole', d: 'Il pendolo aumenta la pressione (è la fase tipica: «non mi ascolti più, ora grido»). Non abbocchi. Rispondi con una frase neutra mono-sillabica se serve.' },
    { g: 4, t: 'Test dell\'opposto', d: 'Nota se stai rispondendo con freddezza ostile — è ancora reazione, solo inversa. Obiettivo: indifferenza curiosa, non chiusura.' },
    { g: 5, t: 'Caduta amalgama', d: 'Al 4°-5° giorno deve arrivare una leggera caduta di carico. Se senti ancora forte attivazione, stai combattendo. Torna alla non-risposta neutra.' },
    { g: 6, t: 'Vuoto che libera energia', d: 'L\'energia che prima il pendolo consumava ora è disponibile. Notalo: più chiarezza, più ore di sonno, più calma. Non rinvestirla nello stesso pendolo.' },
    { g: 7, t: 'Consuntivo del filo', d: 'Il filo è reciso o solo allentato? Scrivi onesto. Se allentato, è già molto — i pendoli forti richiedono ripetizione.' }
  ],
  6: [
    { g: 1, t: 'Diagnosi del peso', d: 'Scegli la situazione con più carico emotivo attuale. Scrivi in alto: «Questa è la situazione-pressione». Poi sotto: dove nel corpo la senti? Ancoraggio fisico.' },
    { g: 2, t: 'Prima dose', d: '3 volte oggi (mattina, dopo-pranzo, sera) ad alta voce: «Va bene se accade A. Va bene se accade B.» Sotto voce se sei in pubblico. Ma sempre 3 volte.' },
    { g: 3, t: 'La formula mente', d: 'La prima volta che dici «va bene» senti la formula mentire. Nota dove: stringere nella gola? Sorriso rigido? Lì è il punto dove il pendolo non vuole mollare.' },
    { g: 4, t: 'Riformulare in 3 versioni', d: 'Prova: «va bene se non arriva mai», «va bene se arriva tra due anni», «va bene anche nella forma sbagliata». Trova la versione che ti fa respirare, non quella corretta.' },
    { g: 5, t: 'Soglia -30%', d: 'Quando pensi alla situazione oggi, la tensione nel petto/stomaco è almeno un terzo più bassa? Se sì, la formula è entrata. Se no, ripeti con l\'angolo di giorno 4.' },
    { g: 6, t: 'Dall\'importanza all\'interesse', d: 'Riformula: «Sono curioso di vedere come si compone». Non «deve andare così». La curiosità è la frequenza dove l\'importanza non può più reggere.' },
    { g: 7, t: 'Test cieco', d: 'Chiudi gli occhi e porta la situazione davanti alla mente. Quanto è pesante? Annota su scala 1-10. Confronta con lunedì. Il delta è il tuo risultato.' }
  ],
  7: [
    { g: 1, t: 'Scena embrionale', d: '3 min al mattino. Entra nella scena dell\'obiettivo-raggiunto. Senza pretesa di vividezza. Nota solo: dove sei? Quanta luce? Che ora è?' },
    { g: 2, t: 'Catalogo sensoriale', d: 'Oggi aggiungi un senso: odori. Cosa senti in quella scena? Cucina? Aria aperta? Profumo? Se non emerge, resta col vuoto — tornerà.' },
    { g: 3, t: 'Con chi', d: 'Chi è in quella scena con te? Se nessuno: va bene. Se qualcuno: non un volto generico — una persona specifica, anche se è ancora sconosciuta.' },
    { g: 4, t: 'Le mani', d: 'Questa è la chiave: cosa fanno le tue mani nella scena? Scrivono? Toccano? Stanno ferme? La scena vera si riconosce perché le mani sanno cosa fanno.' },
    { g: 5, t: 'Slide abitato 10 min', d: 'Seduto 10 minuti, occhi chiusi. Non visualizzazione — entri nella scena e la abiti. Vivi. Se la mente commenta («non sta funzionando»), nota e torna alle mani.' },
    { g: 6, t: 'Prova da dentro', d: 'Dopo lo slide abitato, passeggia 5 min come chi è uscito dalla scena dell\'obiettivo. Nota la postura, lo sguardo. Il corpo la ricorda.' },
    { g: 7, t: 'Scena stabile', d: 'Domenica sera: la scena ha 5+ dettagli sensoriali stabili? Se sì, è tua. Se no, ripeti la settimana — non è fallimento, è ritmo.' }
  ],
  8: [
    { g: 1, t: 'Auto-censimento del chiedere', d: 'Oggi nota ogni volta che stai per chiedere qualcosa prima di aver dato. Anche piccolo (attenzione, un favore, un sì). Non cambi ancora — osservi.' },
    { g: 2, t: 'Dare attenzione piena', d: 'Una conversazione a testa alta, senza telefono in mano, sguardo negli occhi per almeno 2 minuti. Notare chi si rilassa.' },
    { g: 3, t: 'Complimento reale', d: 'A una persona oggi: un complimento specifico e vero, non generico. Poi vai. Non richiami un ricambio.' },
    { g: 4, t: 'Aiuto non richiesto', d: 'Un aiuto concreto offerto senza essere stato chiesto, sproporzionato al contesto («ti porto i sacchi», «ti passo questo contatto»). Nota il proprio impulso di «ci guadagno qualcosa?» e lascialo cadere.' },
    { g: 5, t: 'Frailing deluxe', d: 'Offri qualcosa in una relazione dove normalmente pretendi. Il corpo protesta («ma io merito…»). Proprio lì si apre il Frailing: l\'attenzione rivolta al bisogno dell\'altro disarma la tua pretesa e muove la linea di vita.' },
    { g: 6, t: 'Monitorare il ribaltone', d: 'Quante volte oggi hai colto l\'impulso «prima mi serve…» e hai offerto invece? Scrivilo. È il dato tecnico.' },
    { g: 7, t: 'Senza contabilità', d: 'Se alla fine della settimana senti che «dovrebbe tornarti qualcosa», hai fatto investimento, non Frejling. Riparti. Il vero Frejling non tiene libri mastri.' }
  ],
  9: [
    { g: 1, t: 'Imprevisto primo', d: 'Al primo imprevisto di oggi, ad alta voce o nel diario: «Si incastra nel piano». Nient\'altro. Non sforzi interpretazione.' },
    { g: 2, t: 'Attesa 24h', d: 'Ogni imprevisto di oggi: aspetti 24h prima di concludere se è stato negativo. Ti impegni con te stesso per iscritto.' },
    { g: 3, t: 'Ritardo dell\'altro', d: 'Qualcuno è in ritardo, cambia, rifiuta. Provi la formula. Il corpo fa resistenza? Dove? Quello è il pendolo-colla.' },
    { g: 4, t: 'Reframe 48h', d: 'Gli imprevisti di lunedì: come si sono composti? Uno era utile? Uno neutro? Uno davvero dannoso? Quasi sempre il «davvero dannoso» si riduce.' },
    { g: 5, t: 'Corridoio inedito', d: 'Apparirà oggi una porta che il tuo piano non prevedeva (incontro, email, idea). Se la noti: l\'imprevisto sta già lavorando per te.' },
    { g: 6, t: 'Non è rassegnazione', d: 'Controlla: stai dicendo «si incastra» con spalle cadute («tanto non posso far niente»)? Quella è rassegnazione. Ripeti con spalle aperte.' },
    { g: 7, t: 'Conteggio finale', d: 'Su 7 imprevisti, quanti si sono rivelati utili o neutri entro 48h? Scrivi il numero. È il tuo nuovo rapporto col caos.' }
  ],
  10: [
    { g: 1, t: 'Scelta del tono', d: 'Scegli UN tono per la settimana: calmo, deciso, caldo. Scrivilo in cima al diario. Non due — uno.' },
    { g: 2, t: 'Mappa delle 3 situazioni', d: 'Identifica le 3 situazioni della settimana che normalmente ti sbilanciano (riunione, telefonata famiglia, sera). Solo lì applichi la forma.' },
    { g: 3, t: 'Prova leggera', d: 'Oggi la situazione più facile delle 3. Entra col tono scelto. Il contenuto cambia: rispondi dal tono, non dallo schema di reazione.' },
    { g: 4, t: 'Prova media', d: 'Seconda situazione. Quando senti che il tono sta per rompersi, pausa di 3 respiri. Poi riprendi dal tono — non dalla reazione.' },
    { g: 5, t: 'Prova difficile', d: 'Terza situazione, la più calda. Tieni il tono anche se dentro urli. Uscito fuori, nota: sei ancora stanco come altre volte?' },
    { g: 6, t: 'Specchio a doppio strato', d: 'Chi ti sta intorno reagisce al tono? I toni stabili ricalibrano gli altri — lo specchio duale di cui parla Transurfing V.' },
    { g: 7, t: 'Verdetto onesto', d: 'Il tono era recitato o reale? Recitato: non fallisce, è un primo passo. Reale: si è visto che la situazione non pesava più come prima.' }
  ],
  11: [
    { g: 1, t: 'Stato unico', d: 'Scegli: gratitudine oppure sicurezza. Uno. Scrivilo in cima al diario come riferimento.' },
    { g: 2, t: 'Dieci richiami', d: '10 sveglie silenziose oggi. Ad ogni segnale, richiami lo stato per 30 secondi. Non lo costruisci — lo ricordi.' },
    { g: 3, t: 'Stato con fastidio', d: 'Richiami lo stato anche quando la situazione è contraria (traffico, ritardo, qualcuno di molesto). Lo stato non è reazione alle condizioni — è scelta nonostante.' },
    { g: 4, t: 'Soglia di risposta', d: 'Amalgama iniziata. Il mondo comincia a offrirti piccole conferme: uno sconosciuto ti sorride, una persona-difficile si ammorbidisce. Senza che tu faccia altro.' },
    { g: 5, t: 'Specchio attivo', d: 'Quinto giorno: 2 conferme significative. Se ne arriva solo una, lo stato è intermittente. Se zero, stai richiamandolo dalla testa, non dal corpo.' },
    { g: 6, t: 'Stato sotto stress', d: 'Una situazione oggi andrà storta. Lì lo stato vacilla. Non te ne fai colpa — appena lo noti, richiami. Lo specchio reagisce al ritorno, non al non-deragliamento.' },
    { g: 7, t: 'Amalgama piena', d: 'Quanto respiro dura ora lo stato senza richiamo attivo? Se 10-15 minuti: bene. Se 1 ora: molto bene. Il mondo ti riflette lo stato dominante.' }
  ],
  12: [
    { g: 1, t: 'Brainstorm onesto', d: 'Scrivi 10 obiettivi. Senza filtrare. Senza ordinarli. Quello che ti viene. Anche «comprare una moto», anche «avere ragione con papà».' },
    { g: 2, t: 'Test della solitudine', d: 'Per ognuno: «Lo vorrei ancora se nessuno lo sapesse mai?». Solo i sì onesti passano. I ni vanno tagliati senza compiacenza.' },
    { g: 3, t: 'Verifica del corpo', d: 'Per i superstiti: dove li senti nel corpo? Petto largo = tuo. Stomaco stretto = ancora pendolo. Il corpo non mente.' },
    { g: 4, t: 'Test della rinuncia', d: 'Per ognuno: «Se mi dicessero che posso averne solo 3, questo sarebbe tra i 3?». Il filtro della scarsità rivela le priorità reali.' },
    { g: 5, t: 'Test delle Porte', d: 'Ogni obiettivo è una cima (destinazione reale) o una porta (passaggio che pendolo spaccia per cima)? Scrivi accanto: «cima» o «porta».' },
    { g: 6, t: 'Resta 3-5', d: 'Se a questo punto restano più di 5, sei stato compiacente. Il canone Transurfing è chiaro: le cime vere, per una persona, sono 3 massimo 5.' },
    { g: 7, t: 'La frase-seme', d: 'Per ognuna delle 3-5 cime, scrivi UNA frase. Presente indicativo. Breve. È il seme per il blocco III.' }
  ],
  13: [
    { g: 1, t: 'Leggere il diario 1-4', d: 'Rileggi le prime 4 settimane. Per ognuna, una riga: «Questo è entrato» oppure «Questo è ancora parola».' },
    { g: 2, t: 'Leggere 5-8', d: 'Stessa operazione, settimane 5-8. Occhio ai pendoli: li riconosci ancora con gli stessi nomi o sono diventati sfondo?' },
    { g: 3, t: 'Leggere 9-12', d: 'Settimane 9-12. Quale pratica è diventata quotidiana senza sforzo? Quella è entrata davvero.' },
    { g: 4, t: 'Le due liste', d: 'Compila: lista «carne» (entrata) e lista «parola» (letta ma non incorporata). Onestà radicale — il blocco I regge solo su questa distinzione.' },
    { g: 5, t: 'La settimana da ripetere', d: 'Dalla lista «parola», scegli UNA settimana da ripetere prima di passare al blocco II. La più venduta, non la più mancata.' },
    { g: 6, t: 'Ripetizione compatta', d: 'Fai la settimana scelta in forma compressa: 3 giorni invece di 7, ma con intensità. Non è rifare — è radicare.' },
    { g: 7, t: 'Porta del blocco II', d: 'Leggi l\'introduzione del blocco II (settimana 14). Nota se il corpo risponde («sì») o resiste («ancora no»). In entrambi i casi, la risposta è informazione.' }
  ],
  14: [
    { g: 1, t: 'Inventario del tecnogeno', d: 'Elenco di ciò che consumi quotidianamente: zucchero, caffè, alcol, social, TV, giochi, news-feed. Non giudicare — censire.' },
    { g: 2, t: 'Scelta dei due', d: 'Dall\'inventario, scegli 2 elementi da eliminare. Non i più simbolici — i più drenanti energeticamente. Scrivi accanto: perché questi.' },
    { g: 3, t: 'Primo giorno vuoto', d: 'Primo giorno senza i due. L\'assenza si sente. Non riempire con un sostituto tecnogeno. Sostituisci con: acqua, camminata, silenzio.' },
    { g: 4, t: 'Crisi del secondo', d: 'Il terzo-quarto giorno è quando il sistema protesta. Cefalea, nervosismo, voglia compulsiva. È fisiologia — dura 48h, poi scende.' },
    { g: 5, t: 'Soglia energia libera', d: 'Al quinto giorno, un\'ora in più di lucidità. Il sonno è più profondo. Il risveglio non è più annebbiato. È l\'energia che prima i due rubavano.' },
    { g: 6, t: 'Capitalizzare l\'energia', d: 'Oggi usa quell\'ora in più per qualcosa di vivo: scrittura, contatto umano, progetto bloccato. Non per altro tecnogeno.' },
    { g: 7, t: 'Patto settimanale', d: 'I due elementi restano fuori o rientrano? Se rientrano: in che dose minima? Non devi diventare asceta — devi sapere cosa paga cosa.' }
  ],
  15: [
    { g: 1, t: 'Scelta del pasto vivo', d: 'Scegli UN pasto ogni giorno che sarà vivo (crudo, fresco, masticabile). Non i 3 — uno. Solitamente il pranzo funziona.' },
    { g: 2, t: 'Composizione', d: 'Verdure crude + olio buono + frutta secca + semi. Non diet food — abbondante, colorato, soddisfacente. Se hai fame dopo, hai mangiato poco.' },
    { g: 3, t: 'Masticare lento', d: 'Oggi mastica ogni boccone 20 volte. Diventa meditazione. Il corpo registra il cibo vivo diversamente: non sonnolenza postprandiale.' },
    { g: 4, t: 'Onda dopo il pasto', d: 'Nota nell\'ora successiva: energia che sale invece di sonno? È la firma del cibo vivo. Se non arriva, il pasto era troppo carico di altro.' },
    { g: 5, t: 'Digestione leggera', d: 'Al quinto pasto, la digestione è invisibile — non la noti. Questo è il segnale che il sistema sta calibrando sulla nuova frequenza alimentare.' },
    { g: 6, t: 'Senza rivoluzionare il resto', d: 'Non passare tutto a crudo. Un solo pasto, vero, è più utile di tre pasti sperimentali con senso di sacrificio.' },
    { g: 7, t: 'Decisione sostenibile', d: 'Il pasto vivo si è inserito senza drammi? Tienitelo. È una delle pratiche che Zeland sostiene essere sufficienti a rialzare significativamente la frequenza energetica di base.' }
  ],
  16: [
    { g: 1, t: 'Fuori senza scudi', d: '30 min all\'aperto. Niente cuffie, niente telefono, niente podcast. Se piove, meglio — senti l\'acqua. La natura tecnogena ti voleva coperto.' },
    { g: 2, t: 'Sentiero noto', d: 'Il tuo percorso quotidiano, ma osservandolo come se fosse nuovo. Quanti dettagli non avevi mai notato? Un portone, un albero, una crepa.' },
    { g: 3, t: 'Passo naturale', d: 'Lascia che il passo trovi il suo ritmo — né fitness né lento-forzato. Cammini dalla respirazione, non dal pensiero.' },
    { g: 4, t: 'Orecchio aperto', d: 'Oggi focalizza l\'udito. Conta 5 suoni distinti (uccelli, motori, voci, acqua, foglie). L\'ambiente tecnogeno restringeva l\'udito: lo stai riaprendo.' },
    { g: 5, t: 'Soglia di dettaglio', d: 'Al quinto giorno, la passeggiata si sente diversa. Il corpo la cerca. Se non accade, stai ancora trattandola come allenamento — è ricucitura.' },
    { g: 6, t: 'Vento sulla pelle', d: 'Un pezzo del percorso con manica corta o senza cappello (se possibile). Il vento che tocca la pelle è frequenza: ti ricorda che sei animale.' },
    { g: 7, t: 'Decisione di ritmo', d: 'Stabilisci l\'ora del giorno in cui vale la pena fissare questa pratica per i prossimi mesi. Non «quando ho tempo» — ora fissa, ritmo fisso.' }
  ],
  17: [
    { g: 1, t: 'Prima sessione', d: '20 minuti di silenzio. Niente app guidate, niente ambient. Seduto, sdraiato, in macchina ferma. Il silenzio all\'inizio fa rumore (la mente protesta).' },
    { g: 2, t: 'Il rumore mentale sale', d: 'Oggi la mente è più rumorosa perché senza stimoli esterni. Nota — non combatti. Lasci passare i pensieri come nuvole.' },
    { g: 3, t: 'Pausa dei suoni', d: 'Tra un pensiero e l\'altro c\'è una pausa. Minima. Oggi prova a notarla — un quarto di secondo. È lì la porta.' },
    { g: 4, t: 'Silenzio fisico', d: 'Il silenzio non è solo assenza di suono — è rilassamento di mandibola, spalle, viso. Oggi sposta l\'attenzione al corpo mentre sei in silenzio.' },
    { g: 5, t: 'Il silenzio diventa spazio', d: 'Quinto giorno: il silenzio smette di essere ansioso. Diventa spazio dove qualcosa si ascolta. È la condizione del «fruscio delle stelle del mattino».' },
    { g: 6, t: 'Silenzio con gli occhi aperti', d: 'Prova il silenzio con gli occhi aperti, lo sguardo semi-sfocato. Più difficile, ma trasferibile nella giornata: ogni momento può diventare silenzio.' },
    { g: 7, t: 'Ritmo di mantenimento', d: 'Fissa la fascia oraria del silenzio per il resto della sfida. Sempre stessa ora. Il sistema nervoso si orienta sui ritmi più che sulla quantità.' }
  ],
  18: [
    { g: 1, t: 'Punto del petto', d: '2 min al mattino: attenzione al centro del petto, sotto lo sterno. Non cercare nulla. Sta lì. Il punto non va creato.' },
    { g: 2, t: 'Calore sottile', d: 'Se senti un punto caldo, resta con quello. Non amplificarlo, non analizzarlo. Se non senti nulla: va bene — il punto c\'è comunque.' },
    { g: 3, t: 'Richiamo in giornata', d: 'Oggi, in 3 momenti casuali, ritorna al centro del petto per 10 secondi. Senza chiudere gli occhi. Sta lì mentre fai altro.' },
    { g: 4, t: 'Orientazione di emergenza', d: 'In un momento di agitazione oggi, prova a spostarti al centro del petto. Non per calmarti — per stare da un altro punto.' },
    { g: 5, t: 'Soglia di riconoscimento', d: 'Al quinto giorno, quando sei agitato, l\'attenzione si orienta da sola al centro — senza comando. È il segno che la Scintilla ha trovato spazio.' },
    { g: 6, t: 'Da spettatore a punto', d: 'La Scintilla non è visione — è punto-da-cui-vedi. Oggi: ogni cosa che osservi, osservala dal centro del petto invece che dalla testa.' },
    { g: 7, t: 'Riferimento stabile', d: 'La Scintilla diventa il tuo riferimento per le settimane successive. È da lì che si imposta, si distingue, si imbandiera la direzione — non dalla testa.' }
  ],
  19: [
    { g: 1, t: 'Censimento emotivo', d: '5 min alla sera. Ricorda 3 emozioni forti della giornata. Per ognuna: da dove veniva — tua o del pendolo?' },
    { g: 2, t: 'Due simboli', d: 'Usa due simboli diversi sul diario: ⚫ per «mio», ⬛ per «pendolo». Oggi marca ogni emozione con uno dei due. Nessun commento.' },
    { g: 3, t: 'Emozioni secondarie', d: 'Le emozioni più sottili sono spesso le più pendolari (leggero fastidio, piccola invidia). Oggi caccia quelle.' },
    { g: 4, t: 'Firma del pendolo', d: 'Ogni pendolo ha una firma emotiva (paura di perdere, indignazione, identificazione, invidia). Quale firma si ripete di più nel tuo diario?' },
    { g: 5, t: 'Soglia di sorpresa', d: 'Se la proporzione «mio/pendolo» non ti sorprende, stai ancora giudicando. Riparti senza schemi — conta solo la sensazione quando scrivi.' },
    { g: 6, t: 'Il giudizio ri-aggancia', d: 'Se dopo il censimento ti accusi («troppo pendolo»), sei già di nuovo nel pendolo dell\'auto-giudizio. Noti — chiudi — torna.' },
    { g: 7, t: 'Mappa a fine settimana', d: 'Conta i simboli. Non per punirsi — per sapere. La proporzione è il dato di partenza. Il blocco III lavora esattamente su questo.' }
  ],
  20: [
    { g: 1, t: 'Scelta della persona', d: 'Una persona vicina che ti fa resistere spesso. Non la più amata, non la più odiata — quella con cui c\'è attrito cronico leggero.' },
    { g: 2, t: 'Formula interna', d: 'Mentalmente, non esterno: «Ti do il permesso di essere X» (la qualità che rifiuti). Niente spiegazioni a lei, niente pedagogia.' },
    { g: 3, t: 'Verifica del fondo', d: 'Stai cercando un cambiamento in lei? Se sì, non è permesso. È strategia con secondo fine. Riparti pulito.' },
    { g: 4, t: 'Respiro in sua presenza', d: 'Oggi nota come respiri in sua presenza. Più corto del solito? Ogni volta che lo noti, allunghi il respiro senza dirlo.' },
    { g: 5, t: 'Amalgama relazionale', d: 'Al quinto giorno, lei risponde diversamente. Si rilassa senza sapere perché. Forse è più affettuosa, forse più silenziosa — la qualità è cambiata.' },
    { g: 6, t: 'Permesso attivato', d: 'Quando lei esegue l\'azione che prima ti irritava, oggi dentro di te c\'è: «eccola, è lei». Non subito fastidio. È il segnale che il permesso è entrato.' },
    { g: 7, t: 'Senza rinuncia identitaria', d: 'Il permesso non significa accettare tutto. Puoi dire «no» alle richieste — mantenendo il permesso che esista come è. Differenza sottile ma cruciale.' }
  ],
  21: [
    { g: 1, t: 'Il personaggio rifiutato', d: 'Scegli UNA qualità di te che combatti sempre (pigro, sensibile, esitante, ossessivo). Scrivila al centro del diario.' },
    { g: 2, t: 'Formula vocale', d: 'Mattina e sera, ad alta voce se solo: «Mi do il permesso di essere X». Nota chi si agita dentro — è la voce della Ragione che protesta.' },
    { g: 3, t: 'Difesa del pendolo', d: 'Il giorno dopo scrivi tutte le obiezioni interne («ma se non mi miglioro…», «ma così resto così»). Non le confuti — le osservi.' },
    { g: 4, t: 'Tenerezza minima', d: 'Quarto giorno: scende l\'auto-attacco. Monta un filo di tenerezza. Nota dove nel corpo — spesso nella gola o dietro gli occhi.' },
    { g: 5, t: 'Riallineamento Anima-Ragione', d: 'Al quinto giorno la lotta interna è più quieta. È il riallineamento g43 (Anima-Ragione): condizione per la Metaforza del blocco III.' },
    { g: 6, t: 'Permettersi non è arrendersi', d: 'Test: puoi ancora migliorare X se scegli di farlo? Sì. La differenza: non combatti la qualità — scegli di svolgerla diversamente.' },
    { g: 7, t: 'Respirare nel proprio', d: 'Fine settimana: quanta energia consumavi a combattere questa qualità? Ora è liberata. Nota in che direzione vuole andare — lasciala andare lì.' }
  ],
  22: [
    { g: 1, t: 'Il rifiuto-bandiera', d: 'Individua una cosa/persona che rifiuti con forza identitaria («io NON sono quello», «io NON sopporto»). Scrivila cerchiata.' },
    { g: 2, t: 'Accettare come dato', d: 'Oggi: «Esiste. È così». Non «è giusto» — «è dato di fatto». La distinzione è precisa: accettazione ≠ approvazione.' },
    { g: 3, t: 'Energia del rifiuto', d: 'Quanta energia spendi ogni giorno per rifiutarla? Quantifica in minuti di pensiero. Probabilmente ore.' },
    { g: 4, t: 'Finestra di curiosità', d: '10 min di curiosità verso ciò che rifiuti — non per cambiare opinione, per capire come funziona. Spesso il rifiuto è terrore del simile.' },
    { g: 5, t: 'Pendolo del rifiuto', d: 'Il rifiuto è identificazione-a-rovescio: il pendolo della contro-opinione. Lo stai nominando come pendolo, non come virtù.' },
    { g: 6, t: 'Energia liberata', d: 'L\'attenzione che tornavi a spendere sul rifiuto, oggi la lasci andare altrove. Nota su cosa va — è informazione sui tuoi veri interessi.' },
    { g: 7, t: 'Senza convertirti', d: 'Non sei diventato sostenitore. Sei diventato osservatore. La distinzione è sanità: non devi abbracciare nulla — devi smettere di armarti.' }
  ],
  23: [
    { g: 1, t: 'Direzione in una frase', d: 'Scrivi la direzione in UNA frase. Non un dettaglio («ottenere il posto X»), una direzione («muovermi verso lavoro che rispetta il mio tempo»).' },
    { g: 2, t: 'Primo segnale', d: 'Oggi un segnale arriva (email, incontro, idea persistente). Piccolo. Lo noti. Non fai nulla ancora — lo annoti sul diario.' },
    { g: 3, t: 'Agire sul segnale 1', d: 'Ieri hai notato. Oggi agisci sul primo segnale. Entro 2 ore dal riconoscimento, mossa minima: un\'email, una telefonata, una decisione.' },
    { g: 4, t: 'Secondo segnale', d: 'Oggi un secondo segnale. Forse collegato, forse no. Il corridoio si sta tracciando dai primi due: rispondi anche a questo.' },
    { g: 5, t: 'Porta inedita', d: 'Al quinto giorno si apre una porta che il piano non prevedeva. Se non arriva, non significa che non funziona — il corridoio può essere più lento.' },
    { g: 6, t: 'Non decidere dall\'alto', d: 'Oggi la tentazione: «forse dovrei pianificare meglio». No. Il corridoio si vede camminandolo — il piano lo chiude.' },
    { g: 7, t: 'Mappa a posteriori', d: 'Guarda indietro: i passi di questa settimana hanno senso dalla direzione iniziale? Non identici — coerenti. Il corridoio è coerenza, non copia.' }
  ],
  24: [
    { g: 1, t: 'Taccuino in tasca', d: 'Porta un taccuino piccolo. Ogni volta che una coincidenza salta all\'occhio (nome, numero, frase sentita due volte in 24h), scrivila.' },
    { g: 2, t: 'Senza interpretare', d: 'Oggi: raccogli, non commenti. «Ho sentito il nome di X tre volte». Punto. Non «forse significa…». La tentazione è forte.' },
    { g: 3, t: 'Lucciole dei sensi', d: 'Oltre ai nomi/numeri, oggi raccogli coincidenze sensoriali: odore di un posto evocato, canzone che torna, colore ricorrente.' },
    { g: 4, t: 'Non cercarle', d: 'Oggi il rischio: cercarle. Le cerchi, le forzi, non sono più lucciole — sono proiezioni. Le lucciole arrivano quando lo sguardo è rilassato.' },
    { g: 5, t: 'Pattern senza analisi', d: 'Al quinto giorno la lista ha 7-15 voci. Guardala senza leggerla — come si guarda una costellazione. Pattern emerge?' },
    { g: 6, t: 'Increspature sull\'acqua', d: 'Le lucciole sono increspature sull\'acqua dello spazio varianti. Non profezia — glifi. Confermano o correggono la direzione.' },
    { g: 7, t: 'Senza tirar fuori verità', d: 'Se hai trovato il «significato» delle lucciole, probabilmente la Ragione è intervenuta. Le vere lucciole si lasciano in pace — agiscono da sé.' }
  ],
  25: [
    { g: 1, t: 'Il filo non scelto', d: 'Identifica un «devo» che fai senza averlo mai deciso (telefonata di cortesia settimanale, rituale familiare, presenza sociale obbligata).' },
    { g: 2, t: 'Silenzio sul filo', d: 'Oggi non lo fai. Niente annuncio, niente scuse pre-emptive. Solo non lo fai.' },
    { g: 3, t: 'Reazione dell\'ecosistema', d: 'Entro 48h qualcuno nota. Può arrivare commento, battuta, pressione. Non spieghi — un «non mi andava» basta.' },
    { g: 4, t: 'Verifica energia', d: 'Oggi quanta energia in più hai dall\'averlo tolto? Notabile? Se sì, il filo era reale pressione. Se no, forse non era un filo — era scelta implicita.' },
    { g: 5, t: 'Soglia dell\'abitudine', d: 'Dopo 5 giorni senza, il corpo-mente non chiede più automaticamente il rituale. È il segnale che il filo era automatismo, non desiderio.' },
    { g: 6, t: 'Scegliere con leggerezza', d: 'Oggi decidi: il rituale torna o esce? Se torna, è scelta consapevole — non più filo. Se esce, prima dimissione dal Manichino.' },
    { g: 7, t: 'Senza ribellione', d: 'Se hai tagliato con rabbia, il filo ricresce. Oggi onora chi ti chiama senza filtri: la libertà è nel tono, non nel rifiuto.' }
  ],
  26: [
    { g: 1, t: 'Rileggere 14-17', d: 'Settimane corpo, pasto vivo, movimento, silenzio. Una riga per ciascuna: carne? parola? rumore?' },
    { g: 2, t: 'Rileggere 18-21', d: 'Scintilla, Proiettore, permesso all\'altro, permesso a sé. La parte più sottile del blocco II. Tieni solo ciò che hai sentito cambiare.' },
    { g: 3, t: 'Rileggere 22-25', d: 'Rifiuto, corridoio, lucciole, filo del Manichino. Pratica-ponte verso la Metaforza.' },
    { g: 4, t: 'Tre liste', d: 'Compila: «carne», «parola», «rumore» (pratiche che ti hanno confuso). Ora hai la mappa onesta del blocco II.' },
    { g: 5, t: 'Il disegno del territorio', d: 'Metti le 3 liste su un foglio. È il tuo terreno reale su cui la Metaforza andrà a operare. Se metà è parola, è normale.' },
    { g: 6, t: 'Pratica da ripetere?', d: 'Scegli UNA settimana da ripetere in forma compressa prima del blocco III. Il blocco III è pesante — serve una base viva.' },
    { g: 7, t: 'Soglia di metà anno', d: 'Prendi un paragrafo: «La persona che ha iniziato era…; la persona che attraversa ora è…». Non romanzarlo. Dati.' }
  ],
  27: [
    { g: 1, t: 'Localizzazione fisica', d: '2 min: sposta l\'attenzione dietro la schiena, sopra le scapole. Non crei nulla — cerchi la zona. Forse calore, forse densità, forse niente: va bene.' },
    { g: 2, t: 'Ripetizione mattutina', d: 'Oggi mattina appena sveglio, 2 min: attenzione lì. Poi vai. Il corpo-attenzione ricorda dove tornare.' },
    { g: 3, t: 'Ripetizione serale', d: 'Stessa pratica la sera. Ora la zona è un po\' più definita. Non la forzare — solo sta.' },
    { g: 4, t: 'Calore-soglia', d: 'Al quarto giorno, un leggero calore o densità percepibile. Se ancora vuoto, va bene — alcune persone ci mettono 2 settimane.' },
    { g: 5, t: 'Richiamo in piedi', d: 'Oggi durante la giornata, 3 volte in piedi in movimento, richiama la zona. Imparare a sentirla non solo seduto.' },
    { g: 6, t: 'Niente impostazione ancora', d: 'Tentazione: «posso già impostare da qui?». No. Questa settimana è solo localizzazione. La Metaforza si costruisce sulla percezione — non sulle affermazioni.' },
    { g: 7, t: 'Ancora stabile', d: 'La zona è stabile? Se sì, pronto per settimana 28. Se no, un\'altra settimana di sola localizzazione. Nessuna fretta.' }
  ],
  28: [
    { g: 1, t: 'Frase-pilota', d: 'Scrivi UNA frase al presente indicativo su UNA cima (dalle 3-5 della settimana 12). Massimo 6 parole. Niente «voglio», «spero», «vorrei».' },
    { g: 2, t: 'Prima impostazione', d: 'Attenzione alla Treccia. Da lì, pronuncia la frase una volta. Esci. Non rievocare.' },
    { g: 3, t: 'Dopo aver dimenticato', d: 'Durante il giorno, se la frase torna in mente — congedala. Non re-impostare. Re-impostare riattiva il volere.' },
    { g: 4, t: 'Segnale laterale', d: 'Quarto giorno: un segnale laterale arriva. Non l\'evento, ma una porta che va in quella direzione. Agisci se è concreta; nota se è ambigua.' },
    { g: 5, t: 'Amalgama metaforza', d: 'Al quinto giorno, primi segnali stabili. È il tempo tecnico minimo (Transurfing V, cap. amalgama) — non magia.' },
    { g: 6, t: 'Seconda impostazione', d: 'Oggi puoi rifare l\'impostazione — stessa frase, stessa Treccia. Una volta. Non è ripetizione: è rinnovare il settore.' },
    { g: 7, t: 'Dimenticanza come tecnica', d: 'La dimenticanza è atto, non omissione. Oggi, se la mente vuole «verificare se sta funzionando», è la Ragione che riprende il controllo. Riconosci, chiudi.' }
  ],
  29: [
    { g: 1, t: 'Atterraggio pre-impostazione', d: 'Prima di ogni impostazione oggi: «Sono qui?». 3-5 respiri. Solo dopo imposti. Mai da testa dispersa.' },
    { g: 2, t: 'Marker fisico', d: 'Sposta attenzione ai piedi per 5 secondi, poi alla Treccia. I piedi sono l\'ancora del «sono qui». La Treccia è il punto di emissione.' },
    { g: 3, t: 'Saltare l\'atterraggio?', d: 'Oggi prova deliberatamente a impostare senza atterraggio. Nota la qualità. Differente. La Ragione parla più forte della Treccia.' },
    { g: 4, t: 'Respiro tripolare', d: 'Inspiro nei piedi, espiro nella Treccia, pausa al centro del petto. 3 cicli prima di impostare. Diventa rituale.' },
    { g: 5, t: 'Soglia dell\'ora', d: 'Al quinto giorno, l\'atterraggio richiede 20 secondi, non 2 minuti. Il corpo ha imparato la sequenza.' },
    { g: 6, t: 'Impostare in movimento', d: 'Prova a impostare camminando — mantenendo atterraggio + Treccia. Più difficile, ma trasferibile.' },
    { g: 7, t: 'Zero imposizioni da dispersione', d: 'Consuntivo della settimana: quante impostazioni hai fatto senza atterraggio? Se zero, è entrata. Se non-zero: ripeti. Il rumore costa caro.' }
  ],
  30: [
    { g: 1, t: 'Lista dei «voglio»', d: 'Oggi scrivi ogni «voglio» che ti accorgi («voglio il caffè», «voglio risposta», «voglio riposare»). Non cambi — catturi.' },
    { g: 2, t: 'Traduzione 1', d: 'Riapri la lista. Per ognuno, riscrivi come impostazione presente: «voglio il caffè» → «sto prendendo un caffè ora». Banale? Sì, ed è tecnica.' },
    { g: 3, t: 'Traduzione qualitativa', d: 'Per i «voglio» più grossi («voglio essere riconosciuto»): «sono riconosciuto». Presente come se già accaduto. Non affermazione — impostazione.' },
    { g: 4, t: 'Doppia qualità', d: 'La traduzione abita un punto diverso del corpo. Quando dici «voglio X» il corpo stringe; quando dici «sono Y» (traduzione) il corpo si allarga.' },
    { g: 5, t: 'Distinzione intenzione', d: 'Oggi noti: intenzione interna (voglio) vs intenzione esterna (so). La differenza tecnica è tutta lì. Una spinge, l\'altra permette.' },
    { g: 6, t: 'Catena continua', d: 'Cerca di tradurre i «voglio» in tempo reale, non a fine giornata. Gradualmente il linguaggio interno cambia.' },
    { g: 7, t: 'Soglia di 10-20', d: 'Hai 10-20 traduzioni? Ognuna è un\'impostazione potenziale. Scegline 2-3 che ti fanno stare più largo nel petto e tienile per il resto del mese.' }
  ],
  31: [
    { g: 1, t: 'Dove partiva', d: 'Oggi nota da dove parte ogni impostazione. Testa (fronte, occhi)? Gola? O Treccia (dietro scapole)? Quasi tutte partono dalla testa.' },
    { g: 2, t: 'Correggere la partenza', d: 'Ogni volta che parte dalla testa: ricomincia. Attenzione alla Treccia, frase dalla Treccia. Se la frase cambia nel tragitto, è diversa.' },
    { g: 3, t: 'Qualità della frase', d: 'Dalla testa: frasi elaborate, argomentative. Dalla Treccia: frasi corte, asciutte, quasi ovvie. La qualità rivela il punto di emissione.' },
    { g: 4, t: 'La Treccia non convince', d: 'Tentazione: convincere l\'universo con una frase ben costruita. No. Dalla Treccia non si convince — si pronuncia come si pronuncia un nome.' },
    { g: 5, t: 'Differenza soglia', d: 'Al quinto giorno la differenza è tattile. Sai quando sei partito dalla Treccia e quando dalla testa. È la base per tutte le regole successive.' },
    { g: 6, t: 'Testa come filtro', d: 'La testa può ancora essere utile dopo — per tradurre in azione. Ma l\'emissione è dalla Treccia. La testa è esecutiva, non imprenditoriale.' },
    { g: 7, t: 'Niente ritocco retroattivo', d: 'Se ti accorgi che una frase non era pulita, ripeti — non ritocchi mentalmente l\'originale. Il ritocco è del pendolo della perfezione.' }
  ],
  32: [
    { g: 1, t: 'Cronometro', d: 'Tutte le impostazioni di oggi: cronometrate. 5 secondi max. Se vanno oltre, le tagli a metà.' },
    { g: 2, t: 'Breve come risultato', d: 'Se la frase viene naturalmente lunga, c\'è ancora argomentazione interna. Riduci fino all\'essenziale — 4-5 parole al massimo.' },
    { g: 3, t: 'Compressione non forzata', d: 'Non comprimere artificialmente. Se la frase è «sto avendo un lavoro che mi rispetta», riducila a «sono nel mio lavoro». Mantieni il vero nocciolo.' },
    { g: 4, t: 'Dubbio embrionale', d: 'Ogni secondo oltre il quinto è argomento. Argomento = dubbio. Dubbio = forza di equilibrio in arrivo.' },
    { g: 5, t: 'Soglia 5 secondi', d: 'Tutte le impostazioni di oggi stanno sotto i 5 secondi? Cronometra senza barare. È il nuovo standard per il resto del percorso.' },
    { g: 6, t: 'Versione-seme', d: 'Ogni cima della tua lista ha una versione-seme (max 5 parole)? Falla asciugare ancora se necessario. Il seme non spiega — indica.' },
    { g: 7, t: 'Breve non significa frettoloso', d: 'Breve = senza peso. Oggi: 5 secondi di emissione, preceduti da 30 secondi di atterraggio. Il rapporto è importante.' }
  ],
  33: [
    { g: 1, t: 'Test del sorriso', d: 'Prima di ogni impostazione oggi: un mezzo sorriso, appena accennato. Se non riesci nemmeno a sorridere, c\'è tensione — non è il momento.' },
    { g: 2, t: 'Come se già', d: 'Oggi imposti ogni cosa con la qualità di chi sa che è già. Non «voglio che arrivi» — «è già qui». È sottile, ma si sente nel corpo.' },
    { g: 3, t: 'Dove è lo sforzo', d: 'Nota se c\'è sforzo in gola, fronte, mandibola mentre imposti. Lì stai ancora volendo. Se c\'è, rilassa e ripeti.' },
    { g: 4, t: 'Impostare dopo aver mangiato', d: 'Condizione più difficile: pesante, satollo, tendenzialmente sonnolenti. Se riesci a mantenere leggerezza qui, puoi mantenerla ovunque.' },
    { g: 5, t: 'Corpo più largo, non più teso', d: 'Al quinto giorno, dopo un\'impostazione, il corpo dovrebbe sentirsi più largo, non più concentrato. È il segnale della leggerezza corretta.' },
    { g: 6, t: 'Leggero ≠ superficiale', d: 'Leggero = senza peso. Non = senza attenzione. Oggi distingui: la cura c\'è, il peso no.' },
    { g: 7, t: 'La variante leggera', d: 'La frequenza della variante già realizzata è leggera. Imposti da lì. Se c\'è sforzo, stai ancora sulla linea di vita di chi desidera.' }
  ],
  34: [
    { g: 1, t: 'Tre formulazioni', d: 'Per UNA cima: 3 frasi diverse. Una sullo stato («sono accolto»), una sulla qualità («sono capace»), una sull\'azione («sto scrivendo ogni giorno»).' },
    { g: 2, t: 'Mattina-stato', d: 'Oggi usa la prima (stato) al mattino. 5 secondi dalla Treccia. Poi vai.' },
    { g: 3, t: 'Pranzo-qualità', d: 'A metà giornata: la seconda (qualità). Stesso protocollo.' },
    { g: 4, t: 'Sera-azione', d: 'Prima di dormire: la terza (azione). Tre angolazioni sullo stesso obiettivo in tre momenti diversi.' },
    { g: 5, t: 'Effetto della triplicazione', d: 'Al quinto giorno, il sistema non percepisce la ripetizione — ogni impostazione è nuova. Non si dissipa come le affermazioni.' },
    { g: 6, t: 'Niente ripetizione meccanica', d: 'La ripetizione meccanica è rumore. Il sistema la classifica come pendolo e la neutralizza. La triplicazione la aggira.' },
    { g: 7, t: 'Scegli il tuo trittico', d: 'Per ogni cima prioritaria, definisci il tuo trittico stabile. È il tuo canone personale di impostazione per le settimane successive.' }
  ],
  35: [
    { g: 1, t: 'Post-impostazione', d: 'Oggi dopo ogni impostazione, resti attento per 24h. I segnali possono essere: email inattese, idee persistenti, incontri, errori illuminanti.' },
    { g: 2, t: 'Al primo segnale', d: 'Al primo segnale di oggi: agisci entro 2 ore. Non «quando ho tempo». La velocità è parte della tecnica.' },
    { g: 3, t: 'Non aspettare il perfetto', d: 'La tentazione: aspettare il corridoio ideale. No. Il primo corridoio che si apre è quello giusto. Il secondo è diverso.' },
    { g: 4, t: 'Segnale come porta', d: 'Ogni segnale è una porta. Piccola. Entri anche se non vedi dove porta. Il corridoio si mostra camminandolo.' },
    { g: 5, t: '5 segnali, 5 azioni', d: 'Conteggio: hai risposto ad almeno 5 segnali con azione concreta entro 24h? Se meno di 3, stai ancora aspettando.' },
    { g: 6, t: 'Azione minima', d: 'L\'azione non deve essere grande. Un messaggio, una lettura di 10 minuti, una decisione di «non rifare X». La mossa minima conta.' },
    { g: 7, t: 'Consuntivo del corridoio', d: 'Guarda indietro: i 5-7 segnali e le azioni formano già una traccia? Probabilmente sì. Il corridoio si è manifestato — non pianificato.' }
  ],
  36: [
    { g: 1, t: 'Chiusura dopo impostazione', d: 'Oggi, dopo ogni impostazione, attività manuale che richiede attenzione (cucinare, riordinare, camminare). La mente torna al presente.' },
    { g: 2, t: 'Re-impostare è controllare', d: 'Se oggi ti accorgi che stai re-impostando «per rinforzare», è controllo mascherato. Ogni «sta arrivando?» è spingere.' },
    { g: 3, t: 'Dimenticare come azione', d: 'Dimenticare non è rassegnarsi — è chiudere il circuito. Il circuito aperto perde carica. Il circuito chiuso lascia fluire.' },
    { g: 4, t: 'Verifica del controllo', d: 'Quante volte oggi la mente è tornata sugli obiettivi? Scrivi il numero. La prima settimana a soglia, questo numero si dimezza.' },
    { g: 5, t: 'Soglia dimezzamento', d: 'Al quinto giorno, il numero dovrebbe essere la metà di lunedì. Se è uguale, stai ancora tirando — torna all\'attività manuale dopo impostazione.' },
    { g: 6, t: 'Fare vs tirare', d: 'Agire sui segnali (regola 7) è diverso da tirare mentalmente (regola 8 — da non fare). Agisci sulle porte che si aprono, non tirare quelle chiuse.' },
    { g: 7, t: 'Le 8 regole viste intere', d: 'Fine della sequenza 29-36. Guarda insieme: presenza, impostare-non-volere, Treccia, breve, leggero, triplice, seguire, dimenticare. Tienile come motore.' }
  ],
  37: [
    { g: 1, t: 'Obiettivo scelto', d: 'Scegli UN obiettivo (non più di uno) su cui lavorare questa settimana con le 3 scale. Cerchialo in alto al diario.' },
    { g: 2, t: 'Scala anno', d: 'Definisci la versione «anno»: entro dicembre, dove sei con quest\'obiettivo? Una frase. Niente dettagli.' },
    { g: 3, t: 'Scala mese', d: 'Definisci la versione «questo mese»: quale capitolo specifico stai vivendo? La risposta coerente con la scala anno, non imposta a caso.' },
    { g: 4, t: 'Scala oggi', d: 'Definisci la mossa di oggi. Minima. Eseguibile in 30 minuti. Se non la fai, niente scala anno.' },
    { g: 5, t: 'Prima mossa effettiva', d: 'Fai la mossa. Non ri-pianifichi, non rivedi. Esegui. È la scala oggi che tiene in piedi tutto.' },
    { g: 6, t: 'Seconda, terza, quarta mossa', d: 'Ogni giorno questa settimana, una mossa. 7 mosse totali. Non «quando posso» — sempre.' },
    { g: 7, t: 'Coerenza visibile', d: 'Le 7 mosse formano una trama coerente con la scala anno? Se sì, il corridoio regge. Se no, regoli la scala mese.' }
  ],
  38: [
    { g: 1, t: 'Mappa dell\'approvazione', d: 'Elenca le 3 persone da cui cerchi più approvazione (anche impliciti: lettori, colleghi, partner). Nominarle libera metà del peso.' },
    { g: 2, t: 'Postura eretta', d: 'Oggi in ognuno dei contesti-approvazione: spalle aperte, mento parallelo, mani rilassate. Il corpo parla prima della voce.' },
    { g: 3, t: 'Meno parole', d: 'Dimezza le parole dette in quei contesti. Silenzio educato dopo aver parlato. Chi sa, parla meno.' },
    { g: 4, t: 'Sguardo pacato', d: 'Guardali negli occhi senza scanning per leggere la loro approvazione. Sguardo fermo, non sfidante. Non cerchi risposta nel loro viso.' },
    { g: 5, t: 'Il pendolo non alimentato', d: 'Al quinto giorno, noti: il contesto ha meno peso. L\'approvazione cercata alimentava un pendolo — ora non gira più così forte.' },
    { g: 6, t: 'Itfat non è altezzosità', d: 'Distinzione fine: postura regale ≠ distanza fredda. Tu sai, sei presente, ma non mendichi giudizio. È caldo e non-servile.' },
    { g: 7, t: 'Discesa del volume', d: 'Fine settimana: hai parlato meno in quei contesti? Di quanto? Il calo è il tuo indicatore oggettivo.' }
  ],
  39: [
    { g: 1, t: 'Diario 27-30', d: 'Rileggi Treccia, prima impostazione, presenza, impostare-non-volere. Segna verde (entrata), giallo (in corso), rosso (resiste).' },
    { g: 2, t: 'Diario 31-33', d: 'Dalla Treccia, breve, leggero. Più tecniche che intellettuali: il corpo sa se sono entrate.' },
    { g: 3, t: 'Diario 34-36', d: 'Triplice, seguire, dimenticare. La parte «di chiusura» della Metaforza. Spesso le più difficili da installare.' },
    { g: 4, t: 'Regola del cuore', d: 'Quale regola è più naturale per te? Probabilmente è quella da cui sei partito prima di aver letto Tafti.' },
    { g: 5, t: 'Regola che resiste', d: 'Quale resiste di più? Qui è il lavoro residuo. Non la combatti — la riconosci come la tua stanza nascosta.' },
    { g: 6, t: 'Quadro visivo', d: 'Metti le 8 regole su un foglio. Colora ciascuna secondo verde/giallo/rosso. È il tuo dashboard della Metaforza.' },
    { g: 7, t: 'Riprendere una regola', d: 'Scegli UNA regola (dalla lista rosso) da ripetere per la prima settimana del blocco IV. Non tutte — una. Il blocco IV ha il suo lavoro.' }
  ],
  40: [
    { g: 1, t: 'Scelta del giorno', d: 'Scegli un giorno pieno della settimana. Da mattina a sera, 24h di osservazione del Sé-attore. Segna sul calendario.' },
    { g: 2, t: 'Preparazione', d: 'Oggi (vigilia): scrivi 3 ruoli che solitamente interpreti (il padre, il professionista, il partner). Sono le tue scene-tipo.' },
    { g: 3, t: 'Primo arco del giorno', d: 'Mattina: osserva come entri nel primo ruolo. Quale voce? Quale postura? «Sto recitando X adesso». Nota, non giudichi.' },
    { g: 4, t: 'Pomeriggio-cambio', d: 'Spesso il cambio di ruolo a metà giornata è brusco. Nota la transizione — cambi voce? Sguardo? È il momento più rivelatore.' },
    { g: 5, t: 'Sera-ultimo ruolo', d: 'L\'ultimo ruolo del giorno (sposo, genitore, amico notturno) è spesso il più automatico. Osservalo particolarmente.' },
    { g: 6, t: 'Dopo il giorno', d: 'Il giorno dopo: 3 ruoli identificati. Se solo 1, troppo pochi. Se 7, stai analizzando invece di osservare.' },
    { g: 7, t: 'Niente cinismo', d: 'Oggi: recitare non significa «finto». Tutti recitano sempre — tu l\'hai visto. È liberatorio, non distruttivo.' }
  ],
  41: [
    { g: 1, t: 'Preparazione spettatore', d: 'Scegli il giorno spettatore (diverso dal giorno attore). La sera prima: decidi — domani sposto la sedia dalla scena alla platea.' },
    { g: 2, t: 'Mattina-passo indietro', d: 'Oggi ogni interazione: fai un mezzo passo interno indietro. Ascolti più di quanto parli. Reagisci meno.' },
    { g: 3, t: 'Non intervenire', d: 'Oggi la tentazione è continua: «dovrei dire…», «potrei fare…». No. Solo osservi. Le cose si sbrogliano senza di te in modi inattesi.' },
    { g: 4, t: 'Respiro che si allunga', d: 'Nel pomeriggio, il respiro è più lungo. La sedia della platea è comoda. Scopri: intervenire tanto non era tuo compito.' },
    { g: 5, t: 'Il mondo risponde', d: 'Al pomeriggio, qualcuno ti percepisce «diverso oggi» — più presente ma meno invadente. È lo spettatore che parla senza parlare.' },
    { g: 6, t: 'Non è passività', d: 'Spettatore ≠ spento. Sei attivamente attento. Noti dettagli che l\'attore non vede. Lo spettatore è la Scintilla del Creatore in osservazione.' },
    { g: 7, t: 'Consuntivo', d: 'Cosa hai visto come spettatore che non avevi mai visto come attore? Scrivi 3 osservazioni precise. Sono tue.' }
  ],
  42: [
    { g: 1, t: 'Scelta della scena', d: 'Scegli UNA scena della settimana che dirigi tu: una conversazione, un\'ora di lavoro, una cena. Scrivila sul calendario.' },
    { g: 2, t: 'Impostazione della scena', d: 'Dalla Treccia, una frase: «Questa scena è in ___». Tono, esito, atmosfera. Una parola di qualità.' },
    { g: 3, t: 'Vivere la scena dal regista', d: 'Entri nella scena sapendo cosa dirigi. Tempo, tono, ritmo. Non improvvisi — non rigidifichi. Dirigi.' },
    { g: 4, t: 'Conferma del regista', d: 'La scena è successa nella forma impostata? Non identica — in forma simile. Se no, annota dove è deragliata.' },
    { g: 5, t: 'Il resto della giornata', d: 'Tentazione di dirigere tutto. No. Una scena dirigi. Il resto vivi. L\'overdirection riattiva il volere.' },
    { g: 6, t: 'Seconda scena domani', d: 'Il giorno dopo: un\'altra scena. Sempre una. Impari a scegliere quando regista e quando attore passivo.' },
    { g: 7, t: 'Sé-regista in pratica', d: 'Fine settimana: 2-3 scene dirette riuscite. È il ritmo sostenibile. Oltre, si regredisce nel controllo.' }
  ],
  43: [
    { g: 1, t: 'Autopilota mappato', d: 'Elenca 5 automatismi quotidiani (scrolling, auto-pilota guida, mangiare senza gusto, ripetizioni relazionali). Sono i tuoi pulsanti.' },
    { g: 2, t: 'Parola-chiave', d: 'Quando ti scopri in uno degli automatismi: mentalmente «eccolo». Non giudichi — riconosci. 3 respiri. Torni.' },
    { g: 3, t: 'Accorgersi di più', d: 'Oggi gli «eccolo» sono di più di ieri. È il segno che il riconoscimento sta lavorando — non che sei peggiorato.' },
    { g: 4, t: 'Il filo si allenta', d: 'Al quarto giorno, alcuni automatismi iniziano a rompersi da soli. Non li combatti — il riconoscimento è già azione.' },
    { g: 5, t: 'Pulsanti conosciuti', d: 'Al quinto giorno, i 5 automatismi sono tutti mappati. Sai a che ora, con chi, in quale stato scattano.' },
    { g: 6, t: 'Senza punirsi', d: 'Oggi verifica: stai giudicando l\'autopilota («sono debole»)? È ancora pendolo. Solo riconosci, torna, continua.' },
    { g: 7, t: 'Il Manichino ha meno fili', d: 'La somma dei riconoscimenti indebolisce il Manichino. Ogni filo che vedi si allenta di un po\'. Non per forza — per consapevolezza.' }
  ],
  44: [
    { g: 1, t: 'Taccuino del flow', d: 'Taccuino sempre in tasca. Quando ti accorgi che sono passate ore senza sforzo: dove? Con chi? Cosa facevi? 3 righe.' },
    { g: 2, t: 'Non cercare', d: 'Oggi la tentazione: forzare l\'assorbimento per «registrare». No. Cerchi = non assorbito. Annoti solo quando arriva spontaneo.' },
    { g: 3, t: 'Attività che non sospettavi', d: 'Spesso le attività-missione sono le meno drammatiche: organizzare, cucinare, riparare, curare. Non monumentali.' },
    { g: 4, t: 'Contesto ricorrente', d: 'Nelle voci raccolte, emerge un contesto? Una persona? Un\'ora? Non analizzi — noti.' },
    { g: 5, t: 'Voci soglia', d: 'Al quinto giorno dovresti avere 4-10 voci. Se zero, il tempo non scompare mai — stai sempre in allerta. Se 20+, stai analizzando.' },
    { g: 6, t: 'Niente interpretazione precoce', d: 'La tentazione è chiamarla «missione» oggi. No. La settimana prossima. Oggi solo raccogli.' },
    { g: 7, t: 'Sensazione del campo', d: 'A fine settimana, senza rileggere, hai una sensazione di «dove» la tua frequenza va naturalmente. Tientela nel corpo — non verbalizzarla ancora.' }
  ],
  45: [
    { g: 1, t: 'Spazio per la lettura', d: '1 ora nella settimana in cui leggerai le voci della settimana 44. Scegli il momento. Spazio silenzioso, senza distrazioni.' },
    { g: 2, t: 'Rilettura senza analisi', d: 'Rileggi tutte le voci. Una dopo l\'altra. Lentamente. Senza matita. Senza interpretare — assorbi.' },
    { g: 3, t: 'Prime ricorrenze', d: 'Nota cosa si ripete senza cercarlo. Persona? Tipo di attività? Luogo? Ora del giorno? Scrivi 3 ricorrenze.' },
    { g: 4, t: 'Il filo unificante', d: 'C\'è un filo che unisce 3+ voci? Spesso è semplice: «quando risolvo problemi per altri», «quando organizzo», «quando insegno».' },
    { g: 5, t: 'Piccolo e vero', d: 'La missione non è monumentale. A volte è: cucinare per altri. Riparare oggetti. Scrivere lettere. Piccolo e vero batte grande e retorico.' },
    { g: 6, t: 'Nome provvisorio', d: 'Dai un nome alla missione emergente. Provvisorio. Due-tre parole. «Sostenere chi si blocca». «Organizzare bellezza». Non definitivo.' },
    { g: 7, t: 'Direzione non titolo', d: 'La missione è direzione, non job-title. Si può svolgere in 10 forme professionali diverse. Tienila come frequenza, non come mestiere.' }
  ],
  46: [
    { g: 1, t: 'Distinzione chiarezza-impulso', d: 'Oggi nota 3 «impulsi» e 3 «chiarezze». Chiarezza: silenzio dentro che indica. Impulso: agitazione che spinge. Differiscono molto.' },
    { g: 2, t: 'Esegui la chiarezza', d: 'Quando una decisione è chiara, esegui entro 2 minuti. Non rivedi i pro-contro. La chiarezza è già la lista.' },
    { g: 3, t: 'Non eseguire l\'impulso', d: 'L\'impulso chiede esecuzione urgente («ora, subito, altrimenti»). Aspetta 30 minuti. Se sopravvive, era chiarezza. Se no, era pendolo.' },
    { g: 4, t: 'Prima azione decisiva', d: 'Oggi un\'azione decisiva è stata eseguita subito dopo la chiarezza. Scrivila. È il dato.' },
    { g: 5, t: 'Ritmo della Realizzazione', d: 'Al quinto giorno, 2-3 azioni decisive eseguite. Il ritmo è stato quasi impercettibile. La chiarezza non si annuncia — si accorge e si esegue.' },
    { g: 6, t: 'Test della Ragione', d: 'Oggi osserva: la Ragione vuole «rivedere» dopo l\'azione? È la sua riprogrammazione del controllo. Non la combatti — la noti.' },
    { g: 7, t: 'La Realizzazione 1 vissuta', d: 'Fine settimana: 3+ azioni decisive senza re-interrogazione. Il corpo ha imparato il passo. Non si torna più al deliberare-all\'infinito.' }
  ],
  47: [
    { g: 1, t: 'Chiudere la cartella', d: 'Dopo un\'azione importante oggi: chiudi. Niente «ho fatto bene?», niente «dovevo dire anche X». Se torna, torna a un gesto manuale del presente.' },
    { g: 2, t: 'Rumination mappata', d: 'Oggi nota quante volte torni mentalmente su un\'azione già fatta. Scrivi il numero. Il dato grezzo è prezioso.' },
    { g: 3, t: 'Rumination dimezzata', d: 'Terza sera: il numero è sceso? Se sì, la chiusura sta entrando. Se no, aggiungi gesti manuali (disegnare, cucinare, muovere oggetti).' },
    { g: 4, t: 'Le tre righe', d: 'Se la rumination è insistente: scrivi 3 righe sul diario, chiudi la pagina fisicamente. Gesto ritualico — il cervello recepisce.' },
    { g: 5, t: 'Soglia quieta', d: 'Al quinto giorno, la quantità di pensieri post-azione è almeno dimezzata rispetto a lunedì. Calcola il delta. È oggetto misurabile.' },
    { g: 6, t: 'Chiudere ≠ dimenticare', d: 'Chiudere non è cancellare — è smettere di rianimare. Se arriva un\'osservazione utile, la scrivi e chiudi. Non la rilavori.' },
    { g: 7, t: 'Realizzazione 2 entrata', d: 'Il cambio è nel corpo. Dopo un\'azione c\'è quiete invece di agitazione. È il segnale tecnico che la Realizzazione 2 è stata compresa dal sistema.' }
  ],
  48: [
    { g: 1, t: 'Il pendolo-titolare', d: 'Identifica il pendolo più forte emerso nelle settimane 4-5 (9 mesi fa). Scrivilo di nuovo in alto al diario, con lo stesso nome che gli avevi dato allora.' },
    { g: 2, t: 'Esposizione deliberata', d: 'Oggi metti deliberatamente il pendolo nella tua giornata (situazione, conversazione, media che lo alimenta). Osserva la reazione del corpo.' },
    { g: 3, t: 'Carico misurato', d: 'Assegna un numero 1-10 al peso attuale del pendolo. Confronta mentalmente con il numero di 9 mesi fa. Quasi sempre è sceso.' },
    { g: 4, t: 'Dove è sopravvissuto', d: 'Il pendolo non scompare — spesso si riduce. In quale forma è ancora presente? Di solito più sottile, meno urlante.' },
    { g: 5, t: 'Il delta è il dato', d: 'Il raggiungimento di zero non è l\'obiettivo — il delta sì. Se sei passato da 9 a 5, è un successo tecnico. Molti pendoli richiedono 2+ anni.' },
    { g: 6, t: 'Ri-cadere dal pendolo', d: 'Riutilizza le pratiche della settimana 5: non-risposta, neutralità. Ora hai un arsenale — non sei più principiante.' },
    { g: 7, t: 'Rientra nel corridoio', d: 'La verifica ha rinforzato le risorse. Oggi torna alla direzione del tuo anno — il pendolo non è più il centro della giornata.' }
  ],
  49: [
    { g: 1, t: 'Preparazione della seduta', d: 'Una seduta nella settimana, 30 min di silenzio totale. Scegli giorno, ora, luogo. Sacro in senso laico.' },
    { g: 2, t: 'Atterraggio prolungato', d: '10 minuti solo per atterrare. Piedi, respiro, Treccia. Non fretta. Qui non si imposta in 5 secondi — si entra in 10 minuti.' },
    { g: 3, t: 'Una linea', d: 'Dalla Treccia, una linea. Non elenco. Per il prossimo anno. Una direzione. La scrivi una volta sul diario, con calma.' },
    { g: 4, t: 'Non limarla', d: 'Oggi la tentazione: tornare al foglio e limare la frase. No. La prima linea reale vale più di 20 linee ottimizzate.' },
    { g: 5, t: 'Verifica del respiro', d: 'Quando rileggi la frase oggi, il petto si allarga? Se sì, è la direzione. Se si stringe, non è ancora tua — è di un pendolo residuo.' },
    { g: 6, t: 'Silenzio post-impostazione', d: 'Dopo la frase-madre, silenzio. Non cerchi di tradurla in piano. L\'albero si dirama da sé.' },
    { g: 7, t: 'Tieni la linea scritta', d: 'La riprenderai in capo a 3 mesi. Nel frattempo, lavora sulle mosse del giorno — la linea fa da orizzonte, non da check-list.' }
  ],
  50: [
    { g: 1, t: 'Scelta del giorno', d: 'Scegli un giorno normale (non sacralizzato) della settimana. Dalla mattina alla sera: niente telefono (solo emergenze), niente parlato.' },
    { g: 2, t: 'Preparazione', d: 'Vigilia: avvisa chi serve (partner, lavoro). Non come ritiro — come «giornata sperimentale». Tono leggero.' },
    { g: 3, t: 'Primi 2 ore del giorno', d: 'L\'impulso di prendere il telefono arriva 3-4 volte in 2 ore. Lo noti, non obbedisci. È già rivelatore.' },
    { g: 4, t: 'Metà giornata', d: 'Silenzio esterno amplifica lo schermo interno. La testa monta scene. Non combatti — osservi.' },
    { g: 5, t: 'Pomeriggio esterno', d: 'Verso il pomeriggio, lo schermo esterno prende forza. Dettagli che non noti mai — suoni, colori, sensazioni tattili.' },
    { g: 6, t: 'I due schermi distinti', d: 'La sera percepisci senza sforzo: questo è interno, questo è esterno. La distinzione non è più concetto, è percezione diretta.' },
    { g: 7, t: 'Decontaminazione', d: 'Il giorno dopo: riprendi telefono e parlato. Noti quanto sono invasivi. Stabilisci una versione mini (1h al giorno) come pratica ricorrente.' }
  ],
  51: [
    { g: 1, t: 'Gratitudine come atmosfera', d: '2 min al mattino: entra nella gratitudine come clima del petto. Non elenchi di cose. Sensazione di «già abbastanza» per alcuni secondi.' },
    { g: 2, t: '4 richiami al giorno', d: 'Oggi 4 volte: richiami l\'atmosfera di gratitudine per 30 secondi. Non motivi, non elenchi. Solo richiamo.' },
    { g: 3, t: 'Gratitudine in situazione neutra', d: 'Mentre fai cose banali (lavare piatti, camminare al lavoro): gratitudine di fondo. Scopri che è possibile anche quando non c\'è motivo.' },
    { g: 4, t: 'Gratitudine in situazione scomoda', d: 'Oggi prova a richiamarla in una situazione di piccolo fastidio. La tempera — non la cancella. Ti permette di rispondere meglio.' },
    { g: 5, t: 'Amalgama della gratitudine', d: 'Al quinto giorno, incontri con altri hanno un tono diverso senza che tu faccia nulla. La gratitudine è contagiosa — specchio duale in atto.' },
    { g: 6, t: 'Se scivoli a elencare', d: 'La testa vuole fare liste («grazie per X, grazie per Y»). Chiudi gli occhi 30 secondi e richiama la sensazione. Stato, non racconto.' },
    { g: 7, t: 'Stato di base', d: 'La gratitudine diventa la frequenza di fondo — non atmosfera occasionale. È il nuovo punto da cui imposti, decidi, incontri.' }
  ],
  52: [
    { g: 1, t: 'Spazio di rilettura', d: 'Prima sessione di rilettura del diario completo. 45 minuti. Da settimana 1 alla settimana 13.' },
    { g: 2, t: 'Sessione due', d: 'Settimane 14-26. Il blocco del corpo. Cosa è entrato senza sforzo? Cosa ha richiesto ripetizione?' },
    { g: 3, t: 'Sessione tre', d: 'Settimane 27-39. La Metaforza. Quali delle 8 regole sono ancora alive? Quali si sono dissolte?' },
    { g: 4, t: 'Sessione quattro', d: 'Settimane 40-51. Transurfing di Sé. Il lavoro più recente — spesso il più fresco e chiaro in memoria.' },
    { g: 5, t: 'Tre categorie', d: 'Compila: «diventato carne» (incorporato), «resta parola» (letto ma non integrato), «è nuovo» (emerso durante l\'anno e non previsto).' },
    { g: 6, t: 'Testo libero', d: '1 ora di scrittura senza struttura. «Cosa è successo in questi 12 mesi». Lascia che emerga. Non organizzare.' },
    { g: 7, t: 'Chiudere il capitolo', d: 'L\'anno è un passo, non il cammino. Chiudi come si chiude un capitolo: con un segno di sigillo («fatto»), non di conclusione («finito»).' }
  ]
};
// Teoria tecnica per settimana — ancoraggio ai testi di Zeland (Transurfing I-V, Tafti, Le Regole dello Spazio, Cosa Non Ha Detto Tafti)
const TEORIA_SETTIMANE = {
  1: 'Concetto cardine di "Tafti la Sacerdotessa" (2018), Cap. sul risveglio nel film. La scena è il settore dello spazio varianti che stai attraversando; la presenza coincidente interrompe la proiezione automatica e riapre la selezione del settore successivo. Senza presenza, il Manichino pilota.',
  2: 'Transurfing III — "Avanti nel Passato", legge della frequenza. Ogni giudizio alza la carica emotiva e genera potenziali eccedenti, che attirano forze di equilibrio spostando il settore. L\'osservazione pura è la frequenza di base da cui si può poi modulare qualsiasi variante.',
  3: 'Tafti, Cap. "I due schermi". Lo schermo esterno è la proiezione del settore attuale; lo schermo interno è il pre-montaggio del settore successivo. Il controllo del film inizia dalla distinzione: se lo schermo interno è occupato dalla paura, la Metaforza la imposta nell\'esterno.',
  4: 'Transurfing I — "Lo Spazio delle Varianti", Cap. sui pendoli. Un pendolo è una struttura energetica informazionale che vive dell\'attenzione. L\'amo tipico: paura, senso di colpa, identificazione di gruppo, indignazione. Nominarlo è l\'atto preliminare al «caderne fuori».',
  5: 'Transurfing I, Cap. "Come cadere dal pendolo". La non-risposta — né lotta né adesione — toglie alimento al pendolo, che non ti usa più come condotto di energia. Rispondere in opposizione è ancora nutrimento: il pendolo si sdoppia in un pendolo-contro.',
  6: 'Transurfing II — "Il Fruscio delle Stelle del Mattino", legge delle forze di equilibrio. I potenziali eccedenti attraggono il loro opposto: più urgente rendi un esito, più il sistema produce il contrario. La formula «va bene in entrambi i casi» dissolve la carica e libera il corridoio.',
  7: 'Transurfing II-III. Lo slide è un trasmettitore di frequenza: accorda il tuo stato alla linea di vita dove l\'obiettivo è già reale. Non «guardato» da fuori ma «vissuto dall\'interno» — questa è la differenza tecnica rispetto alla visualizzazione generica da new-age.',
  8: 'Transurfing IV — "Impostare la Propria Realtà". Il Frejling inverte il flusso: chiedere crea corrente respingente (carica di mancanza); offrire per primo crea un vuoto attrattivo che la variante riempie. È l\'operazionalizzazione dell\'intenzione esterna nei rapporti.',
  9: '"Le Regole dello Spazio" / Transurfing V. Ogni «imprevisto» è un bivio del corridoio delle varianti. Classificarlo «negativo» è un potenziale eccedente che spinge il sistema a confermarlo. «Si incastra nel piano» apre il settore successivo invece di chiuderlo.',
  10: 'Base per lo specchio duale (Transurfing V). Lo specchio riflette lo stato interno con ritardo: se cambi forma a ogni pressione, il riflesso resta frammentato e la linea di vita non cambia. Tenere la forma = stabilizzare l\'input dello specchio.',
  11: 'Transurfing V, Cap. "L\'amalgama". Lo strato soggettivo tra te e il mondo si coagula attorno allo stato dominante. 5 giorni sono la soglia tecnica minima perché il mondo esterno cominci a restituire il riflesso del nuovo stato (non è superstizione — è tempo di risposta dello specchio).',
  12: 'Distinzione Obiettivo/Porta — Transurfing III. Gli obiettivi dei pendoli sono Porte travestite: ti portano a una linea ma non alla cima. La cima è riconoscibile dalla domanda-filtro: «Lo vorrei ancora se nessuno lo sapesse mai?». È il test più affilato del canone.',
  13: 'Principio zelandiano: la pratica non ripetuta si dissolve. L\'attenzione è risorsa limitata e il corridoio si chiude senza gesti regolari. La revisione è atto tecnico di consolidamento — non bilancio psicologico.',
  14: 'Transurfing V — "Scardinare il Sistema Tecnogeno". Il sistema non è paranoia: è una struttura di pendoli alimentare, mediatico, digitale che trattiene quota di energia libera. Ridurre input = liberare carburante per l\'intenzione esterna (vedi g51).',
  15: 'čistoPitanie — "Cosa Non Ha Detto Tafti". Il cibo vivo porta energia pranica disponibile senza costo digestivo. Un solo pasto al giorno è sufficiente a sentire la differenza energetica senza rivoluzione: il dogmatismo dietetico è a sua volta pendolo.',
  16: '"Le Regole dello Spazio", principio del ritmo naturale. L\'ambiente tecnogeno sovrastimola il sistema nervoso e restringe lo spazio di attenzione. 30 minuti fuori = ricalibrazione della frequenza di base da cui si impostano le scene.',
  17: 'Tafti, Cap. sul silenzio. Il silenzio è la condizione perché il fruscio delle stelle del mattino (frequenza sottile dello spazio varianti, g53) diventi percepibile. Ogni stimolo sostitutivo (musica ambient, audio-guide) copre il segnale.',
  18: 'Tafti, Cap. sulla Scintilla del Creatore. Non si costruisce: si riconosce. È il punto di presenza viva al centro del petto che distingue te dal personaggio automatico. Base per la Metaforza — senza di essa si imposta dal Manichino.',
  19: 'Apocrifo — funzione di Vershitel\'. La distinzione quotidiana «mio vs. pendolo» è il pre-requisito perché la Metaforza amplifichi le tue direzioni e non i pendoli. Senza questa separazione, ogni impostazione potenzia anche il rumore.',
  20: '"Le Regole dello Spazio". Voler che qualcuno sia diverso è potenziale eccedente duplice: pesa su te e su di lei. Il permesso scioglie il pendolo relazionale e libera energia per entrambi — si manifesta nel respiro che si allunga a contatto con l\'altra.',
  21: 'Tafti — unità Anima-Ragione (g43). L\'auto-attacco è la Ragione che lotta contro l\'Anima: genera il più violento dei potenziali eccedenti interni. Il permesso ricostituisce l\'unità che rende possibile l\'intenzione esterna.',
  22: 'Tafti — seconda delle 4 inversioni. Il rifiuto è identificazione (pendolo della contro-opinione). Accettare come dato di fatto non significa condividere: significa non spendere energia per alimentare il pendolo del rifiuto.',
  23: 'Transurfing III — Cap. sul corridoio. Il corridoio è una famiglia di linee di vita compatibili con l\'obiettivo; si manifesta camminandolo, non pianificandolo. I primi due segnali a cui rispondi definiscono il tono del corridoio per il resto.',
  24: 'Tafti, Cap. sulle Lucciole (g39, g52). Sono glifi del sistema: confermano o correggono la direzione, non sono profezia. La raccolta senza interpretazione è tecnica anti-pendolo: l\'interpretazione prematura attiva la Ragione che distorce.',
  25: 'Tafti, Cap. sul Manichino. Il Manichino è l\'insieme degli automatismi; i fili sono i condotti con cui i pendoli tirano. Recidere con leggerezza toglie un conduttore. Recidere con rabbia sostituisce un pendolo con un altro (di ribellione).',
  26: 'Il blocco II agisce sul corpo-energia: i suoi frutti non sono sempre subito coscienti. «Carne / parola / rumore» è tecnica di discernimento zelandiana: serve a non scambiare la verbalizzazione per integrazione.',
  27: 'Tafti, Cap. sulla Treccia (g31). Non è struttura anatomica: è un punto soggettivo di attenzione dietro le scapole da cui si «pronuncia» l\'impostazione. Localizzarla prima di usarla impedisce che la Metaforza si confonda con l\'affermazione mentale.',
  28: 'Tafti. L\'impostazione dalla Treccia è la forma operativa dell\'intenzione esterna: breve, al presente, poi dimenticata. La dimenticanza è tecnica (non pigrizia) — è la chiusura del circuito che lascia alla variante lo spazio di manifestarsi.',
  29: 'Prima delle 8 regole di Tafti. L\'impostazione da una coscienza addormentata non è neutra: rinforza il rumore del pendolo in cui la coscienza era dispersa al momento dell\'impostazione.',
  30: 'Tafti — seconda regola. Il «volere» è intenzione interna (energia che spinge). L\'impostazione è intenzione esterna (permesso che «sa»). La traduzione è lavoro — la frase nuova abita un punto diverso del corpo, non è parafrasi.',
  31: 'Tafti. La frase dalla testa è argomento alla Ragione; dalla Treccia è pronuncia all\'Anima. Solo l\'unità Anima-Ragione (g43) attiva la Metaforza — da qui la regola tecnica del punto di emissione.',
  32: 'Tafti — regola del breve. La lunghezza dell\'impostazione è misura del tuo dubbio. Ogni secondo oltre il quinto è argomentazione interna: forza di equilibrio in forma embrionale che precede la sua manifestazione esterna.',
  33: 'Tafti — regola del leggero. Spingere riattiva il volere, che chiama le forze di equilibrio. La leggerezza non è superficialità: è la frequenza della variante già realizzata, quindi la sola che risuona con essa.',
  34: 'Tecnica dei Tre Conseguimenti (Apocrifo). Tre angolazioni diverse dello stesso obiettivo (stato / qualità / azione) impediscono la ripetizione meccanica, che il sistema classifica come pendolo e neutralizza.',
  35: 'Tafti — settima regola. Il corridoio delle varianti si manifesta solo camminandolo: aspettare il momento «giusto» è la Ragione che riprende il controllo, e il corridoio si richiude senza che te ne accorga.',
  36: 'Tafti — ottava regola. Tirare a sé col pensiero riattiva l\'importanza: le forze di equilibrio ripartono. La chiusura è parte tecnica dell\'impostazione, non suo post-scriptum — dimenticare è azione, non omissione.',
  37: 'Transurfing IV. Coerenza delle scale temporali = corridoio stabile. La mossa di oggi è l\'unico punto in cui la scala anno si realizza materialmente. Senza mossa di oggi, l\'anno è astratto e i settori non si aprono.',
  38: 'Tafti — la sacerdotessa Itfat (g29). Incarna la postura di chi non cerca approvazione. L\'approvazione cercata è corrente di energia verso i pendoli: quando smette, il pendolo si dissipa senza che tu faccia altro.',
  39: 'Le 8 regole di Tafti formano il motore della Metaforza. Ognuna isola un modo specifico di tornare all\'intenzione interna — vedere dove resisti è vedere dove il motore perde carburante.',
  40: '"Transurfing di Sé" (2025). Il Sé-attore è il ruolo attualmente interpretato nel film. Osservarlo senza giudizio rompe l\'identificazione e apre lo spazio interno per il Sé-regista.',
  41: '"Transurfing di Sé". Lo spettatore è la coscienza da cui parte ogni impostazione. Non è passivo: è il punto neutro da cui si può riscegliere la scena — è la sede della Scintilla del Creatore in movimento.',
  42: '"Transurfing di Sé". Il regista sceglie la scena successiva impostandola dalla Treccia. Una scena per volta — dirigere tutta la giornata riattiva il volere e riduce la scena a controllo ansioso.',
  43: 'Tafti — terza delle 4 inversioni. L\'automatismo diventa pulsante di risveglio invece di schiavitù. «Eccolo» è la parola-tecnica: non giudizio, riconoscimento. Ogni riconoscimento indebolisce il filo del Manichino.',
  44: '"Le Regole dello Spazio". La missione è un settore del campo dove la tua frequenza di base è naturale; si riconosce dalla scomparsa del tempo nell\'attività. Non si sceglie — si nota in cui già accade.',
  45: '"Le Regole dello Spazio". La missione emerge dal pattern, non dall\'introspezione. La Ragione non può dedurla — l\'Anima la riconosce vedendo ricorrenze nei dati raccolti senza filtro nella settimana precedente.',
  46: 'Tafti — Realizzazione 1 (g37). Dopo l\'impostazione, l\'azione che segue senza re-interrogazione. Ogni nuovo pro-contro è rumore della Ragione che riprende il controllo — e riattiva le forze di equilibrio.',
  47: 'Tafti — Realizzazione 2 (g38). Chiudere è atto tecnico: la scena deve potersi compiere senza il pensiero che la tira. La rumination post-azione è pendolo di auto-giudizio, uno dei più subdoli del canone.',
  48: 'Zeland avverte (Apocrifo): i pendoli non si dissolvono tutti uniformemente — alcuni si riducono ma restano nello sfondo. Il delta è il dato tecnico significativo, non il raggiungimento di zero.',
  49: 'La direzione annuale dalla Treccia è l\'impostazione-madre: una sola linea, perché l\'albero si diramerà da sé lungo l\'anno. Elenchi = Ragione che ancora organizza anticipatamente il corridoio, chiudendolo.',
  50: 'Un giorno senza i due dispositivi primari (voce, telefono) ricalibra gli schermi (g36). La distinzione interno/esterno smette di essere concetto e diventa percezione — soglia tecnica dell\'autonomia dai pendoli mediatici.',
  51: 'Transurfing IV-V. La gratitudine come stato (non come elenco) è una delle frequenze più pulite per il coordinamento dell\'intenzione. Elencare è Ragione; abitare è Anima — e la Metaforza risponde alla seconda.',
  52: 'La persona che chiude non è quella che ha iniziato — è il segno tecnico che il coordinamento degli stati ha lavorato. Non sintesi: testo libero come specchio. Nel modello Tafti, la missione si rivela proprio in questi passaggi di soglia.'
};
// Componente menu orbitale: settimane che ruotano attorno a un mondo centrale
function OrbitalUniverse({ progress, current, selected, onSelect, blocchi }) {
  const [paused, setPaused] = useState(false);
  // Organizza le 52 settimane in 4 anelli (uno per blocco, 13 settimane ciascuno)
  const anelli = blocchi.map(b => ({
    blocco: b,
    settimane: SETTIMANE.filter(s => s.blocco === b.n)
  }));
  const radiusMap = { 1: 21, 2: 28, 3: 35, 4: 42 }; // in cqw (% della larghezza del contenitore)
  const sel = selected ? SETTIMANE.find(s => s.n === selected) : null;
  const selDett = sel ? DETTAGLI_SETTIMANE[sel.n] : null;
  const selTeoria = sel ? TEORIA_SETTIMANE[sel.n] : null;
  const selBlocco = sel ? blocchi[sel.blocco - 1] : null;
  return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("div", {
      className: "orbit-scene" + (paused ? " paused" : ""),
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false)
    },
      /*#__PURE__*/React.createElement("div", { className: "orbit-universe" },
        // Anelli con linee guida
        anelli.map((a, idx) => /*#__PURE__*/React.createElement("div", {
          key: 'ring-' + a.blocco.n,
          className: "orbit-ring ring-" + a.blocco.n,
          style: { borderColor: `rgba(180,150,240,${0.10 + idx * 0.03})` }
        },
          // Settimane sull'anello
          a.settimane.map((s, i) => {
            const angle = (360 / a.settimane.length) * i;
            const r = radiusMap[a.blocco.n];
            const done = !!progress[s.n];
            const isCurrent = !done && s.n === current;
            const isSelected = selected === s.n;
            return /*#__PURE__*/React.createElement("div", {
              key: s.n,
              className: "orbit-item" + (done ? " done" : "") + (isCurrent ? " current" : "") + (isSelected ? " selected" : ""),
              style: {
                transform: `rotateZ(${angle}deg) translateY(-${r}cqw)`
              },
              title: `S${String(s.n).padStart(2, '0')} · ${s.tema}`,
              onClick: (e) => { e.stopPropagation(); onSelect(s.n); }
            },
              /*#__PURE__*/React.createElement("div", {
                className: "orbit-item-face",
                style: { transform: `rotateX(-58deg) rotateZ(${-angle}deg)` }
              }, String(s.n).padStart(2, '0'))
            );
          })
        )),
        // Mondo centrale
        /*#__PURE__*/React.createElement("div", {
          className: "orbit-center",
          onClick: () => onSelect(null),
          title: "Centro: clicca su una settimana per aprirla"
        })
      ),
      /*#__PURE__*/React.createElement("div", { className: "orbit-center-label" }, "Ars Realis")
    ),
    /*#__PURE__*/React.createElement("div", {
      className: "text-xs mono mt-3 text-center",
      style: { color: 'var(--ink-mute)' }
    }, "Passa il mouse per fermare la rotazione · clicca una settimana per aprirla"),
    sel && selDett && /*#__PURE__*/React.createElement("div", { className: "orbit-detail reveal in" },
      /*#__PURE__*/React.createElement("div", { className: "orbit-detail-head" },
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", {
            className: "mono text-xs uppercase tracking-widest mb-1",
            style: { color: selBlocco.c }
          }, "Blocco ", sel.blocco, " · Settimana ", String(sel.n).padStart(2, '0')),
          /*#__PURE__*/React.createElement("div", {
            className: "serif text-2xl",
            style: { letterSpacing: '-0.01em' }
          }, sel.tema)
        ),
        /*#__PURE__*/React.createElement("span", {
          className: "chip",
          style: { color: selBlocco.c, whiteSpace: 'nowrap' }
        }, selBlocco.t)
      ),
      /*#__PURE__*/React.createElement("div", { className: "orbit-detail-grid" },
        /*#__PURE__*/React.createElement("div", { className: "orbit-detail-block" },
          /*#__PURE__*/React.createElement("h4", null, "Obiettivo"),
          /*#__PURE__*/React.createElement("p", null, selDett.obiettivo)
        ),
        /*#__PURE__*/React.createElement("div", { className: "orbit-detail-block" },
          /*#__PURE__*/React.createElement("h4", null, "Pratica quotidiana"),
          /*#__PURE__*/React.createElement("p", null, selDett.pratica_quotidiana)
        ),
        /*#__PURE__*/React.createElement("div", { className: "orbit-detail-block" },
          /*#__PURE__*/React.createElement("h4", null, "Come misurarla"),
          /*#__PURE__*/React.createElement("p", null, selDett.misura)
        ),
        /*#__PURE__*/React.createElement("div", { className: "orbit-detail-block" },
          /*#__PURE__*/React.createElement("h4", null, "Trappola da evitare"),
          /*#__PURE__*/React.createElement("p", null, selDett.trappola)
        ),
        selTeoria && /*#__PURE__*/React.createElement("div", {
          className: "orbit-detail-block orbit-detail-teoria",
          style: { gridColumn: '1 / -1' }
        },
          /*#__PURE__*/React.createElement("h4", null, "Teoria \u2014 dai libri di Zeland"),
          /*#__PURE__*/React.createElement("p", null, selTeoria)
        )
      )
    )
  );
}
function Roadmap() {
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ts_progress') || '{}');
    } catch (e) {
      return {};
    }
  });
  const [current, setCurrent] = useState(() => {
    try {
      return parseInt(localStorage.getItem('ts_current') || '1');
    } catch (e) {
      return 1;
    }
  });
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    try {
      localStorage.setItem('ts_progress', JSON.stringify(progress));
    } catch (e) {}
  }, [progress]);
  useEffect(() => {
    try {
      localStorage.setItem('ts_current', String(current));
    } catch (e) {}
  }, [current]);
  const toggleDone = n => setProgress({
    ...progress,
    [n]: !progress[n]
  });
  const doneCount = Object.values(progress).filter(Boolean).length;
  const sel = selected ? SETTIMANE.find(s => s.n === selected) : SETTIMANE.find(s => s.n === current);
  const blocchi = [{
    n: 1,
    t: 'Fondamenta',
    d: 'Presenza, pendoli, importanza. Il terreno di base.',
    c: 'var(--gold)',
    sottotitolo: 'Terreno base \u2014 disarmo degli automatismi',
    descrizione: 'Il primo arco non aggiunge tecniche spettacolari: disarma gli automatismi. Si entra nel film (Tafti, risveglio cosciente nella scena), si impara a distinguere schermo esterno e schermo interno, si identificano i primi pendoli personali e si prova a «caderne fuori» sul pi\u00F9 forte senza combatterlo. Nella seconda met\u00E0 si scende sul piano dei potenziali eccedenti \u2014 la formula \xABva bene in entrambi i casi\xBB diventa parte del parlato interno \u2014 e si costruisce il primo slide vissuto dall\'interno, non guardato da fuori. Si aprono i temi del frejling (offrire prima di chiedere) e del coordinamento dell\'intenzione (accogliere l\'imprevisto come tassello del piano). Si chiude con l\'albero degli obiettivi (Transurfing III) e la prima revisione tecnica \u2014 non bilancio psicologico, ma discernimento: cosa \xE8 gi\xE0 carne, cosa \xE8 ancora parola.',
    arco: 'Da automatismo inconsapevole \u2192 presenza intermittente. La pratica ti fa vedere il Manichino, non lo smonta ancora.',
    testi: 'Transurfing I (Lo Spazio delle Varianti), II (Il Fruscio delle Stelle del Mattino), III (Avanti nel Passato); Tafti la Sacerdotessa (primi capitoli su schermi e risveglio).',
    insidia: 'Credere che basti aver capito il concetto. Il concetto non cambia linee di vita \u2014 la pratica ripetuta s\xEC. Leggere due volte meno e praticare due volte di pi\xF9.'
  }, {
    n: 2,
    t: 'Lavoro del corpo',
    d: 'Sistema tecnogeno, pulizia, silenzio, scintilla.',
    c: 'var(--ink-dim)',
    sottotitolo: 'Liberazione energetica \u2014 dal rumore al carburante',
    descrizione: 'Il secondo arco sposta il fuoco dalla mente al corpo-energia. Zeland \xE8 esplicito: senza energia libera le impostazioni restano parole. Si riduce il carico del sistema tecnogeno (due elementi pi\xF9 pesanti per te, non una lista universale), si porta un pasto vivo al giorno (\u010DistoPitanie, non dieta ideologica), si fa spazio al silenzio assoluto e al movimento all\'aperto senza cuffiette \u2014 ricucitura del ritmo naturale. A met\xE0 arco si tocca la Scintilla del Creatore: non da costruire, da riconoscere come punto di presenza viva al centro del petto. Si installa la distinzione quotidiana \xABmio vs. pendolo\xBB (funzione di Vershitel\', il proiettore pre-Tafti), si pratica il permesso \u2014 all\'altro e a s\xE9 \u2014 e si recide coscientemente un filo del Manichino. Si chiude con la prima revisione di met\xE0 anno.',
    arco: 'Da spese invisibili di energia \u2192 recupero di carburante per la Metaforza. Il corpo smette di essere solo veicolo e diventa strumento energetico.',
    testi: 'Transurfing V (Scardinare il Sistema Tecnogeno); Cosa Non Ha Detto Tafti (\u010DistoPitanie, kLIBE); Le Regole dello Spazio (ritmo naturale, permesso).',
    insidia: 'Farne dieta ideologica o ritiro spirituale solenne. Lo scopo \xE8 tecnico \u2014 liberare energia, non diventare puri. Un solo pasto, una sola recisione, vera.'
  }, {
    n: 3,
    t: 'Metaforza',
    d: 'Treccia, le 8 regole, impostazione diretta.',
    c: 'var(--crimson-bright)',
    sottotitolo: 'Il motore operativo \u2014 la tecnologia centrale di Tafti',
    descrizione: 'Il terzo arco introduce la tecnologia operativa dell\'intenzione esterna. Si localizza la Treccia \u2014 zona soggettiva dietro le scapole, non anatomia \u2014 senza ancora impostare nulla: solo percezione che quel punto esiste. Poi, la prima impostazione breve dalla Treccia, al presente, seguita dalla dimenticanza tecnica (non pigrizia: chiusura del circuito). Da qui si attraversano le 8 regole di Tafti una settimana per ciascuna: Presenza, Impostare-non-volere, Dalla-Treccia, Breve, Leggero, Triplice (i tre conseguimenti dall\'Apocrifo), Seguire (agire sul primo corridoio), Dimenticare. Ogni regola isola un modo specifico in cui la Metaforza si guasta ritornando intenzione interna. Si chiude con la tecnica dei tre movimenti (tre scale temporali coerenti) e la postura di Itfat: chi non cerca approvazione. Si misura quale regola \xE8 entrata, quale resiste.',
    arco: 'Da chiedere al mondo \u2192 impostare dalla Treccia. La differenza non \xE8 di parole: \xE8 di punto di emissione, e il corpo lo sente.',
    testi: 'Tafti la Sacerdotessa (canone centrale, le 8 regole, Treccia, Scintilla, Itfat); Apocrifo (Tecnica dei Tre Conseguimenti); Le Regole dello Spazio per le impostazioni nella relazione.',
    insidia: 'Trasformare le regole in mantra ripetuti. La regola non serve a riempire la giornata \u2014 serve a notare dove il motore perde. Una regola praticata con presenza vale 50 ripetute in automatico.'
  }, {
    n: 4,
    t: 'Transurfing di s\xE9',
    d: 'S\xE9-attore/spettatore/regista, missione, chiusura.',
    c: '#ee6278',
    sottotitolo: 'Il tempo del regista \u2014 presenza al proprio film',
    descrizione: 'Il quarto arco \xE8 il pi\xF9 recente (Zeland 2025) e volta la pratica verso il praticante stesso. Si attraversa la triade S\xE9-attore (un giorno osservando il ruolo che interpreti), S\xE9-spettatore (un giorno dalla platea: vedi senza intervenire), S\xE9-regista (un giorno scegliendo una scena e impostandola). Si usa l\'addormentamento automatico come pulsante di risveglio \u2014 terza delle quattro inversioni Tafti: ogni volta che ti scopri in autopilota, la parola-tecnica \xABeccolo\xBB riporta. A met\xE0 arco si apre il tema della missione: non si cerca, si raccoglie senza interpretare (Le Regole dello Spazio). Il pattern emerger\xE0 dai dati, non dall\'introspezione. Si lavora Realizzazione 1 (agire senza re-interrogare) e Realizzazione 2 (chiudere senza tirare mentalmente il risultato). Si torna sul pendolo principale di inizio anno per misurare il delta \u2014 non il raggiungimento di zero, il cambiamento di peso. Si chiude con intenzione annuale dalla Treccia (una sola linea), un giorno di silenzio e schermi, gratitudine come stato, revisione annuale libera.',
    arco: 'Da protagonista senza copione \u2192 co-regista cosciente del proprio film. La persona che chiude l\'anno non \xE8 quella che ha iniziato \u2014 \xE8 il segno tecnico che il coordinamento ha lavorato.',
    testi: 'Transurfing di S\xE9 (2025, opera pi\xF9 recente); Tafti (Realizzazioni 1 e 2, quarta inversione); Le Regole dello Spazio (missione come settore di frequenza naturale).',
    insidia: 'Chiudere l\'anno con una sintesi definitiva. L\'anno \xE8 un capitolo, non il cammino. La missione non \xE8 monumentale: spesso \xE8 cucinare per altri, riparare oggetti, ascoltare. Piccolo e vero batte grande e retorico.'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-num mb-2"
  }, "05 \xB7 52 SETTIMANE"), /*#__PURE__*/React.createElement("h2", {
    className: "text-5xl serif mb-4",
    style: {
      letterSpacing: '-0.01em'
    }
  }, "Un anno, ", /*#__PURE__*/React.createElement("span", {
    className: "italic",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "una pratica per volta"), "."), /*#__PURE__*/React.createElement("p", {
    className: "text-base max-w-3xl mb-8 leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "52 settimane ordinate in quattro blocchi. Non c\\'\xE8 fretta, non ci sono scorciatoie: una settimana = una pratica sola. Se la settimana \xE8 dura, ripeti. Se \xE8 chiara, avanza. Il corpo-attenzione si struttura nei mesi, non nei giorni."), /*#__PURE__*/React.createElement("div", {
    className: "card p-5 mb-8 flex items-center gap-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono uppercase text-[10px] tracking-widest",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Progresso"), /*#__PURE__*/React.createElement("div", {
    className: "serif text-3xl mt-1"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--crimson-bright)'
    }
  }, doneCount), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-mute)'
    }
  }, " / 52"))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-1.5",
    style: {
      background: 'var(--bg-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full transition-all duration-500",
    style: {
      width: `${doneCount / 52 * 100}%`,
      background: 'linear-gradient(90deg, var(--gold), var(--crimson))'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-xs mt-2",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Settimana corrente: ", /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--gold)'
    }
  }, String(current).padStart(2, '0')), " \u2014 clicca su una cella per aprire i dettagli."))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-5 mb-10"
  }, blocchi.map(b => {
    const done = SETTIMANE.filter(s => s.blocco === b.n && progress[s.n]).length;
    const first = SETTIMANE.find(s => s.blocco === b.n).n;
    const last = SETTIMANE.filter(s => s.blocco === b.n).slice(-1)[0].n;
    return /*#__PURE__*/React.createElement("div", {
      key: b.n,
      className: "card p-6 block-arco",
      style: {
        borderLeft: `3px solid ${b.c}`
      }
    },
      /*#__PURE__*/React.createElement("div", {
        className: "flex items-baseline gap-4 flex-wrap mb-2"
      },
        /*#__PURE__*/React.createElement("span", {
          className: "mono text-xs uppercase tracking-widest",
          style: { color: b.c }
        }, "Blocco ", b.n),
        /*#__PURE__*/React.createElement("span", {
          className: "serif text-2xl",
          style: { letterSpacing: '-0.01em' }
        }, b.t),
        /*#__PURE__*/React.createElement("span", {
          className: "mono text-xs ml-auto",
          style: { color: 'var(--ink-mute)' }
        }, "S", String(first).padStart(2, '0'), "\u2014S", String(last).padStart(2, '0'), " \xB7 ", done, "/13")
      ),
      /*#__PURE__*/React.createElement("div", {
        className: "mono text-[10px] uppercase tracking-widest mb-3",
        style: { color: 'var(--gold-dim)' }
      }, b.sottotitolo),
      /*#__PURE__*/React.createElement("p", {
        className: "text-sm leading-relaxed mb-4",
        style: { color: 'var(--ink)' }
      }, b.descrizione),
      /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-5 pt-4",
        style: { borderTop: '1px solid rgba(180,150,240,0.15)' }
      },
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", {
            className: "mono text-[10px] uppercase tracking-widest mb-1.5",
            style: { color: b.c }
          }, "Arco interno"),
          /*#__PURE__*/React.createElement("div", {
            className: "text-xs leading-relaxed",
            style: { color: 'var(--ink-dim)' }
          }, b.arco)
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", {
            className: "mono text-[10px] uppercase tracking-widest mb-1.5",
            style: { color: b.c }
          }, "Testi di riferimento"),
          /*#__PURE__*/React.createElement("div", {
            className: "text-xs leading-relaxed italic",
            style: { color: 'var(--ink-dim)' }
          }, b.testi)
        ),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", {
            className: "mono text-[10px] uppercase tracking-widest mb-1.5",
            style: { color: b.c }
          }, "Insidia ricorrente"),
          /*#__PURE__*/React.createElement("div", {
            className: "text-xs leading-relaxed",
            style: { color: 'var(--ink-dim)' }
          }, b.insidia)
        )
      )
    );
  })), /*#__PURE__*/React.createElement("div", {
    className: "roadmap-grid gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-13 gap-1",
    style: {
      gridTemplateColumns: 'repeat(13, minmax(0, 1fr))'
    }
  }, SETTIMANE.map(s => {
    const done = !!progress[s.n];
    const isCurrent = !done && s.n === current;
    const isSel = selected === s.n;
    return /*#__PURE__*/React.createElement("div", {
      key: s.n,
      className: "week-cell " + (done ? 'done' : '') + (isCurrent ? ' current' : ''),
      style: {
        borderWidth: isSel ? '2px' : '1px',
        borderColor: isSel ? 'var(--crimson-bright)' : undefined
      },
      title: `S${s.n}: ${s.tema}`,
      onClick: () => {
        setSelected(s.n);
        setCurrent(s.n);
      }
    }, String(s.n).padStart(2, '0'));
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] mono mt-2 flex gap-4",
    style: {
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u2014 vuoto: non iniziata"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold)'
    }
  }, "\u2014 oro: corrente"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "\u2014 crimson: completata")), /*#__PURE__*/React.createElement("div", {
    className: "mt-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "section-num"
  }, "PERCORSO COMPLETO"), /*#__PURE__*/React.createElement("span", {
    className: "section-rule"
  })), blocchi.map(b => /*#__PURE__*/React.createElement("details", {
    key: b.n,
    className: "mb-4",
    open: b.n === 1
  }, /*#__PURE__*/React.createElement("summary", {
    className: "flex items-baseline gap-3 py-2 px-3",
    style: {
      background: 'var(--bg-2)',
      borderLeft: `2px solid ${b.c}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chevron",
    style: {
      color: b.c
    }
  }, "\u25B8"), /*#__PURE__*/React.createElement("span", {
    className: "mono text-xs uppercase tracking-widest",
    style: {
      color: b.c
    }
  }, "Blocco ", b.n), /*#__PURE__*/React.createElement("span", {
    className: "serif text-base flex-1"
  }, b.t), /*#__PURE__*/React.createElement("span", {
    className: "mono text-xs",
    style: {
      color: 'var(--ink-mute)'
    }
  }, "S", SETTIMANE.find(s => s.blocco === b.n).n, "\u2014S", SETTIMANE.filter(s => s.blocco === b.n).slice(-1)[0].n)), /*#__PURE__*/React.createElement("div", {
    className: "pl-6 py-2 space-y-1"
  }, SETTIMANE.filter(s => s.blocco === b.n).map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    className: "week-row " + (progress[s.n] ? 'done ' : '') + (selected === s.n ? 'is-selected' : ''),
    onClick: () => {
      setSelected(s.n);
      setCurrent(s.n);
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!progress[s.n],
    onChange: () => toggleDone(s.n),
    onClick: e => e.stopPropagation(),
    "aria-label": `Segna settimana ${s.n} come completata`
  }), /*#__PURE__*/React.createElement("span", {
    className: "week-num",
    style: {
      color: progress[s.n] ? 'var(--crimson-bright)' : 'var(--ink-mute)'
    }
  }, "S", String(s.n).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    className: "week-title"
  }, s.tema)))))))), /*#__PURE__*/React.createElement("aside", {
    className: "roadmap-aside"
  }, sel && /*#__PURE__*/React.createElement("div", {
    className: "card p-6 glow-border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-between mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono text-xs uppercase tracking-widest",
    style: {
      color: blocchi[sel.blocco - 1].c
    }
  }, "Settimana ", String(sel.n).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    className: "chip",
    style: {
      color: blocchi[sel.blocco - 1].c
    }
  }, blocchi[sel.blocco - 1].t)), /*#__PURE__*/React.createElement("div", {
    className: "serif text-2xl mb-4",
    style: {
      letterSpacing: '-0.01em'
    }
  }, sel.tema), /*#__PURE__*/React.createElement("div", {
    className: "mono uppercase text-[10px] tracking-widest mb-2",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "La pratica"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed mb-5",
    style: {
      color: 'var(--ink)'
    }
  }, sel.pratica), GIORNI_SETTIMANE[sel.n] && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mono uppercase text-[10px] tracking-widest mb-2",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Programma giorno per giorno"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 mb-5"
  }, GIORNI_SETTIMANE[sel.n].map(giorno => /*#__PURE__*/React.createElement("div", {
    key: giorno.g,
    className: "border-l-2 pl-3 py-1",
    style: {
      borderColor: blocchi[sel.blocco - 1].c + '55'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono text-[10px] uppercase tracking-widest",
    style: {
      color: blocchi[sel.blocco - 1].c,
      minWidth: '3rem'
    }
  }, "Giorno ", giorno.g), /*#__PURE__*/React.createElement("span", {
    className: "serif text-sm",
    style: {
      color: 'var(--ink)',
      fontWeight: 500
    }
  }, giorno.t)), /*#__PURE__*/React.createElement("div", {
    className: "text-xs leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, giorno.d))))), sel.tec.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mono uppercase text-[10px] tracking-widest mb-2",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Tecniche collegate"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1 mb-5"
  }, sel.tec.map(id => {
    const t = TECNICHE.find(x => x.id === id);
    if (!t) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: id,
      className: "text-xs flex items-baseline gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        color: 'var(--crimson-bright)'
      }
    }, t.id.toUpperCase()), /*#__PURE__*/React.createElement("span", {
      className: "serif",
      style: {
        color: 'var(--ink-dim)'
      }
    }, t.titolo));
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn " + (progress[sel.n] ? 'ghost' : 'primary'),
    style: {
      width: '100%'
    },
    onClick: () => toggleDone(sel.n)
  }, progress[sel.n] ? '↺ Segna come non-completata' : '✓ Segna come completata')))));
}
// ============================================================
// BIBLIOTECA — fonti e letture
// ============================================================
const PDF_LOCALI = [{
  file: 'Lo Spazio Delle Varianti Come Scivolare Attraverso La Realtà Reality Transurfing Vadim Zeland Z-Library.pdf',
  t: 'Transurfing I — Lo Spazio delle Varianti',
  y: 2004,
  d: 'Primo stadio. I pilastri: spazio varianti, pendoli, importanza, slide, intenzione. Il libro di fondazione del sistema.',
  tipo: 'classic'
}, {
  file: 'ebook_reality_transurfing_il_fruscio_delle_stelle_del_mattino.pdf',
  t: 'Transurfing II — Il Fruscio delle Stelle del Mattino',
  y: 2004,
  d: 'Secondo stadio. Approfondimento dello slide, frejling, vivere l\'immagine dell\'obiettivo.',
  tipo: 'classic'
}, {
  file: 'ebook_realitytransurfing_avanti_nel_passato.pdf',
  t: 'Transurfing III — Avanti nel Passato',
  y: 2005,
  d: 'Terzo stadio. Il cuore teorico sui pendoli e sul flusso delle varianti.',
  tipo: 'classic'
}, {
  file: 'Reality Transurfing 4.0 Transurfing. Vivo oltre i confini della Matrix (Vadim Zeland) (Z-Library).pdf',
  t: 'Transurfing 4.0 — Vivo oltre la Matrix',
  y: 2010,
  d: 'Volume di sintesi degli stadi 4 e 5. Specchio duale, mele che cadono nel cielo.',
  tipo: 'classic'
}, {
  file: 'Reality-Transurfing.-Le-Regole-dello-Spazio.epub.pdf',
  t: 'Transurfing — Le Regole dello Spazio',
  y: 2008,
  d: 'Compendio delle regole operative dello spazio delle varianti.',
  tipo: 'classic'
}, {
  file: 'Reality Transurfing 5.0. Scardinare il sistema tecnogeno (Vadim Zeland) (Z-Library).pdf',
  t: 'Transurfing 5.0 — Scardinare il Sistema Tecnogeno (kLIBE)',
  y: 2012,
  d: 'Svolta critica. Il sistema tecnogeno, cibo, media, dipendenze — come liberarsi.',
  tipo: 'expansion'
}, {
  file: 'Tafti la sacerdotessa. Camminando dal vivo in un film (Vadim Zeland) (Z-Library).pdf',
  t: 'Tafti la Sacerdotessa — Camminando dal vivo in un film',
  y: 2018,
  d: 'Il libro della svolta. Voce narrativa di Tafti, Metaforza, Treccia, le inversioni.',
  tipo: 'tafti'
}, {
  file: 'Cosa Non Ha Detto Tafti (Vadim Zeland) (Z-Library).pdf',
  t: 'Cosa non ha detto Tafti',
  y: 2019,
  d: 'Q&A sistematico dopo Tafti: Treccia, Schermi, Realizzazione 1&2, Manichino, relazioni, soldi, missione.',
  tipo: 'tafti'
}, {
  file: 'Il Proiettore della Realta Separata - Compendio Italiano (2006).pdf',
  t: 'Il Proiettore della Realtà Separata — Compendio IT',
  y: 2006,
  d: 'Compendio educativo italiano della community. Sintesi operativa della fase 2006: i tre fasci del proiettore (attenzione, intenzione, emissione), pendoli, slide, coordinamento, protocollo 21 giorni.',
  tipo: 'compendio'
}, {
  file: 'I Mattoni della Metaforza - Tafti 2 - Compendio Italiano (2024).pdf',
  t: 'I Mattoni della Metaforza (Tafti 2) — Compendio IT',
  y: 2024,
  d: 'Compendio educativo italiano della community. Le otto regole della Metaforza esposte come percorso pratico di 8 settimane: uscire dal film, fare la mossa, pivot, importanza vs interesse, schermo, pre-film, ringraziare.',
  tipo: 'compendio'
}, {
  file: 'Trasferirsi - L\'ultimo movimento - Compendio Italiano (2025).pdf',
  t: 'Trasferirsi — L\'ultimo movimento — Compendio IT',
  y: 2025,
  d: 'Compendio educativo italiano della community. Il movimento finale: dalla selezione delle varianti alla cura di sé. Respiro lento, decisione di meno, cura esposta, calendario delle 12 settimane.',
  tipo: 'compendio'
}, {
  file: 'zelandiano glossario.pdf',
  t: 'Glossario Zelandiano',
  y: null,
  d: 'Raccolta curata dei 42+ concetti chiave con termini bilingue IT/RU ed esempi pratici.',
  tipo: 'glossario'
}];
const FONTI_RUSSE = [{
  nome: 'zelands.ru',
  d: 'Sito ufficiale di Vadim Zeland. Sezione «Biblioteca» con testi integrali di alcuni libri e risorse audio-video.',
  tipo: 'ufficiale',
  url: 'https://zelands.ru'
}, {
  nome: 'tserf.ru',
  d: 'Portale didattico ufficiale del Transurfing. Corsi, webinar, forum di pratica.',
  tipo: 'ufficiale',
  url: 'https://tserf.ru'
}, {
  nome: 'VK: Transurfing della Realtà',
  d: 'Gruppo ufficiale su VKontakte. Pubblicazioni di Zeland, discussioni, testimonianze di pratica.',
  tipo: 'community',
  url: 'https://vk.com/transurfing'
}, {
  nome: 'Telegram: Transurfing',
  d: 'Canali telegram di pratica quotidiana. Citazioni, esercizi, gruppo di lettura Tafti 2.',
  tipo: 'community'
}, {
  nome: 'LiveJournal: zeland',
  d: 'Blog storico di Zeland (pre-Tafti). Archivio di post e dialoghi con i lettori.',
  tipo: 'archivio'
}, {
  nome: 'Litres.ru · Labirint.ru',
  d: 'Edizioni ufficiali in russo di tutti i libri. Letture integrali in e-book.',
  tipo: 'libri'
}];
const LETTURE_CONSIGLIATE = [{
  ordine: 1,
  t: 'Transurfing I — Spazio delle Varianti (2004)',
  why: 'Senza questo, niente ha senso. Spazio varianti, pendoli, intenzione.'
}, {
  ordine: 2,
  t: 'Transurfing III — Avanti nel Passato (2005)',
  why: 'Il cuore teorico: pendoli svolti per esteso e coordinamento.'
}, {
  ordine: 3,
  t: 'Transurfing V — Le mele cadono nel cielo (2006)',
  why: 'Sintesi operativa. Se leggi solo uno dei classici, questo.'
}, {
  ordine: 4,
  t: 'Tafti la Sacerdotessa (2018)',
  why: 'Lo stile cambia, il sistema pure. Prima del 2018 c\'è la geometria. Qui c\'è il gesto.'
}, {
  ordine: 5,
  t: 'Cosa non ha detto Tafti (2019)',
  why: 'Indispensabile per capire Treccia, Schermi, Realizzazione 1&2.'
}, {
  ordine: 6,
  t: 'Tafti 2 — Controllo della realtà (2024)',
  why: 'Le 8 regole della Metaforza. La forma più matura del sistema.'
}, {
  ordine: 7,
  t: 'Trasferirsi (2025)',
  why: 'L\'ultimo movimento: dal controllo del mondo alla cura di sé.'
}];
const PDF_PASSWORD_HASH = '505ba855bcd37422d03bb933ae79fae045c3f9b86971549d4a6e21097bf324cb';
async function hashPassword(pw) {
  const buf = new TextEncoder().encode(pw);
  const h = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function PdfGate({ onUnlock }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(null);
  const [checking, setChecking] = useState(false);
  const submit = async () => {
    if (!pw.trim()) return;
    setChecking(true); setErr(null);
    try {
      const h = await hashPassword(pw.trim());
      if (h === PDF_PASSWORD_HASH) {
        try { sessionStorage.setItem('ts_pdf_auth', '1'); } catch (e) {}
        onUnlock(true);
      } else { setErr('Password errata.'); }
    } catch (e) { setErr('Errore nella verifica: ' + e.message); }
    finally { setChecking(false); }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in",
    style: { position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card p-10 glow-border",
    style: { width: 'min(440px,90vw)' }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest mb-3",
    style: { color: 'var(--gold-dim)' }
  }, "Accesso Biblioteca"), /*#__PURE__*/React.createElement("div", {
    className: "serif text-3xl mb-2",
    style: { letterSpacing: '-0.01em' }
  }, "Password richiesta"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm mb-6 leading-relaxed",
    style: { color: 'var(--ink-dim)' }
  }, "I PDF della biblioteca sono riservati ai membri della community. Inserisci la password che ti \xE8 stata condivisa per sbloccare la lettura."), /*#__PURE__*/React.createElement("input", {
    type: "password", autoFocus: true, placeholder: "Password",
    value: pw, onChange: e => setPw(e.target.value),
    onKeyDown: e => { if (e.key === 'Enter') submit(); }
  }), err && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-xs mono",
    style: { color: 'var(--crimson-bright)' }
  }, "\u2715 ", err), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-5"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary", onClick: submit, disabled: checking
  }, checking ? 'Verifico…' : 'Sblocca →'), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost", onClick: () => onUnlock(false)
  }, "Annulla")), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] mt-5 mono",
    style: { color: 'var(--ink-mute)', lineHeight: 1.6 }
  }, "Nota: la password viene verificata localmente tramite hash SHA-256. Una volta sbloccata, la sessione resta aperta finch\xE9 non chiudi la scheda del browser.")));
}
function PdfViewer({
  pdf,
  onClose
}) {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem('ts_pdf_auth') === '1'; } catch (e) { return false; }
  });
  if (!pdf) return null;
  if (!authed) {
    return /*#__PURE__*/React.createElement(PdfGate, {
      onUnlock: (ok) => { if (ok === false) { onClose(); } else { setAuthed(true); } }
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-6 py-3",
    style: {
      borderBottom: '1px solid var(--line)',
      background: 'var(--bg-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono text-xs uppercase tracking-widest",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "PDF"), /*#__PURE__*/React.createElement("span", {
    className: "serif text-lg"
  }, pdf.t), pdf.y && /*#__PURE__*/React.createElement("span", {
    className: "mono text-xs",
    style: {
      color: 'var(--ink-mute)'
    }
  }, "\xB7 ", pdf.y)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("a", {
    href: encodeURI(pdf.file),
    target: "_blank",
    rel: "noopener",
    className: "btn ghost text-xs"
  }, "Apri in nuova scheda \u2197"), /*#__PURE__*/React.createElement("a", {
    href: encodeURI(pdf.file),
    download: true,
    className: "btn ghost text-xs"
  }, "\u2193 Scarica"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: onClose
  }, "Chiudi \u2715"))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1",
    style: {
      background: '#222'
    }
  }, /*#__PURE__*/React.createElement("iframe", {
    src: encodeURI(pdf.file) + '#view=FitH',
    style: {
      width: '100%',
      height: '100%',
      border: 'none'
    },
    title: pdf.t
  })));
}
function Biblioteca() {
  const [tab, setTab] = useState('pdf');
  const [openPdf, setOpenPdf] = useState(null);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-num mb-2"
  }, "06 \xB7 BIBLIOTECA"), /*#__PURE__*/React.createElement("h2", {
    className: "text-5xl serif mb-4",
    style: {
      letterSpacing: '-0.01em'
    }
  }, "Fonti ", /*#__PURE__*/React.createElement("span", {
    className: "italic",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "vive"), "."), /*#__PURE__*/React.createElement("p", {
    className: "text-base max-w-3xl mb-10 leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Tre cose qui: i PDF della tua cartella di lavoro (clicca per aprirli), le fonti ufficiali in russo per chi vuole andare alla radice, e un ordine di lettura che ha senso. L'originale \xE8 sempre in russo: le traduzioni italiane esistono per ", /*#__PURE__*/React.createElement("em", null, "Tafti"), ", ", /*#__PURE__*/React.createElement("em", null, "Cosa non ha detto Tafti"), " e i cinque stadi classici."), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === 'pdf' ? 'primary' : 'ghost'),
    onClick: () => setTab('pdf')
  }, "Cartella locale"), /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === 'ordine' ? 'primary' : 'ghost'),
    onClick: () => setTab('ordine')
  }, "Ordine di lettura"), /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === 'fonti' ? 'primary' : 'ghost'),
    onClick: () => setTab('fonti')
  }, "Fonti russe"), /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === 'libri' ? 'primary' : 'ghost'),
    onClick: () => setTab('libri')
  }, "Bibliografia completa")), tab === 'pdf' && /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-between mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "I 12 PDF della tua cartella Transurfing"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] mono",
    style: {
      color: 'var(--ink-mute)'
    }
  }, "clicca per aprire nel visualizzatore integrato")), ['classic', 'expansion', 'tafti', 'compendio', 'glossario'].map(gruppo => {
    const items = PDF_LOCALI.filter(p => p.tipo === gruppo);
    if (items.length === 0) return null;
    const gl = {
      'classic': {
        t: 'Stadi Classici (I - V)',
        c: 'var(--gold)'
      },
      'expansion': {
        t: 'Espansione (kLIBE)',
        c: 'var(--ink-dim)'
      },
      'tafti': {
        t: 'Era Tafti',
        c: 'var(--crimson-bright)'
      },
      'compendio': {
        t: 'Compendi Community (IT)',
        c: '#6fb3c9'
      },
      'glossario': {
        t: 'Riferimento',
        c: '#b291d9'
      }
    }[gruppo];
    return /*#__PURE__*/React.createElement("div", {
      key: gruppo,
      className: "mb-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title mb-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono text-xs uppercase tracking-widest",
      style: {
        color: gl.c
      }
    }, gl.t), /*#__PURE__*/React.createElement("span", {
      className: "mono text-[10px]",
      style: {
        color: 'var(--ink-mute)'
      }
    }, "\xB7 ", items.length), /*#__PURE__*/React.createElement("span", {
      className: "section-rule"
    })), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-3"
    }, items.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.file,
      className: "card card-hover p-5 cursor-pointer",
      onClick: () => setOpenPdf(p)
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline justify-between mb-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "serif text-2xl",
      style: {
        color: gl.c
      }
    }, "PDF"), p.y && /*#__PURE__*/React.createElement("span", {
      className: "mono text-xs",
      style: {
        color: 'var(--ink-mute)'
      }
    }, p.y)), /*#__PURE__*/React.createElement("div", {
      className: "serif text-lg leading-tight mb-2"
    }, p.t), /*#__PURE__*/React.createElement("div", {
      className: "text-xs leading-relaxed",
      style: {
        color: 'var(--ink-dim)'
      }
    }, p.d), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 pt-3 flex items-center justify-between text-[10px] mono",
      style: {
        borderTop: '1px solid var(--line)',
        color: 'var(--ink-mute)'
      }
    }, /*#__PURE__*/React.createElement("span", null, p.file.length > 40 ? p.file.slice(0, 37) + '…' : p.file), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--crimson-bright)'
      }
    }, "Apri \u2197"))))));
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-xs mt-6 p-4 leading-relaxed",
    style: {
      color: 'var(--ink-dim)',
      background: 'var(--bg-2)',
      border: '1px dashed var(--line)'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Come funziona"), ": clicca un libro per aprire il visualizzatore integrato (iframe del browser). Da l\xEC puoi scaricare o aprire in nuova scheda. I file devono trovarsi nella stessa cartella di questo file HTML. Se sposti l\\'app, sposta anche i PDF."), /*#__PURE__*/React.createElement(PdfViewer, {
    pdf: openPdf,
    onClose: () => setOpenPdf(null)
  })), tab === 'ordine' && /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest mb-4",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Percorso di lettura suggerito"), /*#__PURE__*/React.createElement("div", {
    className: "relative grid grid-cols-[40px_1fr] gap-x-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute left-[19px] top-4 bottom-4 vline"
  }), LETTURE_CONSIGLIATE.map((l, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: l.ordine
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center pt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 flex items-center justify-center serif text-lg",
    style: {
      background: 'var(--bg-2)',
      border: '1px solid var(--line)',
      color: 'var(--crimson-bright)',
      borderRadius: '2px'
    }
  }, l.ordine)), /*#__PURE__*/React.createElement("div", {
    className: "card p-5 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif text-xl mb-2"
  }, l.t), /*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono uppercase text-[10px] tracking-widest mr-2",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "perch\xE9"), l.why))))), /*#__PURE__*/React.createElement("div", {
    className: "card p-5 mt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono uppercase text-[10px] tracking-widest mb-2",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Nota sul percorso"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Questo ordine privilegia l'", /*#__PURE__*/React.createElement("strong", null, "utilit\xE0 pratica"), ". Se vuoi la linea cronologica completa (I \u2192 II \u2192 III \u2192 IV \u2192 V \u2192 Proiettore \u2192 kLIBE \u2192 \u010DistoPitanie \u2192 Tafti \u2192 Itfat \u2192 Cosa non ha detto Tafti \u2192 Tafti 2 \u2192 Trasferirsi), vai in ", /*#__PURE__*/React.createElement("em", null, "Storia"), ". Se hai poco tempo, bastano ", /*#__PURE__*/React.createElement("strong", null, "1, 4, 6"), " \u2014 tre libri che coprono l'essenziale."))), tab === 'fonti' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest mb-4",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Canali ufficiali e community in russo"), FONTI_RUSSE.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.nome,
    className: "card p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-between flex-wrap gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "serif text-xl"
  }, f.nome), /*#__PURE__*/React.createElement("div", {
    className: "mono text-[10px] uppercase tracking-widest mt-1",
    style: {
      color: f.tipo === 'ufficiale' ? 'var(--gold)' : f.tipo === 'community' ? 'var(--crimson-bright)' : 'var(--ink-dim)'
    }
  }, f.tipo)), f.url && /*#__PURE__*/React.createElement("a", {
    href: f.url,
    target: "_blank",
    rel: "noopener",
    className: "link-crimson mono text-sm"
  }, f.url.replace(/^https?:\/\//, ''), " \u2197")), /*#__PURE__*/React.createElement("div", {
    className: "text-sm mt-3 leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, f.d))), /*#__PURE__*/React.createElement("div", {
    className: "card p-5 mt-4",
    style: {
      background: 'rgba(169,36,58,0.05)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono uppercase text-[10px] tracking-widest mb-2",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "Avvertenza"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Le fonti russe sono la via diretta alle formulazioni originali \u2014 molte sfumature si perdono in traduzione (la ", /*#__PURE__*/React.createElement("em", null, "\u043A\u043E\u0441\u0438\u0446\u0430"), ", ad esempio, ha risonanze che \xABtreccia\xBB non cattura). Se non leggi russo, usa un traduttore automatico: imperfetto ma utilissimo. Il linguaggio di Zeland \xE8 volutamente concreto e basso-registro."))), tab === 'libri' && /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest mb-4",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Bibliografia completa \xB7 14 libri \xB7 2004-2025"), ['classic', 'expansion', 'tafti'].map(era => {
    const items = BOOKS.filter(b => b.era === era);
    const eraLabel = era === 'classic' ? 'Cinque Stadi' : era === 'expansion' ? 'Espansione' : 'Era Tafti';
    const eraColor = era === 'classic' ? 'var(--gold)' : era === 'expansion' ? 'var(--ink-dim)' : 'var(--crimson-bright)';
    return /*#__PURE__*/React.createElement("div", {
      key: era,
      className: "mb-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-title mb-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono text-xs uppercase tracking-widest",
      style: {
        color: eraColor
      }
    }, eraLabel), /*#__PURE__*/React.createElement("span", {
      className: "mono text-[10px]",
      style: {
        color: 'var(--ink-mute)'
      }
    }, "\xB7 ", items.length, " libri"), /*#__PURE__*/React.createElement("span", {
      className: "section-rule"
    })), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, items.map(b => /*#__PURE__*/React.createElement("div", {
      key: b.ru,
      className: "flex items-baseline gap-4 py-2 px-3",
      style: {
        background: 'var(--bg-2)',
        borderLeft: `2px solid ${eraColor}40`
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono text-xs",
      style: {
        color: eraColor,
        minWidth: '50px'
      }
    }, b.y), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "serif text-base"
    }, b.it), /*#__PURE__*/React.createElement("div", {
      className: "ru text-sm"
    }, b.ru))))));
  })));
}

// ============================================================
// FAQ — risposte dai libri, con fonte
// ============================================================
const FAQ = [{
  q: "Dove si trova esattamente la Treccia dell'intenzione?",
  a: "La Treccia si trova dietro le scapole, ma la posizione esatta è soggettiva. Zeland è esplicito: «Non cercate un punto anatomico preciso. Il punto è dove lo sentite voi, ed è reale nel momento in cui vi portate l'attenzione lì.» Può essere al centro della schiena alta, leggermente sopra le scapole, o un palmo dietro di voi. L'importante è la direzione (posteriore) e la qualità (impostare, non chiedere).",
  fonti: ["Cosa non ha detto Tafti, cap. «Treccia 1-3»", "Tafti la Sacerdotessa, cap. «La Metaforza»"],
  tags: ["treccia", "metaforza", "posizione"]
}, {
  q: "Qual è la differenza tra intenzione interna ed esterna?",
  a: "L'intenzione interna è lo sforzo di agire direttamente sul mondo per ottenere (fare, spingere, persuadere). Funziona per i gesti quotidiani. L'intenzione esterna è la determinazione di lasciare che il mondo compia secondo il tuo stato interno: non è «volere di più», è sapere senza sforzo. Nell'era Tafti, l'intenzione esterna si concretizza come Metaforza attivata dalla Treccia.",
  fonti: ["Transurfing I", "Tafti la Sacerdotessa"],
  tags: ["intenzione", "metaforza", "esterna", "interna"]
}, {
  q: "Come faccio a capire se una situazione è un pendolo?",
  a: "Tre segnali. Primo: senti un'emozione carica (rabbia, entusiasmo collettivo, indignazione, paura irrazionale) sproporzionata al fatto. Secondo: la tua attenzione è risucchiata — pensi alla cosa anche quando non vorresti. Terzo: c'è una struttura collettiva che «cresce» dal tuo coinvolgimento (un partito, un gruppo, un drama ricorrente, un social media, un'ideologia). Se i tre segnali coincidono, sei dentro un pendolo.",
  fonti: ["Transurfing I", "Transurfing III"],
  tags: ["pendoli", "identificazione", "segnali"]
}, {
  q: "Lo slide non funziona, cosa sbaglio?",
  a: "Tre errori tipici. 1) Guardi la scena invece di starci dentro: devi sentire, toccare, respirare dentro l'immagine, non osservarla da fuori come un film. 2) Troppa carica emotiva: se lo slide ti fa ansia, stai emettendo «voglio» ad alta potenza e le forze di equilibrio intervengono. Riduci prima l'importanza. 3) Stai visualizzando la Porta invece dell'Obiettivo: se visualizzi la strada (es. «entrerò in quella azienda») invece della cima (es. «vivo una vita creativa, libera, ben retribuita»), limiti il corridoio.",
  fonti: ["Transurfing I", "Transurfing V"],
  tags: ["slide", "errori", "importanza", "obiettivo"]
}, {
  q: "Cosa sono gli «Schermi» di Tafti?",
  a: "Due schermi. Lo schermo ESTERNO è ciò che vedi in questo momento: la stanza, le persone, la strada. Lo schermo INTERNO è ciò che immagini, ricordi, temi, progetti. La maggior parte delle persone vive sullo schermo interno credendo di vivere sull'esterno — reagiscono a proiezioni, non a fatti. La pratica Tafti base è distinguerli consapevolmente: 30 secondi davvero sullo schermo esterno, 30 secondi sullo schermo interno. Ripetere.",
  fonti: ["Cosa non ha detto Tafti, cap. «Gli Schermi»"],
  tags: ["schermi", "attenzione", "presenza"]
}, {
  q: "Cosa significa «cadere dal pendolo»?",
  a: "Cadere dal pendolo non significa combattere il pendolo (questo lo nutre): significa diventare invisibile al suo meccanismo. Ritiri l'attenzione, non partecipi al dramma, non difendi le tue ragioni dove non sono strettamente necessarie, non ti indigni, non esulti insieme agli altri. Il pendolo non trova aggancio emotivo e la sua influenza su di te si dissipa. Non è fuga passiva — è non-partecipazione consapevole.",
  fonti: ["Transurfing I", "Transurfing III"],
  tags: ["pendoli", "caduta", "non-partecipazione"]
}, {
  q: "Che differenza c'è tra Obiettivo e Porta?",
  a: "L'Obiettivo è il tuo fine reale (es. «vivere liberamente del mio lavoro creativo»). La Porta è la linea di vita specifica che vi conduce (es. «entrerò in quella azienda X con il contratto Y»). Confonderli è l'errore più diffuso: lavori sulla Porta pensando di lavorare sull'Obiettivo. Le porte possibili per lo stesso Obiettivo sono molte, spesso imprevedibili. Slide e impostazione devono essere sulla cima, non sul gradino. I gradini si sistemano da soli se la cima è chiara.",
  fonti: ["Transurfing V", "Transurfing IV"],
  tags: ["obiettivo", "porta", "direzione"]
}, {
  q: "Cos'è la Metaforza? È diversa dall'intenzione esterna?",
  a: "La Metaforza è la forma concreta e operativa che Zeland dà all'intenzione esterna a partire da Tafti (2018). Concettualmente coincidono, ma la Metaforza è localizzata (dalla Treccia), breve, imperativa («imposto»), e attivabile in pochi secondi. Nei libri classici l'intenzione esterna rimaneva spesso un principio astratto; con Tafti diventa un gesto. Tafti 2 (2024) aggiunge 8 regole per usarla correttamente.",
  fonti: ["Tafti la Sacerdotessa", "Tafti 2 — Controllo della realtà"],
  tags: ["metaforza", "intenzione-esterna", "gesto"]
}, {
  q: "Le inversioni di Tafti — come si applicano in pratica?",
  a: "Sono quattro. 1) Volere → Dare: ogni volta che noti un «voglio», riformula come «do». «Voglio amore» → «Do amore». 2) Rifiutare → Accettare: ciò che rifiuti con forza ti definisce; accetta ciò che è (non approvare — accettare) e libererai la scelta. 3) Addormentarsi → Svegliarsi: quando noti di essere in automatico, usa il riconoscimento stesso come risveglio. 4) Chiedere → Pronunciare: invece di pregare per un risultato, pronuncia la scena già compiuta dalla Treccia.",
  fonti: ["Tafti la Sacerdotessa", "Cosa non ha detto Tafti"],
  tags: ["inversioni", "tafti", "volere", "dare"]
}, {
  q: "Cosa sono Realizzazione 1 e Realizzazione 2?",
  a: "Realizzazione 1 è la FASE ESECUTIVA: il momento dell'azione decisiva (firmi, parli, prenoti, vai). Qui l'eccesso di riflessione è tradimento dell'impostazione: esegui senza interrogare. Realizzazione 2 è la fase POST-AZIONE: hai agito, chiudi. Non rianimare mentalmente la scena («avrei dovuto dire…», «e se non succede…»), non tirare a te il risultato con il pensiero. «È fatto. Lo spazio si occupa del resto.»",
  fonti: ["Cosa non ha detto Tafti, cap. «Realizzazione 1-2»"],
  tags: ["realizzazione", "azione", "post-azione"]
}, {
  q: "Le coincidenze significano che sto andando sulla strada giusta?",
  a: "Le Lucciole sono segnali sottili dello spazio varianti: una frase colta per caso, un volto, un numero che si ripete, un déjà-vu. Sono ORIENTATIVE, non profetiche: indicano che la tua attenzione sta toccando una linea di vita, non garantiscono che quella sia «la giusta». Zeland avverte: non interpretarle troppo. Annotale, lascia che il pattern emerga col tempo.",
  fonti: ["Cosa non ha detto Tafti, cap. «Le Lucciole»"],
  tags: ["lucciole", "coincidenze", "segnali"]
}, {
  q: "Cos'è il «Manichino» e come libermene?",
  a: "Il Manichino è l'insieme delle funzioni automatiche che rispondono ai fili dei pendoli: reazioni codificate, obblighi che segui senza decidere, attese altrui che ossequi per inerzia. Per liberarsene: identifica un filo alla volta, riconoscilo come tale, e togli il consenso — non lottando contro chi tira il filo, ma semplicemente smettendo di essere disponibile all'automatismo. La consapevolezza basta a recidere.",
  fonti: ["Cosa non ha detto Tafti, cap. «Il Manichino»"],
  tags: ["manichino", "automatismo", "fili"]
}, {
  q: "Devo mangiare crudo per fare Transurfing?",
  a: "No. «Alimentazione Viva» (čistoPitanie nell'originale) è un libro del 2013 dove Zeland suggerisce il cibo vivo/crudo come LIBERAZIONE ENERGETICA, non come ideologia dietetica. L'idea è che il sistema tecnogeno (cibo raffinato, zuccheri, conservanti) nutre pendoli e intorpidisce il corpo. Liberare energia dal lavoro digestivo = più energia per la pratica. Ma non è requisito: una dieta semplicemente pulita (meno zucchero, più frutta/verdura, poco processato) è sufficiente per cominciare.",
  fonti: ["Alimentazione Viva", "Transurfing 5.0 kLIBE"],
  tags: ["alimentazione", "crudo", "energia", "cibo-vivo"]
}, {
  q: "La Sacerdotessa Tafti è una persona reale? Un'entità?",
  a: "No. Tafti è una figura allegorica creata da Zeland nel 2018 per dare una voce al sistema. È il dispositivo narrativo che permette al lettore di essere interpellato direttamente in seconda persona. Zeland non pretende che sia reale — è uno strumento letterario. Ma la PRATICA che insegna è concretissima: il gesto della Treccia, le inversioni, la presenza, non dipendono dall'esistenza storica della figura.",
  fonti: ["Tafti la Sacerdotessa, prefazione"],
  tags: ["tafti", "figura", "allegoria"]
}, {
  q: "Quanto tempo ci mette a funzionare lo specchio duale?",
  a: "Zeland parla di un ritardo variabile da ore a settimane. Lo specchio non reagisce al tuo volere istantaneo, ma al tuo STATO STABILE: se mantieni uno stato interno consistente per 3-5 giorni, il mondo comincia a riflettere. Il problema è che la maggior parte delle persone cambia stato 50 volte al giorno e quindi lo specchio riflette solo oscillazione. La coerenza dello stato è più importante dell'intensità.",
  fonti: ["Transurfing IV"],
  tags: ["specchio-duale", "ritardo", "stato-stabile"]
}, {
  q: "Come trovo la mia Missione?",
  a: "La Missione non è una vocazione mitologica da scoprire con una rivelazione. È la direzione dove la tua energia scorre senza resistenza. Zeland suggerisce un metodo empirico: per 30 giorni, registra QUANDO il tempo «scompare» (flow) e QUANDO ti senti al posto giusto. Non cercare grandi risposte — accumula osservazioni. Il pattern emerge da solo. Quasi sempre è già davanti agli occhi, non riconosciuto perché sembra troppo ovvio o troppo modesto.",
  fonti: ["Tafti la Sacerdotessa", "Cosa non ha detto Tafti, cap. «La Missione»"],
  tags: ["missione", "vocazione", "destino"]
}, {
  q: "Il metodo dei tre conseguimenti, come funziona esattamente?",
  a: "Dalla Treccia, pronuncia la stessa impostazione in TRE formulazioni diverse, a distanza di pochi secondi una dall'altra. Esempio: «Si apre il passaggio» / «Il passaggio si apre» / «Attraverso il passaggio». Non è ripetizione ossessiva — sono tre angolature dello stesso gesto. Una volta non basta (apertura); due sospende (dualità); tre completa (chiusura). Usalo solo per impostazioni importanti, non quotidianamente.",
  fonti: ["Tafti la Sacerdotessa, cap. «Il metodo dei tre conseguimenti»"],
  tags: ["tre-conseguimenti", "metaforza", "tecnica"]
}, {
  q: "Posso fare Transurfing anche se sono ateo/scettico?",
  a: "Sì. Zeland non richiede credo religiosi. I pendoli, le forze di equilibrio, la Metaforza sono descritti come dinamiche energetiche/psicologiche, non come dogmi. Molte tecniche funzionano anche se interpreti lo spazio varianti come una metafora utile dell'inconscio collettivo: la pratica dà risultati indipendentemente dall'ontologia che le dai. La cosa importante è sperimentare — non credere.",
  fonti: ["Transurfing I, introduzione"],
  tags: ["scetticismo", "credo", "pratica"]
}, {
  q: "Qual è l'ordine migliore per leggere i libri?",
  a: "Per impatto pratico: 1) Transurfing I (Spazio delle Varianti) — fondamenta indispensabili. 2) Transurfing V (Le mele cadono nel cielo) — sintesi operativa. 3) Tafti la Sacerdotessa — il gesto concreto. 4) Cosa non ha detto Tafti — chiarimenti indispensabili. 5) Tafti 2 (2024) — le 8 regole. Se vuoi la completezza teorica, aggiungi II, III, IV in ordine. kLIBE e čistoPitanie sono per chi sente che il corpo sta trattenendo. Trasferirsi (2025) è l'ultima evoluzione.",
  fonti: ["Bibliografia completa"],
  tags: ["lettura", "ordine", "percorso"]
}, {
  q: "Cosa cambia in Tafti 2 rispetto al primo Tafti?",
  a: "Tafti 2 (2024) è molto più STRUTTURATO. Il primo Tafti (2018) introduce la Metaforza e le inversioni in modo narrativo e a tratti criptico; molti lettori rimanevano con dubbi pratici. In Tafti 2 Zeland dà 8 regole operative esplicite per la Metaforza (presenza, impostare invece di volere, dalla Treccia, breve, leggero, triplice, seguire, dimenticare), protocolli chiari, e un focus specifico sul «controllo degli eventi». È il manuale che il primo Tafti non voleva essere.",
  fonti: ["Tafti 2 — Controllo della realtà (2024)"],
  tags: ["tafti-2", "8-regole", "controllo-eventi"]
}];

// ============================================================
// CHAT — domande alla base di conoscenza + modalità IA opzionale
// ============================================================
function Chat() {
  const [tab, setTab] = useState('domanda');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-num mb-2"
  }, "07 \xB7 CHAT & DOMANDE"), /*#__PURE__*/React.createElement("h2", {
    className: "text-5xl serif mb-4",
    style: {
      letterSpacing: '-0.01em'
    }
  }, "Chiedi al ", /*#__PURE__*/React.createElement("span", {
    className: "italic",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "sistema"), "."), /*#__PURE__*/React.createElement("p", {
    className: "text-base max-w-3xl mb-8 leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Tre modi di porre una domanda: cercare nelle ", /*#__PURE__*/React.createElement("strong", null, "FAQ"), " curate dai libri, scrivere una domanda libera e lasciare che il sistema cerchi nella ", /*#__PURE__*/React.createElement("strong", null, "base di conoscenza"), ", oppure attivare la modalit\xE0 ", /*#__PURE__*/React.createElement("strong", null, "IA"), " con una tua chiave API (esperienza pi\xF9 fluida, niente server esterno: la chiave resta nel tuo browser)."), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-8"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === 'domanda' ? 'primary' : 'ghost'),
    onClick: () => setTab('domanda')
  }, "Domanda libera"), /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === 'faq' ? 'primary' : 'ghost'),
    onClick: () => setTab('faq')
  }, "FAQ dai libri (", FAQ.length, ")"), /*#__PURE__*/React.createElement("button", {
    className: "btn " + (tab === 'ai' ? 'primary' : 'ghost'),
    onClick: () => setTab('ai')
  }, "Modalit\xE0 IA")), tab === 'domanda' && /*#__PURE__*/React.createElement(ChatOffline, null), tab === 'faq' && /*#__PURE__*/React.createElement(ChatFAQ, null), tab === 'ai' && /*#__PURE__*/React.createElement(ChatAI, null));
}
function ChatOffline() {
  const [q, setQ] = useState('');
  const [risposta, setRisposta] = useState(null);
  const cerca = () => {
    if (!q.trim()) return;
    const query = q.toLowerCase();
    const tokens = query.split(/\s+/).filter(t => t.length > 2);
    const score = text => {
      if (!text) return 0;
      const t = text.toLowerCase();
      let s = 0;
      for (const tok of tokens) {
        if (t.includes(tok)) s += t.split(tok).length - 1;
      }
      return s;
    };
    const faqResults = FAQ.map(f => ({
      tipo: 'faq',
      item: f,
      s: score(f.q) * 4 + score(f.a) + score((f.tags || []).join(' ')) * 3
    })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3);
    const glossResults = GLOSSARIO.map(g => ({
      tipo: 'glossario',
      item: g,
      s: score(g.it) * 3 + score(g.ru) * 3 + score(g.def)
    })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3);
    const tecResults = TECNICHE.map(t => ({
      tipo: 'tecnica',
      item: t,
      s: score(t.titolo) * 3 + score(t.q) * 2 + score(t.come || '') + score(t.ru || '') * 2 + score(t.cat) * 2
    })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 4);
    const total = faqResults.length + glossResults.length + tecResults.length;
    setRisposta({
      faqResults,
      glossResults,
      tecResults,
      total,
      q
    });
  };
  const esempi = ["Cosa significa spegnere un pendolo?", "Dove si trova la Treccia?", "Differenza tra intenzione interna ed esterna", "Come funziona lo slide", "Le inversioni di Tafti", "Cosa sono gli schermi"];
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card p-6 mb-6 glow-border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest mb-3",
    style: {
      color: 'var(--gold-dim)'
    }
  }, "Fai una domanda \u2014 il sistema cerca nelle 32 tecniche, nei 42 concetti del glossario e nelle ", FAQ.length, " FAQ dei libri"), /*#__PURE__*/React.createElement("textarea", {
    rows: "3",
    placeholder: "Es: dove si trova la treccia? Come individuo un pendolo? Qual \xE8 la differenza tra volere e impostare?",
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) cerca();
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px]",
    style: {
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "Ctrl+Enter"), " per cercare rapidamente"), /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: cerca
  }, "Chiedi")), !risposta && /*#__PURE__*/React.createElement("div", {
    className: "mt-5 pt-5",
    style: {
      borderTop: '1px dashed var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] mono uppercase tracking-widest mb-2",
    style: {
      color: 'var(--ink-mute)'
    }
  }, "Esempi"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, esempi.map(e => /*#__PURE__*/React.createElement("button", {
    key: e,
    className: "chip",
    style: {
      cursor: 'pointer'
    },
    onClick: () => {
      setQ(e);
      setTimeout(cerca, 50);
    }
  }, e))))), risposta && /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest mb-4",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "Risposta per: ", /*#__PURE__*/React.createElement("span", {
    className: "serif italic text-sm",
    style: {
      color: 'var(--ink)'
    }
  }, "\xAB", risposta.q, "\xBB")), risposta.total === 0 && /*#__PURE__*/React.createElement("div", {
    className: "card p-8 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif italic text-xl",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Non ho trovato una risposta diretta nella base di conoscenza."), /*#__PURE__*/React.createElement("div", {
    className: "text-sm mt-3",
    style: {
      color: 'var(--ink-mute)'
    }
  }, "Prova a riformulare con termini pi\xF9 specifici (es. \xABpendolo\xBB, \xABtreccia\xBB, \xABslide\xBB, \xABfrejling\xBB), oppure consulta le FAQ o attiva la modalit\xE0 IA.")), risposta.faqResults.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono text-xs uppercase tracking-widest",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "FAQ dai libri"), /*#__PURE__*/React.createElement("span", {
    className: "section-rule"
  })), risposta.faqResults.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card p-5 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif text-lg mb-2"
  }, r.item.q), /*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, r.item.a), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 pt-3 text-[10px] mono",
    style: {
      borderTop: '1px solid var(--line)',
      color: 'var(--gold-dim)'
    }
  }, "Fonti: ", r.item.fonti.join(' · '))))), risposta.glossResults.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono text-xs uppercase tracking-widest",
    style: {
      color: 'var(--gold)'
    }
  }, "Dal glossario"), /*#__PURE__*/React.createElement("span", {
    className: "section-rule"
  })), risposta.glossResults.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card p-4 mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-3 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif text-lg"
  }, r.item.it), /*#__PURE__*/React.createElement("span", {
    className: "ru text-sm", lang: "ru"
  }, "\xB7 ", r.item.ru), /*#__PURE__*/React.createElement("span", {
    className: "chip ml-auto"
  }, r.item.sez)), /*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, r.item.def)))), risposta.tecResults.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono text-xs uppercase tracking-widest",
    style: {
      color: '#b291d9'
    }
  }, "Tecniche da provare"), /*#__PURE__*/React.createElement("span", {
    className: "section-rule"
  })), risposta.tecResults.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card p-4 mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-3 mb-1 flex-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono text-xs",
    style: {
      color: 'var(--ink-mute)'
    }
  }, r.item.id.toUpperCase()), /*#__PURE__*/React.createElement("span", {
    className: "serif text-lg"
  }, r.item.titolo), /*#__PURE__*/React.createElement("span", {
    className: "tag " + (r.item.livello === 'base' ? 'base' : r.item.livello === 'tecnica' ? 'tech' : 'adv')
  }, r.item.livello)), /*#__PURE__*/React.createElement("div", {
    className: "serif italic text-sm mb-1",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "\xAB", r.item.q, "\xBB"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs leading-relaxed",
    style: {
      color: 'var(--ink-dim)'
    }
  }, r.item.come))))));
}
function ChatFAQ() {
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState('');
  const filtered = FAQ.filter(f => !q || (f.q + ' ' + f.a + ' ' + (f.tags || []).join(' ')).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("input", {
    className: "mb-6",
    placeholder: "Filtra FAQ: treccia, pendolo, slide, metaforza\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, filtered.map((f, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "card " + (isOpen ? 'glow-border' : 'card-hover')
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-5 cursor-pointer flex items-baseline gap-3",
      onClick: () => setOpen(isOpen ? null : i)
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono text-xs",
      style: {
        color: 'var(--crimson-bright)',
        minWidth: '32px'
      }
    }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
      className: "serif text-lg flex-1 leading-snug"
    }, f.q), /*#__PURE__*/React.createElement("span", {
      className: "chevron",
      style: {
        color: 'var(--ink-mute)'
      }
    }, "\u203A")), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "px-5 pb-5 fade-in",
      style: {
        borderTop: '1px solid var(--line)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm leading-relaxed mt-4",
      style: {
        color: 'var(--ink)'
      }
    }, f.a), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 pt-3 flex flex-wrap gap-2 items-baseline",
      style: {
        borderTop: '1px dashed var(--line)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono uppercase text-[10px] tracking-widest",
      style: {
        color: 'var(--gold-dim)'
      }
    }, "Fonti:"), f.fonti.map((fn, j) => /*#__PURE__*/React.createElement("span", {
      key: j,
      className: "chip gold"
    }, fn))), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 flex flex-wrap gap-1.5"
    }, f.tags.map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      className: "text-[10px] mono",
      style: {
        color: 'var(--ink-mute)'
      }
    }, "#", t)))));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "serif italic text-center py-16",
    style: {
      color: 'var(--ink-mute)'
    }
  }, "Nessuna FAQ trovata per questa ricerca.")));
}
function ChatAI() {
  const [provider, setProvider] = useState(() => {
    try {
      return localStorage.getItem('ts_ai_provider') || 'anthropic';
    } catch (e) {
      return 'anthropic';
    }
  });
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem('ts_ai_key') || '';
    } catch (e) {
      return '';
    }
  });
  const [messaggi, setMessaggi] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ts_ai_chat') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(null);
  const [showKeyForm, setShowKeyForm] = useState(!apiKey);
  const scrollRef = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem('ts_ai_key', apiKey);
    } catch (e) {}
  }, [apiKey]);
  useEffect(() => {
    try {
      localStorage.setItem('ts_ai_provider', provider);
    } catch (e) {}
  }, [provider]);
  useEffect(() => {
    try {
      localStorage.setItem('ts_ai_chat', JSON.stringify(messaggi.slice(-50)));
    } catch (e) {}
  }, [messaggi]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messaggi]);
  const systemPrompt = `Sei la guida-studio di "Ars Realis", una community indipendente italiana di studio del Reality Transurfing di Vadim Zeland e di pratiche affini. Non sei affiliata all'autore: sei una compagna di studio che aiuta chi legge a capire e applicare i concetti.

Rispondi in italiano, in modo chiaro e concreto, sempre privilegiando la PRATICA QUOTIDIANA sulla teoria astratta. Cita il libro di riferimento quando attingi a una specifica idea.

LINEA STORICA DEI LIBRI (Vadim Zeland):
- 2004-2006: Trilogia Reality Transurfing I-II-III — fondamenta (spazio delle varianti, flusso, pendoli, importanza, equilibrio, intenzione esterna, transizione degli strati).
- 2006: Il Proiettore della Realtà Separata — la realtà come proiezione dell'osservatore, lastre intenzionali, coerenza intenzione-attenzione-sensazione.
- 2007: Avanti nel Passato — applicazioni pratiche, chiarimenti, casi-studio.
- 2010: Il Fruscio delle Stelle del Mattino — lavoro sull'anima, voce del cuore sotto la ragione.
- 2016: Le Regole dello Spazio — revisione sistematica in forma di principi operativi.
- 2018: Tafti la Sacerdotessa — rottura: Script vs Scenario, fasci di attenzione, svegliarsi nel film.
- 2021: Cosa Non Ha Detto Tafti — appendice che chiarisce tecniche di Tafti 1.
- 2024: Tafti 2 — I Mattoni della Metaforza — 8 Regole della Metaforza, sistematizzazione matura.
- 2025: Trasferirsi — cura di sé come atto primo, verità leggera, restauro dello strumento-osservatore.

CONCETTI CHIAVE (stile Zeland, usa questi termini e segnala quello russo tra parentesi quando utile):
${GLOSSARIO.map(g => `- ${g.it} (${g.ru}): ${g.def}`).join('\n')}

TECNICHE PRATICHE (come istruirle):
1. Ridurre l'importanza: notare quando un oggetto/persona/evento ha "troppo peso"; ammorbidire l'aggrappo, restituire la misura reale. L'eccesso di peso attiva l'equilibrio che costruisce l'ostacolo.
2. Uscire dal pendolo: quando si percepisce di essere dentro una struttura che ci risucchia energia (polemica, moda, paura collettiva), non combatterla ma ignorarla, spostare l'attenzione altrove con leggerezza.
3. Nuotare nel flusso (frailer): riconoscere i segnali del flusso delle varianti (coincidenze, porte aperte, suggerimenti), seguirli senza forzare contro la corrente.
4. Diapositiva: immagine mentale dell'obiettivo già realizzato, quotidiana, dettagliata, con tutti i sensi, senza pretendere risultati immediati.
5. Lastra intenzionale (da Il Proiettore 2006): evoluzione della diapositiva — non solo vedere, ma sentire sulla pelle. Attivazione simultanea di intenzione, attenzione, sensazione. Si sta DENTRO l'immagine.
6. Coordinamento dell'intenzione: formula interna "ottimo, così va bene" verso ogni evento. Non rassegnazione: rifiuto di nutrire il negativo.
7. Coordinamento dei rapporti: ognuno ha il suo film; non correggere gli altri né pretendere che si sincronizzino con il nostro.
8. Intenzione esterna (cuore del sistema): non "lo farò succedere" ma "sto lasciando che succeda". Richiede fiducia e aver smesso di aver bisogno del risultato.
9. Fasci di attenzione (Tafti, 2018): dividere l'attenzione in due fasci simultanei — uno che guarda la scena, uno che guarda chi sta guardando. Chi mantiene entrambi accesi esce dall'automatismo.
10. Scenario vs Script (Tafti): Script = copione automatico della vita; Scenario = film che si sceglie consapevolmente. Solo con i fasci di attenzione accesi si può passare dallo Script allo Scenario.
11. Protocollo d'ingresso alla giornata: al mattino accendere i fasci di attenzione, fissare diapositiva/lastra, decidere il tono interno, ringraziare. 2 minuti.
12. Le 8 Regole della Metaforza (Tafti 2, 2024) — codice operativo interiore: non spiegarsi, non giustificarsi, non chiedere permesso a chi non può darlo, agire con dolcezza senza esitazione, scegliere la versione che si vuole essere, non quella che ci si aspetta, ecc.
13. Cura di sé come atto primo (Trasferirsi, 2025): corpo, ambiente, sonno, respiro, cibo, aria. Non contorno: è la pratica stessa. Un osservatore stanco non osserva.
14. Verità leggera (Trasferirsi): dire e pensare la verità senza farne arma o ideologia.
15. Coerenza intenzione-attenzione-sensazione: il gesto ha forza quando le tre convergono. Intenzione senza attenzione è fantasticheria; attenzione senza sensazione è freddezza; sensazione senza intenzione è reazione.

FAQ di riferimento:
${FAQ.map(f => `Q: ${f.q}\nA: ${f.a}\nFonti: ${f.fonti.join(', ')}`).join('\n\n')}

NOTE SUI LIBRI MENO TRADOTTI (basati sui compendi della community):
- Il Proiettore (2006) introduce l'idea che l'osservatore non è fuori dallo schermo ma È il proiettore; le lastre intenzionali sono strumenti di lavoro più avanzati della diapositiva perché integrano la sensazione corporea.
- Tafti 2 / I Mattoni della Metaforza (2024) è la forma più matura e sobria del sistema: Zeland anziano torna a un tono più quieto ma conserva la radicalità di Tafti 1. Le 8 Regole non sono teoria ma codice di condotta.
- Trasferirsi (2025) sposta l'asse dal controllo esterno alla cura di sé: non più "come gestisco il mondo" ma "come restauro lo strumento con cui lo osservo". È il ritorno in forma di pace dopo la guerra di Tafti.

REGOLE DI RISPOSTA:
1. Non inventare citazioni testuali. Se non ricordi una frase esatta, parafrasa e dì che stai parafrasando.
2. Privilegia risposte pratiche ("fai questo", "prova così", "domani al risveglio"), non speculative.
3. Cita il libro/era da cui proviene il concetto.
4. Se la domanda riguarda Metaforza/fasci di attenzione/Script-Scenario, riferisciti all'era Tafti (2018-2025); se riguarda lo spazio delle varianti o i pendoli, riferisciti ai libri 2004-2006.
5. Se la domanda è confusa o rivela un malinteso comune (es. "il Transurfing è la legge dell'attrazione"), chiariscilo con gentilezza e precisione.
6. Invita a leggere i libri originali di Zeland per la forma completa del pensiero — non sostituirli.
7. Rispondi concisa: 150-400 parole, paragrafi corti, tono caldo ma diretto.
8. Se qualcuno chiede aiuto in un momento di disagio psicologico serio, suggerisci con dolcezza di cercare anche il supporto di un professionista.`;
  const send = async () => {
    if (!input.trim() || loading) return;
    if (!apiKey) {
      setErrore('Inserisci la tua API key prima.');
      return;
    }
    setErrore(null);
    const newMsg = {
      role: 'user',
      content: input.trim(),
      ts: Date.now()
    };
    const updated = [...messaggi, newMsg];
    setMessaggi(updated);
    setInput('');
    setLoading(true);
    try {
      const history = updated.slice(-20);
      let response;
      if (provider === 'anthropic') {
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            system: systemPrompt,
            messages: history.map(m => ({
              role: m.role,
              content: m.content
            }))
          })
        });
      } else if (provider === 'openai') {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{
              role: 'system',
              content: systemPrompt
            }, ...history.map(m => ({
              role: m.role,
              content: m.content
            }))]
          })
        });
      } else {
        // openrouter
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey,
            'HTTP-Referer': 'https://ars-realis.local',
            'X-Title': 'Ars Realis Community'
          },
          body: JSON.stringify({
            model: 'anthropic/claude-3.5-haiku',
            messages: [{
              role: 'system',
              content: systemPrompt
            }, ...history.map(m => ({
              role: m.role,
              content: m.content
            }))]
          })
        });
      }
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API ${response.status}: ${errText.slice(0, 200)}`);
      }
      const data = await response.json();
      let aiContent;
      if (provider === 'anthropic') {
        aiContent = data.content[0].text;
      } else {
        aiContent = data.choices[0].message.content;
      }
      setMessaggi([...updated, {
        role: 'assistant',
        content: aiContent,
        ts: Date.now()
      }]);
    } catch (e) {
      setErrore(e.message);
    } finally {
      setLoading(false);
    }
  };
  const clearChat = () => {
    if (confirm('Cancellare tutta la conversazione?')) setMessaggi([]);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-in"
  }, showKeyForm && /*#__PURE__*/React.createElement("div", {
    className: "card p-6 mb-6",
    style: {
      background: 'rgba(169,36,58,0.05)',
      borderColor: 'rgba(169,36,58,0.3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest mb-3",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "Configurazione \u2014 una volta sola"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed mb-4",
    style: {
      color: 'var(--ink-dim)'
    }
  }, "Per usare la modalit\xE0 IA serve la tua chiave API personale. Viene salvata ", /*#__PURE__*/React.createElement("strong", null, "solo nel tuo browser"), " (localStorage) e mai inviata a nessun server tranne quello del provider che scegli. Le richieste vanno direttamente dal tuo browser al provider \u2014 questa app non ha un backend."), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 mb-3"
  }, [{
    id: 'anthropic',
    n: 'Anthropic',
    d: 'claude-haiku-4-5'
  }, {
    id: 'openai',
    n: 'OpenAI',
    d: 'gpt-4o-mini'
  }, {
    id: 'openrouter',
    n: 'OpenRouter',
    d: 'claude via proxy'
  }].map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: "btn " + (provider === p.id ? 'primary' : 'ghost'),
    onClick: () => setProvider(p.id),
    style: {
      flexDirection: 'column',
      padding: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", null, p.n), /*#__PURE__*/React.createElement("div", {
    className: "mono text-[10px] mt-1",
    style: {
      opacity: 0.7
    }
  }, p.d)))), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: provider === 'anthropic' ? 'sk-ant-…' : provider === 'openai' ? 'sk-…' : 'sk-or-…',
    value: apiKey,
    onChange: e => setApiKey(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: () => {
      if (apiKey.trim()) setShowKeyForm(false);
    }
  }, "Salva e inizia"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] leading-relaxed",
    style: {
      color: 'var(--ink-mute)',
      flex: 1
    }
  }, "Dove ottengo la chiave?", ' ', provider === 'anthropic' && /*#__PURE__*/React.createElement("a", {
    href: "https://console.anthropic.com/settings/keys",
    target: "_blank",
    className: "link-crimson"
  }, "console.anthropic.com"), provider === 'openai' && /*#__PURE__*/React.createElement("a", {
    href: "https://platform.openai.com/api-keys",
    target: "_blank",
    className: "link-crimson"
  }, "platform.openai.com"), provider === 'openrouter' && /*#__PURE__*/React.createElement("a", {
    href: "https://openrouter.ai/keys",
    target: "_blank",
    className: "link-crimson"
  }, "openrouter.ai")))), !showKeyForm && /*#__PURE__*/React.createElement("div", {
    className: "card p-4 mb-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip gold"
  }, "\u25CF ", provider), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-dim)'
    }
  }, "chiave salvata localmente \xB7 ", messaggi.length, " messaggi")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn ghost text-xs",
    onClick: () => setShowKeyForm(true)
  }, "Cambia chiave"), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost text-xs",
    onClick: clearChat
  }, "Nuova conversazione"))), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    className: "card p-5 mb-4 scrollbar",
    style: {
      maxHeight: '500px',
      overflowY: 'auto',
      minHeight: '200px'
    }
  }, messaggi.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12",
    style: {
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote-mark"
  }, "\u201C"), /*#__PURE__*/React.createElement("div", {
    className: "serif italic text-lg mt-2"
  }, "Fai la tua domanda sul Transurfing."), /*#__PURE__*/React.createElement("div", {
    className: "text-xs mt-2"
  }, "L\\'IA ha accesso al glossario completo, alle 32 tecniche e alla FAQ dei libri.")), messaggi.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mb-4 " + (m.role === 'user' ? 'pl-12' : 'pr-12')
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono text-[10px] uppercase tracking-widest",
    style: {
      color: m.role === 'user' ? 'var(--gold)' : 'var(--crimson-bright)'
    }
  }, m.role === 'user' ? '→ tu' : '← sistema'), /*#__PURE__*/React.createElement("span", {
    className: "mono text-[10px]",
    style: {
      color: 'var(--ink-mute)'
    }
  }, new Date(m.ts).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  }))), /*#__PURE__*/React.createElement("div", {
    className: "text-sm leading-relaxed p-3 " + (m.role === 'user' ? 'text-right' : ''),
    style: {
      background: m.role === 'user' ? 'rgba(201,169,106,0.07)' : 'var(--bg-2)',
      borderLeft: m.role === 'user' ? 'none' : '2px solid var(--crimson)',
      borderRight: m.role === 'user' ? '2px solid var(--gold)' : 'none',
      color: 'var(--ink)',
      whiteSpace: 'pre-wrap'
    }
  }, m.content))), loading && /*#__PURE__*/React.createElement("div", {
    className: "pr-12 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono text-[10px] uppercase tracking-widest mb-1",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "\u2190 sistema"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm p-3 serif italic",
    style: {
      background: 'var(--bg-2)',
      borderLeft: '2px solid var(--crimson)',
      color: 'var(--ink-dim)'
    }
  }, "sto pensando\u2026"))), errore && /*#__PURE__*/React.createElement("div", {
    className: "card p-4 mb-3",
    style: {
      background: 'rgba(169,36,58,0.1)',
      borderColor: 'var(--crimson)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono text-[10px] uppercase tracking-widest mb-1",
    style: {
      color: 'var(--crimson-bright)'
    }
  }, "Errore"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs",
    style: {
      color: 'var(--ink)'
    }
  }, errore), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] mt-2",
    style: {
      color: 'var(--ink-mute)'
    }
  }, "Verifica che la chiave sia corretta e abbia credito. Se il messaggio parla di CORS, alcuni provider non supportano chiamate dirette dal browser \u2014 prova OpenRouter come alternativa.")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 items-end"
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: "2",
    placeholder: "Scrivi la tua domanda\u2026 (Ctrl+Enter per inviare)",
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send();
    },
    disabled: loading || showKeyForm
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: send,
    disabled: loading || !input.trim() || showKeyForm
  }, loading ? '…' : 'Invia →')), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 text-[11px] leading-relaxed",
    style: {
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Privacy"), ": tutte le conversazioni sono salvate solo nel tuo browser. La tua API key non viene mai inviata a server terzi, solo al provider che scegli.", /*#__PURE__*/React.createElement("strong", null, " Costo"), ": ogni messaggio costa pochi centesimi (Haiku: ~0,001 $/domanda). Ricarica la tua key sul provider quando serve."));
}
// ============================================================
// FLASH CARD — quiz a risposta multipla
// ============================================================
const FLASHCARDS = [
  { q: 'Secondo Zeland, come si indebolisce un pendolo distruttivo?',
    o: ['Combattendolo con determinazione', 'Ignorandolo con indifferenza totale', 'Pregando contro di esso', 'Allineandoti a un pendolo più forte'],
    c: 1, e: 'Il pendolo si alimenta di QUALSIASI reazione, positiva o negativa. L\'unica risposta che lo svuota è l\'indifferenza. Combatterlo lo rafforza.' },
  { q: 'Qual è la differenza tra intenzione interna ed esterna?',
    o: ['Interna = aperta; esterna = chiusa', 'Interna = spinge (volere); esterna = permette (essere già accordato)', 'Interna = rapida; esterna = lenta', 'Non c\'è differenza pratica'],
    c: 1, e: 'L\'intenzione interna è la spinta a fare (volere). L\'esterna è la prontezza ad accogliere quel che già esiste nello spazio delle varianti. Opposte per qualità.' },
  { q: 'Lo "spazio delle varianti" è:',
    o: ['Una metafora poetica senza meccanica', 'Un magazzino di tutte le possibili varianti degli eventi, già esistenti', 'Il futuro visualizzato', 'Il dimensione parallela della meccanica quantistica'],
    c: 1, e: 'Per Zeland lo spazio delle varianti è un campo informativo che contiene TUTTE le possibilità. Non crei nulla: scivoli da una variante a un\'altra cambiando frequenza.' },
  { q: 'Cos\'è un "pendolo"?',
    o: ['Un oggetto magico per divinazione', 'Una struttura energetica che vive dell\'attenzione dei suoi aderenti', 'Un pensiero negativo', 'Un ricordo traumatico'],
    c: 1, e: 'Il pendolo è un vortice energetico formato da gruppi umani che condividono pensieri/emozioni simili. Politici, religioni, mode, paure collettive: tutti pendoli.' },
  { q: 'Lo "slide" di Transurfing è:',
    o: ['Una visualizzazione intensa della meta', 'Una scena sintetica che incarna lo stato dell\'obiettivo già avvenuto, vissuta senza sforzo', 'Un gesto fisico ripetitivo', 'Una tecnica di rilassamento'],
    c: 1, e: 'Lo slide non è desiderare: è già abitare. Una scena breve, vivida, calma, che rappresenta "io sono già lì". Si installa per ripetizione leggera, mai forzata.' },
  { q: 'Il principio dello specchio dice che:',
    o: ['Se visualizzi il bene, il bene arriva', 'La realtà riflette i tuoi sentimenti/percezioni; cambi lo stato interno, non l\'immagine', 'Gli altri sono il tuo specchio karmico', 'Devi specchiarti letteralmente ogni mattina'],
    c: 1, e: 'È una legge meccanica di risonanza, non morale. Il Transurfing III insegna: lascia andare l\'immagine e modifica lo stato, il mondo si riallinea.' },
  { q: 'L\'"importanza" in Zeland è:',
    o: ['Dare priorità alle cose giuste', 'Carica emotiva sovradimensionata che genera forze equilibranti contrarie', 'Sinonimo di responsabilità', 'Rispetto per i valori'],
    c: 1, e: 'L\'importanza eccessiva (interna o esterna) crea potenziale energetico: le bilance equilibranti si attivano per scaricarlo, spesso rovinando ciò a cui davi importanza.' },
  { q: 'Il "frailing" o "frejling" è:',
    o: ['Un tipo di meditazione', 'Rinunciare alla propria pretesa e occuparsi di ciò che vuole l\'altro per ottenere il proprio', 'Sedurre manipolando', 'Fare il contrario di quel che senti'],
    c: 1, e: 'Frailing: abbandoni la tua intenzione interna di ricevere e ti sintonizzi sull\'altro. Paradossalmente, l\'altro inizia a darti quel che cercavi.' },
  { q: 'Tafti la Sacerdotessa è:',
    o: ['Un personaggio storico reale dell\'antico Egitto', 'Una figura narrativa allegorica che Zeland usa per insegnare', 'La moglie di Zeland', 'Una dea della tradizione slava'],
    c: 1, e: 'Tafti è un dispositivo narrativo. Il libro omonimo introduce Metaforza, Treccia e schermi attraverso la voce di questa sacerdotessa fittizia.' },
  { q: 'La "Treccia" nel sistema Tafti si trova:',
    o: ['In mezzo alla fronte', 'Dietro, fra le scapole, in alto', 'Sotto i piedi', 'Al centro del petto'],
    c: 1, e: 'Il punto di emissione della Metaforza è in alto dietro, tra le scapole. Da lì vengono le "frasi pulite" — impostazioni non filtrate dalla testa.' },
  { q: 'La Metaforza di Tafti si attiva:',
    o: ['Concentrandosi molto e volendo forte', 'Impostando dalla Treccia con frase breve, leggera, e poi dimenticando', 'Ripetendo mantra per 40 giorni', 'Visualizzando la meta per un\'ora'],
    c: 1, e: 'Le 8 regole: presenza, impostare (non volere), dalla Treccia, breve, leggero, triplice, seguire, dimenticare. Volere troppo spegne la Metaforza.' },
  { q: 'L\'"amalgama" nel linguaggio dei forum russi è:',
    o: ['Un materiale dentale', 'La soglia in cui una pratica smette di essere uno sforzo e diventa fondo', 'Il nome russo della meditazione', 'Un mix di oli essenziali per Transurfing'],
    c: 1, e: 'Amalgama: saturazione. Dopo alcuni giorni (5-7, 21, 42 a seconda del contesto), una pratica nuova diventa stato naturale. Non è regola universale.' },
  { q: 'Le "lucciole" (increspature sull\'acqua) sono:',
    o: ['Previsioni del futuro', 'Piccoli segnali ricorrenti che confermano o correggono la direzione, senza interpretazione', 'Sincronicità junghiane', 'Simboli astrologici'],
    c: 1, e: 'Zeland: nota i segnali senza forzarne il significato. La ricorrenza E IL MESSAGGIO; non costruire narrazione sopra.' },
  { q: 'Il "Manichino" è:',
    o: ['Una bambola da stregoneria', 'L\'automatismo di pensieri e reazioni che vive al posto nostro', 'Un esercizio fisico', 'Una statua votiva'],
    c: 1, e: 'Il Manichino siamo noi quando reagiamo in automatico ai fili dei pendoli. La presenza — stop-secondo — lo rivela e lo disinnesta.' },
  { q: 'Cos\'è il "coordinamento delle intenzioni"?',
    o: ['Sincronizzare il calendario del team', 'Assumere sempre il peggio per non deludersi', 'Accettare che QUALUNQUE cosa capiti come positiva o neutra, per non cadere in pendoli', 'Scegliere sempre la via di mezzo'],
    c: 2, e: '«Va bene così» — formula di coordinamento. Anche gli imprevisti sono letti come "buon segno" finché non è provato il contrario. Disarma i pendoli di reazione.' },
  { q: 'Il "coordinamento dell\'importanza" serve a:',
    o: ['Fare un\'agenda dei valori', 'Ridurre la carica emotiva che dai alle cose per disattivare le bilance equilibranti', 'Classificare le priorità', 'Nessuna delle precedenti'],
    c: 1, e: 'Riduci importanza = riduci resistenza della realtà. Le bilance si attivano quando un potenziale si accumula: ridurlo è la via più rapida.' },
  { q: 'Nei due schermi di Tafti, "schermo interno" è:',
    o: ['Lo schermo del computer', 'La scena che la mente costruisce (pensieri, proiezioni, ruminazioni)', 'L\'ambiente esterno', 'Un ricordo d\'infanzia'],
    c: 1, e: 'Interno = mente che monta scene. Esterno = realtà che accade. La pratica Tafti è distinguerli consapevolmente, non controllarli.' },
  { q: 'Il "corridoio delle varianti" è:',
    o: ['Un luogo fisico', 'La sequenza di varianti favorevoli in cui ti trovi se tieni lo stato giusto', 'L\'ingresso di casa Zeland', 'Un tunnel dopo la morte'],
    c: 1, e: 'Quando frequenza e importanza sono a posto, scivoli lungo un corridoio di varianti che si allineano con il tuo scopo. Uscirne = tensione, perdita di presenza.' },
  { q: 'La "Scintilla del Creatore" si localizza:',
    o: ['In testa', 'Al centro del petto', 'Nelle mani', 'Alla base della colonna'],
    c: 1, e: 'Nel Transurfing V e nei testi avanzati, la scintilla è al petto — direzione genuina che senti come "leggerezza" quando indovini la mossa giusta.' },
  { q: 'Qual è la corretta gerarchia: Anima — Ragione (mente)?',
    o: ['Mente guida, anima segue', 'Anima sa, mente esegue — non il contrario', 'Sono equivalenti', 'Anima e mente vanno eliminate'],
    c: 1, e: 'L\'anima sceglie (senza parole: silenzi, direzioni, «sì» corporei). La mente è lo strumento che esegue. Quando la mente guida, ti perdi nei pendoli.' },
  { q: 'Le "bilance equilibranti" si attivano quando:',
    o: ['Fai una cattiva azione', 'C\'è un eccesso di potenziale energetico concentrato (importanza)', 'È luna piena', 'Sbagli la frequenza'],
    c: 1, e: 'Legge fisica dello spazio: un picco di potenziale genera forze che lo disperdono. In pratica: più ti importa troppo, più la realtà te lo rovina.' },
  { q: 'Il "freischütz" (tiratore libero) è:',
    o: ['Chi agisce senza pretesa, senza forzare, fidandosi della scintilla', 'Un tipo di pendolo', 'Un mago teutonico', 'Un livello da raggiungere'],
    c: 0, e: 'Chi tira "libero" non mira ossessivamente, non si aggrappa al risultato — agisce con precisione leggera e lascia andare. Stato operativo di Transurfing avanzato.' },
  { q: 'Se una pratica nuova funziona, è perché:',
    o: ['Hai forte volontà', 'La ripeti in modo leggero e regolare, entra in amalgama e diventa fondo', 'Sei speciale', 'Hai pagato un corso'],
    c: 1, e: 'Ripetizione leggera > forza di volontà intermittente. Lo sforzo muscolare le spegne; la regolarità leggera le radica.' },
  { q: 'Secondo Zeland, visualizzare il risultato finale con intensità:',
    o: ['È la via principale del Transurfing', 'Spesso è controproducente: alza importanza e attiva bilance', 'Non ha effetti', 'Va fatto solo al mattino'],
    c: 1, e: 'Lo slide NON è una visualizzazione intensa. È una scena leggera e abitata. Visualizzare con forza è il modo classico di sabotarsi alzando l\'importanza.' },
  { q: 'Il gesto di "lasciar cadere" serve a:',
    o: ['Abbandonare gli obiettivi', 'Liberare la tensione su un\'importanza riconosciuta, restando in azione', 'Deprimerti', 'Mollare il percorso'],
    c: 1, e: 'Non è rassegnazione. È un micro-gesto mentale/fisico: riconosci che "qui mi importa troppo" e rilasci, continuando a camminare verso la meta.' },
  { q: 'Transurfing e Legge di Attrazione:',
    o: ['Sono la stessa cosa', 'La LoA dice "crei la realtà col pensiero"; Transurfing dice "scegli varianti già esistenti cambiando frequenza"', 'Sono opposti totali', 'LoA è più avanzata'],
    c: 1, e: 'Differenza cruciale. In Transurfing non crei nulla: navighi. E l\'energia di scelta non è "credenza positiva" ma allineamento calmo fra frequenza, intenzione esterna, assenza di importanza.' },
  { q: 'La "revisione serale" consiste nel:',
    o: ['Scrivere un diario dettagliato', 'Ripercorrere brevemente la giornata notando i momenti di presenza e di automatismo', 'Ripetere lo slide per 20 minuti', 'Pregare'],
    c: 1, e: 'Passaggio breve prima di dormire: dove sono stato presente, dove ha vinto il Manichino. Rinforza la ricorrenza della scena di presenza.' },
  { q: 'Cosa NON è Transurfing?',
    o: ['Pensiero positivo, LoA, New Age, costringere il futuro', 'Un sistema di pratiche per navigare le varianti', 'Un lavoro di presenza', 'Uno studio dei pendoli'],
    c: 0, e: 'Zeland è esplicito: non è pensiero positivo, non è manifestazione forzata. È osservazione precisa delle dinamiche + pratiche di disallineamento dai pendoli.' },
  { q: '«Impostare invece di volere» significa:',
    o: ['Arrendersi', 'Dichiarare la scena come già risolta e lasciarla andare, senza spingere', 'Forzare il destino', 'Fare wishful thinking'],
    c: 1, e: 'Il "volere" è un atto di intenzione interna che crea tensione e importanza. "Impostare" è un atto di intenzione esterna: dichiari e lasci, come chi compie un gesto leggero.' },
  { q: 'Il proiettore (Projector of new reality) è:',
    o: ['Un dispositivo tecnologico', 'Un testo di Zeland che anticipa Tafti, parla del "proiettore" interno che compone la realtà', 'Un tipo di lampada', 'Un modulo pratico'],
    c: 1, e: 'Nel "Proiettore della nuova realtà" Zeland introduce l\'idea che la coscienza proietta la scena della propria vita — preludio narrativo a Tafti.' }
];
function FlashCard() {
  const [mode, setMode] = useState('pratica'); // 'pratica' | 'test'
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState({ ok: 0, ko: 0 });
  const [testAnswers, setTestAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [order, setOrder] = useState(() => FLASHCARDS.map((_, i) => i));

  function shuffle() {
    const s = [...Array(FLASHCARDS.length).keys()];
    for (let i = s.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [s[i], s[j]] = [s[j], s[i]];
    }
    setOrder(s);
    setIdx(0); setChosen(null); setScore({ ok: 0, ko: 0 });
    setTestAnswers([]); setFinished(false);
  }

  const card = FLASHCARDS[order[idx]];
  const correct = chosen !== null && chosen === card.c;

  function choose(i) {
    if (chosen !== null) return;
    setChosen(i);
    if (mode === 'pratica') {
      if (i === card.c) setScore(s => ({ ...s, ok: s.ok + 1 }));
      else setScore(s => ({ ...s, ko: s.ko + 1 }));
    } else {
      setTestAnswers(prev => [...prev, { i: order[idx], chosen: i, correct: i === card.c }]);
    }
  }
  function next() {
    if (idx + 1 >= FLASHCARDS.length) {
      setFinished(true);
      return;
    }
    setIdx(idx + 1);
    setChosen(null);
  }

  if (finished) {
    const right = mode === 'test' ? testAnswers.filter(a => a.correct).length : score.ok;
    const total = mode === 'test' ? testAnswers.length : score.ok + score.ko;
    const pct = total ? Math.round(100 * right / total) : 0;
    return /*#__PURE__*/React.createElement("div", null,
      /*#__PURE__*/React.createElement("div", { className: "section-num mb-2" }, "07 \xB7 FLASH CARD"),
      /*#__PURE__*/React.createElement("h2", { className: "text-5xl serif mb-4", style: { letterSpacing: '-0.01em' } },
        "Quiz ", /*#__PURE__*/React.createElement("span", { className: "italic", style: { color: 'var(--crimson-bright)' } }, "completato"), "."),
      /*#__PURE__*/React.createElement("div", { className: "card p-6 mb-6" },
        /*#__PURE__*/React.createElement("div", { className: "serif text-3xl mb-3" }, right, " / ", total, " \u2014 ", pct, "%"),
        /*#__PURE__*/React.createElement("div", { className: "text-sm leading-relaxed mb-4", style: { color: 'var(--ink-dim)' } },
          pct >= 85 ? "Eccellente. Hai integrato la struttura del Transurfing a un livello operativo." :
          pct >= 65 ? "Buono. Alcuni concetti chiave sono saldi; rivedi quelli sbagliati per chiudere i buchi." :
          pct >= 40 ? "Parziale. Conviene tornare al glossario e rivedere in particolare pendoli, importanza, intenzione." :
          "Conviene ricominciare dal glossario e dalle prime 4 settimane: sono le fondamenta."),
        /*#__PURE__*/React.createElement("button", { className: "btn primary", onClick: shuffle }, "Ricomincia mescolato"))
    );
  }

  return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("div", { className: "section-num mb-2" }, "07 \xB7 FLASH CARD"),
    /*#__PURE__*/React.createElement("h2", { className: "text-5xl serif mb-4", style: { letterSpacing: '-0.01em' } },
      "Allena la ", /*#__PURE__*/React.createElement("span", { className: "italic", style: { color: 'var(--crimson-bright)' } }, "comprensione"), "."),
    /*#__PURE__*/React.createElement("p", { className: "text-base max-w-3xl mb-6 leading-relaxed", style: { color: 'var(--ink-dim)' } },
      "Domande a risposta multipla sui concetti centrali di Zeland. Due modalit\xE0: ", /*#__PURE__*/React.createElement("strong", null, "pratica"), " mostra la spiegazione subito dopo ogni risposta; ", /*#__PURE__*/React.createElement("strong", null, "test"), " accumula le risposte e d\xE0 il punteggio alla fine."),
    /*#__PURE__*/React.createElement("div", { className: "flex gap-2 mb-6" },
      /*#__PURE__*/React.createElement("button", { className: "btn " + (mode === 'pratica' ? 'primary' : 'ghost'), onClick: () => { setMode('pratica'); shuffle(); } }, "Pratica"),
      /*#__PURE__*/React.createElement("button", { className: "btn " + (mode === 'test' ? 'primary' : 'ghost'), onClick: () => { setMode('test'); shuffle(); } }, "Test"),
      /*#__PURE__*/React.createElement("button", { className: "btn ghost", onClick: shuffle }, "\u21BB Mescola")),
    /*#__PURE__*/React.createElement("div", { className: "card p-6 mb-4" },
      /*#__PURE__*/React.createElement("div", { className: "flex items-center justify-between mb-4" },
        /*#__PURE__*/React.createElement("span", { className: "mono text-xs uppercase tracking-widest", style: { color: 'var(--gold-dim)' } }, "Domanda ", idx + 1, " / ", FLASHCARDS.length),
        mode === 'pratica' && /*#__PURE__*/React.createElement("span", { className: "mono text-xs", style: { color: 'var(--ink-mute)' } },
          /*#__PURE__*/React.createElement("span", { style: { color: '#8be58b' } }, "\u2713 ", score.ok), "   ",
          /*#__PURE__*/React.createElement("span", { style: { color: 'var(--crimson-bright)' } }, "\u2717 ", score.ko))),
      /*#__PURE__*/React.createElement("div", { className: "serif text-xl mb-5", style: { letterSpacing: '-0.01em' } }, card.q),
      /*#__PURE__*/React.createElement("div", { className: "space-y-2 mb-4" },
        card.o.map((opt, i) => {
          const isChosen = chosen === i;
          const isCorrect = i === card.c;
          const showReveal = chosen !== null && mode === 'pratica';
          let border = 'rgba(255,255,255,0.08)';
          let bg = 'transparent';
          if (showReveal && isCorrect) { border = '#8be58b'; bg = 'rgba(139,229,139,0.07)'; }
          else if (showReveal && isChosen && !isCorrect) { border = 'var(--crimson-bright)'; bg = 'rgba(220,50,50,0.07)'; }
          else if (isChosen) { border = 'var(--gold-dim)'; }
          return /*#__PURE__*/React.createElement("button", {
            key: i,
            onClick: () => choose(i),
            disabled: chosen !== null,
            className: "w-full text-left p-3 text-sm leading-relaxed",
            style: {
              border: '1px solid ' + border,
              background: bg,
              borderRadius: '6px',
              cursor: chosen !== null ? 'default' : 'pointer',
              transition: 'border-color 180ms, background 180ms',
              color: 'var(--ink)'
            }
          }, /*#__PURE__*/React.createElement("span", { className: "mono text-xs mr-3", style: { color: 'var(--gold-dim)' } }, String.fromCharCode(65 + i)), opt);
        })),
      chosen !== null && mode === 'pratica' && /*#__PURE__*/React.createElement("div", {
        className: "p-4 mb-2", style: { background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid ' + (correct ? '#8be58b' : 'var(--crimson-bright)'), borderRadius: '3px' }
      },
        /*#__PURE__*/React.createElement("div", { className: "mono uppercase text-[10px] tracking-widest mb-2", style: { color: correct ? '#8be58b' : 'var(--crimson-bright)' } }, correct ? "Corretto" : "Risposta corretta: " + String.fromCharCode(65 + card.c)),
        /*#__PURE__*/React.createElement("div", { className: "text-xs leading-relaxed", style: { color: 'var(--ink-dim)' } }, card.e))),
    /*#__PURE__*/React.createElement("div", { className: "flex justify-between items-center" },
      /*#__PURE__*/React.createElement("div", { className: "mono text-xs", style: { color: 'var(--ink-mute)' } },
        "Modalit\xE0: ", mode === 'pratica' ? 'Pratica (spiegazione immediata)' : 'Test (punteggio finale)'),
      /*#__PURE__*/React.createElement("button", {
        className: "btn " + (chosen !== null ? 'primary' : 'ghost'),
        onClick: next,
        disabled: mode === 'pratica' && chosen === null
      }, idx + 1 >= FLASHCARDS.length ? 'Concludi \u2192' : 'Prossima \u2192')));
}

// ============================================================
// AUDIO — upload di file audio, persistenza in IndexedDB
// ============================================================
function openAudioDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('ars_realis_audio', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('audio')) {
        db.createObjectStore('audio', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function audioDbAll() {
  return openAudioDB().then(db => new Promise((res, rej) => {
    const tx = db.transaction('audio', 'readonly');
    const store = tx.objectStore('audio');
    const r = store.getAll();
    r.onsuccess = () => res(r.result || []);
    r.onerror = () => rej(r.error);
  }));
}
function audioDbAdd(entry) {
  return openAudioDB().then(db => new Promise((res, rej) => {
    const tx = db.transaction('audio', 'readwrite');
    const r = tx.objectStore('audio').add(entry);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
}
function audioDbDel(id) {
  return openAudioDB().then(db => new Promise((res, rej) => {
    const tx = db.transaction('audio', 'readwrite');
    const r = tx.objectStore('audio').delete(id);
    r.onsuccess = () => res();
    r.onerror = () => rej(r.error);
  }));
}
function Audio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  async function refresh() {
    try {
      setLoading(true);
      const all = await audioDbAll();
      const withUrl = all.map(it => ({ ...it, url: it.blob ? URL.createObjectURL(it.blob) : null }));
      setItems(withUrl.sort((a, b) => (b.ts || 0) - (a.ts || 0)));
    } catch (e) { setErr(String(e && e.message || e)); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); return () => { items.forEach(it => it.url && URL.revokeObjectURL(it.url)); }; /* eslint-disable-line */ }, []);

  async function save() {
    if (!file) { setErr('Seleziona un file audio.'); return; }
    if (!title.trim()) { setErr('Dai un titolo all\'audio.'); return; }
    try {
      setSaving(true); setErr(null);
      await audioDbAdd({
        title: title.trim(),
        note: note.trim(),
        name: file.name,
        type: file.type || 'audio/mpeg',
        size: file.size,
        blob: file,
        ts: Date.now()
      });
      setTitle(''); setNote(''); setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      await refresh();
    } catch (e) { setErr(String(e && e.message || e)); }
    finally { setSaving(false); }
  }
  async function del(id) {
    if (!window.confirm('Eliminare questo audio?')) return;
    try { await audioDbDel(id); await refresh(); } catch (e) { setErr(String(e && e.message || e)); }
  }
  function fmtSize(b) { if (!b) return ''; if (b < 1024) return b + ' B'; if (b < 1048576) return (b/1024).toFixed(0) + ' KB'; return (b/1048576).toFixed(1) + ' MB'; }
  function fmtDate(ts) { if (!ts) return ''; const d = new Date(ts); return d.toLocaleDateString('it-IT') + ' ' + d.toTimeString().slice(0,5); }

  return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("div", { className: "section-num mb-2" }, "08 \xB7 AUDIO VOCALI"),
    /*#__PURE__*/React.createElement("h2", { className: "text-5xl serif mb-4", style: { letterSpacing: '-0.01em' } },
      "I tuoi ", /*#__PURE__*/React.createElement("span", { className: "italic", style: { color: 'var(--crimson-bright)' } }, "appunti sonori"), "."),
    /*#__PURE__*/React.createElement("p", { className: "text-base max-w-3xl mb-6 leading-relaxed", style: { color: 'var(--ink-dim)' } },
      "Carica le registrazioni vocali: lezioni, riflessioni serali, slide verbalizzati. Restano nel tuo browser (IndexedDB), non lasciano il dispositivo. Formato consigliato: ", /*#__PURE__*/React.createElement("code", null, ".mp3"), ", ", /*#__PURE__*/React.createElement("code", null, ".m4a"), ", ", /*#__PURE__*/React.createElement("code", null, ".ogg"), ", ", /*#__PURE__*/React.createElement("code", null, ".wav"), "."),
    /*#__PURE__*/React.createElement("div", { className: "card p-6 mb-6" },
      /*#__PURE__*/React.createElement("div", { className: "mono uppercase text-[10px] tracking-widest mb-3", style: { color: 'var(--gold-dim)' } }, "Nuovo audio"),
      /*#__PURE__*/React.createElement("input", {
        type: "text", value: title, onChange: (e) => setTitle(e.target.value),
        placeholder: "Titolo (es. Revisione serale 22 aprile)",
        className: "w-full p-3 text-sm mb-3",
        style: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink)', borderRadius: '4px' }
      }),
      /*#__PURE__*/React.createElement("textarea", {
        value: note, onChange: (e) => setNote(e.target.value),
        placeholder: "Nota breve (opzionale): contesto, settimana di riferimento, tag",
        className: "w-full p-3 text-sm mb-3", rows: 2,
        style: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink)', borderRadius: '4px', resize: 'vertical' }
      }),
      /*#__PURE__*/React.createElement("input", {
        ref: fileRef, type: "file", accept: "audio/*",
        onChange: (e) => setFile(e.target.files && e.target.files[0]),
        className: "w-full p-2 text-xs mb-4 mono",
        style: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink-dim)', borderRadius: '4px' }
      }),
      err && /*#__PURE__*/React.createElement("div", { className: "text-xs mb-3", style: { color: 'var(--crimson-bright)' } }, err),
      /*#__PURE__*/React.createElement("button", { className: "btn primary", onClick: save, disabled: saving }, saving ? "Salvataggio…" : "Carica audio")),
    /*#__PURE__*/React.createElement("div", { className: "mono uppercase text-[10px] tracking-widest mb-3", style: { color: 'var(--gold-dim)' } }, "Libreria (", items.length, ")"),
    loading ? /*#__PURE__*/React.createElement("div", { className: "text-sm", style: { color: 'var(--ink-mute)' } }, "Caricamento…") :
    items.length === 0 ? /*#__PURE__*/React.createElement("div", { className: "card p-5 text-sm", style: { color: 'var(--ink-dim)' } }, "Nessun audio caricato. Usa il form qui sopra per aggiungerne uno.") :
    /*#__PURE__*/React.createElement("div", { className: "space-y-3" },
      items.map(it => /*#__PURE__*/React.createElement("div", { key: it.id, className: "card p-5" },
        /*#__PURE__*/React.createElement("div", { className: "flex items-start justify-between mb-2" },
          /*#__PURE__*/React.createElement("div", { className: "flex-1" },
            /*#__PURE__*/React.createElement("div", { className: "serif text-lg mb-1" }, it.title),
            /*#__PURE__*/React.createElement("div", { className: "mono text-[10px] uppercase tracking-widest", style: { color: 'var(--ink-mute)' } },
              fmtDate(it.ts), " \xB7 ", fmtSize(it.size), " \xB7 ", it.name)),
          /*#__PURE__*/React.createElement("button", {
            onClick: () => del(it.id), className: "mono text-[10px] uppercase tracking-widest",
            style: { color: 'var(--crimson-bright)', background: 'transparent', border: 'none', cursor: 'pointer' }
          }, "Elimina")),
        it.note && /*#__PURE__*/React.createElement("div", { className: "text-xs mb-3", style: { color: 'var(--ink-dim)' } }, it.note),
        it.url && /*#__PURE__*/React.createElement("audio", { src: it.url, controls: true, className: "w-full", style: { height: '36px' } })))));
}

// ============================================================
// RISORSE PDF — materiali scaricabili
// ============================================================
function openResDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('ars_realis_risorse', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('risorse')) {
        db.createObjectStore('risorse', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function resDbAll() {
  return openResDB().then(db => new Promise((res, rej) => {
    const r = db.transaction('risorse', 'readonly').objectStore('risorse').getAll();
    r.onsuccess = () => res(r.result || []);
    r.onerror = () => rej(r.error);
  }));
}
function resDbAdd(entry) {
  return openResDB().then(db => new Promise((res, rej) => {
    const r = db.transaction('risorse', 'readwrite').objectStore('risorse').add(entry);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
}
function resDbDel(id) {
  return openResDB().then(db => new Promise((res, rej) => {
    const r = db.transaction('risorse', 'readwrite').objectStore('risorse').delete(id);
    r.onsuccess = () => res();
    r.onerror = () => rej(r.error);
  }));
}

// ============================================================
// ORACOLO — 78 aforismi "consigli dall'Universo"
// ============================================================
const ORACOLO = [
  { n: 1, t: "Non volere. Lascia che la vita ti conduca." },
  { n: 2, t: "Quando spingi troppo, la porta si chiude. Allenta, e si apre da sola." },
  { n: 3, t: "Oggi puoi scegliere di non combattere nulla." },
  { n: 4, t: "La tua calma è una tecnologia. Allenala." },
  { n: 5, t: "Ciò che accetti si trasforma. Ciò che rifiuti si rinforza." },
  { n: 6, t: "Smetti di giudicare: la mente capirà dopo ciò che il cuore già sa." },
  { n: 7, t: "L'universo non ha fretta. Prendi esempio." },
  { n: 8, t: "Se sei in ritardo, sei dove dovevi essere." },
  { n: 9, t: "Il sorriso è la tua tecnica più potente di oggi." },
  { n: 10, t: "Le persone difficili sono maestri camuffati." },
  { n: 11, t: "Permettiti di riposare senza sensi di colpa." },
  { n: 12, t: "Lo scopo della giornata è goderla, non sopravviverla." },
  { n: 13, t: "Non forzare il fiume. Diventa il fiume." },
  { n: 14, t: "Ciò che immagini con chiarezza ti sta già cercando." },
  { n: 15, t: "Il miglior momento per essere grato è adesso." },
  { n: 16, t: "I problemi non sono segnali di stop, sono deviazioni." },
  { n: 17, t: "Respira tre volte prima di rispondere." },
  { n: 18, t: "Il tuo valore non dipende dalla tua produttività." },
  { n: 19, t: "Fidati: nulla di essenziale ti manca." },
  { n: 20, t: "Se sei stanco, fai meno — non di più." },
  { n: 21, t: "Ogni «no» chiude una porta per aprirne una migliore." },
  { n: 22, t: "Il tuo unico compito è accorgerti di essere qui." },
  { n: 23, t: "Guarda lo schermo della realtà senza recitare." },
  { n: 24, t: "Nessuno è veramente contro di te — ognuno vive il proprio film." },
  { n: 25, t: "La fretta è un pendolo. Esci." },
  { n: 26, t: "Ciò che temi lo attiri. Ciò che ami lo incontri." },
  { n: 27, t: "Non controllare il risultato. Controlla la direzione." },
  { n: 28, t: "Le coincidenze sono l'universo che ti fa l'occhiolino." },
  { n: 29, t: "Se qualcosa si complica, l'universo sta deviando per proteggerti." },
  { n: 30, t: "Dare è ricevere. Ricevere è permettere." },
  { n: 31, t: "Sei libero di cambiare idea. Oggi stesso." },
  { n: 32, t: "Il corpo sa prima della testa. Ascoltalo." },
  { n: 33, t: "Vivi come se tutto andasse bene — molto spesso succede." },
  { n: 34, t: "Non c'è nulla di sbagliato in te. Non c'è mai stato." },
  { n: 35, t: "Lascia andare la persona che eri ieri." },
  { n: 36, t: "La pace è una scelta, prima di essere uno stato." },
  { n: 37, t: "Se perdi qualcosa, stavi trattenendola troppo." },
  { n: 38, t: "L'abbondanza arriva quando smetti di inseguirla." },
  { n: 39, t: "Ogni persona che incontri ha qualcosa da insegnarti." },
  { n: 40, t: "Non devi meritare. Devi permettere." },
  { n: 41, t: "Il passato non decide il prossimo passo." },
  { n: 42, t: "Fermati. Guarda. Respira. Continua." },
  { n: 43, t: "Le giornate migliori sono quelle senza piano." },
  { n: 44, t: "Quando non sai cosa fare, non fare nulla: il chiaro arriva." },
  { n: 45, t: "Il silenzio è pieno di risposte, se smetti di parlare." },
  { n: 46, t: "Sei lo sceneggiatore, non la vittima." },
  { n: 47, t: "Ogni momento ti offre una nuova versione di te." },
  { n: 48, t: "L'apprezzamento amplifica. Inizia da una cosa piccola." },
  { n: 49, t: "Non farti trovare già stanco dal mattino." },
  { n: 50, t: "Ridere è un atto sovversivo e guaritivo." },
  { n: 51, t: "Ciò che cerchi fuori ti sta già aspettando dentro." },
  { n: 52, t: "Puoi scegliere la versione gentile della tua giornata." },
  { n: 53, t: "Non tutti gli inviti vanno accettati — specie quelli della mente." },
  { n: 54, t: "Se arriva l'ansia, guardala e chiedile cosa vuole." },
  { n: 55, t: "Il tuo tempo è sacro. Custodiscilo." },
  { n: 56, t: "Nel dubbio, scegli ciò che ti fa respirare meglio." },
  { n: 57, t: "Nulla di importante si decide di fretta." },
  { n: 58, t: "Dì «grazie» anche quando non ti senti di doverlo." },
  { n: 59, t: "La semplicità è eleganza nascosta." },
  { n: 60, t: "Se tutti gridano, sussurra." },
  { n: 61, t: "Amare sé stessi non è vanità: è fondamenta." },
  { n: 62, t: "La fortuna è preparazione che incontra l'occasione rilassata." },
  { n: 63, t: "Il perdono è un dono che fai a te stesso." },
  { n: 64, t: "Non sei in ritardo sulla tua vita. Non esiste un calendario." },
  { n: 65, t: "Ogni respiro è un «sì» alla vita." },
  { n: 66, t: "Le cose belle accadono quando ti allenti." },
  { n: 67, t: "Oggi è l'unico giorno su cui hai potere." },
  { n: 68, t: "Libera le persone che ami dall'idea che ne hai." },
  { n: 69, t: "Sbagliare è un permesso, non un problema." },
  { n: 70, t: "Ciò che non può essere forzato può essere accolto." },
  { n: 71, t: "Il coraggio è paura che ha imparato a camminare." },
  { n: 72, t: "Prima di dire sì, senti dove lo senti nel corpo." },
  { n: 73, t: "Le tue parole costruiscono mondi. Parla bene di te." },
  { n: 74, t: "Dove guarda la tua attenzione, va la tua vita." },
  { n: 75, t: "Non serve diventare. Serve tornare." },
  { n: 76, t: "La bellezza è un atto di attenzione." },
  { n: 77, t: "Il tuo scopo non è altrove. È in come stai qui." },
  { n: 78, t: "Tutto è già ben orchestrato. Puoi rilassarti ora." }
];

function Oracolo() {
  const STORAGE_KEY = 'ars-oracolo-lastDraw';
  const [drawn, setDrawn] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  });
  const [showAll, setShowAll] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const today = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / 86400000);
    return ORACOLO[dayOfYear % ORACOLO.length];
  }, []);

  function pesca() {
    let idx;
    do { idx = Math.floor(Math.random() * ORACOLO.length); }
    while (drawn && ORACOLO[idx].n === drawn.n && ORACOLO.length > 1);
    const card = ORACOLO[idx];
    setDrawn(card);
    setAnimKey(function (k) { return k + 1; });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(card)); } catch (e) {}
  }

  function clear() {
    setDrawn(null);
    setAnimKey(function (k) { return k + 1; });
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function selectFromList(o) {
    setDrawn(o);
    setAnimKey(function (k) { return k + 1; });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(o)); } catch (e) {}
    if (typeof window !== 'undefined') { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }

  const current = drawn || today;
  const padN = (n) => ('00' + n).slice(-2);

  return React.createElement('div', null,
    React.createElement('div', { className: 'section-num mb-3' }, '10 · ORACOLO'),
    React.createElement('h1', {
      className: 'text-5xl serif leading-none mb-4 anim-blur-zoom-in',
      style: { letterSpacing: '-0.015em' }
    }, 'Consigli ', React.createElement('span', {
      className: 'italic focus-reveal',
      style: { color: 'var(--gold)' }
    }, "dall'Universo"), '.'),
    React.createElement('p', {
      className: 'text-lg max-w-2xl leading-relaxed mb-10',
      style: { color: 'var(--ink-dim)' }
    }, '78 aforismi per attraversare la giornata con leggerezza. Pesca a intuito, oppure lascia che sia il giorno a scegliere per te.'),

    React.createElement('div', {
      key: animKey,
      className: 'card p-10 mb-8 relative glow-border anim-focus-loop anim-blur-zoom-in'
    },
      React.createElement('div', { className: 'quote-mark absolute -top-2 left-4' }, '\u201C'),
      React.createElement('div', {
        className: 'section-num mb-3',
        style: { paddingLeft: '1.5rem' }
      }, 'N.' + padN(current.n)),
      React.createElement('div', {
        className: 'serif italic text-3xl leading-snug pl-6 pr-4',
        style: { color: 'var(--ink)' }
      }, current.t),
      React.createElement('div', {
        className: 'mt-6 pl-6 text-xs mono',
        style: { color: 'var(--gold-dim)' }
      }, drawn ? '\u2014 estratto da te' : '\u2014 consiglio del giorno · ruota a mezzanotte')
    ),

    React.createElement('div', { className: 'flex flex-wrap gap-3 mb-12' },
      React.createElement('button', {
        className: 'btn primary', onClick: pesca
      }, '\u2726  Pesca un consiglio'),
      drawn && React.createElement('button', {
        className: 'btn', onClick: clear
      }, 'Torna al consiglio del giorno'),
      React.createElement('button', {
        className: 'btn', onClick: function () { setShowAll(function (v) { return !v; }); }
      }, showAll ? "Chiudi l'archivio" : 'Vedi tutti e 78')
    ),

    showAll && React.createElement('div', {
      className: 'section-title mb-4'
    }, React.createElement('span', { className: 'section-num' }, "ARCHIVIO COMPLETO"),
       React.createElement('span', { className: 'section-rule' })),

    showAll && React.createElement('div', {
      className: 'grid grid-cols-2 gap-3 mb-10 anim-blur-zoom-in'
    }, ORACOLO.map(function (o) {
      const isCurrent = current && current.n === o.n;
      return React.createElement('div', {
        key: o.n,
        className: 'card p-4 cursor-pointer hover-blur-zoom' + (isCurrent ? ' glow-border' : ''),
        onClick: function () { selectFromList(o); }
      },
        React.createElement('div', { className: 'section-num mb-1' }, padN(o.n)),
        React.createElement('div', {
          className: 'serif text-base leading-snug',
          style: { color: 'var(--ink-dim)' }
        }, o.t)
      );
    }))
  );
}

function Risorse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tag, setTag] = useState('dispensa');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  async function refresh() {
    try {
      setLoading(true);
      const all = await resDbAll();
      const withUrl = all.map(it => ({ ...it, url: it.blob ? URL.createObjectURL(it.blob) : null }));
      setItems(withUrl.sort((a, b) => (b.ts || 0) - (a.ts || 0)));
    } catch (e) { setErr(String(e && e.message || e)); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); return () => { items.forEach(it => it.url && URL.revokeObjectURL(it.url)); }; /* eslint-disable-line */ }, []);

  async function save() {
    if (!file) { setErr('Seleziona un file PDF.'); return; }
    if (!title.trim()) { setErr('Dai un titolo alla risorsa.'); return; }
    try {
      setSaving(true); setErr(null);
      await resDbAdd({
        title: title.trim(),
        desc: desc.trim(),
        tag,
        name: file.name,
        type: file.type || 'application/pdf',
        size: file.size,
        blob: file,
        ts: Date.now()
      });
      setTitle(''); setDesc(''); setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      await refresh();
    } catch (e) { setErr(String(e && e.message || e)); }
    finally { setSaving(false); }
  }
  async function del(id) {
    if (!window.confirm('Eliminare questa risorsa?')) return;
    try { await resDbDel(id); await refresh(); } catch (e) { setErr(String(e && e.message || e)); }
  }
  function download(it) {
    if (!it.url) return;
    const a = document.createElement('a');
    a.href = it.url; a.download = it.name || (it.title + '.pdf');
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }
  function fmtSize(b) { if (!b) return ''; if (b < 1024) return b + ' B'; if (b < 1048576) return (b/1024).toFixed(0) + ' KB'; return (b/1048576).toFixed(1) + ' MB'; }
  const TAGS = [
    { v: 'dispensa', l: 'Dispensa', c: 'var(--gold-dim)' },
    { v: 'libro', l: 'Libro', c: 'var(--crimson-bright)' },
    { v: 'scheda', l: 'Scheda pratica', c: '#6db4ff' },
    { v: 'appunti', l: 'Appunti', c: '#b37cff' },
    { v: 'altro', l: 'Altro', c: 'var(--ink-mute)' }
  ];
  function tagInfo(v) { return TAGS.find(t => t.v === v) || TAGS[TAGS.length - 1]; }

  return /*#__PURE__*/React.createElement("div", null,
    /*#__PURE__*/React.createElement("div", { className: "section-num mb-2" }, "09 \xB7 RISORSE PDF"),
    /*#__PURE__*/React.createElement("h2", { className: "text-5xl serif mb-4", style: { letterSpacing: '-0.01em' } },
      "Materiali ", /*#__PURE__*/React.createElement("span", { className: "italic", style: { color: 'var(--crimson-bright)' } }, "scaricabili"), "."),
    /*#__PURE__*/React.createElement("p", { className: "text-base max-w-3xl mb-6 leading-relaxed", style: { color: 'var(--ink-dim)' } },
      "Carica le tue risorse PDF: dispense, schede pratiche, estratti, appunti. Restano nel browser, pronte per essere scaricate e condivise. Per ogni PDF puoi dare titolo, descrizione e tag."),
    /*#__PURE__*/React.createElement("div", { className: "card p-6 mb-6" },
      /*#__PURE__*/React.createElement("div", { className: "mono uppercase text-[10px] tracking-widest mb-3", style: { color: 'var(--gold-dim)' } }, "Nuova risorsa"),
      /*#__PURE__*/React.createElement("input", {
        type: "text", value: title, onChange: (e) => setTitle(e.target.value),
        placeholder: "Titolo (es. Schema delle 8 regole Metaforza)",
        className: "w-full p-3 text-sm mb-3",
        style: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink)', borderRadius: '4px' }
      }),
      /*#__PURE__*/React.createElement("textarea", {
        value: desc, onChange: (e) => setDesc(e.target.value),
        placeholder: "Descrizione (opzionale): di cosa parla, quando si usa",
        className: "w-full p-3 text-sm mb-3", rows: 2,
        style: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink)', borderRadius: '4px', resize: 'vertical' }
      }),
      /*#__PURE__*/React.createElement("div", { className: "flex gap-2 mb-3 flex-wrap" },
        TAGS.map(t => /*#__PURE__*/React.createElement("button", {
          key: t.v,
          onClick: () => setTag(t.v),
          className: "chip mono",
          style: {
            color: tag === t.v ? t.c : 'var(--ink-mute)',
            borderColor: tag === t.v ? t.c : 'rgba(255,255,255,0.12)',
            background: tag === t.v ? 'rgba(255,255,255,0.04)' : 'transparent',
            cursor: 'pointer'
          }
        }, t.l))),
      /*#__PURE__*/React.createElement("input", {
        ref: fileRef, type: "file", accept: "application/pdf,.pdf",
        onChange: (e) => setFile(e.target.files && e.target.files[0]),
        className: "w-full p-2 text-xs mb-4 mono",
        style: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink-dim)', borderRadius: '4px' }
      }),
      err && /*#__PURE__*/React.createElement("div", { className: "text-xs mb-3", style: { color: 'var(--crimson-bright)' } }, err),
      /*#__PURE__*/React.createElement("button", { className: "btn primary", onClick: save, disabled: saving }, saving ? "Salvataggio…" : "Carica PDF")),
    /*#__PURE__*/React.createElement("div", { className: "mono uppercase text-[10px] tracking-widest mb-3", style: { color: 'var(--gold-dim)' } }, "Catalogo (", items.length, ")"),
    loading ? /*#__PURE__*/React.createElement("div", { className: "text-sm", style: { color: 'var(--ink-mute)' } }, "Caricamento…") :
    items.length === 0 ? /*#__PURE__*/React.createElement("div", { className: "card p-5 text-sm", style: { color: 'var(--ink-dim)' } }, "Nessuna risorsa caricata. Aggiungi il primo PDF dal form qui sopra.") :
    /*#__PURE__*/React.createElement("div", { className: "space-y-3" },
      items.map(it => {
        const ti = tagInfo(it.tag);
        return /*#__PURE__*/React.createElement("div", { key: it.id, className: "card p-5" },
          /*#__PURE__*/React.createElement("div", { className: "flex items-start justify-between mb-2 gap-4" },
            /*#__PURE__*/React.createElement("div", { className: "flex-1" },
              /*#__PURE__*/React.createElement("div", { className: "flex items-baseline gap-3 mb-1 flex-wrap" },
                /*#__PURE__*/React.createElement("span", { className: "chip mono", style: { color: ti.c, borderColor: ti.c } }, ti.l),
                /*#__PURE__*/React.createElement("span", { className: "serif text-lg" }, it.title)),
              /*#__PURE__*/React.createElement("div", { className: "mono text-[10px] uppercase tracking-widest", style: { color: 'var(--ink-mute)' } },
                fmtSize(it.size), " \xB7 ", it.name)),
            /*#__PURE__*/React.createElement("div", { className: "flex gap-2" },
              /*#__PURE__*/React.createElement("button", { className: "btn ghost text-xs", onClick: () => download(it) }, "\u2193 Scarica"),
              /*#__PURE__*/React.createElement("button", {
                onClick: () => del(it.id),
                className: "mono text-[10px] uppercase tracking-widest self-center",
                style: { color: 'var(--crimson-bright)', background: 'transparent', border: 'none', cursor: 'pointer' }
              }, "Elimina"))),
          it.desc && /*#__PURE__*/React.createElement("div", { className: "text-xs mt-2", style: { color: 'var(--ink-dim)' } }, it.desc));
      })));
}

function SiteGate({ onUnlock }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(null);
  const [checking, setChecking] = useState(false);
  const submit = async () => {
    if (!pw.trim()) return;
    setChecking(true); setErr(null);
    try {
      const h = await hashPassword(pw.trim());
      if (h === PDF_PASSWORD_HASH) {
        try {
          sessionStorage.setItem('ts_site_auth', '1');
          sessionStorage.setItem('ts_pdf_auth', '1');
        } catch (e) {}
        onUnlock(true);
      } else { setErr('Password errata.'); }
    } catch (e) { setErr('Errore nella verifica: ' + e.message); }
    finally { setChecking(false); }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: { position: 'fixed', inset: 0, zIndex: 200, background: 'radial-gradient(ellipse at center, #14092e 0%, #05030f 65%, #020108 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card p-10 glow-border fade-in",
    style: { width: 'min(460px,100%)', position: 'relative', overflow: 'hidden' }
  }, /*#__PURE__*/React.createElement("div", {
    style: { position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(154,119,33,0.10) 0%, transparent 70%)', pointerEvents: 'none' }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-xs mono uppercase tracking-widest mb-3",
    style: { color: 'var(--gold-dim)' }
  }, "\u25C8  Community Transurfing  \u25C8"), /*#__PURE__*/React.createElement("div", {
    className: "serif text-3xl mb-2",
    style: { letterSpacing: '-0.01em' }
  }, "Soglia simbolica"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm mb-6 leading-relaxed",
    style: { color: 'var(--ink-dim)' }
  }, "Uno spazio di studio per chi sta gi\xE0 camminando sul sentiero. Inserisci la parola condivisa per entrare."), /*#__PURE__*/React.createElement("input", {
    type: "password", autoFocus: true, placeholder: "Password",
    value: pw, onChange: e => setPw(e.target.value),
    onKeyDown: e => { if (e.key === 'Enter') submit(); }
  }), err && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-xs mono",
    style: { color: 'var(--crimson-bright)' }
  }, "\u2715 ", err), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-5"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary flex-1", onClick: submit, disabled: checking
  }, checking ? 'Verifico…' : 'Entra \u2192')), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] mt-6 mono",
    style: { color: 'var(--ink-mute)', lineHeight: 1.6 }
  }, "La verifica avviene localmente (SHA-256). Nessuna password viene inviata a server esterni. La sessione resta aperta finch\xE9 non chiudi il browser.")));
}
// ============================================================
// PORTAL INTRO — apertura arcana
//   Sigillo esagrammatico disegnato (stroke-dashoffset),
//   scintilla dorata, flare, titolo con scramble glyph,
//   dissolve radiale. Totale ~4.3s.
// ============================================================
function PortalIntro({ onComplete }) {
  const [dissolving, setDissolving] = useState(false);
  const [titleText, setTitleText] = useState('\u25B3\u25B2\u25C7\u25C8\u25B2\u25B3\u25C7\u25B2\u25B3\u25C8\u25B3');
  const [subtitleText, setSubtitleText] = useState('');
  const titleFinal = 'ARS REALIS';
  const subtitleFinal = 'Lo spazio delle varianti si dischiude';
  const glyphs = '\u25B2\u25B3\u25C7\u25C8\u25CA\u29EB\u2736\u2737\u2738\u2739\u273A\u2741\u2748\u274B\u2055';

  useEffect(() => {
    // Tempi compressi su mobile per fluidità (≈metà del desktop)
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const t = isMobile
      ? { scramble: 2550, sub: 3050, dissolve: 3900, unmount: 4700, interval: 38 }
      : { scramble: 4700, sub: 5700, dissolve: 7400, unmount: 8600, interval: 45 };

    // Character scramble sul titolo
    let scrambleFrame = 0;
    const scrambleTotal = isMobile ? 12 : 20;
    const scrambleTimer = setTimeout(() => {
      const interval = setInterval(() => {
        let str = '';
        for (let i = 0; i < titleFinal.length; i++) {
          const ch = titleFinal[i];
          if (ch === ' ') { str += ' '; continue; }
          // Risolvi le lettere progressivamente
          const revealThreshold = Math.floor((scrambleTotal / titleFinal.length) * (i + 1));
          if (scrambleFrame >= revealThreshold) {
            str += ch;
          } else {
            str += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }
        setTitleText(str);
        scrambleFrame++;
        if (scrambleFrame > scrambleTotal) {
          clearInterval(interval);
          setTitleText(titleFinal);
        }
      }, t.interval);
    }, t.scramble);

    // Typewriter del sottotitolo
    const subTimer = setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        i++;
        setSubtitleText(subtitleFinal.slice(0, i));
        if (i >= subtitleFinal.length) clearInterval(typeInterval);
      }, isMobile ? 28 : 38);
    }, t.sub);

    // Dissolvenza finale
    const dissolveTimer = setTimeout(() => setDissolving(true), t.dissolve);
    const unmountTimer = setTimeout(() => onComplete && onComplete(), t.unmount);

    return () => {
      clearTimeout(scrambleTimer);
      clearTimeout(subTimer);
      clearTimeout(dissolveTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  return /*#__PURE__*/React.createElement(
    'div',
    { className: 'portal-intro' + (dissolving ? ' dissolving' : ''), 'aria-hidden': 'true' },
    /*#__PURE__*/React.createElement('div', { className: 'portal-aurora' }),
    /*#__PURE__*/React.createElement('div', { className: 'portal-rays' }),
    /*#__PURE__*/React.createElement('div', { className: 'portal-nebula' }),
    /*#__PURE__*/React.createElement('div', { className: 'portal-stars' }),
    /*#__PURE__*/React.createElement('div', { className: 'portal-vignette' }),
    /*#__PURE__*/React.createElement('div', { className: 'portal-spark' }),
    /*#__PURE__*/React.createElement('div', { className: 'portal-ring-wave ring-1' }),
    /*#__PURE__*/React.createElement('div', { className: 'portal-ring-wave ring-2' }),
    /*#__PURE__*/React.createElement('div', { className: 'portal-ring-wave ring-3' }),
    /*#__PURE__*/React.createElement('div', { className: 'portal-mono' }, '\u2732   A R S   R E A L I S   \u2732'),
    /*#__PURE__*/React.createElement(
      'div',
      { className: 'portal-sigil-wrap' },
      /*#__PURE__*/React.createElement(
        'svg',
        {
          className: 'portal-sigil' + (!dissolving ? ' flaring' : ''),
          viewBox: '0 0 360 360',
          xmlns: 'http://www.w3.org/2000/svg'
        },
        // Cerchio esterno protettivo
        /*#__PURE__*/React.createElement('circle', { className: 'ring-outer', cx: 180, cy: 180, r: 160 }),
        // Cerchio interno leggero
        /*#__PURE__*/React.createElement('circle', { className: 'ring-inner', cx: 180, cy: 180, r: 90 }),
        // MERKABA — tetraedro ascendente (apex alto, base frontale in basso)
        // Silhouette: apice 180,30 | base front-sx 36,288 | base front-dx 324,288
        /*#__PURE__*/React.createElement('polygon', { className: 'tri-up', points: '180,30 36,288 324,288' }),
        // Linee di profondità — back-apex a (180, 210) rivela la terza dimensione
        /*#__PURE__*/React.createElement('line', { className: 'merkaba-depth up-axis', x1: 180, y1: 30,  x2: 180, y2: 210 }),
        /*#__PURE__*/React.createElement('line', { className: 'merkaba-depth up-l',    x1: 36,  y1: 288, x2: 180, y2: 210 }),
        /*#__PURE__*/React.createElement('line', { className: 'merkaba-depth up-r',    x1: 324, y1: 288, x2: 180, y2: 210 }),
        // MERKABA — tetraedro discendente (apex basso, base posteriore in alto)
        /*#__PURE__*/React.createElement('polygon', { className: 'tri-dn', points: '180,330 36,72 324,72' }),
        // Linee di profondità — front-apex a (180, 150)
        /*#__PURE__*/React.createElement('line', { className: 'merkaba-depth dn-axis', x1: 180, y1: 330, x2: 180, y2: 150 }),
        /*#__PURE__*/React.createElement('line', { className: 'merkaba-depth dn-l',    x1: 36,  y1: 72,  x2: 180, y2: 150 }),
        /*#__PURE__*/React.createElement('line', { className: 'merkaba-depth dn-r',    x1: 324, y1: 72,  x2: 180, y2: 150 }),
        // 6 rune-punto sui vertici esterni del Merkaba
        /*#__PURE__*/React.createElement('circle', { className: 'rune-dot', cx: 180, cy: 30,  r: 3.8 }),
        /*#__PURE__*/React.createElement('circle', { className: 'rune-dot', cx: 324, cy: 72,  r: 3.8 }),
        /*#__PURE__*/React.createElement('circle', { className: 'rune-dot', cx: 324, cy: 288, r: 3.8 }),
        /*#__PURE__*/React.createElement('circle', { className: 'rune-dot', cx: 180, cy: 330, r: 3.8 }),
        /*#__PURE__*/React.createElement('circle', { className: 'rune-dot', cx: 36,  cy: 288, r: 3.8 }),
        /*#__PURE__*/React.createElement('circle', { className: 'rune-dot', cx: 36,  cy: 72,  r: 3.8 }),
        // Vertici interni dei tetraedri (back/front apex) — rivelano la struttura 3D
        /*#__PURE__*/React.createElement('circle', { className: 'rune-dot core', cx: 180, cy: 210, r: 2.8 }),
        /*#__PURE__*/React.createElement('circle', { className: 'rune-dot core', cx: 180, cy: 150, r: 2.8 }),
        // Cuore centrale
        /*#__PURE__*/React.createElement('circle', { className: 'rune-dot', cx: 180, cy: 180, r: 4.5 })
      )
    ),
    /*#__PURE__*/React.createElement('div', { className: 'portal-title' }, titleText),
    /*#__PURE__*/React.createElement('div', { className: 'portal-subtitle' }, subtitleText)
  );
}

function AppGuarded() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem('ts_site_auth') === '1'; } catch (e) { return false; }
  });
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem('ars_intro_seen') === '1'; } catch (e) { return false; }
  });
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!authed) {
    return /*#__PURE__*/React.createElement(SiteGate, { onUnlock: () => setAuthed(true) });
  }

  // Se reduced-motion oppure già visto → niente intro
  if (introDone || reducedMotion) {
    return /*#__PURE__*/React.createElement(App, null);
  }

  // Intro sopra, App già montata dietro → quando l'intro svanisce, il sito è pronto
  return /*#__PURE__*/React.createElement(
    React.Fragment,
    null,
    /*#__PURE__*/React.createElement(App, null),
    /*#__PURE__*/React.createElement(PortalIntro, {
      onComplete: () => {
        try { sessionStorage.setItem('ars_intro_seen', '1'); } catch (e) {}
        setIntroDone(true);
      }
    })
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(AppGuarded, null));

// ============================================================
// SCROLL REVEAL — sezioni che emergono (in-view) o si allontanano
// (past-view). Classificazione sincrona al bind per evitare flash
// di sfocatura su elementi già visibili.
// ============================================================
(function initScrollReveal() {
  if (typeof window === 'undefined') return;
  if (!('IntersectionObserver' in window)) return;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  function classify(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    // In vista se qualunque parte interseca il viewport
    if (rect.top < vh - 40 && rect.bottom > 40) {
      el.classList.add('in-view');
      el.classList.remove('past-view');
    } else if (rect.bottom <= 40) {
      el.classList.remove('in-view');
      el.classList.add('past-view');
    } else {
      el.classList.remove('in-view');
      el.classList.remove('past-view');
    }
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      classify(entry.target);
    });
  }, { threshold: [0, 0.01, 0.1, 0.5], rootMargin: '-40px 0px -40px 0px' });

  function bindElement(el) {
    if (el.dataset.revealBound === '1') return;
    // Escludi l'intro del portale e la gate di login
    if (el.closest('.portal-intro') || el.closest('.site-gate')) return;
    // Niente cascata: se un antenato è già bound, saltiamo questo elemento
    // (evita che h1/card nidificate producano blur composto)
    var anc = el.parentElement;
    while (anc) {
      if (anc.dataset && anc.dataset.revealBound === '1') return;
      anc = anc.parentElement;
    }
    el.classList.add('reveal');
    el.dataset.revealBound = '1';
    // Classificazione sincrona immediata → niente flash di blur
    classify(el);
    observer.observe(el);
  }

  function scan() {
    // Target solo top-level containers per evitare filter cascading.
    // Le sezioni includono già i loro titoli/card interni.
    var selectors = [
      'main section',
      'main .orbit-scene',
      'main .neural-scene',
      'main .hero-mandala'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(bindElement);

    // Stagger per card in griglia (anche se binding è saltato, così non fanno nulla)
    document.querySelectorAll('.grid, .grid-cols-1, .grid-cols-2, .grid-cols-3, .grid-cols-4').forEach(function (grid) {
      var cards = grid.querySelectorAll(':scope > .card, :scope > section');
      cards.forEach(function (c, i) {
        if (!c.dataset.revealBound) return;
        if (c.dataset.revealStaggered === '1') return;
        c.dataset.revealStaggered = '1';
        var mod = i % 4;
        if (mod === 1) c.classList.add('reveal-delay-1');
        else if (mod === 2) c.classList.add('reveal-delay-2');
        else if (mod === 3) c.classList.add('reveal-delay-3');
      });
    });
  }

  // Riclassifica tutti gli elementi vincolati (per route change / scroll
  // manuale / resize). Viene chiamato via requestAnimationFrame.
  function reclassifyAll() {
    document.querySelectorAll('.reveal').forEach(classify);
  }

  // Scansione iniziale — rapida con retry finché React monta il contenuto
  var attempts = 0;
  var scanInterval = setInterval(function () {
    scan();
    attempts++;
    if (attempts > 50) clearInterval(scanInterval);
  }, 180);

  // Ri-scansiona al mutare del DOM (tab switch, chat nuova, ecc.)
  var rescanTimer = null;
  var mo = new MutationObserver(function () {
    if (rescanTimer) return;
    rescanTimer = setTimeout(function () {
      rescanTimer = null;
      scan();
      reclassifyAll();
    }, 60);
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // Resize e orientation change → ricalcola
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(reclassifyAll, 120);
  });

  // Safety net: dopo 2s, forza l'in-view su tutti gli elementi visibili
  // per risolvere eventuali titoli rimasti sfocati (osservatori asincroni,
  // iframe o container con scroll annidato).
  setTimeout(reclassifyAll, 2000);
  setTimeout(reclassifyAll, 4500);
})();

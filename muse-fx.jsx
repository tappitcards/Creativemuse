/* ════════════════════════════════════════════════════════════
   muse-fx.jsx — cinematic FX library for Creative Muse
   Exports to window: FxContext, useFx, makeVariants, scrollTo, I,
   RevealLines, Reveal, MagneticButton, SpotlightCard, CountUp,
   LightRays, IridescentOrb, FilmGrain, ScrollProgress, Bloom,
   usePointerParallax
   ════════════════════════════════════════════════════════════ */
const { useState, useEffect, useRef, useContext, createContext } = React;
const {
  motion, AnimatePresence, useScroll, useTransform, useSpring,
  useMotionValue, useMotionValueEvent, useInView
} = Motion;

/* ── Easing ── */
const ease = [0.16, 1, 0.3, 1];
const easeSlow = [0.22, 1, 0.36, 1];

/* ── Intensity-scaled variants ───────────────────────────────
   intensity factor scales travel distance + duration so the
   Tweaks "Motion" control can dial the whole site up or down. */
function makeVariants(intensity = 1) {
  const d = intensity;           // distance multiplier
  const dur = 0.65 + 0.35 * intensity; // duration
  return {
    fadeUp: {
      hidden: { opacity: 0, y: 40 * d },
      show:   { opacity: 1, y: 0, transition: { duration: dur, ease } },
    },
    fadeIn: {
      hidden: { opacity: 0, scale: 1 - 0.04 * d },
      show:   { opacity: 1, scale: 1, transition: { duration: dur + 0.1, ease } },
    },
    cardV: {
      hidden: { opacity: 0, y: 34 * d },
      show:   { opacity: 1, y: 0, transition: { duration: dur, ease } },
    },
    lineV: {
      hidden: { y: '115%' },
      show:   { y: '0%', transition: { duration: 0.55 + 0.45 * intensity, ease } },
    },
    stagger: (s = 0.1, delay = 0) => ({
      hidden: {},
      show: { transition: { staggerChildren: s, delayChildren: delay } },
    }),
  };
}

/* ── Fx context (fed by Tweaks) ── */
const FxContext = createContext({
  flags: { reveals:true, mask:true, magnetic:true, spotlight:true, rays:true, orb:true, grain:true, progress:true },
  V: makeVariants(1),
  intensity: 1,
});
const useFx = () => useContext(FxContext);

/* ── Smooth-scroll-aware anchor scroll (never uses scrollIntoView) ── */
function scrollTo(id) {
  const el = document.querySelector(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/* ════════ Line-mask headline reveal ════════
   lines: array of renderable line content. Falls back to a plain
   heading when reveals or mask are disabled. */
function RevealLines({ lines, as = 'h2', className = '', delay = 0, amount = 0.4 }) {
  const { flags, V } = useFx();
  const Tag = as;
  if (!flags.reveals || !flags.mask) {
    return <Tag className={className}>{lines.map((ln, i) => <span className="line-mask" key={i}><span className="line-inner">{ln}</span></span>)}</Tag>;
  }
  return (
    <motion.div
      initial="hidden" whileInView="show" viewport={{ once: true, amount }}
      variants={V.stagger(0.12, delay)} style={{ display: 'block' }} data-rv
    >
      <Tag className={className}>
        {lines.map((ln, i) => (
          <span className="line-mask" key={i}>
            <motion.span className="line-inner" variants={V.lineV} style={{ display:'block' }}>{ln}</motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}

/* ════════ Generic block reveal ════════ */
function Reveal({ children, className = '', variant = 'fadeUp', amount = 0.2, delay = 0, style }) {
  const { flags, V } = useFx();
  if (!flags.reveals) return <div className={className} style={style}>{children}</div>;
  const v = V[variant] || V.fadeUp;
  const withDelay = delay
    ? { hidden: v.hidden, show: { ...v.show, transition: { ...v.show.transition, delay } } }
    : v;
  return (
    <motion.div className={className} style={style} data-rv
      variants={withDelay} initial="hidden" whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </motion.div>
  );
}

/* ════════ Magnetic button ════════ */
function MagneticButton({ children, className = '', href, onClick, strength = 0.4, ...rest }) {
  const { flags } = useFx();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const onMove = (e) => {
    if (!flags.magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref} href={href} onClick={onClick} className={`magnetic ${className}`}
      onMouseMove={onMove} onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

/* ════════ Spotlight + tilt card ════════ */
function SpotlightCard({ children, className = '', tilt = 6, hoverProps = {}, ...rest }) {
  const { flags } = useFx();
  const ref = useRef(null);
  const [lit, setLit] = useState(false);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    if (!flags.spotlight || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty('--mx', `${px * 100}%`);
    ref.current.style.setProperty('--my', `${py * 100}%`);
    rx.set((0.5 - py) * tilt);
    ry.set((px - 0.5) * tilt);
  };
  const enter = () => flags.spotlight && setLit(true);
  const leave = () => { setLit(false); rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      className={`spotlight ${lit ? 'lit' : ''} ${className}`}
      onMouseMove={onMove} onMouseEnter={enter} onMouseLeave={leave}
      style={{ rotateX: flags.spotlight ? rx : 0, rotateY: flags.spotlight ? ry : 0, transformPerspective: 900 }}
      whileHover={hoverProps}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ════════ Count-up number ════════
   Parses a leading integer ("10+" -> 10 then "+", "AI" -> static). */
function CountUp({ value, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const match = String(value).match(/^(\d+)(.*)$/);
  const [disp, setDisp] = useState(match ? '0' + (match[2] || '') : value);

  useEffect(() => {
    if (!match || !inView) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    const dur = 1100;
    let start;
    let raf;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisp(Math.round(eased * target) + suffix);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return <div ref={ref} className={className}>{match ? disp : value}</div>;
}

/* ════════ Hero light rays + lens flare ════════
   Pure renderer — parent gates with {flags.rays && ...} so hook
   count never changes within an instance. px/py always provided. */
const FLARES = [
  { top: '18%', right: '14%', size: 90, o: 0.5,  dx: -54, dy: -40 },
  { top: '34%', right: '30%', size: 38, o: 0.45, dx: -68, dy: -50 },
  { top: '52%', right: '46%', size: 22, o: 0.4,  dx: -82, dy: -60 },
  { top: '64%', right: '60%', size: 54, o: 0.3,  dx: -96, dy: -70 },
];
function LightRays({ px, py }) {
  const glowX = useTransform(px, v => v * -28);
  const glowY = useTransform(py, v => v * -22);
  const raysX = useTransform(px, v => v * -16);
  const f0x = useTransform(px, v => v * FLARES[0].dx), f0y = useTransform(py, v => v * FLARES[0].dy);
  const f1x = useTransform(px, v => v * FLARES[1].dx), f1y = useTransform(py, v => v * FLARES[1].dy);
  const f2x = useTransform(px, v => v * FLARES[2].dx), f2y = useTransform(py, v => v * FLARES[2].dy);
  const f3x = useTransform(px, v => v * FLARES[3].dx), f3y = useTransform(py, v => v * FLARES[3].dy);
  const fxy = [[f0x, f0y], [f1x, f1y], [f2x, f2y], [f3x, f3y]];
  return (
    <div className="hero-stage" aria-hidden="true">
      <motion.div className="hero-keyglow" style={{ x: glowX, y: glowY }} />
      <motion.div className="hero-rays" style={{ x: raysX }} />
      <div className="hero-rays two" />
      {FLARES.map((f, i) => (
        <motion.div key={i} className="hero-flare"
          style={{ top: f.top, right: f.right, width: f.size, height: f.size, x: fxy[i][0], y: fxy[i][1] }}
          animate={{ opacity: [f.o * 0.6, f.o, f.o * 0.6] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ════════ Iridescent orb ════════ (pure renderer) */
const ORB_RINGS = [1.16, 1.36, 1.6];
function IridescentOrb({ px, py }) {
  const x = useTransform(px, v => v * 38);
  const y = useTransform(py, v => v * 30);
  return (
    <div className="orb-wrap" aria-hidden="true">
      <motion.div
        style={{ position: 'relative', x, y }}
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="hero-orb" />
        {ORB_RINGS.map((r, i) => (
          <div key={i} className="orb-ring"
            style={{ width: `calc(min(33vw,400px) * ${r})`, height: `calc(min(33vw,400px) * ${r})`, opacity: 0.5 - i * 0.13 }} />
        ))}
      </motion.div>
    </div>
  );
}

/* ════════ Film grain ════════ (parent gates) */
function FilmGrain() {
  return <div className="fx-grain" aria-hidden="true" />;
}

/* ════════ Scroll progress ════════ (parent gates) */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX: sx }} aria-hidden="true" />;
}

/* ════════ Parallax bloom for dark sections ════════ */
function Bloom({ className = '', style }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} aria-hidden="true">
      <motion.div className={`bloom ${className}`} style={{ ...style, y }} />
    </div>
  );
}

/* ════════ Hero pointer parallax hook ════════
   Returns spring-smoothed normalized (-0.5..0.5) pointer motion values. */
function usePointerParallax(targetRef, enabled = true) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const py = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  useEffect(() => {
    if (!enabled) return;
    const el = targetRef.current || window;
    const onMove = (e) => {
      const w = window.innerWidth, h = window.innerHeight;
      mx.set(e.clientX / w - 0.5);
      my.set(e.clientY / h - 0.5);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);
  return { px, py };
}

/* ── Icons ── */
const I = {
  brain:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  search:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  globe:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  phone:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  dollar:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  star:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  micro:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>,
  link:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  file:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  check:    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  pin:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  mailSm:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  building: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/></svg>,
  leaf:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  robot:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/><path d="M12 7v4"/><path d="M8 15h.01M16 15h.01"/></svg>,
  extLink:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  arrow:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  linkedin: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  instagram:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
};

Object.assign(window, {
  FxContext, useFx, makeVariants, scrollTo, I,
  RevealLines, Reveal, MagneticButton, SpotlightCard, CountUp,
  LightRays, IridescentOrb, FilmGrain, ScrollProgress, Bloom,
  usePointerParallax, ease, easeSlow,
});

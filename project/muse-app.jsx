/* ════════════════════════════════════════════════════════════
   muse-app.jsx — Lenis smooth scroll, FX provider, Tweaks, mount
   ════════════════════════════════════════════════════════════ */
const { useState, useEffect, useMemo } = React;
const {
  FxContext, makeVariants, ScrollProgress, FilmGrain, useFx,
  Nav, Hero, About, Services, ClientLogos, Clients, SeoAudit, Newsletter, Reviews, Contact, Footer,
} = window;
/* ── Defaults for the Tweaks panel ── */
const TWEAK_DEFAULTS = {
  motion: 1,            // 0.4 – 1.6 intensity
  smoothScroll: true,
  reveals: true,
  mask: true,
  magnetic: true,
  spotlight: true,
  rays: true,
  orb: true,
  blooms: true,
  grain: true,
  progress: true,
  accent: '#C9A84C',
};

/* ── Lenis smooth momentum scroll ── */
function useLenis(enabled) {
  useEffect(() => {
    if (!enabled || !window.Lenis) {
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      if (window.__lenis) { window.__lenis.destroy(); window.__lenis = null; }
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null; };
  }, [enabled]);
}

/* ── App ── */
function App({ tweaks }) {
  const t = tweaks;
  useLenis(t.smoothScroll);

  // Safety net: ensure entrance content reaches its visible end-state even
  // if rAF is throttled (backgrounded tab) so nothing stays permanently hidden.
  useEffect(() => {
    const reveal = () => document.documentElement.classList.add('fx-revealed');
    const id = setTimeout(reveal, 1800);
    const onVis = () => { if (!document.hidden) reveal(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearTimeout(id); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  // Apply accent color to CSS vars live
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--gold', t.accent);
    // derive a lighter tint
    root.style.setProperty('--gold-light', shade(t.accent, 28));
  }, [t.accent]);

  const fxValue = useMemo(() => ({
    flags: {
      reveals: t.reveals, mask: t.mask, magnetic: t.magnetic, spotlight: t.spotlight,
      rays: t.rays, orb: t.orb, blooms: t.blooms, grain: t.grain, progress: t.progress,
    },
    V: makeVariants(t.motion),
    intensity: t.motion,
  }), [t]);

  return (
    <FxContext.Provider value={fxValue}>
      {t.progress && <ScrollProgress key="progress" />}
      {t.grain && <FilmGrain key="grain" />}
      <Nav key="nav" />
      <main key="main">
        <Hero />
        <About />
        <Services />
        <ClientLogos />
        <Clients />
        <SeoAudit />
        <Newsletter />
        <Reviews />
        <Contact />
      </main>
      <Footer key="footer" />
    </FxContext.Provider>
  );
}

/* lighten a hex color by pct toward white */
function shade(hex, pct) {
  const n = parseInt(hex.replace('#', ''), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.round(r + (255 - r) * pct / 100);
  g = Math.round(g + (255 - g) * pct / 100);
  b = Math.round(b + (255 - b) * pct / 100);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ════════════════ Tweaks panel ════════════════ */
function MuseTweaks() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // expose current tweak state to the app via a re-render bridge
  useEffect(() => { window.__setMuseTweaks && window.__setMuseTweaks(tweaks); }, [tweaks]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Motion">
        <TweakSlider label="Animation intensity" min={0.4} max={1.6} step={0.1}
          value={tweaks.motion} onChange={v => setTweak('motion', v)} />
        <TweakToggle label="Smooth momentum scroll" value={tweaks.smoothScroll} onChange={v => setTweak('smoothScroll', v)} />
        <TweakToggle label="Scroll progress bar" value={tweaks.progress} onChange={v => setTweak('progress', v)} />
      </TweakSection>

      <TweakSection label="Reveals">
        <TweakToggle label="Scroll reveals" value={tweaks.reveals} onChange={v => setTweak('reveals', v)} />
        <TweakToggle label="Line-mask headlines" value={tweaks.mask} onChange={v => setTweak('mask', v)} />
      </TweakSection>

      <TweakSection label="Hero atmosphere">
        <TweakToggle label="Light rays + lens flare" value={tweaks.rays} onChange={v => setTweak('rays', v)} />
        <TweakToggle label="Iridescent orb" value={tweaks.orb} onChange={v => setTweak('orb', v)} />
      </TweakSection>

      <TweakSection label="Background & texture">
        <TweakToggle label="Drifting light blooms" value={tweaks.blooms} onChange={v => setTweak('blooms', v)} />
        <TweakToggle label="Film grain" value={tweaks.grain} onChange={v => setTweak('grain', v)} />
      </TweakSection>

      <TweakSection label="Micro-interactions">
        <TweakToggle label="Magnetic buttons" value={tweaks.magnetic} onChange={v => setTweak('magnetic', v)} />
        <TweakToggle label="Card spotlight + tilt" value={tweaks.spotlight} onChange={v => setTweak('spotlight', v)} />
      </TweakSection>

      <TweakSection label="Accent">
        <TweakColor label="Gold accent" value={tweaks.accent} onChange={v => setTweak('accent', v)}
          options={['#C9A84C', '#B8860B', '#C0723E', '#7C8AE0', '#4FB3A0']} />
      </TweakSection>
    </TweaksPanel>
  );
}

/* ════════════════ Mount ════════════════
   App and Tweaks are separate React roots. We bridge tweak state
   from the Tweaks root to the App root via a tiny store. */
function Root() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  useEffect(() => { window.__setMuseTweaks = setTweaks; return () => { window.__setMuseTweaks = null; }; }, []);
  return <App tweaks={tweaks} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<MuseTweaks />);

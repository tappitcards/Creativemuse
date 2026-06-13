/* ════════════════════════════════════════════════════════════
   muse-sections-a.jsx — Nav, Hero (cinematic), About, Services
   ════════════════════════════════════════════════════════════ */
const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence, useScroll, useTransform } = Motion;
const {
  useFx, RevealLines, Reveal, MagneticButton, SpotlightCard, CountUp,
  LightRays, IridescentOrb, Bloom, usePointerParallax, scrollTo, I, ease,
} = window;

/* ══════════════════════════ NAV ══════════════════════════ */
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 80);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [menuOpen]);

  const close = (id) => { setMenuOpen(false); setTimeout(() => scrollTo(id), 120); };
  const links = [['#about','About'],['#services','Services'],['#clients','Clients'],['#seo-audit','Free Audit'],['#reviews','Reviews']];

  return (
    <>
      <motion.nav className={`nav${solid ? ' solid' : ''}`} initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease }}>
        <a className="logo-mark" onClick={e => { e.preventDefault(); scrollTo('#hero'); }} href="#hero">
          <span className="logo-mark-top">Creative <em>Muse</em></span>
          <span className="logo-mark-bottom">Marketing</span>
        </a>
        <ul className="nav-links">
          {links.map(([id, label]) => (
            <li key={id}><a onClick={e => { e.preventDefault(); scrollTo(id); }} href={id}>{label}</a></li>
          ))}
          <li><a onClick={e => { e.preventDefault(); scrollTo('#contact'); }} href="#contact" className="nav-cta">Let's Talk</a></li>
        </ul>
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <motion.span animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
          <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }} />
          <motion.span animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
        </button>
      </motion.nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            {links.map(([id, label], i) => (
              <motion.a key={id} href={id} onClick={() => close(id)}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.07, duration: 0.5, ease }}
              >{label}</motion.a>
            ))}
            <motion.a href="#contact" className="m-cta" onClick={() => close('#contact')}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease }}
            >Let's Talk →</motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════ HERO ══════════════════════════ */
function FloatCard({ children, delay = 0, x = 0, px, py, depth = 1 }) {
  // Independent depth-based parallax: each card drifts at its own rate.
  const dx = useTransform(px, v => v * -22 * depth);
  const dy = useTransform(py, v => v * -16 * depth);
  return (
    <motion.div data-rv
      initial={{ opacity: 0, y: 44, x }}
      whileInView={{ opacity: 1, y: 0, x }}
      viewport={{ once: true }}
      transition={{ duration: 1.0, delay, ease }}
    >
      <motion.div style={{ x: dx, y: dy }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  const { flags } = useFx();
  const heroRef = useRef(null);
  const parallaxOn = flags.rays || flags.orb;
  const { px, py } = usePointerParallax(heroRef, parallaxOn);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opContent = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const HEAD = [
    'We Grow Brands',
    <em key="e">That Mean</em>,
    <strong key="s">Something.</strong>,
  ];
  const stats = [['10+', 'Years in Business'], ['3', 'Markets Served'], ['AI', 'Native Approach']];

  return (
    <section className="hero" id="hero" ref={heroRef} data-screen-label="Hero">
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-grad" aria-hidden="true" />
      {flags.rays && <LightRays px={px} py={py} />}

      {/* LEFT */}
      <motion.div className="hero-left" style={{ y: yContent, opacity: opContent }}>
        <motion.div data-rv className="hero-eyebrow" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15, ease }}>
          Canadian Roots · Dubai Operated
        </motion.div>
        <RevealLines as="h1" lines={HEAD} amount={0.1} />
        <motion.p data-rv className="hero-sub" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease }}>
          AI-native execution. Boutique partnership. Built for founders and brands who refuse to be average, from Toronto to Dubai to the Caribbean.
        </motion.p>
        <motion.div data-rv className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.78, ease }}>
          <MagneticButton href="#contact" className="btn-gold" strength={0.15} onClick={e => { e.preventDefault(); scrollTo('#contact'); }}
            whileHover={{ scale: 1.02, y: -2, boxShadow: '0 14px 44px rgba(201,168,76,0.32)' }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            Let's Talk Growth {I.arrow}
          </MagneticButton>
          <MagneticButton href="#services" className="btn-ghost" strength={0.12} onClick={e => { e.preventDefault(); scrollTo('#services'); }}>
            Our Services
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* RIGHT — floating result cards */}
      <div className="hero-right">
        <motion.div className="hero-cards" style={{ position: 'relative', zIndex: 3 }}>
          <FloatCard delay={0.85} px={px} py={py} depth={1.35}>
            <motion.div className="result-card" style={{ marginBottom: '12px' }}
              whileHover={{ y: -6, borderColor: 'rgba(201,168,76,0.5)', backgroundColor: 'rgba(255,255,255,0.08)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}>
              <div className="result-card-head"><div className="result-card-dot" /><div className="result-card-label">Our Approach</div></div>
              <div className="result-card-value"><span>AI-Native</span></div>
              <div className="result-card-sub">Strategy, content &amp; campaigns, all AI-assisted</div>
            </motion.div>
          </FloatCard>
          <FloatCard delay={1.0} px={px} py={py} depth={0.6}><div className="hero-card-line" /></FloatCard>
          <FloatCard delay={1.05} x={40} px={px} py={py} depth={0.85}>
            <motion.div className="result-card" style={{ margin: '12px 0 12px 40px' }}
              whileHover={{ y: -6, borderColor: 'rgba(201,168,76,0.5)', backgroundColor: 'rgba(255,255,255,0.08)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}>
              <div className="result-card-head"><div className="result-card-dot" /><div className="result-card-label">Client Markets</div></div>
              <div className="result-card-value" style={{ fontSize: '27px', lineHeight: 1.12 }}><span>UAE · Canada · Caribbean</span></div>
              <div className="result-card-sub">Cross-market campaigns since 2014</div>
            </motion.div>
          </FloatCard>
          <FloatCard delay={1.15} px={px} py={py} depth={0.5}><div className="hero-card-line" /></FloatCard>
          <FloatCard delay={1.25} px={px} py={py} depth={1.7}>
            <motion.div className="result-card" style={{ marginTop: '12px' }}
              whileHover={{ y: -6, borderColor: 'rgba(201,168,76,0.5)', backgroundColor: 'rgba(255,255,255,0.08)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}>
              <div className="result-card-head"><div className="result-card-dot" /><div className="result-card-label">Audit Delivery</div></div>
              <div className="result-card-value"><span>48 Hours</span></div>
              <div className="result-card-sub">Human reviewed, not an automated PDF</div>
            </motion.div>
          </FloatCard>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════ ABOUT ══════════════════════════ */
function About() {
  const { V } = useFx();
  const cards = [
    { flag: '🇦🇪', icon: I.building, title: 'Musetech Solutions FZCO', body: 'Our Dubai Free Zone entity, the legal and operational home of everything we do today. Built to serve UAE, MENA, and international clients with full compliance and credibility.' },
    { flag: '🌎', icon: I.globe,    title: 'Multi-Market Experience', body: 'Years of marketing experience across the Caribbean, North America, and the Middle East. We understand how different markets think, buy, and grow.' },
    { flag: null,  icon: I.robot,    title: 'AI-Native, Human-Led',     body: 'AI runs through every workflow: strategy, content, SEO, automation. Not as a gimmick, but as infrastructure. Faster outputs, sharper insights, better ROI for every client.' },
  ];
  return (
    <section className="about section-fade-cream" id="about" data-screen-label="About">
      <div className="about-inner">
        <Reveal amount={0.2}>
          <div className="eyebrow">Our Story</div>
          <RevealLines as="h2" className="sec-title" lines={['A decade of craft.', <em key="e">A new chapter.</em>]} />
          <div className="gold-rule" />
          <div className="about-narrative">
            <p className="lead">"We started with a conviction. It's still the same one."</p>
            <p>Our team brings years of hands-on marketing experience across the Caribbean, North America, and the Middle East. We've built brands, run campaigns, and driven growth for businesses at every stage — from founder-led startups to established enterprises.</p>
            <p style={{ marginTop: '20px' }}>Today we operate under <strong>Musetech Solutions FZCO</strong> in Dubai, serving clients across the UAE, Canada, and the Caribbean with the same focus we've always had: measurable outcomes, honest strategy, and work we're proud to put our name on.</p>
            <p style={{ marginTop: '20px' }}>We're not a faceless agency. We're a small, senior team that treats every client like a partner, because that's the only way we know how to work.</p>
          </div>
        </Reveal>
        <motion.div className="about-cards" data-stagger variants={V.stagger(0.12, 0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          {cards.map(c => (
            <motion.div key={c.title} variants={V.cardV}>
              <SpotlightCard className="about-card" tilt={4} hoverProps={{ y: -4 }}>
                {c.flag && <div className="about-card-flag">{c.flag}</div>}
                <div className="about-card-head">
                  <div className="about-card-icon">{c.icon}</div>
                  <div className="about-card-title">{c.title}</div>
                </div>
                <p className="about-card-body">{c.body}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════ SERVICES ══════════════════════════ */
const SERVICES = [
  { n: '01', icon: I.brain,  name: 'AI Marketing Strategy',          tag: 'Strategy · AI',            desc: 'Full-funnel strategy built with AI at its core: from ICP definition and market research to channel mix and campaign architecture. We think deeper and move faster than any traditional agency.' },
  { n: '02', icon: I.search, name: 'Generative Engine Optimisation', tag: 'GEO · AEO · SEO',          desc: 'Search is no longer just Google. We optimise your content, authority, and structure to rank on ChatGPT, Perplexity, and Gemini, while building the topical foundation that compounds on traditional search too.' },
  { n: '03', icon: I.globe,  name: 'Web Design & Development',       tag: 'Web · CMS · Dev',          desc: 'Conversion-optimised, mobile-first websites built to perform. Every site we ship is fast, accessible, and designed to turn visitors into revenue.' },
  { n: '04', icon: I.phone,  name: 'Social Media Management',        tag: 'Social · Content',         desc: 'Instagram, LinkedIn, and TikTok: platform-specific strategy, carousel and Reel creation, and community management built for how audiences consume content in 2026.' },
  { n: '05', icon: I.dollar, name: 'Paid Media (PPC & Paid Social)', tag: 'Google · Meta · LinkedIn', desc: 'Google Ads, Meta, LinkedIn, and TikTok campaigns managed with AI-assisted creative testing and real-time optimisation. We chase cost-per-acquisition, never vanity metrics.' },
  { n: '06', icon: I.star,   name: 'Brand Identity & Creative',      tag: 'Brand · Design',           desc: 'Logo systems, visual identity, tone of voice, and brand guidelines built for businesses that want to stand out, and stay that way. We create brands that feel premium, because they are.' },
];

function Services() {
  const { V, flags } = useFx();
  return (
    <section className="services section-fade-dark" id="services" data-screen-label="Services">
      {flags.blooms && <Bloom style={{ width: 560, height: 560, top: '8%', left: '-8%' }} />}
      {flags.blooms && <Bloom style={{ width: 480, height: 480, bottom: '4%', right: '-6%' }} />}
      <div className="services-inner">
        <Reveal className="services-header" amount={0.2}>
          <div className="eyebrow">What We Do</div>
          <RevealLines as="h2" className="sec-title light" lines={['Services built for', <em key="e">today's landscape.</em>]} />
          <p className="sec-sub light" style={{ marginTop: '14px' }}>The marketing playbook has changed. AI has rewritten who does what, how fast, and at what cost. Every service we offer is built around that reality.</p>
        </Reveal>
        <motion.div className="services-grid" data-stagger variants={V.stagger(0.08, 0.05)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}>
          {SERVICES.map(s => (
            <motion.div key={s.name} variants={V.cardV}>
              <SpotlightCard className="srv-card" tilt={5}
                hoverProps={{ y: -6, borderColor: 'rgba(201,168,76,0.2)', boxShadow: '0 32px 70px rgba(0,0,0,0.45)' }}>
                <div className="srv-head">
                  <div className="srv-icon">{s.icon}</div>
                  <h3>{s.name}</h3>
                </div>
                <p>{s.desc}</p>
                <span className="srv-tag">{s.tag}</span>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

Object.assign(window, { Nav, Hero, About, Services });

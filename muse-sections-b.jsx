/* ════════════════════════════════════════════════════════════
   muse-sections-b.jsx — Clients, SEO Audit, Newsletter,
   Reviews, Contact, Footer
   ════════════════════════════════════════════════════════════ */
const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence, useScroll, useTransform } = Motion;
const {
  useFx, RevealLines, Reveal, MagneticButton, SpotlightCard, Bloom, scrollTo, I, ease,
} = window;

/* ══════════════════════════ OUR VENTURES (case-study layout) ══════════════════════════ */
function CaseStudy({ dark, reverse, badge, title, desc, tags, ctaLabel, ctaHref, imgSrc, imgAlt }) {
  const theme = dark ? 'light' : 'dark-txt';
  const wrapRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div className={`case-study ${dark ? 'dark' : 'cream section-fade-cream'}`}>
      <div className={`case-inner${reverse ? ' reverse' : ''}`}>
        <Reveal className="case-img-wrap" variant="fadeIn" amount={0.2}>
          <div className="case-img-bracket tl" />
          <motion.div style={{ y: imgY, borderRadius: 'var(--r-xl)', overflow: 'hidden' }} ref={wrapRef}>
            <motion.img src={imgSrc} alt={imgAlt} className="case-img"
              whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease }} />
          </motion.div>
          <div className="case-img-bracket br" />
        </Reveal>
        <Reveal amount={0.2}>
          <RevealLines as="div" className={`case-title ${theme}`} lines={[title]} />
          <div className={`case-badge-text ${theme}`}>{badge}</div>
          <p className={`case-desc ${theme}`} style={{ marginTop: '20px' }}>{desc}</p>
          <div className="case-tags">
            {tags.map(t => <span key={t} className={`case-tag ${theme}`}>{t}</span>)}
          </div>
          <MagneticButton href={ctaHref} target="_blank" rel="noopener noreferrer" strength={0.12}
            className={`btn-venture ${dark ? 'on-dark' : 'on-cream'}`}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
            {ctaLabel} <span className="btn-arrow">{I.extLink}</span>
          </MagneticButton>
        </Reveal>
      </div>
    </div>
  );
}

function Clients() {
  return (
    <section className="ventures-cases section-fade-dark" id="clients" data-screen-label="Our Ventures">
      <div className="vc-head">
        <Reveal amount={0.3}>
          <div className="eyebrow">Beyond Client Work</div>
          <RevealLines as="h2" className="sec-title light" lines={['Our Ventures']} />
          <p className="sec-sub light vc-sub">We don't just market businesses. We build them. Two brands we founded, own, and grow.</p>
        </Reveal>
      </div>
      <CaseStudy
        dark={true} reverse={false}
        title="Tappit Cards"
        badge="NFC Digital Business Cards · UAE, Canada & Caribbean"
        desc="One tap replaces the entire paper card ritual. Tappit Cards are NFC-powered digital business cards that turn any smartphone into a contact-saving moment: no app, no friction, no reprinting. Built for professionals who network at volume and can't afford to be forgotten."
        tags={['NFC Technology', 'Eco Bamboo & PVC', 'Live Digital Profile']}
        ctaLabel="Visit tappitcards.com"
        ctaHref="https://tappitcards.com"
        imgSrc="assets/tappit-card.webp"
        imgAlt="Tappit Cards, bamboo NFC contactless business card"
      />
      <CaseStudy
        dark={false} reverse={true}
        title="Auralis Crystals"
        badge="Wellness & Crystal Lifestyle · Global"
        desc="Auralis is a curated crystal and wellness brand built around the belief that intentional living starts with the right energy. Every piece is handpicked for quality and purpose: from raw formations to wearable crystal jewellery and meditation tools for modern, mindful people."
        tags={['Healing Crystals', 'Crystal Jewellery', 'Meditation Tools']}
        ctaLabel="Visit auraliscrystals.com"
        ctaHref="https://auraliscrystals.com"
        imgSrc="assets/auralis-buddha.webp"
        imgAlt="Auralis Crystals, pyrite meditating Buddha figurines on a marble dish"
      />
    </section>
  );
}

/* ══════════════════════════ SEO AUDIT ══════════════════════════ */
function SeoAudit() {
  const { V, flags } = useFx();
  const [form, setForm] = useState({ name: '', email: '', url: '', company: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = true;
    if (!form.url.trim()) e.url = true;
    return e;
  };
  const handleSubmit = ev => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  const feats = [
    { icon: I.micro, title: 'Technical SEO & Core Web Vitals', desc: 'Crawlability, indexation, page speed, and site structure.' },
    { icon: I.brain, title: 'AI Search Visibility (GEO/AEO)',  desc: 'Are you being cited by ChatGPT, Perplexity, or Gemini?' },
    { icon: I.file,  title: 'Content & Keyword Gaps',          desc: "What competitors rank for that you don't, and why." },
    { icon: I.link,  title: 'Backlink & Authority Profile',     desc: 'Your link profile vs. top 3 organic competitors.' },
  ];

  return (
    <section className="seo-audit section-fade-dark" id="seo-audit" data-screen-label="SEO Audit">
      {flags.blooms && <Bloom style={{ width: 620, height: 620, top: '-10%', right: '-10%' }} />}
      <div className="seo-inner">
        <Reveal amount={0.15}>
          <div className="eyebrow">Free Audit</div>
          <RevealLines as="h2" className="sec-title light" lines={['Get your free', <em key="e">AI-powered</em>, 'SEO audit.']} />
          <p className="sec-sub light" style={{ marginTop: '18px' }}>Not an automated PDF with 200 orange warning icons. A real, human review of your site: technical health, keyword gaps, AI search visibility, and competitor comparison.</p>
          <motion.div className="seo-features" data-stagger variants={V.stagger(0.1, 0.2)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
            {feats.map(f => (
              <motion.div key={f.title} className="seo-feat" variants={V.cardV}>
                <div className="seo-feat-icon">{f.icon}</div>
                <div><div className="seo-feat-title">{f.title}</div><div className="seo-feat-desc">{f.desc}</div></div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>
        <Reveal amount={0.15} delay={0.12}>
          <div className="seo-form-box">
            <h3>Request Your Free Audit</h3>
            <p className="form-sub">No commitment. Delivered within 48 hours by a real human.</p>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div className="form-success" key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}>
                  <motion.div style={{ color: 'var(--gold)' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 180 }}>{I.check}</motion.div>
                  <div style={{ marginTop: '14px', color: 'var(--white)' }}>We've received your request.<br />Expect your audit within 48 hours.</div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} noValidate exit={{ opacity: 0 }}>
                  {[{ id: 'name', label: 'Your Name', type: 'text', ph: 'Jane Smith' }, { id: 'email', label: 'Work Email', type: 'email', ph: 'jane@company.com' }, { id: 'url', label: 'Website URL', type: 'url', ph: 'https://yourwebsite.com' }, { id: 'company', label: 'Company', type: 'text', ph: 'Your brand or company name' }].map(f => (
                    <div key={f.id} className="field">
                      <label htmlFor={`a-${f.id}`}>{f.label}</label>
                      <input id={`a-${f.id}`} type={f.type} placeholder={f.ph} value={form[f.id]} onChange={e => { setForm({ ...form, [f.id]: e.target.value }); setErrors({ ...errors, [f.id]: false }); }} className={errors[f.id] ? 'error' : ''} />
                    </div>
                  ))}
                  <motion.button type="submit" className="btn-gold" disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--r)', marginTop: '6px', opacity: loading ? .7 : 1 }}
                    whileHover={!loading ? { scale: 1.01, boxShadow: '0 10px 28px rgba(201,168,76,0.22)' } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >{loading ? 'Sending…' : 'Send Me the Free Audit →'}</motion.button>
                  <p className="form-note">No spam. No automated reports. We respond within 48 hours.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════ NEWSLETTER ══════════════════════════ */
function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section className="newsletter section-fade-cream" id="newsletter" data-screen-label="Newsletter">
      <Reveal className="newsletter-inner" amount={0.25}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>Weekly Insights</div>
        <RevealLines as="h2" className="sec-title" lines={['Stay Ahead of the', <em key="e">AI Marketing Curve.</em>]} />
        <p className="sec-sub" style={{ margin: '0 auto', marginTop: '14px' }}>One email per week. What's actually working in AI-driven marketing: tools, frameworks, and case studies. No fluff. Read by founders across UAE, Canada, and the Caribbean.</p>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.p key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '44px', fontSize: '16px', color: 'var(--navy)', fontWeight: 500 }}>
              You're in. Look for your first edition next Tuesday.
            </motion.p>
          ) : (
            <motion.form key="f" className="nl-form" exit={{ opacity: 0 }} onSubmit={e => { e.preventDefault(); if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) setDone(true); }}>
              <input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} required aria-label="Email address" />
              <motion.button type="submit" whileHover={{ background: 'var(--ink)' }} whileTap={{ scale: 0.97 }}>Subscribe Free →</motion.button>
            </motion.form>
          )}
        </AnimatePresence>
        <p className="nl-note">No spam. Sent every Tuesday. Unsubscribe any time.</p>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════ REVIEWS ══════════════════════════ */
/* ══════════════════════════ REVIEWS ══════════════════════════ */
/* Real verified reviews from Clutch.co */
const CLUTCH_URL = 'https://clutch.co/profile/creative-muse-marketing?utm_source=widget&utm_medium=4&utm_campaign=widget&utm_content=title&utm_term=creativemuse.ca';
const REVIEWS = [
  { text: "Creative Muse Marketing was very caring, and they came back to us very quickly.", name: "David Hardy", company: "Director, Cayman Islands Crisis Centre", service: "Web Development", rating: 4.5, initials: "DH", color: "#1A2244" },
  { text: "Creative Muse Marketing Inc. is honest and able to work without oversight.", name: "Tom Lloyd", company: "2IC & Head of Marketing, Cheaper Buy The Dozen", service: "SEO & Digital Marketing", rating: 5, initials: "TL", color: "#C9A84C" },
  { text: "They took my concept and really made it pop.", name: "Ceili Heffernan", company: "Owner, Cayman Maintenance", service: "Web Design & Development", rating: 5, initials: "CH", color: "#2D3350" },
  { text: "The response time has been phenomenal.", name: "Hetav Dave", company: "Lawyer, Aastha Lawyers", service: "Web Development", rating: 5, initials: "HD", color: "#1A2244" },
  { text: "The whole experience was great.", name: "Founder", company: "Business & Relationship Coaching Company", service: "Web Design", rating: 5, initials: "BC", color: "#C9A84C" },
  { text: "I've had nothing but a great experience with this company.", name: "Founder & Manager", company: "Efficient Mobile Technicians", service: "Web Development", rating: 5, initials: "EM", color: "#2D3350" },
  { text: "Creative Muse Marketing Inc. truly cares about growing my business.", name: "Managing Director", company: "Medical Spa", service: "Digital Marketing", rating: 4, initials: "MS", color: "#1A2244" },
];

function Stars({ rating }) {
  const pct = (rating / 5) * 100;
  return (
    <div className="rev-stars" aria-label={`${rating} out of 5`}>
      <span className="rev-stars-bg">★★★★★</span>
      <span className="rev-stars-fill" style={{ width: pct + '%' }}>★★★★★</span>
    </div>
  );
}

function ReviewCard({ r }) {
  return (
    <div className="rev-card">
      <div className="rev-card-top">
        <Stars rating={r.rating} />
        <span className="rev-rating-num">{r.rating.toFixed(1)}</span>
      </div>
      <p className="rev-text">“{r.text}”</p>
      <div className="rev-author">
        <div className="rev-avatar" style={{ background: r.color }} aria-hidden="true">{r.initials}</div>
        <div>
          <div className="rev-name">{r.name}</div>
          <div className="rev-co">{r.company}</div>
          <div className="rev-service">{r.service}</div>
        </div>
      </div>
    </div>
  );
}

function Reviews() {
  const { flags } = useFx();
  const loop = [...REVIEWS, ...REVIEWS];
  return (
    <section className="reviews section-fade-dark" id="reviews" data-screen-label="Reviews">
      {flags.blooms && <Bloom style={{ width: 520, height: 520, top: '20%', left: '-6%' }} />}
      <div className="reviews-inner">
        <Reveal className="reviews-header" amount={0.2}>
          <div>
            <div className="eyebrow">Client Reviews</div>
            <RevealLines as="h2" className="sec-title light" lines={['What our clients say.']} />
          </div>
          <a className="clutch-badge" href={CLUTCH_URL} target="_blank" rel="noopener noreferrer">
            <span className="clutch-stars">★★★★★</span><span>Verified on Clutch.co</span>
          </a>
        </Reveal>
      </div>
      <div className="rev-marquee">
        <div className="rev-fade left" aria-hidden="true" />
        <div className="rev-fade right" aria-hidden="true" />
        <div className="rev-track">
          {loop.map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>
      <Reveal className="reviews-cta">
        <MagneticButton href={CLUTCH_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-gold" strength={0.12}
          whileHover={{ background: 'var(--gold)', color: 'var(--dark)', borderColor: 'var(--gold)' }}>
          View All Reviews on Clutch.co {I.extLink}
        </MagneticButton>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════ CONTACT ══════════════════════════ */
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', service: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = true;
    if (!form.message.trim()) e.message = true;
    return e;
  };
  const handleSubmit = ev => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  return (
    <section className="contact section-fade-navy" id="contact" data-screen-label="Contact">
      <div className="contact-inner">
        <Reveal amount={0.15}>
          <div className="eyebrow">Get In Touch</div>
          <RevealLines as="h2" className="sec-title light" lines={['Ready to grow', <em key="e">something great?</em>]} />
          <div className="gold-rule" />
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', fontWeight: 300, marginBottom: '44px' }}>
            Whether you're launching a brand, scaling in the UAE, or looking to bring AI into your marketing. We'd love to hear what you're building.
          </p>
          {[{ icon: I.mailSm, label: 'Email', val: <a href="mailto:info@creativemuse.ca">info@creativemuse.ca</a> }, { icon: I.pin, label: 'Offices', val: 'Dubai, UAE 🇦🇪  ·  Canada 🇨🇦' }, { icon: I.building, label: 'Legal Entity', val: 'Musetech Solutions FZCO' }].map(d => (
            <div key={d.label} className="contact-detail">
              <div className="contact-detail-icon">{d.icon}</div>
              <div><div className="contact-detail-label">{d.label}</div><div className="contact-detail-val">{d.val}</div></div>
            </div>
          ))}
        </Reveal>
        <Reveal amount={0.15} delay={0.12}>
          <div className="contact-form-box">
            <h3>Send us a message</h3>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div className="form-success" key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}>
                  <motion.div style={{ color: 'var(--gold)' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 180 }}>{I.check}</motion.div>
                  <div style={{ marginTop: '14px', color: 'var(--white)' }}>Thanks, we'll be in touch within 24 hours.</div>
                </motion.div>
              ) : (
                <motion.form key="f" onSubmit={handleSubmit} noValidate exit={{ opacity: 0 }}>
                  <div className="field-row">
                    <div className="field"><label htmlFor="c-name">Name</label><input id="c-name" type="text" placeholder="Jane Smith" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: false }); }} className={errors.name ? 'error' : ''} /></div>
                    <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" type="email" placeholder="jane@company.com" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: false }); }} className={errors.email ? 'error' : ''} /></div>
                  </div>
                  <div className="field-row">
                    <div className="field"><label htmlFor="c-co">Company</label><input id="c-co" type="text" placeholder="Brand or company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                    <div className="field">
                      <label htmlFor="c-srv">Service Interest</label>
                      <select id="c-srv" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--r)', padding: '14px 18px', width: '100%', color: form.service ? 'var(--white)' : 'rgba(255,255,255,.25)', fontFamily: "'DM Sans',sans-serif", fontSize: '14px', outline: 'none', cursor: 'pointer', appearance: 'none' }}>
                        <option value="" style={{ background: '#1A2244' }}>Select a service</option>
                        {['AI Marketing Strategy', 'SEO & GEO', 'Web Development', 'Paid Media', 'Social Media', 'Brand Identity', 'Other / Not sure'].map(s => <option key={s} value={s} style={{ background: '#1A2244' }}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="field"><label htmlFor="c-msg">Message</label><textarea id="c-msg" placeholder="Tell us about your project, goals, or questions…" value={form.message} onChange={e => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: false }); }} className={errors.message ? 'error' : ''} rows="4" /></div>
                  <motion.button type="submit" className="btn-gold" disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--r)', marginTop: '6px', opacity: loading ? .7 : 1 }}
                    whileHover={!loading ? { scale: 1.01, boxShadow: '0 10px 28px rgba(201,168,76,0.22)' } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >{loading ? 'Sending…' : 'Send Message →'}</motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════ FOOTER ══════════════════════════ */
function Footer() {
  return (
    <footer data-screen-label="Footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '26px', fontWeight: 600, color: 'var(--white)', letterSpacing: '-0.5px', lineHeight: 1 }}>
                Creative <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 300 }}>Muse</em>
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '9px', fontWeight: 400, color: 'rgba(255,255,255,0.3)', letterSpacing: '3.5px', textTransform: 'uppercase', marginTop: '4px' }}>Marketing</div>
            </div>
            <div className="footer-tagline">Canadian Roots · Dubai Operated</div>
            <p className="footer-desc">AI-powered digital marketing for brands that mean business. Boutique in feel, enterprise in capability.</p>
            <span className="footer-entity">Musetech Solutions FZCO</span>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>{['AI Marketing Strategy', 'SEO & GEO', 'Paid Media', 'Web Development', 'Social Media', 'Brand Identity'].map(s => <li key={s}><a onClick={() => scrollTo('#services')}>{s}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>{[['#about', 'About'], ['#clients', 'Clients'], ['#reviews', 'Reviews'], ['#newsletter', 'Newsletter'], ['#seo-audit', 'Free SEO Audit']].map(([id, l]) => <li key={id}><a onClick={() => scrollTo(id)}>{l}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:info@creativemuse.ca">info@creativemuse.ca</a></li>
              <li><a onClick={() => scrollTo('#contact')}>Dubai, UAE 🇦🇪</a></li>
              <li><a onClick={() => scrollTo('#contact')}>Canada 🇨🇦</a></li>
              <li><a href="https://tappitcards.com" target="_blank" rel="noopener noreferrer">Tappit Cards {I.extLink}</a></li>
              <li><a href="https://auraliscrystals.com" target="_blank" rel="noopener noreferrer">Auralis Crystals {I.extLink}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 Musetech Solutions FZCO. All rights reserved. creativemuse.com</div>
          <div className="footer-socials">
            <motion.a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn" whileHover={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>{I.linkedin}</motion.a>
            <motion.a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram" whileHover={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>{I.instagram}</motion.a>
          </div>
          <div className="footer-legal"><a href="#">Privacy Policy</a><a href="#">Terms &amp; Conditions</a></div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Clients, SeoAudit, Newsletter, Reviews, Contact, Footer });

/* ════════════════════════════════════════════════════════════
   muse-clients.jsx — "Clients Who Trust Us" marquee + Our Ventures
   ════════════════════════════════════════════════════════════ */
const { useFx, Reveal } = window;
const { motion } = Motion;
const ventEase = [0.22, 1, 0.36, 1];

/* ── Logos (real cropped logotypes, greyscale → colour on hover) ── */
const ALL_LOGOS = [
  { src: 'assets/clients/neptune-marketing.png',     alt: 'Neptune Marketing' },
  { src: 'assets/clients/wow-spa.png',               alt: 'WOW Spa' },
  { src: 'assets/clients/fidelity.png',              alt: 'Fidelity' },
  { src: 'assets/clients/district-bagel.png',        alt: 'District Bagel' },
  { src: 'assets/clients/caytours.png',              alt: 'CayTours' },
  { src: 'assets/clients/cayman-career-academy.png', alt: 'Cayman Career Academy' },
  { src: 'assets/clients/stand-speak-up.png',        alt: 'Stand Speak Up' },
  { src: 'assets/clients/crisis-centre.png',         alt: 'Crisis Centre Cayman Islands' },
  { src: 'assets/clients/ican.png',                  alt: 'i-CAN Advisory Group' },
  { src: 'assets/clients/the-life-sync.png',         alt: 'The Life Sync' },
  { src: 'assets/clients/corevu-labs.png',           alt: 'CoreVU Labs' },
  { src: 'assets/clients/get-student-visa.png',      alt: 'Get Student Visa' },
  { src: 'assets/clients/sas.png',                   alt: 'SAS' },
  { src: 'assets/clients/khana-khazana.png',         alt: 'Khana Khazana' },
  { src: 'assets/clients/kilimanjaro.png',           alt: 'Kilimanjaro' },
];

function MarqueeRow({ logos, dir }) {
  const loop = [...logos, ...logos];
  return (
    <div className="cl-row">
      <div className={`cl-track ${dir}`}>
        {loop.map((l, i) => (
          <div className="cl-logo" key={i} aria-hidden={i >= logos.length ? 'true' : undefined}>
            <img src={l.src} alt={i >= logos.length ? '' : l.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientLogos() {
  return (
    <section className="client-logos" id="trusted-by" data-screen-label="Clients Who Trust Us">
      <div className="cl-inner">
        <Reveal className="cl-header" amount={0.3}>
          <div className="eyebrow">Clients Who Trust Us</div>
          <h2 className="sec-title light cl-title">Brands that chose us to grow.</h2>
          <p className="sec-sub light cl-sub">From the Caribbean to Canada to the UAE: a cross-market portfolio built on results.</p>
        </Reveal>
      </div>
      <div className="cl-marquee">
        <div className="cl-fade left" aria-hidden="true" />
        <div className="cl-fade right" aria-hidden="true" />
        <MarqueeRow logos={ALL_LOGOS} dir="left" />
      </div>
    </section>
  );
}

/* ══════════════════════════ OUR VENTURES ══════════════════════════ */
Object.assign(window, { ClientLogos });

import { useEffect, useState } from 'react';
import { NavBar, CompanyFooter } from '../components/company';
import { useSwipeScroll } from '../hooks/useSwipeScroll';
import '../components/company/company.css';
import './ascelis.css';

const A = '/assets/ascelis/';

type FocusCard = {
  title: string;
  image: string;
  desc: string;
};

const CORE_FOCUS: FocusCard[] = [
  {
    title: 'Peptide-based APIs & Generics',
    image: 'card-peptide-apis.png',
    desc: 'High-purity peptide APIs adhering to stringent Swiss and international pharmacopeial standards.',
  },
  {
    title: 'Specialized CDMO Services',
    image: 'card-cdmo-services.png',
    desc: 'Full-spectrum contract development and manufacturing from early-stage discovery to commercial supply.',
  },
  {
    title: 'Cosmetic Peptides',
    image: 'card-cosmetic-peptides.png',
    desc: 'Bioactive peptides for cutting-edge dermatology, anti-aging, and cosmetic formulations.',
  },
  {
    title: 'Theragnostic Peptides',
    image: 'card-theragnostic-peptides.png',
    desc: 'Dual-action peptide platforms integrating molecular diagnostics with precision therapeutic delivery.',
  },
];

const FOOTPRINT = ['Senn Chemicals AG (Switzerland)', 'Ascelis India (Upcoming)', 'IIT Hyderabad R&D Lab'];

export default function AscelisPeptidesPage() {
  const {
    swipeProps,
    isDragging,
    scrollProgress,
    canScrollLeft,
    canScrollRight,
    thumbWidth,
    scroll,
  } = useSwipeScroll();
  const [openCard, setOpenCard] = useState(-1);

  useEffect(() => {
    document.title = 'Ascelis Peptides Private Limited — Granules India';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cp">
      <NavBar />

      <p className="cp-breadcrumb" style={{ width: 'min(1463px, 100% - 3.2rem)', margin: 'clamp(60px, 8vw, 118px) auto 0' }}>
        <span>Homepage</span>
        <span className="sep">{'>'}</span>
        <span>Company</span>
        <span className="sep">{'>'}</span>
        <span className="current">Ascelis Peptides Private Limited</span>
      </p>
      <h1 className="cp-page-title">Ascelis Peptides Private Limited</h1>
      <div className="cp-hero-banner">
        <img src={`${A}hero-banner.png`} alt="Ascelis Peptides facility" />
      </div>

      <div className="asc-intro">
        <p>
          <span>Granules India&rsquo;s entry into the peptide space marks a transformational milestone, anchored by the acquisition of Senn Chemicals AG — a Swiss CDMO with over 60 years of peptide synthesis expertise. </span>
          <span className="muted">This move strengthens our capabilities across therapeutic, cosmetic, and diagnostic peptides, and enables a globally integrated platform under Ascelis Peptides.</span>
        </p>
        <p>
          Built to serve the fast-evolving $100–150 billion peptide therapeutics market, Ascelis
          combines Swiss precision and Indian scalability to support development across GLP-1
          receptor agonists, oncology peptides, peptide-drug conjugates, and amino acid
          derivatives.
        </p>
      </div>

      <div className="asc-section-head">
        <div className="copy">
          <span className="cp-section-badge">Core focus area</span>
          <h2>Advancing Peptide science with scale &amp; speed</h2>
          <p>
            Ascelis integrates end-to-end peptide synthesis infrastructure to deliver across high-growth segments:
          </p>
        </div>
        <a className="cp-cta-btn" href="/company">Learn more</a>
      </div>

      <div className="asc-carousel">
        <div className={`asc-track${isDragging ? ' is-dragging' : ''}`} {...swipeProps}>
          {CORE_FOCUS.map((card, idx) => {
            const isOpenCard = openCard === idx;
            return (
              <article
                className={`asc-card${isOpenCard ? ' is-open' : ''}`}
                key={card.title}
                onMouseEnter={() => setOpenCard(idx)}
                onMouseLeave={() => setOpenCard(-1)}
                onClick={() => setOpenCard(isOpenCard ? -1 : idx)}
              >
                <img className="bg" src={`${A}${card.image}`} alt={card.title} />
                <div className="asc-sheet">
                  <div className="asc-sheet-head">
                    <span className="asc-sheet-title">{card.title}</span>
                    <span className="asc-sheet-symbol" aria-hidden="true">+</span>
                  </div>
                  <div className="asc-sheet-body">
                    <p className="asc-sheet-desc">{card.desc}</p>
                    <span className="asc-sheet-learn">LEARN MORE ↗</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Dynamic progress bar and smooth arrow navigation */}
        <div className="asc-carousel-controls">
          <div className="asc-progress-track">
            <div
              className="asc-progress-bar"
              style={{
                width: `${thumbWidth}%`,
                left: `${scrollProgress * (100 - thumbWidth)}%`,
              }}
            />
          </div>
          <div className="asc-carousel-arrows">
            <button
              type="button"
              className="asc-arrow-btn"
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              type="button"
              className="asc-arrow-btn"
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="asc-motion">
        <div className="asc-motion-copy">
          <h3>Science, speed, and sustainability in motion</h3>
          <p>
            The Company is backed by a clear execution plan to ensure rapid, responsible growth
            across geographies:
          </p>
        </div>
        <div className="asc-progress">
          <span className="active" />
          <span /><span /><span /><span /><span />
        </div>
        <div className="asc-motion-card">
          <img src={`${A}icon-molecule.svg`} alt="" />
          <p>New peptide R&amp;D lab at IIT Hyderabad, aligned with Senn&rsquo;s Swiss R&amp;D</p>
        </div>
      </div>

      <div className="asc-footprint">
        <div>
          <h2>Our footprint</h2>
          <p>Global manufacturing and R&amp;D infrastructure</p>
        </div>
        <div className="asc-footprint-grid">
          {FOOTPRINT.map((location) => (
            <div className="asc-placeholder-card" key={location}>
              <div className="asc-placeholder-label">{location}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="asc-cta">
        <img className="bg" src={`${A}cta-bg.png`} alt="" />
        <div className="overlay" />
        <div className="asc-cta-copy">
          <h2>Ascelis Peptides Capabilities</h2>
          <p>Connect with our peptide experts to accelerate your next breakthrough.</p>
        </div>
        <a className="cp-cta-btn" href="/company">Know more</a>
      </div>

      <CompanyFooter />
    </div>
  );
}

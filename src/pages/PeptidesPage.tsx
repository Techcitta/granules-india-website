import { useEffect, useRef, useState } from 'react';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './business.css';

const P = '/assets/peptides/';

const CAPABILITY_CARDS = [
  { title: 'Generic APIs', image: 'card-generic-apis.png' },
  { title: 'Contract Services', image: 'card-contract-services.png' },
  { title: 'Cosmetic Peptides', image: 'card-cosmetic-peptides.png' },
  { title: 'Theragnostic Peptides', image: 'card-theragnostic-peptides.png' },
];

type OfferItem = { title: string; body: string; icon: string };

const OFFERS: OfferItem[] = [
  {
    title: 'Globally Endorsed Production Practices',
    body: 'Regulatory-aligned manufacturing with Swissmedic and USFDA standards',
    icon: 'icon-production-belt.svg',
  },
  { title: 'End-to-End Global CDMO Support', body: '', icon: 'icon-box.svg' },
  { title: 'Innovating GLP-1 and Growth Therapies', body: '', icon: 'icon-manufacturing.svg' },
  { title: 'Sustainable Peptide & Amino Solutions', body: '', icon: 'icon-circles.svg' },
  { title: 'Agile, Modular Global Infrastructure', body: '', icon: 'icon-globe.svg' },
];

export default function PeptidesPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    document.title = 'Peptides — Granules India';
    window.scrollTo(0, 0);
  }, []);

  const scroll = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * 500, behavior: 'smooth' });
  };

  return (
    <div className="cp">
      <NavBar />

      <p className="cp-breadcrumb" style={{ width: 'min(1463px, 100% - 3.2rem)', margin: 'clamp(60px, 8vw, 118px) auto 0' }}>
        <span>Homepage</span>
        <span className="sep">{'>'}</span>
        <span>Business</span>
        <span className="sep">{'>'}</span>
        <span className="current">Peptides</span>
      </p>
      <h1 className="cp-page-title">Peptide</h1>
      <div className="cp-hero-banner">
        <img src={`${P}hero-banner.png`} alt="Granules peptide science" />
      </div>

      <div className="biz-intro">
        <p>
          Granules India is expanding into high-growth peptide therapeutics with a fully
          integrated platform, built on the acquisition of Senn Chemicals (Switzerland) and the
          launch of Ascelis Peptides (India).
        </p>
        <p>
          With over 170 obesity-related peptides in global pipelines, peptides are revolutionizing
          treatments in diabetes, obesity, oncology, and rare diseases. Global GLP-1 agonist sales
          exceeded USD 50 billion in 2024 and are projected to reach USD 130 billion by 2030.
        </p>
        <p className="muted">
          At Granules, we are combining green science, contract development and manufacturing
          excellence, and a future-ready innovation mindset to lead this transformation.
        </p>
      </div>

      <div className="biz-section-head">
        <div className="copy">
          <span className="cp-section-badge">Key capabilities</span>
          <h2>Ascelis Peptides: science, scale, and speed</h2>
          <p>
            With over six decades of peptide synthesis experience through Senn Chemicals,
            Granules brings unmatched precision to the development of high-purity peptide APIs.
            This legacy is now amplified through Ascelis Peptides, our dedicated Indian platform,
            enabling speed-to-market and cost efficiency at scale.
          </p>
        </div>
        <a className="cp-cta-btn" href="/company/ascelis-peptides">Learn more</a>
      </div>

      <div className="biz-carousel">
        <div className="biz-track" ref={trackRef}>
          {CAPABILITY_CARDS.map((card) => (
            <article className="biz-card" key={card.title}>
              <img className="bg" src={`${P}${card.image}`} alt="" />
              <div className="biz-card-label">
                <span>{card.title}</span>
                <span className="biz-card-arrow">
                  <img src={`${P}arrow-plus.svg`} alt="" style={{ width: 20, height: 20 }} />
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="biz-carousel-nav">
          <button type="button" aria-label="Scroll left" onClick={() => scroll(-1)}>
            <img src={`${P}carousel-arrow-left.svg`} alt="" />
          </button>
          <button type="button" aria-label="Scroll right" onClick={() => scroll(1)}>
            <img src={`${P}carousel-arrow-right.svg`} alt="" />
          </button>
        </div>
      </div>

      <div className="biz-panel">
        <img className="bg" src={`${P}offers-bg.png`} alt="" />
        <div className="overlay" />
        <div className="biz-panel-grid">
          <div className="biz-panel-head">
            <h2>Our integrated modal offers</h2>
          </div>
          <div className="biz-accordion">
            {OFFERS.map((item, index) => {
              const isOpen = open === index;
              return (
                <button
                  key={item.title}
                  type="button"
                  className={`biz-accordion-item${isOpen ? '' : ' collapsed'}`}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <div className="biz-accordion-head">
                    <div className="biz-accordion-icon-row">
                      <span className="biz-accordion-icon">
                        <img src={`${P}${item.icon}`} alt="" />
                      </span>
                      <p className="biz-accordion-title">{item.title}</p>
                    </div>
                    <span className="biz-accordion-toggle">
                      <img src={`${P}icon-minus.svg`} alt="" />
                    </span>
                  </div>
                  {isOpen && item.body && <p className="biz-accordion-body">{item.body}</p>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="biz-cta">
        <img className="bg" src={`${P}cta-bg.png`} alt="" />
        <div className="overlay" />
        <div className="biz-cta-copy">
          <h2>Partner with Granules for your Peptide journey</h2>
        </div>
        <a className="cp-cta-btn" href="/business/peptides">Our Capabilities</a>
      </div>

      <CompanyFooter />
    </div>
  );
}

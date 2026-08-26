import { useEffect } from 'react';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './rd.css';

const R = '/assets/rd/';

const CENTER_TABS = ['Integrated Product Development', 'Controlled Substances', 'New Technologies'];

type GreenCard = { title: string; body: string; image: string | null };

const GREEN_CARDS: GreenCard[] = [
  { title: 'Catalysis over stoichiometric reagents', body: 'Less waste, more efficiency', image: 'card-catalysis.png' },
  { title: 'Usage of Safer Solvents', body: 'Water and ethanol replace harmful chlorinated hydrocarbons', image: 'card-solvents.png' },
  { title: 'Energy-efficient Synthesis Routes', body: 'Reactions run at ambient temperatures and pressures', image: 'card-synthesis.png' },
  { title: 'Biocatalysis', body: 'Cleaner transformations with fewer by-products', image: null },
];

export default function RdPage() {
  useEffect(() => {
    document.title = 'R&D and Innovation — Granules India';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cp">
      <NavBar />

      <p className="cp-breadcrumb" style={{ width: 'min(1463px, 100% - 3.2rem)', margin: 'clamp(60px, 8vw, 118px) auto 0' }}>
        <span>Homepage</span>
        <span className="sep">{'>'}</span>
        <span>Business</span>
        <span className="sep">{'>'}</span>
        <span className="current">Research &amp; Development</span>
      </p>
      <h1 className="cp-page-title">R&amp;D and innovation</h1>
      <div className="cp-hero-banner">
        <img src={`${R}hero-banner.png`} alt="Granules R&D laboratory" />
      </div>

      <div className="rd-intro">
        <p>
          At Granules India, research and development drives our transformation into a vertically
          integrated and diversified pharmaceutical company. Our comprehensive R&amp;D ecosystem
          spanning APIs, PFIs, and FDs, enables us to deliver safe, effective, and affordable
          healthcare solutions across regulated and emerging markets.
        </p>
        <p>
          With over 400 scientists across four global R&amp;D centres, we specialise in
          cost-efficient, regulatory-compliant, and commercially scalable product development.{' '}
          <span className="muted">Our efforts cover the entire pharmaceutical value chain, from chemical intermediates and APIs to finished dosages&mdash;designed for speed, quality, and global alignment.</span>
        </p>
      </div>

      <div className="rd-centers">
        <img className="bg" src={`${R}centers-bg.png`} alt="" />
        <div className="overlay" />
        <div className="rd-centers-nav rd-centers-nav--prev">
          <button type="button" aria-label="Previous R&D centre" disabled>
            <img src={`${R}arrow-left.svg`} alt="" />
          </button>
        </div>
        <div className="rd-centers-nav rd-centers-nav--next">
          <button type="button" aria-label="Next R&D centre" disabled>
            <img src={`${R}arrow-right.svg`} alt="" />
          </button>
        </div>

        <div className="rd-centers-content">
          <span className="cp-section-badge" style={{ alignSelf: 'flex-start' }}>R&amp;D Center</span>
          <h2>Revolutionizing global manufacturing</h2>
          <div>
            <p className="rd-slide-index">01 / 04</p>
            <p className="rd-slide-location">Genome Valley, MN Park, Hyderabad</p>
            <p className="rd-slide-subtitle">R&amp;D site for APIs and FDs</p>
            <a className="cp-cta-btn" href="/business/rd">Know more</a>
          </div>
        </div>

        <div className="rd-centers-tabs">
          {CENTER_TABS.map((tab, index) => (
            <span className={`rd-centers-tab${index === 0 ? ' active' : ''}`} key={tab}>
              {tab}
              <img src={`${R}icon-plus.svg`} alt="" />
            </span>
          ))}
        </div>
      </div>

      <div className="rd-green-section">
        <h2>Pioneering green pharmaceutical solutions</h2>
        <p>
          At Granules India, sustainability is embedded at the molecular level. We apply green
          chemistry principles, such as atom economy, e-factor optimization, and solvent
          minimization, across every stage of product development. Examples include:
        </p>
      </div>

      <div className="rd-green-grid">
        {GREEN_CARDS.map((card) => (
          <article className={`rd-green-card${card.image ? '' : ' rd-green-card--placeholder'}`} key={card.title}>
            {card.image && <img className="bg" src={`${R}${card.image}`} alt="" />}
            <div className="rd-green-label">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="rd-eco-note">
        Our proprietary Eco-Scale framework evaluates processes across six core{' '}
        <span className="muted">parameters and 38 sub-parameters, ensuring our chemistries align with operational efficiency, global standards, and environmental stewardship.</span>
      </p>

      <div className="rd-cta">
        <img className="bg" src={`${R}cta-bg.png`} alt="" />
        <div className="overlay" />
        <div className="rd-cta-copy">
          <h2>Global manufacturing powerhouse</h2>
          <p>
            GMP-compliant facilities across India and the US enable consistent, high-quality,
            large-scale production for global pharmaceutical partners.
          </p>
        </div>
        <a className="cp-cta-btn" href="/company/facilities">Facilities</a>
      </div>

      <CompanyFooter />
    </div>
  );
}

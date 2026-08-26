import { useEffect, useRef, useState } from 'react';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './business.css';

const P = '/assets/pfi/';

const FOCUS_AREAS = [
  { title: 'Scaling Operational Throughput', image: null },
  { title: 'Enhancing Customer Efficiency', image: 'card-customer-efficiency.png' },
  { title: 'Delivering End-To-End Formulation Value', image: null },
  { title: 'Expanding Global Reach and Impact', image: 'card-global-reach.png' },
];

type BenefitItem = { title: string; body: string; icon: string };

const BENEFITS: BenefitItem[] = [
  {
    title: 'Efficient Testing Solutions',
    body: 'Driving efficiency through tailor-made and complex PFI solutions customized to the needs',
    icon: 'icon-test-tube.svg',
  },
  { title: 'Simplified Logistics', body: 'PFIs cut supply chain steps and inventory pressures', icon: 'icon-box.svg' },
  { title: 'Quality Assurance', body: 'Volume manufacturing assures consistent, reliable output.', icon: 'icon-manufacturing.svg' },
  { title: 'Asset-Light Production', body: 'PFIs replicate over 80% of standard oral facility infrastructure', icon: 'icon-production-belt.svg' },
  { title: 'Tailored Release Capabilities', body: 'Custom solutions allow for homogeneous mixtures with other APIs', icon: 'icon-circles.svg' },
];

export default function PfiPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    document.title = 'Pharmaceutical Formulation Intermediates — Granules India';
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
        <span className="current">Pharmaceutical Formulation Intermediates</span>
      </p>
      <h1 className="cp-page-title">Pharmaceutical formulation intermediates</h1>
      <div className="cp-hero-panel">
        <span className="cp-hero-badge">STOCK IMAGE</span>
      </div>

      <div className="biz-intro">
        <p>
          Granules India is a global leader and pioneer in Pharmaceutical Formulation
          Intermediates (PFIs) offering scalable, cost-effective solutions that simplify
          complexity and accelerate manufacturing for oral solid dosage forms.
        </p>
        <p>
          With a six-tonne batch capacity and a presence in over 80 countries, we are the
          world&rsquo;s largest PFI manufacturer by volume. Our proprietary &ldquo;Drum to
          Hopper&rdquo; model enables direct compression with minimal development effort, helping
          partners streamline production and avoid intensive infrastructure setups. Our PFIs
          support a broad range of chronic and acute therapies, including fixed-dose
          combinations, and are tailored to meet market-specific regulatory needs.
        </p>
      </div>

      <div className="biz-section-head">
        <div className="copy">
          <span className="cp-section-badge">Section Head</span>
          <h2>Our focus areas in PFI excellence</h2>
        </div>
      </div>

      <div className="biz-carousel">
        <div className="biz-track" ref={trackRef}>
          {FOCUS_AREAS.map((card) => (
            <article className={`biz-card${card.image ? '' : ' biz-card--placeholder'}`} key={card.title}>
              {card.image && <img className="bg" src={`${P}${card.image}`} alt="" />}
              <div className="biz-card-label">
                <span>{card.title}</span>
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
        <img className="bg" src={`${P}key-benefits-bg.png`} alt="" />
        <div className="overlay" />
        <div className="biz-panel-grid">
          <div className="biz-panel-head">
            <h2>Key benefits of our PFI model</h2>
          </div>
          <div className="biz-accordion">
            {BENEFITS.map((item, index) => {
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
                  {isOpen && <p className="biz-accordion-body">{item.body}</p>}
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
          <h2>Explore our full PFI product portfolio</h2>
        </div>
        <a className="cp-cta-btn" href="/business/pfi">View Product List</a>
      </div>

      <CompanyFooter />
    </div>
  );
}

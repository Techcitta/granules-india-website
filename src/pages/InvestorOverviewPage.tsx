import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './investor.css';

const A = '/assets/investor/';

const KEY_REASONS = [
  'Global Leadership in Pharma Manufacturing',
  'Consistent Financial Performance',
  'Operational Excellence at Scale',
  'Innovation-driven Growth',
  'Sustainability Commitment',
];

const DATA_TABS = ['Financial Reports', 'Investor resources', 'Financial highlights', 'Notices & Disclosures', 'other info'];

const DATA_ROWS = [
  { label: 'Annual Reports', href: '/investor/annual-reports' },
  { label: 'Sustainability Reports' },
  { label: 'Quarterly Results' },
  { label: 'Annual Accounts of Subsidiaries & JVs' },
  { label: 'Corporate Presentation' },
];

export default function InvestorOverviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Investor Overview — Granules India';
    window.scrollTo(0, 0);
  }, []);

  const scrollReasons = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 496, behavior: 'smooth' });
  };

  return (
    <div className="cp">
      <NavBar />

      <p className="cp-breadcrumb" style={{ width: 'min(1463px, 100% - 3.2rem)', margin: 'clamp(60px, 8vw, 118px) auto 0' }}>
        <span>Homepage</span>
        <span className="sep">{'>'}</span>
        <span className="current">Investor</span>
      </p>
      <h1 className="cp-page-title">Investor overview</h1>

      <div className="inv-hero">
        <span className="inv-hero-badge">STOCK IMAGE</span>
      </div>

      <div className="inv-stock-wrap">
        <div className="inv-stock-card">
          <div className="inv-stock-head">
            <div>
              <p className="inv-stock-name">GRANULES INDIA</p>
              <p className="inv-stock-date">June 14,2025 12:29:00</p>
            </div>
            <div className="inv-stock-exchange">
              <span className="nse">NSE</span>
              <span className="bse">BSE</span>
            </div>
          </div>
          <div className="inv-stock-price-row">
            <p className="inv-stock-price">946.00</p>
            <span className="inv-stock-change up">
              <img src={`${A}growth-arrow.svg`} alt="" />
              22.10 (2.20%)
            </span>
          </div>
        </div>
      </div>

      <div className="inv-why">
        <h2>Why Invest in Granules ?</h2>
        <p>
          Granules India is a trusted partner in the global pharmaceutical industry, with a strong
          foundation of scale, quality, and reliability. Investing in Granules means being part of
          a growth story built on innovation, operational efficiency, and global compliance.
        </p>
      </div>

      <div className="inv-reasons">
        <div className="inv-reasons-track" ref={trackRef}>
          {KEY_REASONS.map((reason) => (
            <div className="inv-reason-card" key={reason}>
              <div className="inv-reason-bar">
                <p>{reason}</p>
                <div className="inv-reason-icon">
                  <img src={`${A}arrow-diag.svg`} alt="" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="inv-reasons-nav">
          <button type="button" onClick={() => scrollReasons(-1)} aria-label="Previous">
            <img src={`${A}carousel-arrow-left.svg`} alt="" />
          </button>
          <button type="button" onClick={() => scrollReasons(1)} aria-label="Next">
            <img src={`${A}carousel-arrow-right.svg`} alt="" />
          </button>
        </div>
      </div>

      <div className="inv-quarterly">
        <div className="inv-quarterly-copy">
          <h2>Latest Quarterly Results</h2>
          <div className="inv-quarterly-list">
            {['2024 Integrated Annual Report', 'corporate presentation', 'Press release'].map((item) => (
              <div className="inv-quarterly-item" key={item}>
                <div className="inv-quarterly-item-head">
                  <p>{item}</p>
                  <img src={`${A}plus.svg`} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="inv-quarterly-image" />
      </div>

      <div className="inv-data">
        <div className="inv-data-tabs">
          {DATA_TABS.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`inv-data-tab${index === activeTab ? ' active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 0 && (
          <div className="inv-data-list">
            {DATA_ROWS.map((row) =>
              row.href ? (
                <Link className="inv-data-row" to={row.href} key={row.label}>
                  <p>{row.label}</p>
                  <img src={`${A}plus.svg`} alt="" />
                </Link>
              ) : (
                <div className="inv-data-row" key={row.label}>
                  <p>{row.label}</p>
                  <img src={`${A}plus.svg`} alt="" />
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div className="inv-contact-cta">
        <div className="inv-contact-copy">
          <h2>Investor relations contacts</h2>
          <p>
            For investor-related queries, please reach out to our Investor Relations team. We are
            committed to transparent communication and timely responses.
          </p>
        </div>
        <a className="inv-contact-btn" href="/#footer">Contact</a>
      </div>

      <CompanyFooter />
    </div>
  );
}

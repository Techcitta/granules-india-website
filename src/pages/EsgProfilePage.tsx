import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './esg-profile.css';

const ESG_DASHBOARD_URL =
  'https://esg.churchgatepartners.com/login/companyprofile?id=3100350036003500240024004100530048004F004B0041004E0041004E00590041004100560041004E004900410053004800570049004E00490024002400';

export default function EsgProfilePage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    document.title = 'ESG Profile & ESG World | Granules India Sustainability';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cp">
      <NavBar />

      {/* Breadcrumb Navigation */}
      <p
        className="cp-breadcrumb"
        style={{ width: 'min(85%, 1632px)', margin: 'clamp(60px, 8vw, 118px) auto 0' }}
      >
        <Link to="/">HOME</Link>
        <span className="sep">›</span>
        <Link to="/sustainability">SUSTAINABILITY</Link>
        <span className="sep">›</span>
        <span className="current">ESG PROFILE</span>
      </p>

      {/* Botanical Stock Hero Banner */}
      <div className="esg-hero-photo">
        <img
          className="bg"
          src="/assets/esg/esg-banner.jpg"
          alt="Granules Sustainable Operations and ESG Stewardship"
          loading="eager"
          decoding="async"
        />
        <div className="overlay" />
        <div className="esg-hero-content">
          <span className="esg-hero-tag">SUSTAINABILITY DISCLOSURES</span>
          <h1 className="esg-hero-heading">ESG Profile</h1>
        </div>
      </div>

      <div className="esg-prof-container">
        {/* Two-Tone Intro Narrative */}
        <div className="esg-intro-wrap">
          <p className="esg-intro-text">
            <strong>Healing lives responsibly</strong>{' '}
            <span>
              through verified disclosures, science-based decarbonization pathways,
              and accountable corporate governance metrics.
            </span>
          </p>
        </div>

        {/* Embedded Live ESG World Interactive Frame */}
        <div className="esg-frame-card">
          <div className="esg-frame-header">
            <div className="esg-frame-badge">
              <span className="esg-frame-dot" aria-hidden="true" />
              <span>ESG World Interactive Portal</span>
            </div>
            <a
              href={ESG_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="esg-frame-external-btn"
              title="Open Granules ESG World Portal in new tab"
            >
              Open Full Screen ↗
            </a>
          </div>

          <div className="esg-iframe-container">
            {!iframeLoaded && (
              <div className="esg-iframe-loader">
                <div className="esg-spinner" />
                <p>Loading ESG World Portal &amp; Disclosures...</p>
              </div>
            )}
            <iframe
              src={ESG_DASHBOARD_URL}
              title="Granules India ESG Profile, Factsheets, and Documents on ESG World"
              className={`esg-portal-frame ${iframeLoaded ? 'loaded' : ''}`}
              loading="lazy"
              allow="fullscreen"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>
      </div>

      <CompanyFooter />
    </div>
  );
}

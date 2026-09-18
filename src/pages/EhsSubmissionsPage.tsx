import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './ehs.css';
import { EHS_DOCUMENTS, EHS_FACILITIES, EHS_CATEGORIES, EhsDocument } from '../data/ehsData';

export default function EhsSubmissionsPage() {
  const [selectedFacility, setSelectedFacility] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    document.title = 'EHS Submissions | Granules India Sustainability';
    window.scrollTo(0, 0);
  }, []);

  const filteredDocs = useMemo(() => {
    return EHS_DOCUMENTS.filter((doc) => {
      const matchFacility =
        selectedFacility === 'ALL' || doc.facility.toLowerCase() === selectedFacility.toLowerCase();
      const matchCategory =
        selectedCategory === 'ALL' || doc.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        searchQuery.trim() === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.scope && doc.scope.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchFacility && matchCategory && matchSearch;
    });
  }, [selectedFacility, selectedCategory, searchQuery]);

  return (
    <div className="ehs-root">
      <NavBar />

      <main className="ehs-main">
        <p className="cp-breadcrumb">
          <Link to="/">HOME</Link>
          <span className="sep">›</span>
          <Link to="/sustainability">SUSTAINABILITY</Link>
          <span className="sep">›</span>
          <span className="current">EHS SUBMISSIONS</span>
        </p>

        <div className="ehs-container">
          {/* Hero Banner */}
          <section className="ehs-hero-banner" aria-label="EHS Submissions Overview">
            <div className="ehs-hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Statutory Compliance & Filings</span>
            </div>
            <h1 className="ehs-hero-title">EHS Submissions</h1>
            <p className="ehs-hero-desc">
              Granules India maintains rigorous environmental, health, and safety standards across all manufacturing
              facilities. Explore our verified annual returns, biomedical and hazardous waste statements, environmental audit
              disclosures, and regulatory certifications.
            </p>
          </section>

          {/* Quick Metrics */}
          <div className="ehs-stat-strip">
            <div className="ehs-stat-card">
              <span className="ehs-stat-num">19</span>
              <span className="ehs-stat-label">Statutory Filings Available</span>
            </div>
            <div className="ehs-stat-card">
              <span className="ehs-stat-num">6+</span>
              <span className="ehs-stat-label">Manufacturing Sites Covered</span>
            </div>
            <div className="ehs-stat-card">
              <span className="ehs-stat-num">100%</span>
              <span className="ehs-stat-label">Pollution Board Compliance</span>
            </div>
            <div className="ehs-stat-card">
              <span className="ehs-stat-num">Dual</span>
              <span className="ehs-stat-label">ISO 14001 & 45001 Certified</span>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="ehs-toolbar">
            <div className="ehs-facility-pills" role="tablist" aria-label="Facility filter">
              {EHS_FACILITIES.map((fac) => {
                const count =
                  fac === 'ALL'
                    ? EHS_DOCUMENTS.length
                    : EHS_DOCUMENTS.filter((d) => d.facility.toLowerCase() === fac.toLowerCase()).length;
                return (
                  <button
                    key={fac}
                    type="button"
                    role="tab"
                    aria-selected={selectedFacility === fac}
                    className={`ehs-pill-btn ${selectedFacility === fac ? 'active' : ''}`}
                    onClick={() => setSelectedFacility(fac)}
                  >
                    <span>{fac}</span>
                    <span style={{ opacity: 0.75, fontSize: '11px' }}>({count})</span>
                  </button>
                );
              })}
            </div>

            <div className="ehs-search-row">
              <div className="ehs-search-box">
                <svg
                  className="ehs-search-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search submissions, reports, units..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search EHS documents"
                />
              </div>

              <select
                className="ehs-cat-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by document category"
              >
                {EHS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Document Table */}
          <div className="ehs-table-wrap">
            {filteredDocs.length === 0 ? (
              <div className="ehs-empty-msg">
                No EHS documents match your selected filters. Please adjust your search criteria or select &quot;ALL&quot;.
              </div>
            ) : (
              <table className="ehs-table" aria-label="EHS Submissions Document Table">
                <thead>
                  <tr>
                    <th style={{ width: '42%' }}>Document Title & Description</th>
                    <th style={{ width: '18%' }}>Facility / Unit</th>
                    <th style={{ width: '16%' }}>Category</th>
                    <th style={{ width: '10%' }}>Period</th>
                    <th style={{ width: '14%', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <span className="ehs-doc-title">{doc.title}</span>
                        {doc.scope && <span className="ehs-doc-scope">{doc.scope}</span>}
                      </td>
                      <td>
                        <span className="ehs-badge ehs-badge-facility">{doc.facility}</span>
                      </td>
                      <td>
                        <span className="ehs-badge ehs-badge-cat">{doc.category}</span>
                      </td>
                      <td>
                        <strong style={{ color: '#0061f8' }}>{doc.period}</strong>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="ehs-actions" style={{ justifyContent: 'flex-end' }}>
                          <a
                            href={doc.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ehs-btn-download"
                            aria-label={`Download ${doc.title}`}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span>Download PDF</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Bottom Gradient Call-to-Action Banner matching site-wide style */}
          <div className="ct-cta-box" style={{ marginBottom: '75px' }}>
            <h2 className="ct-cta-title">Committed to Zero-Harm &amp; Sustainable Operations</h2>
            <p className="ct-cta-text">
              Discover how Granules India integrates green chemistry, energy efficiency, and community stewardship into
              every phase of our business.
            </p>
            <div className="ct-cta-actions">
              <Link to="/sustainability" className="ct-cta-btn ct-cta-btn--primary">
                Explore Sustainability Overview
              </Link>
              <Link to="/sustainability/esg-world" className="ct-cta-btn ct-cta-btn--secondary">
                View ESG World Profile
              </Link>
            </div>
          </div>
        </div>
      </main>

      <CompanyFooter />
    </div>
  );
}

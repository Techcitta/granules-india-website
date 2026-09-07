import React, { useState, useMemo, useEffect } from 'react';
import { InvestorCategory, InvestorDocItem } from '../../data/investorData';

interface InvestorFilteredSectionProps {
  category: InvestorCategory;
  defaultSubcatId?: string;
  defaultYear?: string;
}

export default function InvestorFilteredSection({
  category,
  defaultSubcatId,
  defaultYear,
}: InvestorFilteredSectionProps) {
  // Can be 'all' or a specific subcategory id
  const [activeSubcatId, setActiveSubcatId] = useState<string>(
    () => defaultSubcatId || 'all'
  );
  const [selectedYear, setSelectedYear] = useState<string>(() => defaultYear || 'all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Sync if defaultSubcatId changes from route/hash
  useEffect(() => {
    if (defaultSubcatId) {
      setActiveSubcatId(defaultSubcatId);
    }
  }, [defaultSubcatId]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubcatId, selectedYear]);

  // Total items in category
  const allCategoryItems = useMemo(() => {
    return category.subcategories.flatMap((s) => s.items);
  }, [category.subcategories]);

  // Active subcategory if specific one chosen
  const activeSubcat = useMemo(() => {
    if (activeSubcatId === 'all') return null;
    return category.subcategories.find((s) => s.id === activeSubcatId) || null;
  }, [category.subcategories, activeSubcatId]);

  // Extract unique available years for current view
  const availableYears = useMemo(() => {
    const pool = activeSubcat ? activeSubcat.items : allCategoryItems;
    const years = Array.from(new Set(pool.map((i) => i.year).filter(Boolean)));
    return years.sort((a, b) => b.localeCompare(a));
  }, [activeSubcat, allCategoryItems]);

  // If selected year is not available in new subcategory, reset to 'all'
  useEffect(() => {
    if (selectedYear !== 'all' && !availableYears.includes(selectedYear)) {
      setSelectedYear('all');
    }
  }, [availableYears, selectedYear]);

  // Filtered documents
  const filteredItems = useMemo<InvestorDocItem[]>(() => {
    let pool = activeSubcat ? activeSubcat.items : allCategoryItems;
    if (selectedYear !== 'all') {
      pool = pool.filter((item) => item.year === selectedYear);
    }
    return pool;
  }, [activeSubcat, allCategoryItems, selectedYear]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  return (
    <div className="inv-section-wrapper">
      {/* SECTION HEADER WITH FILTERS BESIDE IT */}
      <div className="inv-doc-section-head">
        <div className="inv-doc-head-left">
          <span className="inv-section-badge">{category.badge}</span>
          <h2>{category.title.toUpperCase()}</h2>
          <p>{category.description}</p>
        </div>

        {/* 2 Filters Placed Side-by-Side: Categories & Year */}
        {!category.isContact && (
          <div className="inv-doc-head-filters" aria-label={`Filter ${category.title}`}>
            {/* Filter 1: Categories / Subcategories */}
            <div className="inv-header-filter-group">
              <label htmlFor={`subcat-select-${category.id}`} className="inv-header-filter-label">
                CATEGORIES
              </label>
              <div className="inv-header-select-wrap">
                <select
                  id={`subcat-select-${category.id}`}
                  className="inv-header-select inv-header-select--subcat"
                  value={activeSubcatId}
                  onChange={(e) => setActiveSubcatId(e.target.value)}
                  aria-label={`Select category in ${category.title}`}
                >
                  <option value="all">All Categories ({allCategoryItems.length})</option>
                  {category.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.label} ({sub.items.length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter 2: Year Filter */}
            {availableYears.length > 0 && (
              <div className="inv-header-filter-group">
                <label htmlFor={`year-select-head-${category.id}`} className="inv-header-filter-label">
                  YEAR
                </label>
                <div className="inv-header-select-wrap">
                  <select
                    id={`year-select-head-${category.id}`}
                    className="inv-header-select inv-header-select--year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    aria-label={`Select year in ${category.title}`}
                  >
                    <option value="all">All Years</option>
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION CONTENT: TABLE THEME & UI MATCHING SCREENSHOT */}
      {category.isContact ? (
        /* Investor Relations Contact Desk */
        <div className="inv-contact-grid">
          <div className="inv-contact-card">
            <div>
              <h3 className="inv-contact-card-title">
                For Institutional Investors &amp; Financial Analysts
              </h3>
              <p style={{ marginTop: '10px' }}>
                <strong>Tel:</strong> +040-69043500,
              </p>
              <p>
                <strong>Email id:</strong>
              </p>
              <p>
                <a href="mailto:investorrelations@granulesindia.com">
                  investorrelations@granulesindia.com
                </a>
              </p>
              <p>
                <a href="mailto:irfan.raeen@linkintime.co.in">
                  irfan.raeen@linkintime.co.in
                </a>
              </p>
            </div>

            <div className="inv-contact-card-divider" />

            <div>
              <h3 className="inv-contact-card-title">Registrar and Transfer Agent</h3>
              <p style={{ marginTop: '8px' }}>
                <strong>M/s. KFin Technologies Limited</strong>
              </p>
              <p>Selenium Tower B,</p>
              <p>Plot 31-32, Gachibowli, Financial District,</p>
              <p>Nanakramguda, Hyderabad - 500 032.</p>
              <p>
                <strong>Toll Free No.:</strong> 1-800-309-4001,
              </p>
              <p>
                <strong>Investor Grievance ID:</strong>
              </p>
              <p>
                <a href="mailto:einward.ris@kfintech.com">einward.ris@kfintech.com</a>
              </p>
              <p>
                <strong>Website:</strong>
              </p>
              <p>
                <a
                  href="https://www.kfintech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.kfintech.com
                </a>
              </p>
            </div>
          </div>

          <div className="inv-contact-card">
            <h3 className="inv-contact-card-title">
              For Retail Investors and Grievance
            </h3>
            <p style={{ marginTop: '8px' }}>
              <strong>Ms. Chaitanya Tummala</strong>
            </p>
            <p>Company Secretary, Compliance Officer and Nodal Officer</p>
            <p>Granules India Limited</p>
            <p>15th Floor, Granules Tower, Botanical Garden Road,</p>
            <p>Kondapur, Hyderabad - 500084, Telangana, India</p>
            <p>
              <strong>Tel:</strong> +91 40 69043500,
            </p>
            <p>
              <strong>Fax:</strong> +91 40 23115145,
            </p>
            <p>
              <strong>Email id:</strong>
            </p>
            <p>
              <a href="mailto:chaitanya.tummala@granulesindia.com">
                chaitanya.tummala@granulesindia.com
              </a>
            </p>
            <p style={{ marginTop: '14px' }}>
              <strong>Write to us at:</strong>
            </p>
            <p>
              <a href="mailto:investorrelations@granulesindia.com">
                investorrelations@granulesindia.com
              </a>
            </p>
          </div>
        </div>
      ) : (
        /* DATA TABLE WITH REPORT NAME, SCOPE, PERIOD, ACTION */
        <div className="inv-table-wrap">
          <table className="inv-data-table">
            <thead>
              <tr>
                <th>REPORT / DOCUMENT NAME</th>
                <th>ENTITY / REPORTING SCOPE</th>
                <th>REPORTING PERIOD</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((doc) => (
                <tr key={doc.id}>
                  <td className="inv-table-title-cell">
                    <span>{doc.title}</span>
                  </td>
                  <td className="inv-table-detail-cell">{doc.scope}</td>
                  <td className="inv-table-period-cell">{doc.period}</td>
                  <td className="inv-table-action-cell">
                    {doc.webUrl ? (
                      <a
                        className="inv-table-btn"
                        href={doc.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`View ${doc.title}`}
                      >
                        <span>View</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                    ) : doc.pdf ? (
                      <a
                        className="inv-table-btn"
                        href={doc.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={`${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`}
                        title={`Download ${doc.title}`}
                      >
                        <span>Download</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </a>
                    ) : (
                      <span className="inv-table-btn inv-table-btn--disabled">Available Soon</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <p style={{ margin: '0 0 12px', fontSize: '15px' }}>
                      No documents found for selected category / year.
                    </p>
                    <button
                      type="button"
                      className="inv-doc-reset-btn"
                      onClick={() => {
                        setActiveSubcatId('all');
                        setSelectedYear('all');
                      }}
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* TABLE FOOTER / PAGINATION BAR */}
          {filteredItems.length > 0 && (
            <div className="inv-table-pagination">
              <span className="inv-pagination-count">
                Showing {Math.min((currentPage - 1) * pageSize + 1, filteredItems.length)}–
                {Math.min(currentPage * pageSize, filteredItems.length)} of {filteredItems.length} documents
                {selectedYear !== 'all' && ` • Year: ${selectedYear}`}
                {activeSubcat && ` • Category: ${activeSubcat.label}`}
              </span>

              {totalPages > 1 && (
                <div className="inv-pagination-actions">
                  <button
                    type="button"
                    className="inv-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>

                  <span className="inv-page-info">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    className="inv-page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

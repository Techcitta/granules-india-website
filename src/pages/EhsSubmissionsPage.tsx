import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './sustainability.css';
import './ehs.css';
import './investor.css';
import { EHS_DOCUMENTS, EhsDocument } from '../data/ehsData';
import { toCdnPdf } from '../lib/pdf';

const FACILITY_ORDER = [
  'Unit 1 - Bonthapally',
  'Gagillapur',
  'Jeedimetla',
  'Granules Life Sciences',
  'Unit 4 - Vizag',
  'Unit 5 - Vizag',
  'PLI Documents',
];

export default function EhsSubmissionsPage() {
  useEffect(() => {
    document.title = 'EHS Documents & Submissions | Granules India Sustainability';
    window.scrollTo(0, 0);
  }, []);

  const groupedDocs = useMemo(() => {
    const groups: { facility: string; items: EhsDocument[] }[] = [];

    FACILITY_ORDER.forEach((fac) => {
      const items = EHS_DOCUMENTS.filter((d) => d.facility === fac);
      if (items.length > 0) {
        groups.push({ facility: fac, items });
      }
    });

    // In case any doc has an unlisted facility:
    EHS_DOCUMENTS.forEach((d) => {
      if (!FACILITY_ORDER.includes(d.facility)) {
        let g = groups.find((grp) => grp.facility === d.facility);
        if (!g) {
          g = { facility: d.facility, items: [] };
          groups.push(g);
        }
        if (!g.items.includes(d)) {
          g.items.push(d);
        }
      }
    });

    return groups;
  }, []);

  return (
    <div className="ehs-root">
      <NavBar />

      <main className="ehs-main">
        <p className="cp-breadcrumb ehs-breadcrumb">
          <Link to="/">HOME</Link>
          <span className="sep">›</span>
          <Link to="/sustainability">SUSTAINABILITY</Link>
          <span className="sep">›</span>
          <span className="current">EHS Submissions</span>
        </p>

        <h1 className="cp-page-title ehs-page-title">EHS Submissions</h1>

        <div className="ehs-container">
          {/* Facility Group Cards */}
          <div className="sus-cert-groups" style={{ marginBottom: '60px' }}>
            {groupedDocs.map((group) => (
              <div key={group.facility} className="sus-cert-card">
                {group.facility !== 'PLI Documents' && (
                  <div className="sus-cert-header">
                    <h3 className="sus-cert-title">{group.facility}</h3>
                  </div>
                )}
                <div className="sus-cert-table-wrap">
                  <table className="sus-cert-table">
                    <tbody>
                      {group.items.map((doc) => (
                        <tr key={doc.id}>
                          <td className="sus-cert-facility">{doc.title}</td>
                          <td className="sus-cert-actions">
                            {doc.pdf ? (
                              <div className="inv-table-actions">
                                <a
                                  className="inv-action-link"
                                  href={toCdnPdf(doc.pdf)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`View ${doc.title}`}
                                >
                                  VIEW
                                </a>
                                <span className="inv-action-slash">/</span>
                                <a
                                  className="inv-action-link"
                                  href={toCdnPdf(doc.pdf)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={`${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`}
                                  title={`Download ${doc.title}`}
                                >
                                  DOWNLOAD
                                </a>
                              </div>
                            ) : (
                              <span className="sus-cert-soon">Download (Available Soon)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <CompanyFooter />
    </div>
  );
}

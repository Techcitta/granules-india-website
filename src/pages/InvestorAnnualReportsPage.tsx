import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavBar, CompanyFooter, CareerSection } from '../components/company';
import '../components/company/company.css';
import './investor.css';

const REPORTS = [
  { year: 'FY25-26', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/2026/07/Granules_Annual-Report-FY26.pdf', visit: false },
  { year: 'FY24-25', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/2025/07/Granules_Integrated-Report-2024-25.pdf', visit: false },
  { year: 'FY23-24', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/2024/07/GranulesIndia-limited-AR-2023-24.pdf', visit: true },
  { year: 'FY22-23', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/Granules-AR-2022-23.pdf', visit: true },
  { year: 'FY21-22', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/2022/09/Annual-Report-2021-22.pdf', visit: false },
  { year: 'FY20-21', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/2022/09/Annual-Report-2020-21.pdf', visit: false },
  { year: 'FY19-20', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/2022/09/Annual-Report-2019-20.pdf', visit: false },
  { year: 'FY18-19', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/3127AnnualReport-FY18-19.pdf', visit: false },
  { year: 'FY17-18', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/8058AnnualReport-FY17-18.pdf', visit: false },
  { year: 'FY16-17', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/2198AR2016-17.pdf', visit: false },
  { year: 'FY15-16', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/2668AnnualReport2015-2016.pdf', visit: false },
  { year: 'FY14-15', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/2427AnnualReport-FY14-15.pdf', visit: false },
  { year: 'FY13-14', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/2027AnnualReport-FY13-14.pdf', visit: false },
  { year: 'FY12-13', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/8742AnnualReport-FY12-13.pdf', visit: false },
  { year: 'FY11-12', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/6127AnnualReport-FY11-12.pdf', visit: false },
  { year: 'FY10-11', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/3268AnnualReport-FY10-11.pdf', visit: false },
  { year: 'FY09-10', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/6181AnnualReport-FY09-10.pdf', visit: false },
  { year: 'FY08-09', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/6994AnnualReport-FY08-09.pdf', visit: false },
  { year: 'FY07-08', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/2157AnnualReport-FY07-08.pdf', visit: false },
  { year: 'FY06-07', pdf: 'https://d16d47oyl512wy.cloudfront.net/pdfs/pdf/6249AnnualReport-FY06-07.pdf', visit: false },
];

export default function InvestorAnnualReportsPage() {
  useEffect(() => {
    document.title = 'Annual Reports — Granules India';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cp">
      <NavBar />

      <p className="cp-breadcrumb" style={{ width: '85%', maxWidth: '85%', margin: 'clamp(60px, 8vw, 118px) auto 0' }}>
        <a href="/">HOME</a>
        <span className="sep">›</span>
        <a href="/investors">INVESTOR</a>
        <span className="sep">›</span>
        <a href="/investors">FINANCIAL REPORTS &amp; PERFORMANCE</a>
        <span className="sep">›</span>
        <span className="current">ANNUAL REPORTS</span>
      </p>

      <div className="inv-detail-head">
        <h1>Annual Reports</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            className="inv-action-link"
            href="https://d16d47oyl512wy.cloudfront.net/pdfs/2026/07/Granules_Annual-Report-FY26.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title="View Latest Annual Report in new tab"
          >
            VIEW LATEST
          </a>
          <span className="inv-action-slash">/</span>
          <a
            className="inv-action-link"
            href="https://d16d47oyl512wy.cloudfront.net/pdfs/2026/07/Granules_Annual-Report-FY26.pdf"
            download="Granules_Annual-Report-FY26.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title="Download Latest Annual Report"
          >
            DOWNLOAD LATEST
          </a>
        </div>
      </div>

      <div className="inv-detail-list">
        {REPORTS.map((report) => (
          <div className="inv-detail-row" key={report.year}>
            <p>Annual Report - {report.year}</p>
            <div className="inv-detail-actions" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <a
                className="inv-action-link"
                href={report.pdf}
                target="_blank"
                rel="noopener noreferrer"
                title={`View Annual Report ${report.year} in new tab`}
              >
                VIEW
              </a>
              <span className="inv-action-slash">/</span>
              <a
                className="inv-action-link"
                href={report.pdf}
                download={`Annual-Report-${report.year}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Download Annual Report ${report.year}`}
              >
                DOWNLOAD
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="inv-detail-back-wrap">
        <Link className="inv-detail-back" to="/investor">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>BACK TO INVESTOR</span>
        </Link>
      </div>

      <CareerSection />

      <CompanyFooter />
    </div>
  );
}

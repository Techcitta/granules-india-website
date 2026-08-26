import { useEffect, useState } from 'react';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './media.css';

const A = '/assets/media/';

const IN_THE_NEWS = [
  {
    date: '11 April 2025',
    title: 'Granules India Acquires Swiss CDMO Senn Chemicals to Enter Peptide Therapeutics Space.',
    image: true,
  },
  {
    date: '24 February 2025',
    title: 'Granules India enters CDMO business by acquiring Senn Chemicals AG.',
    image: true,
  },
  {
    date: '16 January 2025',
    title: 'Granules India AIG Hospitals extend breast cancer screening.',
    image: true,
  },
];

const PRESS_RELEASES = [
  {
    date: '18 May 2025',
    title: 'Granules India transforms BC government boys hostel in Parawada.',
  },
  {
    date: '20 April 2025',
    title: 'Q4FY25 Revenue from operations at INR 11,974 Mn up 2% YoY, EBITDA at INR 2,524 Mn down 1% YoY, PAT at INR 1,520 Mn up 17% YoY.',
  },
  {
    date: '04 April 2025',
    title: 'Granules India Limited extends support to 1,030 TB patients in Bhadradri Kothagudem District.',
  },
  {
    date: '04 May 2025',
    title: 'Granules India earns gold rating in first-ever corporate-level EcoVadis assessment ranks in the top 5% globally across all industries.',
  },
  {
    date: '22 March 2025',
    title: 'Granules India announces closing of acquisition of Senn Chemicals, strengthening capabilities in Peptide therapeutics and CDMO Services.',
  },
];

const MEDIA_KIT = [
  { icon: 'icon-webasset.svg', name: 'Logos' },
  { icon: 'icon-user.svg', name: 'Leadership' },
  { icon: 'icon-building.svg', name: 'Offices Images' },
  { icon: 'icon-video.svg', name: 'Videos' },
];

const SOCIALS = [
  { icon: 'social-linkedin.svg', label: 'LinkedIn' },
  { icon: 'social-x.svg', label: 'X' },
  { icon: 'social-facebook.svg', label: 'Facebook' },
  { icon: 'social-instagram.svg', label: 'Instagram' },
];

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<'news' | 'press'>('news');

  useEffect(() => {
    document.title = 'Granules Newsroom — Granules India';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cp">
      <NavBar />

      <p className="cp-breadcrumb" style={{ width: 'min(1463px, 100% - 3.2rem)', margin: 'clamp(60px, 8vw, 118px) auto 0' }}>
        <span>Homepage</span>
        <span className="sep">{'>'}</span>
        <span className="current">Media</span>
      </p>
      <h1 className="cp-page-title">Granules newsroom</h1>

      <div className="med-hero">
        <span className="med-hero-badge">STOCK IMAGE</span>
      </div>

      <div className="med-tabs-row">
        <div className="med-tabs">
          <button type="button" className={`med-tab${activeTab === 'news' ? ' active' : ''}`} onClick={() => setActiveTab('news')}>
            In the News
          </button>
          <button type="button" className={`med-tab${activeTab === 'press' ? ' active' : ''}`} onClick={() => setActiveTab('press')}>
            Press release
          </button>
        </div>
        <span className="med-year">
          <span>2025</span>
          <img src={`${A}arrow-filled.svg`} alt="" />
        </span>
      </div>
      <div className={`med-tabs-divider${activeTab === 'press' ? ' press' : ''}`} />

      {activeTab === 'news' ? (
        <div className="med-news-list">
          {IN_THE_NEWS.map((item) => (
            <div className="med-news-item with-image" key={item.title}>
              <div className="med-news-image" />
              <div className="med-news-body">
                <div className="med-news-content">
                  <div className="med-news-tags">
                    <span className="med-news-tag">News</span>
                    <span className="med-news-tag">{item.date}</span>
                  </div>
                  <p className="med-news-title">{item.title}</p>
                </div>
                <a className="med-read-more" href="/#footer">Read More</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="med-news-list">
            {PRESS_RELEASES.map((item) => (
              <div className="med-news-item" key={item.title}>
                <div className="med-news-body">
                  <div className="med-news-content">
                    <div className="med-news-tags">
                      <span className="med-news-tag">Press Release</span>
                      <span className="med-news-tag">{item.date}</span>
                    </div>
                    <p className="med-news-title" style={{ fontSize: 30 }}>{item.title}</p>
                  </div>
                  <a className="med-read-more" href="/#footer">Read More</a>
                </div>
              </div>
            ))}
          </div>
          <div className="med-pagination" style={{ marginTop: 40 }}>
            <button type="button" className="med-page-btn nav up" aria-label="Previous page">
              <img src={`${A}pagination-arrow-left.svg`} alt="" />
            </button>
            {['01', '02', '....', '08'].map((p, i) => (
              <button type="button" key={p} className={`med-page-btn${i === 0 ? ' active' : ''}`}>{p}</button>
            ))}
            <button type="button" className="med-page-btn nav up" aria-label="Next page">
              <img src={`${A}pagination-arrow-right.svg`} alt="" />
            </button>
          </div>
        </>
      )}

      <div className="med-report">
        <div className="med-report-copy">
          <h2>2024 Integrated Annual Report</h2>
          <a className="med-report-btn" href="/#footer">View Report</a>
        </div>
        <div className="med-report-image" />
      </div>

      <div className="med-kit">
        <h2>Media kit</h2>
        <div className="med-kit-grid">
          {MEDIA_KIT.map((item) => (
            <a className="med-kit-item" href="/#footer" key={item.name}>
              <div className="med-kit-icon">
                <img src={`${A}${item.icon}`} alt="" />
              </div>
              <div className="med-kit-text">
                <p className="name">{item.name}</p>
                <p className="action">Download Asset</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="med-follow">
        <h2>Follow us for updates and company news</h2>
        <div className="med-follow-icons">
          {SOCIALS.map((social) => (
            <a className="med-follow-icon" href="/#footer" key={social.label} aria-label={social.label}>
              <img src={`${A}${social.icon}`} alt="" />
            </a>
          ))}
        </div>
      </div>

      <CompanyFooter />
    </div>
  );
}

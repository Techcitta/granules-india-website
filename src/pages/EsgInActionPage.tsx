import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './sustainability.css';
import './esg.css';

const S = '/assets/esg/';

const PILLAR_NAV = [
  { id: 'environment', label: 'Environment' },
  { id: 'social', label: 'Social' },
  { id: 'governance', label: 'Governance' },
];

const ENV_SUB_TABS = ['GHG Emissions', 'Water Management', 'Waste Management', 'Biodiversity Management'];
const SOCIAL_SUB_TABS = ['Learning and Development', 'Community'];

const GOVERNANCE_STATS = [
  { value: '98.6%', label: 'Board meeting attendance' },
  { value: '06', label: 'Independent directors' },
  { value: '03', label: 'Women on the Board' },
  { value: 'ZERO', label: 'Product recalls' },
  { value: 'ZERO', label: 'Cybersecurity complaints' },
];

export default function EsgInActionPage() {
  useEffect(() => {
    document.title = 'ESG in Action — Granules India';
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="cp">
      <NavBar />

      <p className="cp-breadcrumb" style={{ width: 'min(1463px, 100% - 3.2rem)', margin: 'clamp(60px, 8vw, 118px) auto 0' }}>
        <span>Homepage</span>
        <span className="sep">{'>'}</span>
        <span>Sustainability</span>
        <span className="sep">{'>'}</span>
        <span className="current">ESG in action</span>
      </p>
      <h1 className="cp-page-title">ESG in action</h1>
      <div className="cp-hero-banner">
        <img src={`${S}hero-banner.png`} alt="Granules ESG impact" />
      </div>

      <div className="sus-intro">
        <p>
          At Granules, our responsibility extends beyond products to people and the planet. Every
          action we take reflects our ambition to become a trusted, long-term partner for
          companies seeking a resilient, sustainable, and ethical pharmaceutical supply chain.{' '}
          <span className="muted">Whether it&rsquo;s decarbonizing our value chain, investing in local communities, or reinforcing transparent governance &mdash; we act with clarity, urgency, and accountability.</span>
        </p>
      </div>

      <div className="sus-pillar-tabs" style={{ marginTop: 'clamp(40px, 5vw, 60px)' }}>
        {PILLAR_NAV.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="sus-pillar-tab"
            style={{ borderColor: '#0061f8', color: '#0061f8' }}
            onClick={() => scrollTo(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="esg-pillar-section" id="environment">
        <div className="esg-pillar-head">
          <h2>Creating a future where earth thrives</h2>
          <p>
            Climate change impacts health, economies, and the very systems that support our
            industry. We are responding with bold, measurable action, minimizing emissions,
            conserving water, and reducing waste across all sites and suppliers.
          </p>
        </div>
        <div className="sus-pillar-tabs" style={{ marginBottom: 24 }}>
          {ENV_SUB_TABS.map((tab, index) => (
            <span key={tab} className={`sus-pillar-tab${index === 0 ? ' active' : ''}`} style={{ background: index === 0 ? '#197b0c' : '#fff', borderColor: '#00bc1b', color: index === 0 ? '#fff' : '#197b0c', cursor: 'default' }}>
              {tab}
            </span>
          ))}
        </div>
        <div className="sus-event" style={{ background: '#eefff1', color: '#197b0c' }}>
          <div className="sus-event-copy">
            <h3 className="sus-event-title">GHG Emissions</h3>
            <p className="sus-event-desc" style={{ color: '#070707' }}>
              Granules is decoupling emissions from production, building a future-proof,
              low-carbon pharma platform.
            </p>
            <div className="sus-event-stats">
              <div className="sus-stat">
                <p className="sus-stat-value">32.2%</p>
                <p className="sus-stat-label">Absolute reduction in Scope 1 &amp; 2 emissions since FY23</p>
              </div>
            </div>
          </div>
          <div className="esg-carousel">
            {['env-1.png', 'env-2.png', 'env-3.png', 'env-4.png'].map((img) => (
              <img key={img} src={`${S}${img}`} alt="Environment sustainability initiative" />
            ))}
          </div>
        </div>
      </section>

      <section className="esg-pillar-section" id="social">
        <div className="esg-pillar-head">
          <h2>Our employees, our strength for tomorrow</h2>
          <p>
            We recognise that the skills and dedication of our teams play a vital role in
            achieving operational efficiency, advancing pharmaceutical innovation, and enabling
            sustainable business growth.
          </p>
        </div>
        <div className="sus-pillar-tabs" style={{ marginBottom: 24 }}>
          {SOCIAL_SUB_TABS.map((tab, index) =>
            tab === 'Community' ? (
              <Link
                key={tab}
                to="/sustainability/esg-in-action/community"
                className="sus-pillar-tab"
                style={{ background: '#fff', borderColor: '#0061f8', color: '#0061f8' }}
              >
                {tab}
              </Link>
            ) : (
              <span key={tab} className={`sus-pillar-tab${index === 0 ? ' active' : ''}`} style={{ background: index === 0 ? '#0061f8' : '#fff', borderColor: '#0061f8', color: index === 0 ? '#fff' : '#0061f8', cursor: 'default' }}>
                {tab}
              </span>
            )
          )}
        </div>
        <div className="sus-event" style={{ background: '#ebf9ff', color: '#0061f8' }}>
          <div className="sus-event-copy">
            <span className="sus-event-badge" style={{ borderColor: '#0061f8', color: '#0061f8' }}>01 / 04</span>
            <h3 className="sus-event-title">Learning and Development</h3>
            <p className="sus-event-desc" style={{ color: '#070707' }}>
              We have upskilled employees with practical and industry-relevant knowledge, ensuring
              they remain at the forefront of innovation and excellence.
            </p>
            <div className="sus-event-stats">
              <div className="sus-stat">
                <p className="sus-stat-value">4,01,110</p>
                <p className="sus-stat-label">Training Hours</p>
              </div>
            </div>
          </div>
          <div className="esg-carousel">
            {['social-1.png', 'social-2.png'].map((img) => (
              <img key={img} src={`${S}${img}`} alt="Social impact initiative" />
            ))}
          </div>
        </div>
      </section>

      <section className="esg-pillar-section" id="governance">
        <div className="esg-pillar-head">
          <h2>Setting direction for a stronger tomorrow</h2>
          <p>
            The Board of Directors at Granules India sets the overall vision, strategic direction
            and long-term objectives of the Company. It provides oversight into financial and
            operational matters, while regularly reviewing the performance of senior management.
          </p>
        </div>
        <div className="sus-event" style={{ background: '#f4f0ff', color: '#7248f5' }}>
          <div className="sus-event-copy">
            <h3 className="sus-event-title">Board Composition</h3>
            <p className="sus-event-desc" style={{ color: '#070707' }}>
              Our Board comprises industry experts with diverse backgrounds, who offer us valuable
              insights into our diverse business practices.
            </p>
            <div className="sus-event-stats">
              {GOVERNANCE_STATS.map((stat) => (
                <div className="sus-stat" key={stat.label} style={{ minWidth: 140 }}>
                  <p className="sus-stat-value" style={{ fontSize: 40 }}>{stat.value}</p>
                  <p className="sus-stat-label" style={{ fontSize: 15 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="sus-event-image">
            <img src={`${S}governance-1.png`} alt="Board of Directors" />
          </div>
        </div>
      </section>

      <div className="sus-cta" style={{ marginTop: 'clamp(100px, 12vw, 140px)' }}>
        <img className="bg" src={`${S}cta-bg.png`} alt="" />
        <div className="overlay" />
        <div className="sus-cta-copy">
          <h2>Lorem ipsum convallis consectetur</h2>
          <p>Lorem ipsum dolor sit amet consectetur. Ipsum magna a ac nibh morbi malesuada molestie mauris.</p>
        </div>
        <a className="cp-cta-btn" href="/#investor">Integrated Report</a>
      </div>

      <CompanyFooter />
    </div>
  );
}

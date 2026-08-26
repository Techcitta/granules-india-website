import { useEffect, useState } from 'react';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import '../pages/business.css';
import './sustainability.css';
import './strategy.css';

const S = '/assets/strategy/';

type Pillar = {
  key: string;
  badge: string;
  title: string;
  desc: string;
  headline: { value: string; label: string };
  color: string;
  bg: string;
  image: string;
};

const COMMON_METRICS = [
  { value: '82,735 MWh', label: 'Electricity Consumed' },
  { value: '69%', label: 'Electricity from renewable sources (PPA, rooftop solar, I-RECs)' },
  { value: '1MW', label: 'Installed rooftop solar capacity at Gagillapur' },
  { value: '881 TJ', label: 'Energy Consumed' },
  { value: '24%', label: 'Total energy sourced from renewables' },
  { value: '2,16,823 KL', label: 'Water Consumed' },
  { value: '44%', label: 'Wastewater recycled and reused' },
  { value: '80%', label: 'Hazardous waste safely co-processed' },
];

const PILLARS: Pillar[] = [
  {
    key: 'environment',
    badge: 'Environment',
    title: 'Environmental Stewardship Beyond Limits',
    desc: '',
    headline: { value: '42%', label: 'Absolute reduction in Scope 1 and 2 emissions since FY23' },
    color: '#197b0c',
    bg: '#eefff1',
    image: 'pillar-environment.png',
  },
  {
    key: 'social',
    badge: 'Social',
    title: 'Breaking Barriers',
    desc: '',
    headline: { value: '6,166', label: 'Total Workforce' },
    color: '#0061f8',
    bg: '#ebf9ff',
    image: 'pillar-social.png',
  },
  {
    key: 'governance',
    badge: 'Governance',
    title: 'Integrity in Action',
    desc: '',
    headline: { value: '25%', label: 'Representation of women on the Board' },
    color: '#7248f5',
    bg: '#f4f0ff',
    image: 'pillar-governance.png',
  },
];

const CARBON_STATS = [
  { value: '80%', label: 'of emissions are Scope 3 (raw materials, logistics, and supply chain) actively tracked and managed' },
  { value: '65%', label: 'of products have verified carbon footprint data' },
  { value: 'Supplier', label: 'carbon assessments embedded in sourcing' },
  { value: 'SBTi', label: 'aligned Net Zero roadmap by 2050 underway' },
];

type GreenItem = { title: string; body?: string; tags?: string[]; icon?: string };

const GREEN_ITEMS: GreenItem[] = [
  {
    title: 'CZRO: India’s Green Pharma Manufacturing Hub',
    tags: ['100% by Renewable Energy', 'Built with Circularity-first Design Principles', 'Uses Green Molecules: Hydrogen, Ammonia, Methanol'],
    icon: 'icon-windmill.svg',
  },
  { title: 'Green Chemistry' },
  { title: 'Sustainable Formulations' },
];

export default function SustainabilityStrategyPage() {
  const [open, setOpen] = useState(0);

  useEffect(() => {
    document.title = 'Sustainability Strategy — Granules India';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cp">
      <NavBar />

      <p className="cp-breadcrumb" style={{ width: 'min(1463px, 100% - 3.2rem)', margin: 'clamp(60px, 8vw, 118px) auto 0' }}>
        <span>Homepage</span>
        <span className="sep">{'>'}</span>
        <span>Sustainability</span>
        <span className="sep">{'>'}</span>
        <span className="current">Sustainability strategy</span>
      </p>
      <h1 className="cp-page-title">Sustainability strategy</h1>

      <div className="sus-intro">
        <p>
          At Granules, sustainability is embedded into every molecule we develop, every factory
          we build, and every partnership we forge. Built for impact and innovation, our strategy
          aligns with global ESG standards, paving the way for a Net Zero pharmaceutical future
          that values people, planet, and progress.
        </p>
        <p className="muted" style={{ marginTop: 16 }}>
          Committed to sustainable pharmaceutical manufacturing, Granules integrates ESG deep into
          the supply chain to reduce carbon footprint, mitigate risks, and support responsible
          sourcing goals. Backed by Board-level oversight and aligned with global standards like
          SBTi, GRI, and UNGC, we collaborate with academia, governments, and grassroots
          organizations to scale sustainable solutions &mdash; from clean energy adoption to
          inclusive employment and transparent governance. Transparent ESG tracking across all
          operations, including subsidiaries, ensures accountability and momentum toward Net Zero.
        </p>
      </div>

      <div className="sus-section-head">
        <div className="copy">
          <h2>Our strategic framework</h2>
        </div>
        <a className="cp-cta-btn" href="/sustainability/esg-in-action">ESG Delivery in Action</a>
      </div>

      {PILLARS.map((pillar) => (
        <div className="sus-event" style={{ background: pillar.bg, color: pillar.color }} key={pillar.key}>
          <div className="sus-event-copy">
            <span className="sus-event-badge" style={{ borderColor: pillar.color, color: pillar.color }}>{pillar.badge}</span>
            <h3 className="sus-event-title">{pillar.title}</h3>
            <div className="sus-stat">
              <p className="sus-stat-value">{pillar.headline.value}</p>
              <p className="sus-stat-label">{pillar.headline.label}</p>
            </div>
            <div className="sus-event-stats">
              {COMMON_METRICS.map((metric) => (
                <div className="sus-stat" key={pillar.key + metric.label} style={{ minWidth: 180 }}>
                  <p className="sus-stat-value" style={{ fontSize: 28 }}>{metric.value}</p>
                  <p className="sus-stat-label" style={{ fontSize: 13 }}>{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="sus-event-image">
            <img src={`${S}${pillar.image}`} alt={pillar.title} />
          </div>
        </div>
      ))}

      <div className="strat-carbon">
        <div className="strat-carbon-copy">
          <h2>From carbon footprint to carbon-free</h2>
        </div>
        <div className="strat-carbon-stats">
          <div className="strat-carbon-track">
            {CARBON_STATS.map((stat) => (
              <div className="strat-carbon-item" key={stat.label}>
                <p className="sus-stat-value">{stat.value}</p>
                <p className="sus-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="biz-panel" style={{ marginTop: 'clamp(60px, 8vw, 90px)' }}>
        <img className="bg" src={`${S}green-science-bg.png`} alt="" />
        <div className="overlay" />
        <div className="biz-panel-grid">
          <div className="biz-panel-head">
            <h2>Green science in motion</h2>
            <p>
              Granules is reinventing pharmaceutical manufacturing to be low-emission, low-waste,
              and high-precision, without compromising quality or scalability.
            </p>
          </div>
          <div className="biz-accordion">
            {GREEN_ITEMS.map((item, index) => {
              const isOpen = open === index;
              return (
                <button
                  key={item.title}
                  type="button"
                  className={`biz-accordion-item${isOpen ? '' : ' collapsed'}`}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  style={isOpen && item.tags ? { background: '#f2fff3' } : undefined}
                >
                  <div className="biz-accordion-head">
                    <div className="biz-accordion-icon-row">
                      {item.icon && isOpen && (
                        <span className="biz-accordion-icon" style={{ background: 'linear-gradient(180deg, #6cff81, #19c308)' }}>
                          <img src={`${S}${item.icon}`} alt="" />
                        </span>
                      )}
                      <p className="biz-accordion-title" style={{ color: isOpen && item.tags ? '#197b0c' : 'var(--blue)' }}>{item.title}</p>
                    </div>
                    <span className="biz-accordion-toggle">
                      <img src={`${S}${isOpen ? 'icon-minus.svg' : 'icon-plus.svg'}`} alt="" />
                    </span>
                  </div>
                  {isOpen && item.tags && (
                    <div className="strat-tags">
                      {item.tags.map((tag) => (
                        <span className="strat-tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="sus-cta">
        <img className="bg" src={`${S}cta-bg.png`} alt="" />
        <div className="overlay" />
        <div className="sus-cta-copy">
          <h2>Reimagining pharma for a carbon-free future</h2>
          <p>
            Granules CZRO is driving Net Zero transformation through green molecules, renewable
            energy, and circular pharmaceutical manufacturing.
          </p>
        </div>
        <a className="cp-cta-btn" href="/company/granules-czro">Discover CZRO</a>
      </div>

      <CompanyFooter />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './sustainability.css';
import './overview.css';

const S = '/assets/sustainability/';

const PILLARS = [
  { key: 'environment', title: 'Environment Stewardship', image: 'card-environment.png' },
  { key: 'social', title: 'Breaking Barriers', image: 'card-breaking-barriers.png' },
  { key: 'governance', title: 'Integrity in Action', image: 'card-integrity.png' },
] as const;

const GOAL_2030_STATS = [
  { value: '42%', label: 'Reduction in Scope 1 and 2 emissions' },
  { value: '42%', label: 'Cut in Scope 3 emissions' },
  { value: '100%', label: 'Sourcing of renewable electricity' },
  { value: 'Zero', label: 'Waste to Landfill achievement' },
  { value: '1million+', label: 'Lives impacted through CSR programs' },
  { value: 'Gender', label: 'Pay parity attained' },
  { value: '100%', label: "Increase in women's employment achieved" },
];

type JourneyYear = { year: string; items?: string[]; hasContent: boolean };

const JOURNEY_YEARS: JourneyYear[] = [
  { year: '2008', hasContent: false },
  { year: '2020', hasContent: false },
  {
    year: '2023',
    hasContent: true,
    items: [
      'Conducted comprehensive GHG inventorization across the value chain, including subsidiaries.',
      'Submitted SBTi net-zero commitment and established UNGC partnership.',
      'Completed Product Carbon Footprint (PCF) analysis for 65% of sales.',
      'Advanced the supplier sustainability program.',
    ],
  },
  { year: '2025', hasContent: false },
];

const PARTNERSHIP_TABS = [
  {
    label: 'OUR COMMITMENT',
    logos: [
      { img: 'logo-sbt.png', name: 'Science Based Targets initiative' },
      { img: 'logo-2.png', name: 'UN Global Compact' },
      { img: 'logo-psci.png', name: 'PSCI' },
      { img: 'logo-scan.png', name: 'SCAN' },
    ],
  },
  {
    label: 'RATINGS AND CERTIFICATIONS',
    logos: [
      { img: 'logo-ecovadis.svg', name: 'EcoVadis Gold' },
      { img: 'logo-cdp-discloser.svg', name: 'CDP Discloser 2024' },
      { img: 'logo-cdp-supplier.svg', name: 'CDP Supplier Engagement Leader' },
      { img: 'logo-gptw.svg', name: 'Great Place To Work' },
      { img: 'logo-sp-global.svg', name: 'S&P Global CSA Score' },
      { img: 'logo-msci-esg.svg', name: 'MSCI ESG Ratings BBB' },
    ],
  },
  {
    label: 'MEMBERSHIP AND ASSOCIATIONS',
    logos: [
      { img: 'logo-wef-telangana.svg', name: 'World Economic Forum C4IR Telangana' },
      { img: 'logo-cii.svg', name: 'Confederation of Indian Industry' },
      { img: 'logo-bdmai.svg', name: 'BDMAI' },
      { img: 'logo-british-safety.svg', name: 'British Safety Council' },
      { img: 'logo-esg-world.svg', name: 'ESG World' },
      { img: 'logo-ftapcci.svg', name: 'FTAPCCI' },
      { img: 'logo-green-triangle.svg', name: 'Green Triangle Society' },
    ],
  },
  {
    label: 'COLLABORATION PLATFORMS',
    logos: [
      { img: 'logo-project-gigaton.svg', name: 'Project Gigaton' },
      { img: 'logo-sedex-smeta.svg', name: 'Sedex SMETA' },
      { img: 'logo-manufacture-2030.svg', name: 'Manufacture 2030' },
    ],
  },
];

export default function SustainabilityOverviewPage() {
  const [journeyIndex, setJourneyIndex] = useState(2);
  const [partnershipTab, setPartnershipTab] = useState(0);

  useEffect(() => {
    document.title = 'Sustainability Overview — Granules India';
    window.scrollTo(0, 0);
  }, []);

  const activeYear = JOURNEY_YEARS[journeyIndex];

  return (
    <div className="cp">
      <NavBar />

      <p className="cp-breadcrumb" style={{ width: 'min(1463px, 100% - 3.2rem)', margin: 'clamp(60px, 8vw, 118px) auto 0' }}>
        <span>Homepage</span>
        <span className="sep">{'>'}</span>
        <span className="current">Sustainability Overview</span>
      </p>
      <h1 className="cp-page-title">One planet. One purpose.</h1>
      <div className="cp-hero-banner">
        <img src={`${S}hero-banner.png`} alt="Granules solar sustainability" />
      </div>

      <div className="sus-intro">
        <p>
          Guided by our vision of healing lives responsibly through pioneering green science, we
          drive innovation that balances environmental stewardship, social impact,{' '}
          <span className="muted">and business excellence—building a future-ready pharmaceutical industry.</span>
        </p>
      </div>

      <div className="sus-section-head">
        <div className="copy">
          <span className="cp-section-badge">Our ESG Pillars</span>
          <h2>Leading with green science and responsible growth</h2>
        </div>
        <a className="cp-cta-btn" href="/sustainability/strategy">Explore ESG Strategy</a>
      </div>

      <div className="sus-pillar-grid">
        {PILLARS.map((pillar) => (
          <article className={`sus-pillar-card sus-pillar--${pillar.key}`} key={pillar.key}>
            <img className="bg" src={`${S}${pillar.image}`} alt="" />
            <div className="sus-pillar-label">
              <span>{pillar.title}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="ov-goals">
        <h2>Our sustainability goals</h2>
        <div className="ov-goals-row">
          <div className="ov-goal-peek"><span>2050</span></div>
          <div className="ov-goal-card">
            <div className="ov-goal-copy">
              <h3>By 2030</h3>
              <div className="ov-goal-stats">
                {GOAL_2030_STATS.map((stat) => (
                  <div className="sus-stat" key={stat.label}>
                    <p className="sus-stat-value">{stat.value}</p>
                    <p className="sus-stat-label" style={{ color: 'var(--n7)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="ov-goal-image">
              <img src={`${S}goal-2030-image.png`} alt="Sustainability goal 2030" />
            </div>
          </div>
          <div className="ov-goal-peek"><span>2032</span></div>
        </div>
      </div>

      <h2 style={{ margin: 'clamp(60px, 8vw, 90px) auto clamp(24px, 3vw, 40px)', width: 'min(1465px, 100% - 3.2rem)', font: "500 clamp(28px, 4vw, 50px)/1.1 'Manrope', sans-serif", color: 'var(--n9)' }}>
        Leadership commitment
      </h2>
      <div className="ov-leadership">
        <img className="ov-leadership-bg" src={`${S}leadership-bg.png`} alt="" />
        <div className="ov-leadership-overlay" />
        <img className="ov-leadership-person" src={`${S}leadership-portrait.png`} alt="Dr. Krishna Prasad Chigurupati" />
        <div className="ov-quote-card">
          <div className="ov-quote-mark">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="#0061f8">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          <p className="ov-quote-text">
            The pharmaceutical industry has a dual responsibility: to heal lives and the planet.
            At Granules, sustainability is not an add-on. It is the core of our business.
          </p>
          <p className="ov-quote-name">Dr. Krishna Prasad Chigurupati</p>
          <p className="ov-quote-role">CHAIRMAN AND MANAGING DIRECTOR</p>
        </div>
      </div>

      <div className="ov-journey">
        <h2>Our journey</h2>
        <div className="ov-journey-tabs">
          {JOURNEY_YEARS.map((y, index) => (
            <button
              key={y.year}
              type="button"
              className={`ov-journey-tab${index === journeyIndex ? ' active' : ''}`}
              onClick={() => setJourneyIndex(index)}
            >
              {y.year}
            </button>
          ))}
        </div>
        {activeYear.hasContent ? (
          <div className="ov-journey-card">
            <div className="ov-journey-image">
              <img src={`${S}journey-2023.png`} alt="Granules sustainability journey 2023" />
            </div>
            <div className="ov-journey-list">
              {activeYear.items!.map((item) => (
                <div className="ov-journey-item" key={item}>
                  <img src={`${S}icon-check.svg`} alt="" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#197b0c', font: "500 20px/1.4 'Manrope', sans-serif" }}>
            Milestone details for {activeYear.year} will be published soon.
          </p>
        )}
      </div>

      <div className="ov-partnerships">
        <h2>Partnerships, collaborations and ratings</h2>
        <div className="ov-p-tabs">
          {PARTNERSHIP_TABS.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              className={`ov-p-tab${index === partnershipTab ? ' active' : ''}`}
              onClick={() => setPartnershipTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="ov-logo-grid">
          {PARTNERSHIP_TABS[partnershipTab].logos.map((logo) => (
            <div className="ov-logo-tile" key={logo.img}>
              <img src={`${S}${logo.img}`} alt={logo.name} />
            </div>
          ))}
        </div>
      </div>

      <div className="sus-cta">
        <img className="bg" src={`${S}cta-bg.png`} alt="" />
        <div className="overlay" />
        <div className="sus-cta-copy">
          <h2>Building a sustainable tomorrow</h2>
          <p>
            Sustainability is central to Granules&rsquo; strategy, integrating science, people,
            and planet to drive long-term, responsible growth.
          </p>
        </div>
        <a className="cp-cta-btn" href="/sustainability/strategy">Sustainability Strategy</a>
      </div>

      <CompanyFooter />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './sustainability.css';
import './community.css';

const S = '/assets/esg/';

const CATEGORIES = ['Health', 'Skilling & Education', 'Environment and Biodiversity'] as const;

const EVENTS: Record<(typeof CATEGORIES)[number], {
  badge: string;
  title: string;
  desc: string;
  stats: { value: string; label: string }[];
}> = {
  Health: {
    badge: '01 / 03',
    title: 'Mobile Mammography Services',
    desc: 'A mobile mammography unit was deployed to provide early detection and raise awareness about breast cancer among underserved women, enabling timely medical intervention.',
    stats: [
      { value: '2,500+', label: 'Women benefitted' },
      { value: '95%', label: 'From vulnerable and marginalised groups' },
      { value: '5,000+', label: 'Women reached through awareness programs' },
    ],
  },
  'Skilling & Education': {
    badge: '01 / 04',
    title: 'Pharma Pathashala',
    desc: 'A flagship skill development initiative, launched with Swarna Bharat Trust, the program addresses high youth unemployment and the gap in science-based vocational education by training youth in pharmaceutical operations like production, quality control, and R&D.',
    stats: [
      { value: '1,450+', label: 'Rural youth trained since 2017' },
      { value: '100%', label: 'Of graduates placed in pharma jobs' },
    ],
  },
  'Environment and Biodiversity': {
    badge: '01 / 03',
    title: 'Granules Green — Kanha Run',
    desc: 'As the title sponsor, Granules supported a wellness-focused community event organized by the Heartfulness Institute to promote health and fitness.',
    stats: [
      { value: '3,500+', label: 'Runners participated' },
    ],
  },
};

export default function CommunityPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>('Health');
  const event = EVENTS[active];

  useEffect(() => {
    document.title = 'Community — Granules India';
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
        <span>esg</span>
        <span className="sep">{'>'}</span>
        <span className="current">Community</span>
      </p>
      <h1 className="cp-page-title">Community</h1>
      <div className="cp-hero-banner com-event-placeholder" style={{ borderRadius: 40 }}>
        <span>Community imagery coming soon</span>
      </div>

      <div className="sus-intro">
        <p>
          We believe lasting progress comes from strong, meaningful relationships with our
          communities and stakeholders.{' '}
          <span className="muted">
            Guided by empathy and responsibility, we support healthcare, education, and social
            development, creating long-term value beyond business.
          </span>
        </p>
      </div>

      <div className="sus-pillar-tabs" style={{ marginTop: 'clamp(40px, 5vw, 60px)' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`sus-pillar-tab${cat === active ? ' active' : ''}`}
            style={{
              background: cat === active ? '#0061f8' : '#fff',
              borderColor: '#0061f8',
              color: cat === active ? '#fff' : '#0061f8',
            }}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="com-event">
        <div className="com-event-copy">
          <div className="com-event-title-block">
            <span className="com-event-badge">{event.badge}</span>
            <h2 className="com-event-title">{event.title}</h2>
            <p className="com-event-desc">{event.desc}</p>
          </div>
          <div className="com-event-stats">
            {event.stats.map((stat) => (
              <div className="com-stat" key={stat.label}>
                <p className="com-stat-value">{stat.value}</p>
                <p className="com-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="com-event-placeholder">
          <span>Event photography coming soon</span>
        </div>
      </div>

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

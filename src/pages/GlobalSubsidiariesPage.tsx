import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavBar, CompanyFooter } from '../components/company';
import '../components/company/company.css';
import './subsidiaries.css';

type SubsidiaryItem = {
  index: string;
  name: string;
  image: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  isExternal?: boolean;
};

const SUBSIDIARY_ITEMS: SubsidiaryItem[] = [
  {
    index: '01',
    name: 'Granules Pharmaceuticals Inc.',
    image: '/assets/company/gpi-facility.webp',
    description:
      "R&D and manufacturing facility producing oral solid dosage forms and drives commercialisation of products manufactured at Granules' India facility.",
    ctaText: 'Learn More',
    ctaHref: 'https://www.granulespharma.com/',
    isExternal: true,
  },
  {
    index: '02',
    name: 'Senn Tides India Private Limited',
    image: '/assets/ascelis/hero-banner.webp',
    description:
      'Advancing peptide-based therapies through specialized CDMO capabilities.',
    ctaText: 'Learn More',
    ctaHref: '/company/senn-tides',
  },
  {
    index: '03',
    name: 'Granules CZRO',
    image: '/assets/czro/hero-banner.webp',
    description:
      'Integrating sustainability through green chemistry, circular manufacturing, and net-zero innovation.',
  },
  {
    index: '04',
    name: 'Granules Life Sciences',
    image: '/assets/gls/hero-banner.webp',
    description:
      'State-of-the-art oral solid facility designed to accelerate the next phase of growth in regulated markets through quality, innovation and manufacturing excellence.',
    ctaText: 'Learn More',
    ctaHref: '/company/granules-life-sciences',
  },
];

export default function GlobalSubsidiariesPage() {
  useEffect(() => {
    document.title = 'Global Subsidiaries — Granules India';

    const descriptionContent =
      'Explore Granules India global subsidiaries: Granules Pharmaceuticals Inc., Senn Tides India Private Limited, Granules CZRO, and Granules Life Sciences.';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', descriptionContent);

    window.scrollTo(0, 0);
  }, []);

  const renderCard = (sub?: SubsidiaryItem) => {
    if (!sub) return null;
    const hasCta = Boolean(sub.ctaText && sub.ctaHref);
    const ctaInner = hasCta ? (
      <>
        <span>{sub.ctaText}</span>
        <span className="global-sub-cta-icon-circle" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </span>
      </>
    ) : null;

    return (
      <article className="global-sub-card" key={sub.name}>
        <div className="global-sub-card-media">
          <span className="global-sub-card-index">{sub.index}</span>
          <img src={sub.image} alt={sub.name} loading="lazy" decoding="async" />
        </div>
        <div className="global-sub-card-content">
          <h3 className="global-sub-card-title">{sub.name}</h3>
          <p className="global-sub-card-desc">{sub.description}</p>
          {hasCta && (
            <div className="global-sub-card-action">
              {sub.isExternal ? (
                <a
                  href={sub.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="global-sub-card-cta"
                >
                  {ctaInner}
                </a>
              ) : (
                <Link to={sub.ctaHref!} className="global-sub-card-cta">
                  {ctaInner}
                </Link>
              )}
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="cp global-subsidiaries-page">
      <NavBar />

      <p className="cp-breadcrumb">
        <Link to="/">HOME</Link>
        <span className="sep">›</span>
        <Link to="/company">ABOUT US</Link>
        <span className="sep">›</span>
        <span className="current">GLOBAL SUBSIDIARIES</span>
      </p>

      <h1 className="cp-page-title">Global Subsidiaries</h1>

      <div className="global-sub-hero-banner">
        <img
          src="/assets/company/values-bg-2.webp"
          alt="Granules India Global Subsidiaries"
          loading="eager"
          decoding="async"
        />
        <div className="global-sub-hero-overlay" />
      </div>

      {/* Intro Section */}
      <div className="global-sub-intro">
        <h4>
          With strategically differentiated offerings, our subsidiaries play a vital role in enabling us to deliver high-quality, affordable, and sustainable healthcare solutions to patients worldwide.
        </h4>
        <h4>
          Beyond driving business growth, our subsidiaries help drive a shared commitment to common values, consistent standards, and a collective focus on creating long-term value for patients, partners, communities, and the planet.
        </h4>
      </div>

      {/* 4 Featured Subsidiaries Showcase - Staggered Columns matching R&D page */}
      <section className="global-sub-section" aria-label="Global Subsidiaries">
        <div className="global-sub-columns">
          <div className="global-sub-col">
            {[SUBSIDIARY_ITEMS[0], SUBSIDIARY_ITEMS[2]].map(renderCard)}
          </div>
          <div className="global-sub-col global-sub-col--staggered">
            {[SUBSIDIARY_ITEMS[1], SUBSIDIARY_ITEMS[3]].map(renderCard)}
          </div>
        </div>
      </section>

      <CompanyFooter />
    </div>
  );
}

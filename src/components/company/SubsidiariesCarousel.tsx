import { Link } from 'react-router-dom';

export default function SubsidiariesCarousel() {
  return (
    <section className="cp-subsidiaries" id="subsidiaries" aria-label="Global Subsidiaries">
      <div className="shell cp-shell">
        <h2 className="cp-sub-title">Global Subsidiaries</h2>
        <p className="cp-sub-copy">
          Our subsidiaries play a vital role in advancing Granules’ integrated business model across
          the pharmaceutical value chain. Strategically located, they enhance our ability to deliver
          affordable, high-quality healthcare solutions while maintaining a reliable and agile global
          supply chain.
        </p>
        <div className="cp-sub-cta-wrap">
          <Link to="/company/global-subsidiaries" className="cp-cta-btn">
            Explore Global Subsidiaries
          </Link>
        </div>
      </div>
    </section>
  );
}

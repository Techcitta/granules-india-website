import { Link } from 'react-router-dom';
import { asset } from './constants';
import { FOOTER_SOCIALS } from './data';

export default function CompanyFooter() {
  return (
    <footer className="cp-footer">
      <img className="cp-bg" src={asset('footer-bg.png')} alt="" />
      <div className="cp-bg-overlay" />
      <div className="cp-footer-inner">
        <div className="cp-footer-top">
          <div className="cp-footer-brand">
            <div className="cp-footer-logo">
              <img src={asset('footer-logo.png')} alt="Granules" />
            </div>
            <p>
              Granules India, headquartered in Hyderabad, is a vertically integrated pharma
              manufacturer delivering APIs, PFIs, and FDs globally with regulatory-compliant
              operations in India, US and Europe ensuring quality, scale, and sustainability.
            </p>
          </div>
          <div className="cp-footer-cols">
            <div className="cp-footer-col">
              <h5>Products</h5>
              <Link to="/business/api">Active Pharmaceutical Ingredients</Link>
              <Link to="/business/pfi">Pharmaceutical Formulation Intermediates</Link>
              <Link to="/business/fd">Finished Dosages</Link>
              <Link to="/business/peptides">Peptides</Link>
            </div>
            <div className="cp-footer-col cp-footer-impact">
              <h5 className="cp-visually-hidden">Impact</h5>
              <Link to="/company">Company</Link>
              <Link to="/sustainability">Sustainability</Link>
              <Link to="/investor">Investors</Link>
              <Link to="/media">Media</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/contact">contact US</Link>
            </div>
          </div>
        </div>
        <div className="cp-footer-divider" />
        <div className="cp-footer-bottom">
          <p className="cp-footer-legal">
            <span>Copyright &copy; 2025 Granules. All rights reserved.</span>
            <a href="/#footer">Privacy policy</a>
            <a href="/#footer">Cookies Policy</a>
            <a href="/#footer">Disclaimer</a>
            <a href="/#footer">Data Protection Notice</a>
            <a href="/#footer">Terms &amp; Condition</a>
          </p>
          <div className="cp-footer-socials">
            {FOOTER_SOCIALS.map((icon) => (
              <a href="/#footer" key={icon}>
                <img src={asset(icon)} alt="" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

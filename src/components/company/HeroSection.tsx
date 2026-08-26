import { asset } from './constants';

export default function HeroSection() {
  return (
    <section className="cp-hero">
      <p className="cp-breadcrumb" style={{ width: 'min(1463px, 100% - 3.2rem)', margin: 'clamp(60px, 8vw, 118px) auto 0' }}>
        <span>Homepage</span>
        <span className="sep">{'>'}</span>
        <span>Company</span>
        <span className="sep">{'>'}</span>
        <span className="current">About us (overview)</span>
      </p>
      <h1 className="cp-page-title">About us</h1>
      <div className="cp-hero-panel">
        <span className="cp-hero-badge">STOCK VIDEO</span>
        <div className="cp-scroll-indicator">
          <img src={asset('scroll-down-icon.png')} alt="" />
        </div>
      </div>
    </section>
  );
}

import { asset } from './constants';

export default function LeadershipSection() {
  return (
    <section className="cp-leadership" aria-label="Leadership speaks">
      <h2>Leadership speaks</h2>

      <div className="cp-leadership-wrapper">
        <div className="cp-leadership-banner">
          <img
            src={asset('leadership-photo-banner.webp?v=sharp_v4')}
            alt="Dr. Krishna Prasad Chigurupati"
            className="cp-leadership-banner-img"
            loading="eager"
            decoding="async"
          />
          <div className="cp-leadership-overlay-block">
            <div className="cp-quote-card">
              <div className="cp-quote-icon" aria-hidden="true">
                <svg width="24" height="19" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4286 0C5.11429 0 0 5.11429 0 11.4286C0 20.8571 8.4 28 16 32L18.2857 28C12.5714 24.8 9.14286 20.5714 8.68571 16.2286C9.6 16.6857 10.7429 16.9143 12 16.9143C16.5714 16.9143 20.2286 13.2571 20.2286 8.68571C20.2286 3.88571 16.3429 0 11.4286 0ZM31.2 0C24.8857 0 19.7714 5.11429 19.7714 11.4286C19.7714 20.8571 28.1714 28 35.7714 32L38.0571 28C32.3429 24.8 28.9143 20.5714 28.4571 16.2286C29.3714 16.6857 30.5143 16.9143 31.7714 16.9143C36.3429 16.9143 40 13.2571 40 8.68571C40 3.88571 36.1143 0 31.2 0Z" fill="#0061F8"/>
                </svg>
              </div>
              <p className="cp-quote-text">
                &ldquo;At Granules, we believe that access to quality medicines is a fundamental right. Our
                commitment to innovation, quality and affordability enables us to serve global
                healthcare needs while staying true to our values.&rdquo;
              </p>
              <div className="cp-quote-author">
                <p className="cp-quote-name">Dr. Krishna Prasad Chigurupati</p>
                <p className="cp-quote-role">FOUNDER, CHAIRMAN &amp; MANAGING DIRECTOR</p>
              </div>
            </div>

            <a className="cp-cta-btn" href="/company/leadership">
              MEET OUR TEAM
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


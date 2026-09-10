import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { SUBSIDIARIES } from './data';

export default function SubsidiariesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prevIndex = (activeIndex - 1 + SUBSIDIARIES.length) % SUBSIDIARIES.length;
  const nextIndex = (activeIndex + 1) % SUBSIDIARIES.length;

  const current = SUBSIDIARIES[activeIndex];
  const prevItem = SUBSIDIARIES[prevIndex];
  const nextItem = SUBSIDIARIES[nextIndex];

  const handlePrev = useCallback(() => {
    setActiveIndex((curr) => (curr - 1 + SUBSIDIARIES.length) % SUBSIDIARIES.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((curr) => (curr + 1) % SUBSIDIARIES.length);
  }, []);

  // Auto-scroll every 3 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const getImgUrl = (path: string) => (path.startsWith('/') ? path : `/assets/${path}`);

  return (
    <section
      className="cp-subsidiaries"
      id="subsidiaries"
      aria-label="Global Subsidiaries"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="cp-sub-header">
        <h2>Global Subsidiaries</h2>
        <h4>
          Our subsidiaries play a vital role in advancing Granules’ integrated business model across the pharmaceutical value chain. Strategically located, they enhance our ability to deliver affordable, high-quality healthcare solutions while maintaining a reliable and agile global supply chain.
        </h4>
        <div className="cp-sub-cta-wrap">
          <Link to="/company/global-subsidiaries" className="cp-cta-btn">
            EXPLORE GLOBAL SUBSIDIARIES &rarr;
          </Link>
        </div>
      </div>

      <div className="cp-subsidiaries-stage">
        {/* Left preview card */}
        <button
          type="button"
          className="cp-sub-preview-card cp-sub-preview--prev"
          onClick={handlePrev}
          aria-label={`View ${prevItem.shortName}`}
        >
          <span>{prevItem.shortName}</span>
          <svg
            className="cp-sub-arrow-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>

        {/* Center active featured card */}
        <article className="cp-sub-featured-card cp-sub-featured-card--no-img" key={activeIndex}>
          <div className="cp-sub-featured-info">
            <h3>
              <Link to={current.href}>{current.fullName}</Link>
            </h3>
            <p>{current.description}</p>
            <div className="cp-sub-card-action-wrap">
              <Link to={current.href} className="cp-sub-card-action-link">
                <span>Learn More</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            </div>
          </div>
        </article>

        {/* Right preview card */}
        <button
          type="button"
          className="cp-sub-preview-card cp-sub-preview--next"
          onClick={handleNext}
          aria-label={`View ${nextItem.shortName}`}
        >
          <span>{nextItem.shortName}</span>
          <svg
            className="cp-sub-arrow-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="cp-sub-nav">
        <button
          type="button"
          aria-label="Previous subsidiary"
          onClick={handlePrev}
          className="cp-sub-nav-btn"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next subsidiary"
          onClick={handleNext}
          className="cp-sub-nav-btn"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

/**
 * Chatbot Section Highlighter
 * Highlights and scrolls to a section when navigated from the chatbot.
 * Usage: ?highlight=sectionName in the URL
 */
(function () {
  'use strict';

  // Map section names to CSS selectors or element IDs
  const SECTION_SELECTORS = {
    // HomePage section IDs
    'business': '#business',
    'sustainability': '#sustainability',
    'investor': '#investor',
    'media': '#media',
    'careers': '#careers',
    'about': '#about',
    'presence': '#presence',
    'top': '#top',
    // ESG page sections
    'environment': '#environment',
    'social': '#social',
    'governance': '#governance',
    'esg-profile': '.esg-hero, .esg-profile, [class*="esg"]',
    'esg-ratings': '.esg-ratings, [class*="rating"]',
    'esg-kpi': '.esg-kpi, [class*="kpi"]',
    'certifications': '.certifications, [class*="cert"]',
    'policies': '.policies, [class*="policy"]',
    'reports': '.reports, [class*="report"]',
    // Company pages
    'leadership': '.ld-hero, [class*="leadership"]',
    'leadership-detail': '.ld-hero, [class*="leadership"]',
    'cmd': '.ld-hero, [class*="leadership"]',
    'management': '.ld-hero, [class*="leadership"]',
    'facilities': '.fac-intro, [class*="facility"]',
    'facilities-detail': '.fac-intro, [class*="facility"]',
    'facility-detail': '.fac-intro, [class*="facility"]',
    'facility-bonthapally': '.fac-intro, [class*="facility"]',
    'facility-gagillapur': '.fac-intro, [class*="facility"]',
    'facility-chantilly': '.fac-intro, [class*="facility"]',
    'facility-gls': '.fac-intro, [class*="facility"]',
    'awards': '.aw-hero, [class*="award"]',
    'milestones': '.ms-intro, [class*="milestone"]',
    'quality': '.qc-intro, [class*="quality"]',
    'ops': '.oe-intro, [class*="operational"]',
    'czro': '.czro-intro, [class*="czro"]',
    'gls': '.gls-intro, [class*="gls"]',
    'ascelis': '.asc-intro, [class*="ascelis"]',
    'acquisitions': '.acq, [class*="acquisition"], [class*="milestone"]',
    'acquisition-news': '.news, [class*="news"]',
    'senn-chemicals': '.asc-intro, [class*="ascelis"]',
    // Business pages
    'api': '.biz-intro, [class*="api"]',
    'api-products': '.biz-intro, [class*="api"]',
    'pfi': '.biz-intro, [class*="pfi"]',
    'fd': '.biz-intro, [class*="fd"]',
    'rd': '.rd-intro, [class*="rd"]',
    'peptides': '.biz-intro, [class*="peptide"]',
    'product-detail': '.biz-intro, [class*="product"]',
    // Sustainability pages
    'overview': '.sus-hero, [class*="sustainability"]',
    'strategy': '.sus-hero, [class*="strategy"]',
    'esg': '.esg-hero, [class*="esg"]',
    'community': '.community, [class*="community"]',
    // Investor pages
    'financials': '.inv-hero, [class*="financial"]',
    'annual-reports': '.inv-hero, [class*="annual"]',
    // Media pages
    'news': '.news, [class*="news"]',
    // Careers pages
    'life': '.careers-hero, [class*="life"]',
    'opportunities': '.careers-hero, [class*="opportunity"]',
    // Contact
    'contact': '.contact-hero, [class*="contact"]',
  };

  // Add highlight animation styles
  function injectStyles() {
    if (document.getElementById('chatbot-highlight-styles')) return;
    const style = document.createElement('style');
    style.id = 'chatbot-highlight-styles';
    style.textContent = `
      @keyframes chatbot-highlight-pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 213, 0, 0.7); }
        50% { box-shadow: 0 0 0 15px rgba(255, 213, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 213, 0, 0); }
      }
      .gw-highlight-section {
        animation: chatbot-highlight-pulse 1.5s ease-out 4;
        position: relative;
        background-color: rgba(255, 213, 0, 0.25) !important;
        border-left: 4px solid #ffd500 !important;
        padding-left: 12px !important;
        transition: background-color 0.3s ease;
      }
      .gw-highlight-section::before {
        content: '';
        position: absolute;
        inset: -4px;
        border: 3px solid #ffd500;
        border-radius: 8px;
        pointer-events: none;
        opacity: 1;
        animation: gw-highlight-fade 4s ease-out forwards;
      }
      .gw-highlight-section::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, rgba(255, 213, 0, 0.3) 0%, transparent 100%);
        pointer-events: none;
        animation: gw-highlight-gradient-fade 4s ease-out forwards;
      }
      @keyframes gw-highlight-fade {
        0% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes gw-highlight-gradient-fade {
        0% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function highlightSection(sectionName) {
    if (!sectionName) return;

    const selector = SECTION_SELECTORS[sectionName];
    if (!selector) return;

    // Wait for page to be ready
    function tryHighlight() {
      const el = document.querySelector(selector);
      if (el) {
        // Scroll to element
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add highlight class
        injectStyles();
        el.classList.add('gw-highlight-section');

        // Show notification banner
        showHighlightBanner(sectionName);

        // Remove highlight after animation
        setTimeout(() => {
          el.classList.remove('gw-highlight-section');
        }, 6000);

        return true;
      }
      return false;
    }

    // Try immediately, then retry after a delay (for lazy-loaded content)
    if (!tryHighlight()) {
      setTimeout(tryHighlight, 500);
      setTimeout(tryHighlight, 1500);
      setTimeout(tryHighlight, 3000);
      setTimeout(tryHighlight, 5000);
    }
  }

  function showHighlightBanner(sectionName) {
    // Remove existing banner
    const existing = document.getElementById('chatbot-highlight-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'chatbot-highlight-banner';
    banner.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #ffd500 0%, #ffb800 100%);
      color: #1a1a1a;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 99999;
      box-shadow: 0 4px 20px rgba(255, 213, 0, 0.4);
      animation: banner-slide-in 0.3s ease-out;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    banner.innerHTML = `
      <span style="margin-right: 8px;">📍</span>
      Highlighted: <strong>${sectionName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
    `;

    // Add animation style
    if (!document.getElementById('banner-animation-style')) {
      const animStyle = document.createElement('style');
      animStyle.id = 'banner-animation-style';
      animStyle.textContent = `
        @keyframes banner-slide-in {
          from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes banner-fade-out {
          from { opacity: 1; }
          to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
      `;
      document.head.appendChild(animStyle);
    }

    document.body.appendChild(banner);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      banner.style.animation = 'banner-fade-out 0.3s ease-out forwards';
      setTimeout(() => banner.remove(), 300);
    }, 4000);
  }

  // Check URL for highlight parameter on page load
  function init() {
    const params = new URLSearchParams(window.location.search);
    const highlight = params.get('highlight');
    if (highlight) {
      // Clean up URL without reloading
      const url = new URL(window.location);
      url.searchParams.delete('highlight');
      window.history.replaceState({}, '', url);

      // Delay highlight slightly to ensure page is rendered
      setTimeout(() => highlightSection(highlight), 300);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for manual use
  window.GranulesHighlight = highlightSection;
})();

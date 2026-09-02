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
    // Common class-based selectors for other pages
    'leadership': '.ld-hero',
    'facilities': '.fac-intro',
    'awards': '.aw-hero',
    'milestones': '.ms-intro',
    'quality': '.qc-intro',
    'ops': '.oe-intro',
    'czro': '.czro-intro',
    'gls': '.gls-intro',
    'ascelis': '.asc-intro',
    'api': '.biz-intro',
    'pfi': '.biz-intro',
    'fd': '.biz-intro',
    'rd': '.rd-intro',
    'peptides': '.biz-intro',
  };

  // Add highlight animation styles
  function injectStyles() {
    if (document.getElementById('chatbot-highlight-styles')) return;
    const style = document.createElement('style');
    style.id = 'chatbot-highlight-styles';
    style.textContent = `
      @keyframes chatbot-highlight-pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 97, 248, 0.5); }
        50% { box-shadow: 0 0 0 12px rgba(0, 97, 248, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 97, 248, 0); }
      }
      .gw-highlight-section {
        animation: chatbot-highlight-pulse 1.5s ease-out 3;
        position: relative;
      }
      .gw-highlight-section::before {
        content: '';
        position: absolute;
        inset: -4px;
        border: 2px solid #0061f8;
        border-radius: 8px;
        pointer-events: none;
        opacity: 1;
        animation: gw-highlight-fade 3s ease-out forwards;
      }
      @keyframes gw-highlight-fade {
        0% { opacity: 1; }
        70% { opacity: 1; }
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
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Add highlight class
        injectStyles();
        el.classList.add('gw-highlight-section');

        // Remove highlight after animation
        setTimeout(() => {
          el.classList.remove('gw-highlight-section');
        }, 5000);

        return true;
      }
      return false;
    }

    // Try immediately, then retry after a delay (for lazy-loaded content)
    if (!tryHighlight()) {
      setTimeout(tryHighlight, 500);
      setTimeout(tryHighlight, 1500);
      setTimeout(tryHighlight, 3000);
    }
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

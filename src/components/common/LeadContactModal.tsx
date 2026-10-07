import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { submitToGoogleSheet } from '../../lib/sheetsService';
import './LeadContactModal.css';

const LEAD_DISMISSED_KEY = 'granules_lead_contact_dismissed';

interface SegmentLeadConfig {
  sheet: 'API' | 'PFI' | 'FD';
  label: string;
}

const SEGMENT_CONFIGS: Record<string, SegmentLeadConfig> = {
  API: { sheet: 'API', label: 'Active Pharmaceutical Ingredients (API)' },
  PFI: { sheet: 'PFI', label: 'Pharmaceutical Formulation Intermediates (PFI)' },
  'Finished Dosage': { sheet: 'FD', label: 'Finished Dosages (FD)' },
  FD: { sheet: 'FD', label: 'Finished Dosages (FD)' },
};

export default function LeadContactModal() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [activeConfig, setActiveConfig] = useState<SegmentLeadConfig | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Clear timer and close modal whenever the user navigates across pages
  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, [location.pathname]);

  // Listen exclusively for segment filter selections (API, PFI, or Finished Dosage) on the generics/products portfolio
  useEffect(() => {
    const handleSegmentChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ segment?: string }>;
      const segment = customEvent.detail?.segment;

      // Clear any running timer on filter switch
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (!segment || segment === 'All' || !SEGMENT_CONFIGS[segment]) {
        return;
      }

      const config = SEGMENT_CONFIGS[segment];
      const dismissedKey = `${LEAD_DISMISSED_KEY}_${config.sheet}`;

      try {
        if (sessionStorage.getItem(dismissedKey) === 'true') {
          return;
        }
      } catch {
        // ignore storage errors
      }

      // Start 10-second timer when user selects API, PFI, or FD filter
      timerRef.current = window.setTimeout(() => {
        setActiveConfig(config);
        setSubmitted(false);
        setVisible(true);
      }, 10000);
    };

    window.addEventListener('granules:segment-filter-change', handleSegmentChange);
    return () => {
      window.removeEventListener('granules:segment-filter-change', handleSegmentChange);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleDismiss = () => {
    if (activeConfig) {
      try {
        sessionStorage.setItem(`${LEAD_DISMISSED_KEY}_${activeConfig.sheet}`, 'true');
      } catch {
        // ignore
      }
    }
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubmitting(true);

    try {
      await submitToGoogleSheet({
        sheet: activeConfig?.sheet || 'API',
        data: {
          email: email.trim(),
          category: activeConfig?.label || 'Product Lead',
          url: window.location.href,
        },
      });
    } catch (err) {
      console.error('Lead submission error:', err);
    }

    setSubmitting(false);
    setSubmitted(true);

    if (activeConfig) {
      try {
        sessionStorage.setItem(`${LEAD_DISMISSED_KEY}_${activeConfig.sheet}`, 'true');
      } catch {
        // ignore
      }
    }

    // Automatically close after success message displays
    setTimeout(() => {
      setVisible(false);
    }, 2500);
  };

  if (!visible || !activeConfig) return null;

  return (
    <div
      className="lead-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Contact inquiry modal"
    >
      <div className="lead-popup-card">
        {submitted ? (
          <div className="lead-popup-success" role="status">
            <div className="lead-popup-success-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="lead-popup-success-text">
              <strong>Thank you for connecting!</strong>
              <p>Our commercial team will reach out to your work email shortly.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="lead-popup-header">
              <div className="lead-popup-icon-wrap" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h3 className="lead-popup-title">Do you want to be contacted?</h3>
              </div>
            </div>

            <p className="lead-popup-desc">
              Please drop your work email and our commercial specialist for{' '}
              <strong>{activeConfig.label}</strong> will be in touch with specifications and supply capabilities.
            </p>

            <form className="lead-popup-form" onSubmit={handleSubmit}>
              <div className="lead-input-wrap">
                <span className="lead-input-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  placeholder="Enter your work email (e.g. name@company.com)"
                  className="lead-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="lead-popup-actions">
                <button
                  type="button"
                  className="lead-popup-btn lead-popup-skip"
                  onClick={handleDismiss}
                >
                  SKIP
                </button>
                <button
                  type="submit"
                  className="lead-popup-btn lead-popup-submit"
                  disabled={submitting || !email}
                >
                  {submitting ? 'SENDING...' : 'CONNECT'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

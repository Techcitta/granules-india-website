import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { submitToGoogleSheet } from '../../lib/sheetsService';
import './LeadContactModal.css';

const LEAD_DISMISSED_KEY = 'granules_lead_contact_dismissed';

// Routes to monitor: FD, PFI, and API
const TARGET_ROUTES: Record<string, string> = {
  '/business/api': 'Active Pharmaceutical Ingredients (API)',
  '/business/pfi': 'Pharmaceutical Formulation Intermediates (PFI)',
  '/business/fd': 'Finished Dosages (FD)',
  '/business/finisheddosage': 'Finished Dosages (FD)',
};

export default function LeadContactModal() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<number | null>(null);

  const cleanPath = location.pathname.toLowerCase().replace(/\/+$/, '');
  const matchedPage = TARGET_ROUTES[cleanPath] || null;

  useEffect(() => {
    // Clear any existing timer upon navigation
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Only activate on targeted pages (API, PFI, FD)
    if (!matchedPage) {
      setVisible(false);
      return;
    }

    // Check if user already skipped or submitted during this browser session
    try {
      const dismissed = sessionStorage.getItem(LEAD_DISMISSED_KEY);
      if (dismissed === 'true') {
        return;
      }
    } catch {
      // ignore storage access issues
    }

    // Start 15-second timer
    timerRef.current = window.setTimeout(() => {
      setVisible(true);
    }, 15000);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [cleanPath, matchedPage]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(LEAD_DISMISSED_KEY, 'true');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubmitting(true);

    try {
      await submitToGoogleSheet({
        sheet: 'Contact',
        data: {
          fullName: 'Interested Business Prospect',
          designation: `Visitor from ${matchedPage || 'Portfolio'}`,
          email: email.trim(),
          subject: `Product Inquiry — ${matchedPage || 'Business'}`,
          message: `Inquiry captured via 15s prompt on ${matchedPage || cleanPath} page. Work Email: ${email.trim()}`,
        },
      });
    } catch (err) {
      console.error('Lead submission error:', err);
    }

    setSubmitting(false);
    setSubmitted(true);

    try {
      sessionStorage.setItem(LEAD_DISMISSED_KEY, 'true');
    } catch {
      // ignore
    }

    // Automatically close after success message displays
    setTimeout(() => {
      setVisible(false);
    }, 2500);
  };

  if (!visible) return null;

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
              <strong>{matchedPage}</strong> will be in touch with specifications and supply capabilities.
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

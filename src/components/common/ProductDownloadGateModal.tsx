import React, { useState, useEffect } from 'react';
import { submitToGoogleSheet } from '../../lib/sheetsService';
import './ProductDownloadGateModal.css';

export type ProductListType = 'API' | 'PFI' | 'FD';

interface ProductListConfig {
  sheet: 'API' | 'PFI' | 'FD';
  title: string;
  fullName: string;
  description: string;
  pdfUrl: string;
  fileName: string;
  badge: string;
}

export const PRODUCT_LIST_CONFIGS: Record<ProductListType, ProductListConfig> = {
  API: {
    sheet: 'API',
    title: 'API Product List',
    fullName: 'Active Pharmaceutical Ingredients (API)',
    description: 'Download our comprehensive portfolio of Active Pharmaceutical Ingredients, pharmacopeia grades, and USDMF filings.',
    pdfUrl: 'https://assets.granulesindia.com/pdfs/2025/05/Granules_Product_Brochure_API.pdf',
    fileName: 'Granules_Product_Brochure_API.pdf',
    badge: 'API Portfolio',
  },
  PFI: {
    sheet: 'PFI',
    title: 'PFI Product List',
    fullName: 'Pharmaceutical Formulation Intermediates (PFI)',
    description: 'Download our complete catalog of directly compressible granules and Drum-to-Hopper PFI blends.',
    pdfUrl: 'https://assets.granulesindia.com/pdfs/2025/06/GIL_Product_Brochure_May_20_2025_Master_PFI.pdf',
    fileName: 'GIL_Product_Brochure_PFI.pdf',
    badge: 'PFI Portfolio',
  },
  FD: {
    sheet: 'FD',
    title: 'Finished Dosage (FD) Product List',
    fullName: 'Finished Dosages (FD)',
    description: 'Download our full listing of solid oral dosage forms, commercial strengths, and regulatory approvals.',
    pdfUrl: 'https://assets.granulesindia.com/products/FD-list-merged.pdf',
    fileName: 'Granules_Finished_Dosage_Product_List.pdf',
    badge: 'Finished Dosage Portfolio',
  },
};

export function BrochureIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const USER_EMAIL_KEY = 'granules_lead_user_email';

/**
 * Trigger the product list download gate modal from anywhere in the app.
 */
export function openProductDownloadGate(type: ProductListType) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('granules:open-download-gate', {
        detail: { type },
      })
    );
  }
}

export default function ProductDownloadGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeType, setActiveType] = useState<ProductListType>('API');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ type?: ProductListType }>;
      const requestedType = customEvent.detail?.type || 'API';
      setActiveType(requestedType);

      // Pre-fill email if user already provided one during this browser session
      try {
        const savedEmail = sessionStorage.getItem(USER_EMAIL_KEY);
        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch {
        // ignore storage errors
      }

      setSubmitted(false);
      setErrorMessage('');
      setIsOpen(true);
    };

    window.addEventListener('granules:open-download-gate', handleOpen);
    return () => window.removeEventListener('granules:open-download-gate', handleOpen);
  }, []);

  const config = PRODUCT_LIST_CONFIGS[activeType];

  const handleClose = () => {
    if (submitting) return;
    setIsOpen(false);
    setSubmitted(false);
    setErrorMessage('');
  };

  const triggerDownload = (url: string, fileName: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Submit lead to distinct Google Sheets tab (API, PFI, or FD)
      await submitToGoogleSheet({
        sheet: config.sheet,
        data: {
          email: cleanEmail,
          category: `${config.title} Download`,
          url: window.location.href,
        },
      });

      // 2. Persist email for seamless future interactions in this session
      try {
        sessionStorage.setItem(USER_EMAIL_KEY, cleanEmail);
      } catch {
        // ignore
      }

      setSubmitting(false);
      setSubmitted(true);

      // 3. Trigger immediate file download
      triggerDownload(config.pdfUrl, config.fileName);

      // 4. Close modal after brief success confirmation
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 2000);
    } catch (err: any) {
      console.error('Download gate submission error:', err);
      // Still allow download even if webhook network had an issue
      triggerDownload(config.pdfUrl, config.fileName);
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="dgate-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dgate-modal-title"
    >
      <div className="dgate-card">
        {/* Close Button */}
        <button
          type="button"
          className="dgate-close-btn"
          onClick={handleClose}
          aria-label="Close download modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {submitted ? (
          <div className="dgate-success-view">
            <div className="dgate-success-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="dgate-success-title">Your Download is Starting!</h3>
            <p className="dgate-success-desc">
              We've initiated the download for <strong>{config.fileName}</strong>. A copy will also be available for your reference.
            </p>
          </div>
        ) : (
          <>
            <div className="dgate-header">
              <span className="dgate-badge">{config.badge}</span>
              <div className="dgate-icon-circle" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3 id="dgate-modal-title" className="dgate-title">
                Download {config.title}
              </h3>
              <p className="dgate-subtitle">
                Please provide your work email to download the official <strong>{config.fullName}</strong> brochure and specifications.
              </p>
            </div>

            <form className="dgate-form" onSubmit={handleSubmit}>
              <div className="dgate-field">
                <label htmlFor="dgate-work-email" className="dgate-label">
                  Work Email Address <span className="dgate-req">*</span>
                </label>
                <div className="dgate-input-wrap">
                  <span className="dgate-input-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="dgate-work-email"
                    type="email"
                    required
                    placeholder="Enter your work email (e.g. name@company.com)"
                    className="dgate-input"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    autoFocus
                  />
                </div>
                {errorMessage && (
                  <p className="dgate-error-text" role="alert">
                    {errorMessage}
                  </p>
                )}
              </div>

              <div className="dgate-actions">
                <button
                  type="submit"
                  className="dgate-submit-btn"
                  disabled={submitting || !email.trim()}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{submitting ? 'Preparing Download...' : 'Download Product List'}</span>
                </button>
              </div>

              <p className="dgate-privacy-note">
                Your email is protected under our Privacy Policy and will be used solely for product inquiries.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

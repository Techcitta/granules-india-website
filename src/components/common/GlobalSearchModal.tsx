import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEARCH_INDEX, SearchResultItem } from '../../data/searchData';
import './global-search.css';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Default items shown initially exactly as in img1
const DEFAULT_SEARCH_ITEMS: SearchResultItem[] = [
  {
    title: 'About Granules',
    description: 'Company leadership and integrated capabilities',
    href: '/company',
    category: 'Company',
    badge: 'Overview',
    keywords: ['about', 'company', 'leadership'],
  },
  {
    title: 'Business Verticals',
    description: 'APIs, PFIs and finished dosages',
    href: '/business/generics',
    category: 'Business',
    badge: 'Generics',
    keywords: ['business', 'generics', 'api', 'pfi', 'fd'],
  },
  {
    title: 'Global Presence',
    description: 'Locations, subsidiaries and facilities',
    href: '/#presence',
    category: 'Company',
    badge: 'Global',
    keywords: ['presence', 'locations', 'global', 'facilities'],
  },
  {
    title: 'Sustainability',
    description: 'CZRO, Net Zero and Pharma Pathshala',
    href: '/sustainability',
    category: 'Sustainability',
    badge: 'ESG',
    keywords: ['sustainability', 'czro', 'net zero', 'csr'],
  },
  {
    title: 'Investor Relations',
    description: 'Stock performance and annual report',
    href: '/investor',
    category: 'Investors',
    badge: 'Reports',
    keywords: ['investor', 'financials', 'annual report'],
  },
  {
    title: 'Newsroom',
    description: 'Achievements and company stories',
    href: '/media',
    category: 'Media',
    badge: 'News',
    keywords: ['newsroom', 'media', 'press', 'stories'],
  },
  {
    title: 'Careers',
    description: 'Join the Granules team',
    href: '/careers',
    category: 'Careers',
    badge: 'Jobs',
    keywords: ['careers', 'jobs', 'team', 'openings'],
  },
  {
    title: 'Active Pharmaceutical Ingredients (APIs)',
    description: 'World-leading paracetamol, metformin, ibuprofen manufacturing',
    href: '/business/api',
    category: 'Products',
    badge: 'APIs',
    keywords: ['api', 'molecules', 'active pharmaceutical'],
  },
  {
    title: 'Pharmaceutical Formulation Intermediates (PFIs)',
    description: 'Directly compressible granules customized for high-speed tableting',
    href: '/business/pfi',
    category: 'Products',
    badge: 'PFIs',
    keywords: ['pfi', 'granules', 'intermediates'],
  },
  {
    title: 'Finished Dosages (FD)',
    description: 'Tablets, caplets, and multi-dose capsules distributed globally',
    href: '/business/finisheddosage',
    category: 'Products',
    badge: 'Finished Dosages',
    keywords: ['fd', 'finished dosage', 'tablets', 'capsules'],
  },
  {
    title: 'Peptide CDMO — Senn Tides',
    description: 'Specialized synthetic peptides & oligonucleotides contract development',
    href: '/business/peptides',
    category: 'Business',
    badge: 'Peptides',
    keywords: ['peptides', 'cdmo', 'senn tides', 'glp-1'],
  },
  {
    title: 'Research & Development',
    description: 'Cutting-edge innovation centers driving green chemistry and QbD',
    href: '/business/rd',
    category: 'Business',
    badge: 'R&D',
    keywords: ['rd', 'research', 'development', 'innovation'],
  },
];

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Reset state and focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Compute search results: default primary list if query is empty, else search index
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return DEFAULT_SEARCH_ITEMS;
    }
    return SEARCH_INDEX.filter((item) => {
      const inTitle = item.title.toLowerCase().includes(q);
      const inDesc = item.description.toLowerCase().includes(q);
      const inBadge = item.badge.toLowerCase().includes(q);
      const inKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
      return inTitle || inDesc || inBadge || inKeywords;
    });
  }, [query]);

  // Reset selection index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Navigate to an item
  const handleSelect = (item: SearchResultItem) => {
    onClose();
    if (item.href.startsWith('http')) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.href);
      if (item.href.includes('#')) {
        const hash = item.href.split('#')[1];
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Keyboard navigation through search list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = (prev + 1) % results.length;
        scrollSelectedIntoView(next);
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = (prev - 1 + results.length) % results.length;
        scrollSelectedIntoView(next);
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[selectedIndex];
      if (item) {
        handleSelect(item);
      }
    }
  };

  const scrollSelectedIntoView = (index: number) => {
    if (!resultsContainerRef.current) return;
    const items = resultsContainerRef.current.querySelectorAll('.search-results-item');
    const el = items[index] as HTMLElement;
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search the website"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-field">
          <svg
            className="search-icon-svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search Granules"
            aria-label="Search Granules"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          <button
            type="button"
            className="search-close-button"
            onClick={onClose}
            aria-label="Close search"
          >
            ×
          </button>
        </div>

        {/* Results List */}
        <div className="search-results" ref={resultsContainerRef} role="listbox">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.title}-${item.href}`}
                  className={`search-results-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="search-item-text">
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>

                  <div className="search-arrow-circle" aria-hidden="true">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0061f8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" stroke="#0061f8" strokeOpacity="0.4" fill="none" />
                      <polyline points="10 8 14 12 10 16" />
                    </svg>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="search-no-results">
              No matching section. Try “sustainability” or “investor”.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

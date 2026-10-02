import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEARCH_INDEX, SearchResultItem } from '../../data/searchData';
import './global-search.css';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Default items shown initially before query
const DEFAULT_SEARCH_ITEMS: SearchResultItem[] = SEARCH_INDEX.slice(0, 12);

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

  // Compute search results with intelligent relevance ranking and multi-token matching
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return DEFAULT_SEARCH_ITEMS;
    }

    const tokens = q.split(/\s+/).filter(Boolean);

    const scored = SEARCH_INDEX.map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const badgeLower = item.badge.toLowerCase();
      const locLower = item.location.toLowerCase();
      const keywordsLower = item.keywords.map((k) => k.toLowerCase());

      // 1. Exact phrase matches (Highest priority)
      if (titleLower === q) score += 200;
      else if (titleLower.startsWith(q)) score += 120;
      else if (titleLower.includes(q)) score += 80;

      if (badgeLower === q) score += 90;
      if (locLower.includes(q)) score += 50;
      if (descLower.includes(q)) score += 40;

      // 2. Token-level matching
      let tokensMatched = 0;
      tokens.forEach((t) => {
        let matched = false;
        if (titleLower.includes(t)) {
          score += 45;
          matched = true;
          if (titleLower.startsWith(t)) score += 25;
        }
        if (badgeLower.includes(t)) {
          score += 35;
          matched = true;
        }
        if (locLower.includes(t)) {
          score += 30;
          matched = true;
        }
        if (keywordsLower.some((k) => k === t)) {
          score += 55;
          matched = true;
        } else if (keywordsLower.some((k) => k.startsWith(t))) {
          score += 35;
          matched = true;
        } else if (keywordsLower.some((k) => k.includes(t))) {
          score += 20;
          matched = true;
        }
        if (descLower.includes(t)) {
          score += 15;
          matched = true;
        }
        if (matched) tokensMatched++;
      });

      // Bonus if all query tokens matched somewhere
      if (tokensMatched === tokens.length) {
        score += 60;
      }

      return { item, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((s) => s.item);
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
            placeholder="Search Granules (e.g. PFI, APIs, Paracetamol, Senn Tides, Annual Report...)"
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
                  key={`${item.id}-${item.href}`}
                  className={`search-results-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="search-item-text">
                    <div className="search-item-meta">
                      <span className="search-item-badge">{item.badge}</span>
                      <span className="search-item-location">{item.location}</span>
                    </div>
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
              No matching results found for &ldquo;{query}&rdquo;. Try searching for &ldquo;PFI&rdquo;, &ldquo;API&rdquo;, &ldquo;Paracetamol&rdquo;, &ldquo;Senn Tides&rdquo;, or &ldquo;Annual Reports&rdquo;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

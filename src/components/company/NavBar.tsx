import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { asset } from './constants';
import { NAV_LINKS } from './data';
import type { NavLink as NavLinkItem } from './types';

function isActive(link: NavLinkItem, pathname: string) {
  return !!link.matchPrefix && pathname.startsWith(link.matchPrefix);
}

function NavItemLink({ link, className, onClick }: { link: NavLinkItem; className: string; onClick?: () => void }) {
  if (link.href.startsWith('/#')) {
    return (
      <a href={link.href} className={className} onClick={onClick}>
        {link.label}
      </a>
    );
  }
  return (
    <Link to={link.href} className={className} onClick={onClick}>
      {link.label}
    </Link>
  );
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="cp-nav-wrap">
      <nav className={`cp-nav${open ? ' cp-nav--open' : ''}`} aria-label="Primary navigation">
        <div className="cp-nav-bar">
          <Link to="/" className="cp-nav-logo" aria-label="Granules home" onClick={() => setOpen(false)}>
            <img src={asset('nav-logo.png')} alt="Granules" />
          </Link>
          <button
            className="cp-nav-toggle"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="cp-nav-links">
            {NAV_LINKS.map((link) => (
              <NavItemLink
                key={link.label}
                link={link}
                className={`cp-nav-link${isActive(link, pathname) ? ' active' : ''}`}
              />
            ))}
            <button className="cp-nav-search" type="button" aria-label="Search">
              <img src={asset('search-icon.svg')} alt="" />
            </button>
            <span className="cp-nav-global">
              <span className="cp-nav-globe">
                <img src={asset('group-globe-1.svg')} alt="" />
              </span>
              Global
            </span>
          </div>
        </div>
        {open && (
          <div className="cp-nav-drawer">
            {NAV_LINKS.map((link) => (
              <NavItemLink
                key={link.label}
                link={link}
                className={`cp-nav-drawer-link${isActive(link, pathname) ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              />
            ))}
            <span className="cp-nav-drawer-global">
              <img src={asset('group-globe-1.svg')} alt="" /> Global
            </span>
          </div>
        )}
      </nav>
    </div>
  );
}

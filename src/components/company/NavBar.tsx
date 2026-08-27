import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { asset } from './constants';
import { NAV_LINKS } from './data';
import type { NavLink as NavLinkItem } from './types';

type Submenu = {
  quickLinks: { label: string; href: string }[];
  links: { label: string; href: string }[];
  image: string;
};

const SUBMENUS: Record<string, Submenu> = {
  'About Us': {
    quickLinks: [
      { label: 'Company', href: '/company' },
      { label: 'Sub Companies', href: '/company' },
      { label: 'Milestone', href: '/company/milestone' },
      { label: 'Awards', href: '/company/awards' },
    ],
    links: [
      { label: 'Leadership', href: '/company/leadership' },
      { label: 'Sub Companies', href: '/company' },
      { label: 'Operational Excellence', href: '/company/operational-excellence' },
      { label: 'Facilities', href: '/company/facilities' },
      { label: 'Granules CZRO', href: '/company/granules-czro' },
      { label: 'Ascelis Peptides', href: '/company/ascelis-peptides' },
      { label: 'Granules Life Sciences', href: '/company/granules-life-sciences' },
    ],
    image: 'purpose-bg.png',
  },
  Business: {
    quickLinks: [
      { label: 'API', href: '/business/api' },
      { label: 'PFI', href: '/business/pfi' },
      { label: 'Finished Dosages', href: '/business/fd' },
    ],
    links: [
      { label: 'Peptides', href: '/business/peptides' },
      { label: 'Research & Development', href: '/business/rd' },
      { label: 'Quality & Compliance', href: '/business/quality-compliance' },
    ],
    image: 'gpi-facility.png',
  },
  Sustainability: {
    quickLinks: [{ label: 'Overview', href: '/sustainability' }, { label: 'Strategy', href: '/sustainability/strategy' }],
    links: [{ label: 'ESG in Action', href: '/sustainability/esg-in-action' }, { label: 'Community', href: '/sustainability/esg-in-action/community' }],
    image: 'values-bg.png',
  },
  Investor: {
    quickLinks: [{ label: 'Overview', href: '/investor' }, { label: 'Annual Reports', href: '/investor/annual-reports' }],
    links: [{ label: 'Investor Updates', href: '/investor' }],
    image: 'leadership-photo-main.png',
  },
  Media: {
    quickLinks: [{ label: 'News & Media', href: '/media' }],
    links: [{ label: 'Press Releases', href: '/media' }],
    image: 'leadership-photo-main-2.png',
  },
  Careers: {
    quickLinks: [{ label: 'Careers', href: '/careers' }, { label: 'Life at Granules', href: '/careers/life-at-granules' }],
    links: [{ label: 'Opportunities', href: '/careers/opportunities' }],
    image: 'career-bg.png',
  },
  Contact: {
    quickLinks: [{ label: 'Contact Us', href: '/contact' }],
    links: [{ label: 'Get in touch with Granules', href: '/contact' }],
    image: 'gpi-facility.png',
  },
};

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
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { pathname } = useLocation();

  const showMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setHoveredMenu(label);
  };

  const hideMenu = () => {
    closeTimer.current = setTimeout(() => setHoveredMenu(null), 180);
  };

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
            {NAV_LINKS.map((link) => {
              const submenu = SUBMENUS[link.label];
              return (
                <div
                  className="cp-nav-item"
                  key={link.label}
                  onMouseEnter={() => showMenu(link.label)}
                  onMouseLeave={hideMenu}
                >
                  <NavItemLink
                    link={link}
                    className={`cp-nav-link${isActive(link, pathname) ? ' active' : ''}`}
                  />
                  {submenu && (
                    <div className={`cp-nav-submenu${hoveredMenu === link.label ? ' is-open' : ''}`} onMouseEnter={() => showMenu(link.label)}>
                      <div className="cp-nav-submenu-copy">
                        <NavItemLink link={link} className="cp-nav-submenu-title" />
                        <div className="cp-nav-quick-links">
                          {submenu.quickLinks.map((item) => <Link to={item.href} key={item.label}>{item.label}<span>↗</span></Link>)}
                        </div>
                        <div className="cp-nav-submenu-links">
                          {submenu.links.map((item) => <Link to={item.href} key={item.label}>{item.label}</Link>)}
                        </div>
                      </div>
                      <img src={asset(submenu.image)} alt="" />
                    </div>
                  )}
                </div>
              );
            })}
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

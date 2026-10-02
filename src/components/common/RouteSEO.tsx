import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoForPath } from '../../data/seoConfig';

function updateMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export default function RouteSEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);

    // 1. Update Document Title
    document.title = seo.title;

    // 2. Primary Meta Tags
    updateMetaTag('name', 'description', seo.description);
    updateMetaTag('name', 'keywords', seo.keywords);
    updateMetaTag('name', 'author', 'Granules India Limited');

    // 3. Canonical URL
    updateCanonicalLink(seo.canonical);

    // 4. OpenGraph Tags
    updateMetaTag('property', 'og:title', seo.title);
    updateMetaTag('property', 'og:description', seo.description);
    updateMetaTag('property', 'og:url', seo.canonical);
    updateMetaTag('property', 'og:type', seo.ogType || 'website');
    updateMetaTag('property', 'og:site_name', 'Granules India Limited');
    if (seo.ogImage) {
      updateMetaTag('property', 'og:image', `https://granulesindia.com${seo.ogImage}`);
    }

    // 5. Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', seo.title);
    updateMetaTag('name', 'twitter:description', seo.description);
  }, [pathname]);

  return null;
}

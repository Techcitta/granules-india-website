import { useEffect, useState } from 'react';
import type { InvestorCategory, InvestorDocItem } from '../data/investorData';
import { CLOUDFRONT_URL, toCdnPdf } from './pdf';

export interface CmsDocument {
  id: string;
  key: string;
  folderPrefix: string;
  year: string | null;
  title: string;
  description?: string;
  filename: string;
  contentType?: string;
  kind?: string;
  size?: number;
  publicationDate?: string;
  status: 'published' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsIndexResponse {
  version: number;
  updatedAt?: string;
  records: CmsDocument[];
}

const CMS_CDN_INDEX = `${CLOUDFRONT_URL}/cms/index.json`;

let cachedRecords: CmsDocument[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000;

/** Fetch all published documents from S3 CloudFront CDN index. */
export async function getPublishedCmsDocuments(): Promise<CmsDocument[]> {
  const now = Date.now();
  if (cachedRecords && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedRecords;
  }

  try {
    const res = await fetch(`${CMS_CDN_INDEX}?t=${now}`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data: CmsIndexResponse = await res.json();
      if (Array.isArray(data.records)) {
        cachedRecords = data.records.filter((r) => r.status === 'published');
        cacheTimestamp = now;
        console.log(`[CMS] Successfully loaded ${cachedRecords.length} documents from CDN index`);
        return cachedRecords;
      }
    }
  } catch (err) {
    console.warn('[CMS] Failed to fetch CMS index from CDN:', err);
  }

  return cachedRecords || [];
}

/** Hook to fetch documents filtered by folder prefix */
export function useCmsDocuments(prefix?: string) {
  const [documents, setDocuments] = useState<CmsDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPublishedCmsDocuments()
      .then((records) => {
        if (!active) return;
        const filtered = prefix
          ? records.filter((r) => r.folderPrefix?.startsWith(prefix))
          : records;
        setDocuments(filtered);
      })
      .catch(() => {
        if (active) setDocuments([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [prefix]);

  return { documents, loading };
}

const FOLDER_TO_INVES_MAP: Record<string, { catId: string; subcatId: string; label: string }> = {
  'investors/financial-reports/annual-reports/': {
    catId: 'sec-financial-reports',
    subcatId: 'annual-reports',
    label: 'Annual Reports',
  },
  'investors/financial-reports/quarterly-results/': {
    catId: 'sec-financial-reports',
    subcatId: 'quarterly-results',
    label: 'Quarterly Results',
  },
  'investors/financial-reports/annual-accounts-subsidiaries-jvs/': {
    catId: 'sec-financial-reports',
    subcatId: 'annual-accounts-of-subsidiaries-jvs',
    label: 'Annual Accounts of Subsidiaries & JVs',
  },
  'investors/investor-resources/investor-presentation/': {
    catId: 'sec-investor-resources',
    subcatId: 'investor-presentation',
    label: 'Investor Presentation',
  },
  'investors/investor-resources/earnings-call-transcripts/': {
    catId: 'sec-investor-resources',
    subcatId: 'earnings-call-transcripts',
    label: 'Earnings Call Transcripts',
  },
  'investors/investor-resources/earnings-call-recording/': {
    catId: 'sec-investor-resources',
    subcatId: 'earnings-call-recording',
    label: 'Earnings Call Recording',
  },
  'investors/investor-resources/shareholding-structure/': {
    catId: 'sec-investor-resources',
    subcatId: 'shareholding-structure',
    label: 'Shareholding Structure',
  },
  'investors/investor-resources/top-200-shareholders/': {
    catId: 'sec-investor-resources',
    subcatId: 'top-200-shareholders',
    label: 'Top 200 Shareholders',
  },
  'investors/investor-resources/policies/': {
    catId: 'sec-investor-resources',
    subcatId: 'policies',
    label: 'Policies',
  },
  'investors/investor-resources/buyback-2022/': {
    catId: 'sec-investor-resources',
    subcatId: 'buyback-2022',
    label: 'Buyback 2022',
  },
  'investors/investor-resources/forms/': {
    catId: 'sec-investor-resources',
    subcatId: 'forms',
    label: 'Forms',
  },
  'investors/investor-resources/unclaimed-dividend-and-iepf/': {
    catId: 'sec-investor-resources',
    subcatId: 'unclaimed-dividend-and-iepf',
    label: 'Unclaimed Dividend & IEPF',
  },
  'investors/notice-and-disclosures/notice-of-board-meetings/': {
    catId: 'sec-notices-disclosures',
    subcatId: 'notice-of-board-meetings',
    label: 'Notice of Board Meetings',
  },
  'investors/notice-and-disclosures/schedule-of-investor-meet/': {
    catId: 'sec-notices-disclosures',
    subcatId: 'schedule-of-investor-meet',
    label: 'Schedule of Investor Meet',
  },
  'investors/notice-and-disclosures/newspaper-publications/': {
    catId: 'sec-notices-disclosures',
    subcatId: 'newspaper-publications',
    label: 'Newspaper Publications',
  },
  'investors/notice-and-disclosures/secretarial-compliance-report/': {
    catId: 'sec-notices-disclosures',
    subcatId: 'secretarial-compliance-report',
    label: 'Secretarial Compliance Report',
  },
  'investors/other-information/ehs-documents/': {
    catId: 'sec-other-info',
    subcatId: 'ehs-documents',
    label: 'EHS Documents',
  },
  'investors/other-information/other-information/': {
    catId: 'sec-other-info',
    subcatId: 'other-information',
    label: 'Other Information',
  },
};

function docToInvestorItem(doc: CmsDocument, mapping: { catId: string; subcatId: string; label: string }): InvestorDocItem {
  const pdfUrl = doc.key.startsWith('http') ? doc.key : `${CLOUDFRONT_URL}/${doc.key}`;
  
  let rawYear = (doc.year || '').replace(/\D+/g, '');
  if (!rawYear && doc.publicationDate) {
    rawYear = doc.publicationDate.slice(0, 4);
  }
  if (!rawYear) {
    rawYear = '2026';
  }

  return {
    id: `cms-${doc.id}`,
    title: doc.title,
    scope: 'Earnings Call Transcript - ' + (doc.year ? ('FY' + doc.year.slice(-2)) : 'FY26'),
    period: doc.publicationDate || doc.year || '2026',
    year: rawYear,
    pdf: pdfUrl,
    category: mapping.catId,
    subcategoryId: mapping.subcatId,
    subcategoryLabel: mapping.label,
  };
}

/** Merges CMS published documents into the investor section tree. */
export function useCmsInvestorSections(fallbackSections: InvestorCategory[]): InvestorCategory[] {
  const [sections, setSections] = useState<InvestorCategory[]>(fallbackSections);

  useEffect(() => {
    let active = true;
    getPublishedCmsDocuments().then((cmsDocs) => {
      if (!active || !cmsDocs.length) return;

      const merged: InvestorCategory[] = JSON.parse(JSON.stringify(fallbackSections));

      cmsDocs.forEach((doc) => {
        const mapping = FOLDER_TO_INVES_MAP[doc.folderPrefix];
        if (!mapping) return;

        const cat = merged.find((c) => c.id === mapping.catId);
        if (!cat) return;

        const subcat = cat.subcategories.find((s) => s.id === mapping.subcatId);
        if (!subcat) return;

        const item = docToInvestorItem(doc, mapping);
        const exists = subcat.items.some(
          (existing) => existing.id === item.id || existing.title.toLowerCase() === item.title.toLowerCase()
        );

        if (!exists) {
          subcat.items.unshift(item);
          console.log(`[CMS] Injected doc into ${subcat.label}: ${item.title} (Year: ${item.year})`);
        }
      });

      setSections(merged);
    });

    return () => {
      active = false;
    };
  }, [fallbackSections]);

  return sections;
}

export interface HomepageDoc {
  title: string;
  href: string;
  download: string;
}

/** Hook to update homepage featured documents from CMS */
export function useCmsHomepageDocs(defaultDocs: HomepageDoc[]): HomepageDoc[] {
  const [docs, setDocs] = useState<HomepageDoc[]>(defaultDocs);

  useEffect(() => {
    let active = true;
    getPublishedCmsDocuments().then((cmsDocs) => {
      if (!active || !cmsDocs.length) return;

      const nextDocs = [...defaultDocs];

      const latestQuarterly = cmsDocs.find(
        (d) => d.folderPrefix === 'investors/financial-reports/quarterly-results/'
      );
      if (latestQuarterly) {
        nextDocs[0] = {
          title: latestQuarterly.title,
          href: toCdnPdf(latestQuarterly.key),
          download: latestQuarterly.filename,
        };
      }

      const latestConcall = cmsDocs.find(
        (d) => d.folderPrefix === 'investors/investor-resources/earnings-call-transcripts/'
      );
      if (latestConcall) {
        nextDocs[1] = {
          title: latestConcall.title,
          href: toCdnPdf(latestConcall.key),
          download: latestConcall.filename,
        };
      }

      const latestPresentation = cmsDocs.find(
        (d) => d.folderPrefix === 'investors/investor-resources/investor-presentation/'
      );
      if (latestPresentation) {
        nextDocs[2] = {
          title: latestPresentation.title,
          href: toCdnPdf(latestPresentation.key),
          download: latestPresentation.filename,
        };
      }

      const latestAnnual = cmsDocs.find(
        (d) => d.folderPrefix === 'investors/financial-reports/annual-reports/'
      );
      if (latestAnnual) {
        nextDocs[3] = {
          title: latestAnnual.title,
          href: toCdnPdf(latestAnnual.key),
          download: latestAnnual.filename,
        };
      }

      setDocs(nextDocs);
    });

    return () => {
      active = false;
    };
  }, [defaultDocs]);

  return docs;
}

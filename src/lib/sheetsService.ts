/**
 * Form Submission Service for Granules India
 * 
 * Supports:
 *  1. Microsoft SharePoint & Power Automate Webhook (VITE_SHAREPOINT_WEBHOOK_URL)
 *  2. Google Sheets Web App Webhook (VITE_GOOGLE_SHEETS_WEBHOOK_URL)
 * 
 * Routes submissions across:
 *  - "Contact" (Contact Us inquiries)
 *  - "Talent Community" (Careers & CV/Resume uploads to SharePoint Document Library)
 *  - "Data Privacy" (DPDP Act complaints)
 *  - "Sheet1" / "API" / "PFI" / "FD" (Product lead capture)
 */

// Configured SharePoint Power Automate Webhook URL
export const SHAREPOINT_WEBHOOK_URL =
  import.meta.env.VITE_SHAREPOINT_WEBHOOK_URL || '';

// Configured Google Apps Script Web App URL (active fallback)
export const GOOGLE_SHEETS_WEBHOOK_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycbzgPNLqcIWEeW6tBbTwy7WhI4VD5UQXtBIs_xZPpgz_DNT3U_wH7WluL2Zqg_viio5Q/exec';

export type FormSheetType =
  | 'Contact'
  | 'Talent Community'
  | 'Data Privacy'
  | 'Sheet1'
  | 'API'
  | 'PFI'
  | 'FD';

export interface ContactPayload {
  fullName: string;
  designation: string;
  email: string;
  subject: string;
  message: string;
}

export interface TalentCommunityPayload {
  fullName: string;
  email: string;
  dialCode: string;
  mobile: string;
  location: string;
  careerInterest: string;
  resumeFileName?: string;
  resumeBase64?: string;
  resumeMimeType?: string;
  consent: boolean;
}

export interface DataPrivacyPayload {
  name: string;
  role: string;
  street: string;
  country: string;
  phone: string;
  email: string;
  complaint: string;
}

export interface ProductLeadPayload {
  email: string;
  category: string;
  url?: string;
}

export type FormPayload =
  | { sheet: 'Contact'; data: ContactPayload }
  | { sheet: 'Talent Community'; data: TalentCommunityPayload }
  | { sheet: 'Data Privacy'; data: DataPrivacyPayload }
  | { sheet: 'Sheet1' | 'API' | 'PFI' | 'FD'; data: ProductLeadPayload };

/**
 * Submit form payload to SharePoint (Power Automate) and/or Google Apps Script
 */
export async function submitToGoogleSheet(payload: FormPayload): Promise<{ success: boolean; error?: string }> {
  const spUrl = SHAREPOINT_WEBHOOK_URL;
  const gsUrl = GOOGLE_SHEETS_WEBHOOK_URL;

  // Log in development if neither webhook URL is configured
  if (!spUrl && !gsUrl) {
    console.warn(
      `[FormService] Neither VITE_SHAREPOINT_WEBHOOK_URL nor VITE_GOOGLE_SHEETS_WEBHOOK_URL is set. Simulated submission for sheet: "${payload.sheet}"`,
      payload.data
    );
    return { success: true };
  }

  try {
    const sanitizedData: Record<string, any> = {};
    for (const [key, val] of Object.entries(payload.data)) {
      if (typeof val === 'string' && (val.startsWith('+') || val.startsWith('='))) {
        sanitizedData[key] = `'${val}`;
      } else {
        sanitizedData[key] = val;
      }
    }

    const bodyData = {
      sheet: payload.sheet,
      timestamp: new Date().toISOString(),
      ...sanitizedData,
    };

    let spSucceeded = false;

    // 1. Primary: Microsoft SharePoint via Power Automate Webhook
    if (spUrl) {
      try {
        const spResponse = await fetch(spUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        });
        if (spResponse.ok || spResponse.type === 'opaque') {
          spSucceeded = true;
        }
      } catch (spErr) {
        console.error('[SharePoint] Failed sending to Power Automate webhook:', spErr);
      }
    }

    // 2. Secondary / Backup: Google Sheets Webhook
    if (gsUrl) {
      const gsResponse = await fetch(gsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(bodyData),
      });

      if (!gsResponse.ok && gsResponse.type !== 'opaque' && !spSucceeded) {
        throw new Error(`Google Sheets server returned HTTP ${gsResponse.status}`);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error(`[FormService] Failed submitting to "${payload.sheet}":`, err);
    return { success: false, error: err?.message || 'Submission failed' };
  }
}

// Export alias for semantic clarity
export const submitFormPayload = submitToGoogleSheet;

/**
 * Convert a File object to Base64 string for transmission
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const res = reader.result as string;
      // Strip data url prefix (e.g. data:application/pdf;base64,)
      const base64 = res.split(',')[1] || res;
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

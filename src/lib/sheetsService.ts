/**
 * Google Sheets Form Submission Service for Granules India
 * 
 * Sends submitted form data to a Google Apps Script Web App webhook,
 * which appends rows into 3 distinct sheets:
 *  1. "Contact"
 *  2. "Talent Community"
 *  3. "Data Privacy"
 */

// Configured Google Apps Script Web App URL
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
 * Submit form payload to Google Apps Script Web App
 */
export async function submitToGoogleSheet(payload: FormPayload): Promise<{ success: boolean; error?: string }> {
  const url = GOOGLE_SHEETS_WEBHOOK_URL;

  // Log in development if webhook URL is not yet configured
  if (!url) {
    console.warn(
      `[GoogleSheets] VITE_GOOGLE_SHEETS_WEBHOOK_URL is not set. Simulated submission for sheet: "${payload.sheet}"`,
      payload.data
    );
    // Return success in local preview mode so UI does not get stuck
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

    // Google Apps Script requires text/plain or application/x-www-form-urlencoded to prevent CORS preflight OPTIONS failure
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok && response.type !== 'opaque') {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error(`[GoogleSheets] Failed submitting to sheet "${payload.sheet}":`, err);
    return { success: false, error: err?.message || 'Submission failed' };
  }
}

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

/**
 * Granules India - Web Forms & Product Leads Google Sheets Webhook
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace all code in Code.gs with this code
 * 4. Click "Deploy" > "Manage deployments" > Edit (pencil icon) > "New version" > "Deploy"
 * 5. Ensure access is set to "Anyone"
 *
 * Weekly Storage:
 * Automatically creates and organizes tabs weekly using 7-day brackets:
 *  - Week 1st - 7th (Month)
 *  - Week 8th - 14th (Month)
 *  - Week 15th - 21st (Month)
 *  - Week 22nd - 28th (Month)
 *  - Week 29th - 30th/31st (Month)
 *
 * Resulting Tab Names:
 *  1. Contact - Week 1st - 7th (Oct)
 *  2. Talent Community - Week 1st - 7th (Oct)
 *  3. Data Privacy - Week 1st - 7th (Oct)
 *  4. Sheet1 - Week 1st - 7th (Oct)  (Work emails from 10s lead popups & brochure downloads)
 *
 * Master Tab Archiving:
 *  By default (KEEP_MASTER_TAB = true), submissions are written to BOTH:
 *  - The current weekly tab (e.g. "Contact - Week 22nd - 28th (Oct)")
 *  - The overall master tab (e.g. "Contact") for a complete historical log.
 */

// ── Configuration ────────────────────────────────
const TIMEZONE = 'Asia/Kolkata';
const KEEP_MASTER_TAB = true; // Set to false if you only want the weekly tabs

// Handles browser visits to the URL
function doGet(e) {
  const currentWeek = getWeeklyLabel(new Date(), TIMEZONE);
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "active",
      service: "Granules India Forms Webhook",
      message: "Webhook is live and ready to receive submissions.",
      currentWeeklyLabel: currentWeek,
      exampleTabName: `Contact - ${currentWeek}`,
      keepMasterTab: KEEP_MASTER_TAB
    }, null, 2)
  ).setMimeType(ContentService.MimeType.JSON);
}

// Handles form & lead submissions from the website
function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = data.sheet;

    if (!sheetName) {
      return jsonResponse({ result: 'error', message: 'Missing sheet name' });
    }

    const timestamp = Utilities.formatDate(
      new Date(),
      TIMEZONE,
      'yyyy-MM-dd HH:mm:ss'
    );

    // ──────────────────────────────────────────────
    // 1. CONTACT FORM
    // ──────────────────────────────────────────────
    if (sheetName === 'Contact') {
      appendFormRow(
        ss,
        'Contact',
        [
          'Timestamp',
          'Full Name',
          'Designation',
          'Email Address',
          'Subject',
          'Message'
        ],
        [
          timestamp,
          data.fullName || '',
          data.designation || '',
          data.email || '',
          data.subject || '',
          data.message || ''
        ]
      );
    }

    // ──────────────────────────────────────────────
    // 2. TALENT COMMUNITY FORM
    // ──────────────────────────────────────────────
    else if (sheetName === 'Talent Community') {
      let resumeLink = '';
      if (data.resumeBase64 && data.resumeFileName) {
        resumeLink = saveCvToDrive(
          data.resumeFileName,
          data.resumeBase64,
          data.resumeMimeType || 'application/pdf',
          data.fullName || 'Candidate'
        );
      }

      const dialCode = data.dialCode ? data.dialCode.toString() : '+91';
      const safeDial = dialCode.startsWith('+') ? "'" + dialCode : dialCode;
      const mobile = data.mobile ? data.mobile.toString() : '';
      const safeMobile = mobile.startsWith('+') ? "'" + mobile : mobile;

      appendFormRow(
        ss,
        'Talent Community',
        [
          'Timestamp',
          'Full Name',
          'Email Address',
          'Dial Code',
          'Mobile Number',
          'Location / Hub',
          'Career Interest',
          'Resume File Name',
          'Resume Drive Link',
          'Consent (DPDP Act)'
        ],
        [
          timestamp,
          data.fullName || '',
          data.email || '',
          safeDial,
          safeMobile,
          data.location || '',
          data.careerInterest || '',
          data.resumeFileName || '',
          resumeLink || 'None provided',
          data.consent ? 'YES' : 'NO'
        ]
      );
    }

    // ──────────────────────────────────────────────
    // 3. DATA PRIVACY COMPLAINT FORM
    // ──────────────────────────────────────────────
    else if (sheetName === 'Data Privacy') {
      const rawPhone = data.phone ? data.phone.toString() : '';
      const safePhone = rawPhone.startsWith('+') ? "'" + rawPhone : rawPhone;

      appendFormRow(
        ss,
        'Data Privacy',
        [
          'Timestamp',
          'Full Name',
          'Role',
          'Street Address',
          'Country',
          'Phone Number',
          'Email Address',
          'Complaint Details'
        ],
        [
          timestamp,
          data.name || '',
          data.role || '',
          data.street || '',
          data.country || '',
          safePhone,
          data.email || '',
          data.complaint || ''
        ]
      );
    }

    // ──────────────────────────────────────────────
    // 4. WORK EMAILS & PRODUCT LEADS -> "Sheet1"
    // ──────────────────────────────────────────────
    else if (
      sheetName === 'Sheet1' ||
      sheetName === 'API' ||
      sheetName === 'PFI' ||
      sheetName === 'FD' ||
      sheetName === 'Leads'
    ) {
      appendFormRow(
        ss,
        'Sheet1',
        [
          'Timestamp',
          'Work Email',
          'Product Category / Segment',
          'Page URL'
        ],
        [
          timestamp,
          data.email || '',
          data.category || sheetName,
          data.url || ''
        ]
      );
    }

    return jsonResponse({ result: 'success' });
  } catch (error) {
    return jsonResponse({ result: 'error', error: error.toString() });
  }
}

/**
 * Appends form row to both the Weekly tab and optionally Master tab
 */
function appendFormRow(ss, baseSheetName, headers, rowData) {
  const weeklyLabel = getWeeklyLabel(new Date(), TIMEZONE);
  const weeklySheetName = `${baseSheetName} - ${weeklyLabel}`;

  // 1. Append to Weekly Tab (e.g. "Contact - Week 1st - 7th (Oct)")
  const weeklySheet = getOrCreateSheet(ss, weeklySheetName, headers);
  weeklySheet.appendRow(rowData);

  // 2. Append to Master Tab (e.g. "Contact") if enabled
  if (KEEP_MASTER_TAB) {
    const masterSheet = getOrCreateSheet(ss, baseSheetName, headers);
    masterSheet.appendRow(rowData);
  }
}

/**
 * Computes weekly label: e.g. "Week 1st - 7th (Oct)"
 * - Days 1 to 7:   Week 1st - 7th (Month)
 * - Days 8 to 14:  Week 8th - 14th (Month)
 * - Days 15 to 21: Week 15th - 21st (Month)
 * - Days 22 to 28: Week 22nd - 28th (Month)
 * - Days 29 to end: Week 29th - 31st (Month)
 */
function getWeeklyLabel(date, tz) {
  const timezone = tz || 'Asia/Kolkata';
  const day = parseInt(Utilities.formatDate(date, timezone, 'd'), 10);
  const monthStr = Utilities.formatDate(date, timezone, 'MMM');
  const year = parseInt(Utilities.formatDate(date, timezone, 'yyyy'), 10);
  const monthIndex = parseInt(Utilities.formatDate(date, timezone, 'M'), 10) - 1;

  const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();

  let startDay, endDay;
  if (day <= 7) {
    startDay = 1;
    endDay = 7;
  } else if (day <= 14) {
    startDay = 8;
    endDay = 14;
  } else if (day <= 21) {
    startDay = 15;
    endDay = 21;
  } else if (day <= 28) {
    startDay = 22;
    endDay = 28;
  } else {
    startDay = 29;
    endDay = lastDayOfMonth;
  }

  return `Week ${getOrdinalSuffix(startDay)} - ${getOrdinalSuffix(endDay)} (${monthStr})`;
}

/**
 * Helper to return 1st, 2nd, 3rd, 4th, 7th, 21st, 22nd, 31st etc.
 */
function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) return day + 'th';
  switch (day % 10) {
    case 1: return day + 'st';
    case 2: return day + 'nd';
    case 3: return day + 'rd';
    default: return day + 'th';
  }
}

/**
 * Gets the sheet tab or creates and formats it with styled headers if not existing or empty
 */
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);

    // Style the header row (Dark Blue background, bold white text)
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#002B66');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setFontFamily('Arial');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

/**
 * Saves uploaded CVs to a dedicated "Granules_Talent_CVs" folder in Google Drive
 */
function saveCvToDrive(fileName, base64Data, mimeType, candidateName) {
  try {
    const folderName = 'Granules_Talent_CVs';
    const folders = DriveApp.getFoldersByName(folderName);
    const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    const decoded = Utilities.base64Decode(base64Data);
    const cleanCandidateName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
    const stampedName = `${cleanCandidateName}_${Date.now()}_${fileName}`;
    const blob = Utilities.newBlob(decoded, mimeType, stampedName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return `Upload error: ${err.toString()}`;
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Granules India - Web Forms & Product Leads Google Sheets Webhook
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code into Code.gs
 * 4. Click "Deploy" > "Manage deployments" > Edit (pencil icon) > "New version" > "Deploy"
 * 5. Ensure access is set to "Anyone"
 *
 * Handles tabs automatically:
 *  1. "Contact" (from Contact Us page)
 *  2. "Talent Community" (from Careers page, with automatic CV upload to Google Drive)
 *  3. "Data Privacy" (from Data Privacy complaint form)
 *  4. "Sheet1" (Work emails from 10s lead popups & brochure downloads)
 */

// Handles browser visits to the URL
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "active",
      service: "Granules India Forms Webhook",
      message: "Webhook is live and ready to receive submissions."
    })
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
      'Asia/Kolkata',
      'yyyy-MM-dd HH:mm:ss'
    );

    // ──────────────────────────────────────────────
    // 1. CONTACT FORM
    // ──────────────────────────────────────────────
    if (sheetName === 'Contact') {
      const sheet = getOrCreateSheet(ss, 'Contact', [
        'Timestamp',
        'Full Name',
        'Designation',
        'Email Address',
        'Subject',
        'Message'
      ]);

      sheet.appendRow([
        timestamp,
        data.fullName || '',
        data.designation || '',
        data.email || '',
        data.subject || '',
        data.message || ''
      ]);
    }

    // ──────────────────────────────────────────────
    // 2. TALENT COMMUNITY FORM
    // ──────────────────────────────────────────────
    else if (sheetName === 'Talent Community') {
      const sheet = getOrCreateSheet(ss, 'Talent Community', [
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
      ]);

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

      sheet.appendRow([
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
      ]);
    }

    // ──────────────────────────────────────────────
    // 3. DATA PRIVACY COMPLAINT FORM
    // ──────────────────────────────────────────────
    else if (sheetName === 'Data Privacy') {
      const sheet = getOrCreateSheet(ss, 'Data Privacy', [
        'Timestamp',
        'Full Name',
        'Role',
        'Street Address',
        'Country',
        'Phone Number',
        'Email Address',
        'Complaint Details'
      ]);

      const rawPhone = data.phone ? data.phone.toString() : '';
      const safePhone = rawPhone.startsWith('+') ? "'" + rawPhone : rawPhone;

      sheet.appendRow([
        timestamp,
        data.name || '',
        data.role || '',
        data.street || '',
        data.country || '',
        safePhone,
        data.email || '',
        data.complaint || ''
      ]);
    }

    // ──────────────────────────────────────────────
    // 4. WORK EMAILS & PRODUCT LEADS -> "Sheet1"
    // ──────────────────────────────────────────────
    else if (sheetName === 'Sheet1' || sheetName === 'API' || sheetName === 'PFI' || sheetName === 'FD' || sheetName === 'Leads') {
      const sheet = getOrCreateSheet(ss, 'Sheet1', [
        'Timestamp',
        'Work Email',
        'Product Category / Segment',
        'Page URL'
      ]);

      sheet.appendRow([
        timestamp,
        data.email || '',
        data.category || sheetName,
        data.url || ''
      ]);
    }

    return jsonResponse({ result: 'success' });
  } catch (error) {
    return jsonResponse({ result: 'error', error: error.toString() });
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

/**
 * Moderated guestbook for Yvette's portfolio.
 * New messages are ALWAYS private until the owner checks approved in Google Sheets.
 *
 * UPDATE YOUR EXISTING PROJECT (keep the same Sheet and deployment):
 * 1. Paste this file into the existing Apps Script project.
 * 2. Confirm NOTIFY_EMAIL. If this is not a Sheet-bound script, fill SHEET_ID.
 * 3. Select setupGuestbook and run it once in the editor. Authorize the requested
 *    Sheet/email access. The execution log prints the private review-sheet URL.
 *    Existing messages and approval values are preserved.
 * 4. Deploy > Manage deployments > Edit > Version: New version > Deploy.
 *    Keep Execute as: Me and access: Anyone. The existing /exec URL stays valid.
 *
 * REVIEW: open the link in each notification email and tick column D (approved).
 * Refresh the portfolio to see approved messages. Unchecking hides them again.
 * The public API never changes approval and never returns pending messages.
 */
const SHEET_NAME = 'guestbook';
const SHEET_ID = ''; // Optional: ID between /d/ and /edit in the EXISTING Sheet URL.
const NOTIFY_EMAIL = 'yvettewu2017@gmail.com';
const MAX_NAME = 40;
const MAX_MESSAGE = 500;

// Run manually once from the Apps Script editor, not through the public web app.
function setupGuestbook() {
  const spreadsheet = spreadsheet_();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab named "' + SHEET_NAME + '". Open the original guestbook spreadsheet.');
  const headers = sheet.getRange(1, 1, 1, 4).getValues()[0];
  const expected = ['date', 'name', 'message', 'approved'];
  if (headers.every(function (value) { return value === ''; })) {
    sheet.getRange(1, 1, 1, 4).setValues([expected]);
  } else if (headers.some(function (value, i) { return String(value).trim().toLowerCase() !== expected[i]; })) {
    throw new Error('Expected columns A–D: date | name | message | approved. No existing data was changed.');
  }
  // Unlike insertCheckboxes(), validation alone preserves existing TRUE/FALSE values.
  if (sheet.getMaxRows() > 1) {
    sheet.getRange(2, 4, sheet.getMaxRows() - 1, 1).setDataValidation(checkbox_());
  }
  PropertiesService.getScriptProperties().setProperty('GUESTBOOK_SHEET_ID', spreadsheet.getId());
  SpreadsheetApp.flush();
  const url = reviewUrl_(sheet);
  console.log('Open this private sheet to review messages: ' + url);
  console.log('Notification email: ' + NOTIFY_EMAIL);
  return url;
}

// Run from the editor whenever you need to find the moderation spreadsheet again.
function showReviewLink() {
  const url = reviewUrl_(sheet_());
  console.log('Review guestbook messages: ' + url);
  return url;
}

function doGet() {
  try {
    const rows = sheet_().getDataRange().getValues().slice(1);
    const entries = rows
      .filter(function (row) {
        return row[2] && row[3] === true && !isNaN(new Date(row[0]).getTime());
      })
      .map(function (row) {
        return {
          date: new Date(row[0]).toISOString(),
          name: String(row[1] || 'Anonymous'),
          message: String(row[2])
        };
      })
      .reverse();
    return json_(entries);
  } catch (error) {
    console.error('Guestbook read failed: ' + String(error));
    return json_({ status: 'error', message: 'The guestbook is temporarily unavailable.' });
  }
}

function doPost(event) {
  let data;
  try {
    data = JSON.parse(event && event.postData ? event.postData.contents : '');
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid message');
  } catch (_) {
    return json_({ status: 'error', message: 'Invalid message.' });
  }
  if (data.website) return json_({ status: 'ok', pending: true, entry: null });
  const name = String(data.name || '').trim().slice(0, MAX_NAME) || 'Anonymous';
  const message = String(data.message || '').trim().slice(0, MAX_MESSAGE);
  if (!message) return json_({ status: 'error', message: 'Message is empty.' });

  let reviewUrl;
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return json_({ status: 'error', message: 'The guestbook is busy. Please try again.' });
  }
  try {
    const sheet = sheet_();
    const lastRow = sheet.getLastRow();
    const recent = lastRow > 1
      ? sheet.getRange(Math.max(2, lastRow - 39), 1, Math.min(40, lastRow - 1), 4).getValues()
      : [];
    const hourAgo = Date.now() - 3600000;
    const duplicate = recent.some(function (row) {
      return new Date(row[0]).getTime() > hourAgo && String(row[2]).trim() === message;
    });
    if (duplicate) return json_({ status: 'error', message: 'That message was just posted.' });

    const row = lastRow + 1;
    if (row > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 1);
    reviewUrl = reviewUrl_(sheet, row);
    // Approval is always a real unchecked checkbox; visitor-provided approved is ignored.
    sheet.getRange(row, 4).setDataValidation(checkbox_());
    sheet.getRange(row, 1, 1, 4).setValues([[new Date(), '', '', false]]);
    // Rich-text values preserve user text without interpreting a leading '=' as a formula.
    sheet.getRange(row, 2, 1, 2).setRichTextValues([[
      SpreadsheetApp.newRichTextValue().setText(name).build(),
      SpreadsheetApp.newRichTextValue().setText(message).build()
    ]]);
    SpreadsheetApp.flush();
  } catch (error) {
    console.error('Guestbook save failed: ' + String(error));
    return json_({ status: 'error', message: 'Your message could not be saved. Please try again.' });
  } finally {
    lock.releaseLock();
  }

  // A mail/quota failure must not turn a successfully saved message into a failed post.
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'Guestbook awaiting approval — ' + name.replace(/[\r\n]/g, ' '),
      body: 'New guestbook message from ' + name + '\n\n'
        + message + '\n\n'
        + 'This message is NOT public yet.\n\n'
        + 'Open this Google Sheet to review the message:\n' + reviewUrl + '\n\n'
        + 'Tick the checkbox in column D (approved) on this message’s row to publish it.\n'
        + 'Leave it unchecked to keep it private. Uncheck it later to remove it from the website.\n'
        + 'Refresh the website after changing approval.\n\n'
        + '请打开上面的表格链接，在该留言所在行勾选 D 列 approved 后公开。'
    });
  } catch (error) {
    console.error('Message saved, but notification email failed. Check pending rows in the review sheet. ' + String(error));
  }
  return json_({ status: 'ok', pending: true, entry: null });
}

function spreadsheet_() {
  const id = SHEET_ID || PropertiesService.getScriptProperties().getProperty('GUESTBOOK_SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error('Run setupGuestbook once from the original Sheet-bound Apps Script editor, or set SHEET_ID.');
}

function sheet_() {
  const sheet = spreadsheet_().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab named "' + SHEET_NAME + '".');
  const headers = sheet.getRange(1, 1, 1, 4).getValues()[0];
  const expected = ['date', 'name', 'message', 'approved'];
  if (headers.some(function (value, i) { return String(value).trim().toLowerCase() !== expected[i]; })) {
    throw new Error('Guestbook headers must be: date | name | message | approved.');
  }
  return sheet;
}

function checkbox_() {
  return SpreadsheetApp.newDataValidation().requireCheckbox().setAllowInvalid(false).build();
}

function reviewUrl_(sheet, row) {
  return sheet.getParent().getUrl().split('#')[0] + '#gid=' + sheet.getSheetId()
    + (row ? '&range=A' + row + ':D' + row : '');
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

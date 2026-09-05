/**
 * Guestbook backend for yvette-portfolio-green.html
 * Runs on Google Apps Script and stores messages in a Google Sheet you own.
 * Free, no server, and visitors do not need an account to post.
 *
 * SETUP
 *  1. Create a Google Sheet. Name the first tab: guestbook
 *     Put these four headers in row 1: date | name | message | approved
 *  2. In that sheet: Extensions > Apps Script. Delete the sample code and
 *     paste this whole file in.
 *  3. Set NOTIFY_EMAIL below to your address (or leave "" for no emails).
 *  4. Deploy > New deployment > type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone            <-- required, or the page cannot read it
 *     Copy the /exec URL it gives you.
 *  5. In yvette-portfolio-green.html find this line near the top of the script:
 *       const GUESTBOOK_API = "";
 *     Paste the /exec URL between the quotes. The guestbook section appears
 *     on the page as soon as that line is filled in.
 *
 * MODERATION
 *  With MODERATE = true, new messages land in the sheet with approved = FALSE
 *  and stay hidden. To publish one, tick its approved checkbox (or type TRUE).
 *  Set MODERATE = false to publish everything instantly.
 *
 * After editing this file, redeploy: Deploy > Manage deployments > edit >
 * Version: New version > Deploy. The /exec URL stays the same.
 */

const SHEET_NAME   = 'guestbook';
const MODERATE     = true;   // hold new messages until you approve them
const NOTIFY_EMAIL = '';     // e.g. 'yvettewu2017@gmail.com' — emails you on each new post
const MAX_NAME     = 40;
const MAX_MESSAGE  = 500;

function doGet() {
  try {
    const rows = sheet_().getDataRange().getValues().slice(1);
    const entries = rows
      .filter(function (r) { return r[2] && (!MODERATE || r[3] === true); })
      .map(function (r) {
        return {
          date: (r[0] instanceof Date ? r[0] : new Date(r[0])).toISOString(),
          name: String(r[1] || 'Anonymous'),
          message: String(r[2])
        };
      })
      .reverse();                       // newest first
    return json_(entries);
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Honeypot: bots fill hidden fields. Report success so they do not retry.
    if (data.website) return json_({ status: 'ok', pending: true });

    const name = String(data.name || '').trim().slice(0, MAX_NAME) || 'Anonymous';
    const message = String(data.message || '').trim().slice(0, MAX_MESSAGE);
    if (!message) return json_({ status: 'error', message: 'Message is empty.' });

    const sheet = sheet_();

    // Reject an identical message posted in the last hour (stops double-clicks
    // and the simplest flood attempts).
    const recent = sheet.getDataRange().getValues().slice(1).slice(-40);
    const hourAgo = Date.now() - 3600 * 1000;
    const duplicate = recent.some(function (r) {
      const t = (r[0] instanceof Date ? r[0] : new Date(r[0])).getTime();
      return t > hourAgo && String(r[2]).trim() === message;
    });
    if (duplicate) return json_({ status: 'error', message: 'That message was just posted.' });

    const now = new Date();
    sheet.appendRow([now, name, message, !MODERATE]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        'New guestbook message from ' + name,
        message + '\n\n' + (MODERATE
          ? 'Tick the approved column in your sheet to publish it.'
          : 'It is already live on your site.')
      );
    }

    return json_({
      status: 'ok',
      pending: MODERATE,
      entry: MODERATE ? null : { name: name, message: message, date: now.toISOString() }
    });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  }
}

function sheet_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab named "' + SHEET_NAME + '" in this sheet.');
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

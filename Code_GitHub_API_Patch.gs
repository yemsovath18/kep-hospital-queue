/*
 * GITHUB PAGES BRIDGE
 * Add this block to Code.gs.
 *
 * Keep the existing business functions and AudioData.gs unchanged.
 * The HTML pages hosted on GitHub call these endpoints using JSONP,
 * so browser CORS restrictions are avoided.
 *
 * IMPORTANT: replace your existing doGet(e) with the version below.
 */

function doGet(e) {
  e = e || {};
  var p = e.parameter || {};

  // GitHub Pages API mode
  if (p.api === '1') {
    return handleApiRequest_(p);
  }

  // Original Google Apps Script Web App pages (still work)
  var page = p.page || 'index';
  var templateName = 'Index';
  if (page === 'staff') templateName = 'Staff';
  else if (page === 'display') templateName = 'Display';

  var template = HtmlService.createTemplateFromFile(templateName);
  return template.evaluate()
    .setTitle('Hospital Queue System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function handleApiRequest_(p) {
  var action = p.action || '';
  var callback = p.callback || '';

  // JSONP callback must be a simple JavaScript identifier/path.
  if (!/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    callback = 'callback';
  }

  var result;
  try {
    switch (action) {
      case 'getServiceTypes':
        result = getServiceTypes();
        break;
      case 'getServiceTypesWithCounters':
        result = getServiceTypesWithCounters();
        break;
      case 'getServiceTypesFull':
        result = getServiceTypesFull();
        break;
      case 'createTicket':
        result = createTicket(p.serviceType || '');
        break;
      case 'getDisplayOverview':
        result = getDisplayOverview();
        break;
      case 'getLatestCalled':
        result = getLatestCalled();
        break;
      case 'getQueueData':
        result = getQueueData();
        break;
      case 'getDisplayData':
        result = getDisplayData();
        break;
      case 'callNextTicket':
        result = callNextTicket(p.serviceType || '');
        break;
      case 'updateTicketStatus':
        result = updateTicketStatus(p.queueId || '', p.newStatus || '');
        break;
      case 'getAudioManifest':
        result = getAudioManifest();
        break;
      case 'getAudioData':
        result = getAudioData(p.key || '');
        break;
      default:
        result = { success: false, error: 'Unknown API action: ' + action };
    }
  } catch (err) {
    result = { success: false, error: err && err.message ? err.message : String(err) };
  }

  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

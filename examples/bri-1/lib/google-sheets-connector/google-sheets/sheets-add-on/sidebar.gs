/**
 *  The event handler triggered when editing the spreadsheet.
 * @param {Event} e The onEdit event.
 */
function onEdit(e) {
  // Set a comment on the edited cell to indicate when it was changed.
  //var range = e.range;

  Logger.log(e.range)
  Logger.log(e.source)
  Logger.log(e.source.getId())
  Logger.log(e.source.getName())
  Logger.log(e.source.getSheetId())
  Logger.log(e.source.getSheetName())
  if (e.source.getSheetName() == "Proposals" || e.source.getSheetName() == "Proposal_Tiers") {
    return
  }
  e.range.setNote('Baselined. Last update: ' + new Date());
}

function onOpen(e) {
  SpreadsheetApp.getUi().createMenu("Baseline")
    .addItem('Open', 'showSidebar')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('test-sidebar')
    .setTitle('Baseline Integrator');
  SpreadsheetApp.getUi().showSidebar(ui);
}

var nodeURL = "https://us-central1-baseline-spreadsheet.cloudfunctions.net"

function authenticate(url, email, pass) {
  nodeURL = url
  var response = UrlFetchApp.fetch(nodeURL + '/sheets-authenticate?email=' + email + '&password=' + pass);
  Logger.log(response.getContentText());
  return response.getContentText();

}

function triggerSendProposals() {
  var response = UrlFetchApp.fetch(nodeURL + '/sheets-send-proposals');
  Logger.log(response.getContentText());
  return response.getContentText();
}
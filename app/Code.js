API_KEY = retrieveRiotApiKey();
REGION = retrieveRegion();

/**
 * Retrives Riot API key from Credentials tab of current document.
 *
 * @return User specified Riot API key
 */

function retrieveRiotApiKey() {
  var range = SpreadsheetApp.getActiveSheet().getRange("Credentials!B2");
  var value = range.getValue();
  return value;
}

/**
 * Retrives region information from Credentials tab of current document.
 *
 * @return User specified platform/region
 */

function retrieveRegion() {
  var range = SpreadsheetApp.getActiveSheet().getRange("Credentials!A2");
  var value = range.getValue();
  return value;
}

/**
 * Makes request to API with given region, query and API key (secret)
 *
 * @param {text} region Region/platform for request.
 * @param {text} query Endpoint and parameter(s)
 * @param {text} secret Riot API key.
 * @return JSON representation of Riot API response.
 */

const SHORT_CALL_LIMIT = 20;
const SHORT_CALL_PERIOD = 1;
const LONG_CALL_LIMIT = 100;
const LONG_CALL_PERIOD = 120;

function getCurrentTimestamp() {
  var d = new Date();
  var ts = d.getTime();
  return ts;
}

function makeHttpGetRequest(url) {
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var json = response.getContentText();
  var data = JSON.parse(json);
  return data;
}

function makeRiotApiCall(region, query, secret) {
  if (query.endsWith("&") || query.endsWith("?")) {
    var url =
      "https://" + region + ".api.riotgames.com" + query + "api_key=" + secret;
  } else {
    var url =
      "https://" + region + ".api.riotgames.com" + query + "?api_key=" + secret;
  }

  var data = makeHttpGetRequest(url);

  // Naive rate limiting. If waiting the short call period does not work, then just wait the long call period (minus the time we've already spent waiting).
  if (data.hasOwnProperty("status") && data["status"]["status_code"] == 429) {
    Utilities.sleep(SHORT_CALL_PERIOD * 1000);
    var data = makeHttpGetRequest(url);
    if (data.hasOwnProperty("status") && data["status"]["status_code"] == 429) {
      Utilities.sleep((LONG_CALL_PERIOD - SHORT_CALL_PERIOD) * 1000);
    }
  }
  return data;
}

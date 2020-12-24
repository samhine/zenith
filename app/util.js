/**
 * Retrives Riot API key from Credentials tab of current document.
 * 
 * @return 
 */

function retrieveRiotApiKey(){
    var range = SpreadsheetApp.getActiveSheet().getRange('Credentials!B2');
    var value = range.getValue();
    return value
}

/**
 * Retrives region information from Credentials tab of current document.
 * 
 * @return 
 */
  
function retrieveRegion(){
    var range = SpreadsheetApp.getActiveSheet().getRange('Credentials!A2');
    var value = range.getValue();
    return value
}

/**
 * Makes request to API with given region, query and API key (secret)
 * 
 * @param {text} region Region/platform for request.
 * @param {text} query Endpoint and parameter(s)
 * @param {text} secret Riot API key.
 * @return JSON representation of Riot API response.
 */

function makeRiotApiCall(region, query, secret){
    if (query.endsWith("&")) var url = "https://"+region+".api.riotgames.com"+query+"api_key="+secret;
    else var url = "https://"+region+".api.riotgames.com"+query+"?api_key="+secret;

    var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
    var json = response.getContentText();
    var data = JSON.parse(json);
    return data
}
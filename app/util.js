
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

function makeRiotApiCall(region, query, secret){
    if (query.endsWith("&") || query.endsWith("?")) var url = "https://"+region+".api.riotgames.com"+query+"api_key="+secret;
    else var url = "https://"+region+".api.riotgames.com"+query+"?api_key="+secret;


    var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': false});
    var json = response.getContentText();
    var data = JSON.parse(json);
    return data
}
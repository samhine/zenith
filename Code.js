API_KEY = retrieveRiotApiKey()
REGION = retrieveRegion()

function retrieveRiotApiKey(){
  var range = SpreadsheetApp.getActiveSheet().getRange('Credentials!B2');
  var value = range.getValue();
  return value
}

function retrieveRegion(){
  var range = SpreadsheetApp.getActiveSheet().getRange('Credentials!A2');
  var value = range.getValue();
  return value
}

function makeRiotApiCall(query){
  var url = "https://"+REGION+".api.riotgames.com"+query+"?api_key="+API_KEY
  
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var json = response.getContentText();
  var data = JSON.parse(json);
  return data
}

function getAccountIdBySummoner(summoner_name){
  var data = makeRiotApiCall("/lol/summoner/v4/summoners/by-name/"+summoner_name)
  return data.accountId
}

function getSummonerByAccountId(account_id){
  var data = makeRiotApiCall("/lol/summoner/v4/summoners/by-account/"+account_id)
  return data.name
}


/**
 * Retrives matches for a certain account ID. Riot API documentation here: https://developer.riotgames.com/apis#match-v4/GET_getMatchlist.
 *
 * @param {string} account_id ID for a summoner.
 * @param {string} champion_ids of champion IDs for filtering the matchlist (comma delimited).
 * @param {string} queue_ids of queue IDs for filtering the matchlist (comma delimited).
 * @param {string} end_time end time to use for filtering matchlist specified as epoch milliseconds.
 * @param {string} begin_time begin time to use for filtering matchlist specified as epoch milliseconds. 
 * @param {string} end_index end index to use for filtering matchlist. If beginIndex is specified, but not endIndex, then endIndex defaults to beginIndex+100. If endIndex is specified, but not beginIndex, then beginIndex defaults to 0. If both are specified, then endIndex must be greater than beginIndex. The maximum range allowed is 100.
 * @param {string} begin_index begin index to use for filtering matchlist. If beginIndex is specified, but not endIndex, then endIndex defaults to beginIndex+100. If endIndex is specified, but not beginIndex, then beginIndex defaults to 0. If both are specified, then endIndex must be greater than beginIndex. The maximum range allowed is 100.
 * @return Table containing matchlist of specified account with given parameters.
 * @customfunction
 */
 

function getMatchlistsByAccountId(account_id, champion_ids, queue_ids, end_time, begin_time, end_index, begin_index){
  var multi_query_params = {
    "champion": champion_ids ? champion_ids.split(",") : null,
    "queue": queue_ids ? queue_ids.split(",") : null
  }
  
  var query_params = {
    "endTime": end_time,
    "beginTime": begin_time,
    "endIndex": end_index,
    "beginIndex": begin_index
  }
  
  var base_url = "https://"+REGION+".api.riotgames.com/lol/match/v4/matchlists/by-account/"+account_id+"?";
  
  for (var key in query_params) {
    if (query_params[key] != null){
      base_url += key + "=" + query_params[key] + "&";
    }
  }
  
  for (var key in multi_query_params) {
    if (multi_query_params[key] != null){
      multi_query_params[key].forEach(function (item, index) {
        base_url += key + "=" + item + "&";
      });
    }
  }
  
  var response = UrlFetchApp.fetch(base_url+"api_key="+API_KEY, {'muteHttpExceptions': true});
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  var grid_data = [["platformId","gameId","champion","queue","season","timestamp","role","lane"]]
  for (var i=0; i<data.matches.length; i++){
    var record = data.matches[i]
    var new_row = [record.platformId, record.gameId, record.champion, record.queue, record.season, record.timestamp, record.role, record.lane]
    grid_data.push(new_row)
  }
  
  return grid_data
}
import makeRiotApiCall from 'util';
import {API_KEY, REGION} from 'Main';

/**
 * Retrieves matches for a certain account ID. Riot API documentation here: https://developer.riotgames.com/apis#match-v4/GET_getMatchlist.
 *
 * @param {text} account_id ID for a summoner.
 * @param {text} champion_ids  Set of champion IDs for filtering the matchlist (comma delimited).
 * @param {text} queue_ids Set of queue IDs for filtering the matchlist (comma delimited).
 * @param {text} end_time End time to use for filtering matchlist specified as epoch milliseconds.
 * @param {text} begin_time Begin time to use for filtering matchlist specified as epoch milliseconds. 
 * @param {text} end_index End index to use for filtering matchlist. If beginIndex is specified, but not endIndex, then endIndex defaults to beginIndex+100. If endIndex is specified, but not beginIndex, then beginIndex defaults to 0. If both are specified, then endIndex must be greater than beginIndex. The maximum range allowed is 100.
 * @param {text} begin_index Begin index to use for filtering matchlist. If beginIndex is specified, but not endIndex, then endIndex defaults to beginIndex+100. If endIndex is specified, but not beginIndex, then beginIndex defaults to 0. If both are specified, then endIndex must be greater than beginIndex. The maximum range allowed is 100.
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
    
    var base_url = "/lol/match/v4/matchlists/by-account/"+account_id+"?";
    
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
    
    var data = makeRiotApiCall(REGION, base_url, API_KEY)
    
    var grid_data = [["platformId","gameId","champion","queue","season","timestamp","role","lane"]]
    for (var i=0; i<data.matches.length; i++){
      var record = data.matches[i]
      var new_row = [record.platformId, record.gameId, record.champion, record.queue, record.season, record.timestamp, record.role, record.lane]
      grid_data.push(new_row)
    }
    
    return grid_data
}


/**
 * Retrieves data for a single game object from the Riot API
 * 
 * @param {text} gameId ID of game/match we're requesting data for
 * @returns JSON representation of Riot API response for given game ID.
 */

function getMatchByGameId(game_id){
    var query = "/lol/match/v4/matches/"+game_id;
    var data = makeRiotApiCall(REGION, query, API_KEY);
    return data
}

 /**
 * Retrieves data for a single timeline object from the Riot API
 * 
 * @param {text} gameId ID of game/match we're requesting data for
 * @returns JSON representation of Riot API response for given game ID.
 */

function getTimelineByGameId(game_id){
    var query = "/lol/match/v4/timelines/by-match/"+game_id;
    var data = makeRiotApiCall(REGION, query, API_KEY);
    return data
}
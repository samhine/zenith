const CHAMPION_NAMES = getAllChampionNames();

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

function getMatchlistsByAccountId(
  account_id,
  champion_ids,
  queue_ids,
  end_time,
  begin_time,
  end_index,
  begin_index
) {
  var multi_query_params = {
    champion: champion_ids ? champion_ids.split(",") : null,
    queue: queue_ids ? queue_ids.split(",") : null,
  };

  var query_params = {
    endTime: end_time,
    beginTime: begin_time,
    endIndex: end_index,
    beginIndex: begin_index,
  };

  var base_url = "/lol/match/v4/matchlists/by-account/" + account_id + "?";

  for (var key in query_params) {
    if (query_params[key] != null) {
      base_url += key + "=" + query_params[key] + "&";
    }
  }

  for (var key in multi_query_params) {
    if (multi_query_params[key] != null) {
      multi_query_params[key].forEach(function (item, index) {
        base_url += key + "=" + item + "&";
      });
    }
  }

  var data = makeRiotApiCall(REGION, base_url, API_KEY);

  var grid_data = [
    [
      "platformId",
      "gameId",
      "champion",
      "queue",
      "season",
      "timestamp",
      "role",
      "lane",
    ],
  ];
  for (var i = 0; i < data.matches.length; i++) {
    var record = data.matches[i];
    var new_row = [
      record.platformId,
      record.gameId,
      record.champion,
      record.queue,
      record.season,
      record.timestamp,
      record.role,
      record.lane,
    ];
    grid_data.push(new_row);
  }

  return grid_data;
}

/**
 * Retrieves data for a single game object from the Riot API
 *
 * @param {text} gameId ID of game/match we're requesting data for
 * @returns JSON representation of Riot API response for given game ID.
 */

function getMatchByGameId(game_id) {
  var query = "/lol/match/v4/matches/" + game_id;
  var data = makeRiotApiCall(REGION, query, API_KEY);
  return data;
}

/**
 * Retrieves data for a single timeline object from the Riot API
 *
 * @param {text} gameId ID of game/match we're requesting data for
 * @returns JSON representation of Riot API response for given game ID.
 */

function getTimelineByGameId(game_id) {
  var query = "/lol/match/v4/timelines/by-match/" + game_id;
  var data = makeRiotApiCall(REGION, query, API_KEY);
  return data;
}

/**
 * Parses match for chosen statistic and returns it for given champion.
 *
 * @param {text} match_id
 * @param {text} champion_name
 * @param {text} statistic
 * @return {text} Statistic for champion in provided match.
 * @customfunction
 */

function getStatForChampion(match_id, champion_name, statistic) {
  // Hint to correct formats?
  if (match_id == null || champion_name == null || statistic == null) {
    throw new Error("Missing field.");
  } else if (!CHAMPION_NAMES.includes(champion_name)) {
    throw new Error("Champion not found.");
  }

  try {
    match_data = getMatchByGameId(match_id);
  } catch (err) {
    throw new Error("Error getting match data:" + err.toString());
  }

  try {
    timeline_data = getTimelineByGameId(match_id);
  } catch (err) {
    throw new Error("Error getting timeline data:" + err.toString());
  }

  try {
    participant_id = participantIdForChampion(match_id, champion_name);
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Champion not found in match.");
    } else {
      throw err;
    }
  }
  return getStatisticForParticipant(match_data, participant_id, statistic);
}

/**
 * Parses match for chosen statistic and returns it for given summoner.
 *
 * @param {text} match_id
 * @param {text} summoner_name
 * @param {text} statistic
 * @return {text} Statistic for summoner in provided match.
 * @customfunction
 */

function getStatForSummoner(match_id, summoner_name, statistic) {
  if (match_id == null || summoner_name == null || statistic == null) {
    throw new Error("Missing field.");
  }

  try {
    match_data = getMatchByGameId(match_id);
  } catch (err) {
    throw new Error("Error getting match data:" + err.toString());
  }

  try {
    timeline_data = getTimelineByGameId(match_id);
  } catch (err) {
    throw new Error("Error getting timeline data:" + err.toString());
  }

  participant_id = participantIdForSummoner(match_id, summoner_name);

  return getStatisticForParticipant(match_data, participant_id, statistic);
}

/**
 * Parses match for chosen statistic and returns it for given participant.
 *
 * @param {text} match_id
 * @param {text} participant_id
 * @param {text} statistic
 */

function getStatisticForParticipant(match_data, participant_id, statistic) {
  switch (statistic) {
    case "champion":
      return getChampionForParticipant(match_data, participant_id);
    case "kills":
      return getKillsForParticipant(match_data, participant_id);
    case "deaths":
      return getDeathsForParticipant(match_data, participant_id);
    case "assists":
      return getAssistsForParticipant(match_data, participant_id);
    case "totalGold":
      return getTotalGoldForParticipant(match_data, participant_id);
    case "goldPerMin":
      return getGoldPerMinForParticipant(match_data, participant_id);
    case "cs":
      return getCsForParticipant(match_data, participant_id);
    case "csPerMin":
      return getCsPerMinForParticipant(match_data, participant_id);
    case "damage":
      return getDamageForParticipant(match_data, participant_id);
    case "damagePerMin":
      return getDamagePerMinForParticipant(match_data, participant_id);
    case "kdr":
      return getKdrForParticipant(match_data, participant_id);
    default:
      throw new Error("Statistic not valid.");
  }
}

/**
 * Finds participant ID for a given summoner name within a match.
 *
 * @param {text} match_id
 * @param {text} summoner_name
 */

function participantIdForSummoner(match_id, summoner_name) {
  match_data = getMatchByGameId(match_id);
  account_id = getAccountIdBySummoner(summoner_name);

  participant_info = match_data["participantIdentities"].find(
    (player) => player["player"]["currentAccountId"] == account_id
  );

  if (participant_info == undefined) {
    throw new Error("Summoner not found in match");
  }

  return participant_info["participantId"];
}

/**
 * Finds participant ID for a given champion name within a match.
 *
 * @param {text} match_id
 * @param {text} champion_name
 */

function participantIdForChampion(match_id, champion_name) {
  match_data = getMatchByGameId(match_id);
  champion_id = getChampionInfoByName(champion_name)["key"];

  return match_data["participants"].find(
    (player) => player["championId"] == champion_id
  )["participantId"];
}

/**
 * Provides JSON of Riot provided statistics which do not require calculation
 *
 * @param {text} match_data
 * @param {text} participant_id
 */
function getBaseStatsForParticipant(match_data, participant_id) {
  return match_data["participants"].find(
    (player) => player["participantId"] == participant_id
  )["stats"];
}

function getChampionForParticipant(match_data, participant_id) {
  champion_id = match_data["participants"].find(
    (player) => player["participantId"] == participant_id
  )["championId"];
  return getChampionInfoById(champion_id)["name"];
}

function getKdrForParticipant(match_data, participant_id) {
  return (
    getKillsForParticipant(match_data, participant_id) +
    "/" +
    getDeathsForParticipant(match_data, participant_id) +
    "/" +
    getAssistsForParticipant(match_data, participant_id)
  );
}

function getKillsForParticipant(match_data, participant_id) {
  return getBaseStatsForParticipant(match_data, participant_id)["kills"];
}

function getDeathsForParticipant(match_data, participant_id) {
  return getBaseStatsForParticipant(match_data, participant_id)["deaths"];
}

function getAssistsForParticipant(match_data, participant_id) {
  return getBaseStatsForParticipant(match_data, participant_id)["assists"];
}

function getTotalGoldForParticipant(match_data, participant_id) {
  return getBaseStatsForParticipant(match_data, participant_id)["goldEarned"];
}

function getGoldPerMinForParticipant(match_data, participant_id) {
  minutes = match_data["gameDuration"] / 60;
  total_gold = getTotalGoldForParticipant(match_data, participant_id);
  return total_gold / minutes;
}

function getCsForParticipant(match_data, participant_id) {
  return getBaseStatsForParticipant(match_data, participant_id)[
    "totalMinionsKilled"
  ];
}

function getCsPerMinForParticipant(match_data, participant_id) {
  minutes = match_data["gameDuration"] / 60;
  total_cs = getCsForParticipant(match_data, participant_id);
  return total_cs / minutes;
}

function getDamageForParticipant(match_data, participant_id) {
  return getBaseStatsForParticipant(match_data, participant_id)[
    "totalDamageDealt"
  ];
}

function getDamagePerMinForParticipant(match_data, participant_id) {
  minutes = match_data["gameDuration"] / 60;
  total_dmg = getDamageForParticipant(match_data, participant_id);
  return total_dmg / minutes;
}

/**
 * Champion list for given match. If side is undefined, all champions are returned with blue side champions listed first.
 *
 * @param {text} match_id ID of match
 * @param {text|undefined} side Side for which champions will be returned ("blue" or "red")
 * @return {range} List of champions for given match.
 * @customfunction
 */

function getChampionListForMatch(match_id, side) {
  match_data = getMatchByGameId(match_id);
  if (side != null && side != "blue" && side != "red") {
    throw new Error("Invalid side selection.");
  }

  participant_data = match_data["participants"];
  if (side == null) {
    return participant_data.map((p) => {
      return [getChampionInfoById(p["championId"])["name"]];
    });
  }

  side_id = side == "blue" ? 100 : 200;

  return participant_data.map((p) => {
    if (p["teamId"] == side_id) {
      return [getChampionInfoById(p["championId"])["name"]];
    }
  });
}

/**
 * Summoner list for given match. If side is undefined, all summoners are returned with blue side summoners listed first. Note, this method will NOT work for custom games since indentity information is not given by the API.
 *
 * @param {text} match_id ID of match
 * @param {text|undefined} side Side for which summoners will be returned ("blue" or "red")
 * @return {range} List of summoners for given match.
 * @customfunction
 */

function getSummonerListForMatch(match_id, side) {
  match_data = getMatchByGameId(match_id);
  if (side != null && side != "blue" && side != "red") {
    throw new Error("Invalid side selection.");
  }

  participant_indentities = match_data["participantIdentities"];

  // for (var p in participant_indentities) {
  //   all_summoner_names.push([participant_indentities[p]["summonerName"]]);
  // }

  all_summoner_names = participant_indentities.map((p) => {
    return [p["player"]["summonerName"]];
  });

  if (side == null) {
    return all_summoner_names;
  } else if (side == "blue") {
    return all_summoner_names.slice(0, 5);
  } else {
    return all_summoner_names.slice(5, 10);
  }
}

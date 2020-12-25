/**
 * Retrieves account ID for a given summoner name.
 *
 * @param {text} summoner_name Name of summmoner.
 * @return {text} Account ID for provided summoner name.
 * @customfunction
 */
function getAccountIdBySummoner(summoner_name) {
  if (!summoner_name) {
    throw new Error("Summoner name not provided.");
  }
  var data = makeRiotApiCall(
    REGION,
    "/lol/summoner/v4/summoners/by-name/" + summoner_name,
    API_KEY
  );
  Logger.log(JSON.stringify(data));
  return data.accountId;
}

/**
 * Retrieves summmoner name for a given account ID.
 *
 * @param {text} account_id Account ID of summmoner.
 * @return {text} Summoner name for provided account ID.
 */
function getSummonerByAccountId(account_id) {
  if (!account_id) {
    throw new Error("Account ID not provided.");
  }
  var data = makeRiotApiCall(
    REGION,
    "/lol/summoner/v4/summoners/by-account/" + account_id,
    API_KEY
  );
  return data.name;
}

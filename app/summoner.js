/**
 * Retrieves account ID for a given summoner name.
 * 
 * @param {text} summoner_name Name of summmoner.
 * @return Account ID for provided summoner name.
 * @customfunction
 */
function getAccountIdBySummoner(summoner_name){
    var data = makeRiotApiCall(REGION, "/lol/summoner/v4/summoners/by-name/"+summoner_name, API_KEY)
    return data.accountId
}

/**
 * Retrieves summmoner name for a given account ID.
 * 
 * @param {text} account_id Account ID of summmoner.
 */
function getSummonerByAccountId(account_id){
    var data = makeRiotApiCall(REGION, "/lol/summoner/v4/summoners/by-account/"+account_id, API_KEY)
    return data.name
}

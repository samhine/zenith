
/**
 * Retrieves account ID for a given summoner name.
 * 
 * @param {text} summoner_name Name of summmoner.
 */
function getAccountIdBySummoner(summoner_name){
    var data = makeRiotApiCall("/lol/summoner/v4/summoners/by-name/"+summoner_name)
    return data.accountId
}

/**
 * Retrieves summmoner name for a given account ID.
 * 
 * @param {text} account_id Account ID of summmoner.
 */
function getSummonerByAccountId(account_id){
    var data = makeRiotApiCall("/lol/summoner/v4/summoners/by-account/"+account_id)
    return data.name
}

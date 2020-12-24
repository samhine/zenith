// Champion data indexed by champion name (default from Data Dragon)
const CHAMPION_DATA = requestDataDragonChampionData();
// Champion data indexed by champion ID (easier for lookups from game data)
const CHAMPION_DATA_BY_NAME = reindexChampionDataByName(CHAMPION_DATA);

function requestDataDragonVersion() {
  var url = "https://ddragon.leagueoflegends.com/api/versions.json";

  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var json = response.getContentText();
  var data = JSON.parse(json);
  return data[0];
}

function requestDataDragonChampionData() {
  var version = requestDataDragonVersion();
  var url =
    "http://ddragon.leagueoflegends.com/cdn/" +
    version +
    "/data/en_US/champion.json";

  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var json = response.getContentText();
  var data = JSON.parse(json);
  return data["data"];
}

function getChampionInfoById(champion_id) {
  for (var name in CHAMPION_DATA) {
    if (CHAMPION_DATA[name]["key"] == champion_id) {
      return CHAMPION_DATA[name];
    }
  }
}

function reindexChampionDataByName(champion_data) {
  var reindexed_data = {};

  for (var name in champion_data) {
    var champion_id = champion_data[name]["key"];
    reindexed_data[champion_id] = champion_data[name];
  }

  return reindexed_data;
}

function getChampionInfoByName(champion_name) {
  return CHAMPION_DATA[champion_name];
}

function getAllChampionNames() {
  var champion_names = [];
  for (var name in CHAMPION_DATA) {
    champion_names.push(name);
  }
  return champion_names;
}

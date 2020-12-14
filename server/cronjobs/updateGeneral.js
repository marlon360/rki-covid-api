const superagent = require('superagent');
const superagentJsonapify = require('superagent-jsonapify');

superagentJsonapify(superagent);

module.exports.updateGeneral = async (database) => {

  try {
    let dCollection = database.collection("general");

    // get date string for today
    const todayString = (new Date()).toDateString();

    // find entry for today
    const todayEntry = await dCollection.findOne({ date: todayString });

    // we don't need to update if entry already exists
    if (todayEntry) {
      console.log("skipping update");
      return;
    } else {
      // if no entry exists, get latest data from api
      const response = await superagent.get("https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.geojson").maxResponseSize(500 * 1024 * 1024);
      const apidata = response.body;

      let cumulative = {
        recovered: 0,
        cases: 0,
        deaths: 0,
      }

      for (const feature of apidata.features) {
        cumulative.recovered += Math.max(0, feature.properties.AnzahlGenesen);
        cumulative.cases += Math.max(0, feature.properties.AnzahlFall);
        cumulative.deaths += Math.max(0, feature.properties.AnzahlTodesfall);
      }

      const lastUpdate = apidata.features[0].properties.Datenstand;

      const lastUpdateDate = parseDate(lastUpdate);
      const lastUpdateDateString = lastUpdateDate.toDateString();

      const latestData = {
        lastUpdate,
        ...cumulative,
      }

      // check if entry for this date exists
      const lastUpdateEntry = await dCollection.findOne({ date: lastUpdateDateString });
      if (!lastUpdateEntry) {
        const insert = await dCollection.updateOne({
          date: lastUpdateDateString
        },
          {
            $set: {
              date: lastUpdateDateString,
              ...latestData
            }
          },
          {
            upsert: true
          });
        console.log("updated database");
      }
    }

  } catch (e) {
    console.log(e);
  }

};

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // note parts[1]-1
  return new Date(parts[2], parts[1] - 1, parts[0]);
}
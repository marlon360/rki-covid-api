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
      console.log("Skipping database update.");
      return;
    } else {
      // if no entry exists, get latest data from api
      const response = await superagent.get("https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.geojson").maxResponseSize(500 * 1024 * 1024);
      const apidata = response.body;

      const lastUpdate = apidata.features[0].properties.Datenstand;

      const lastUpdateDate = parseDate(lastUpdate);
      const lastUpdateDateString = lastUpdateDate.toDateString();

      // get data of states to calculate week incidence
      const statesResponse = await superagent.get("https://iot.shinewelt.de/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_EWZ,cases7_bl,Aktualisierung,Fallzahl&returnGeometry=false&outSR=4326&f=json").maxResponseSize(500 * 1024 * 1024);
      const statesData = JSON.parse(statesResponse.text);

      const statesUpdateDate = new Date(statesData.features[0].attributes.Aktualisierung + (3600 * 1000));

      if (lastUpdateDate.getTime() !== statesUpdateDate.getTime()) {
        console.log("Skipping database update. Data from different dates.");
        return;
      }

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

      // calculate week incidence
      let population = 0;
      let casesPerWeek = 0;
      let cases = 0;
      for (const feature of statesData.features) {
        population += feature.attributes.LAN_ew_EWZ;
        casesPerWeek += feature.attributes.cases7_bl;
        cases += feature.attributes.Fallzahl;
      }

      const weekIncidence = casesPerWeek / population * 100000;
      const casesPer100k = cases / population * 100000;

      const latestData = {
        lastUpdate,
        ...cumulative,
        weekIncidence,
        casesPerWeek,
        casesPer100k
      }

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
      if (insert.modifiedCount > 0) {
        console.log("Updated database!");
      } else {
        console.log("Data already exists.");
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
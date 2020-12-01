'use strict';

const superagent = require('superagent');
const superagentJsonapify = require('superagent-jsonapify');
const MongoClient = require('mongodb').MongoClient;

superagentJsonapify(superagent);

// get database credentials from environment
const dbuser = process.env['DATABASE_USER'];
const dbpassword =  process.env['DATABASE_PASSWORD'];
const dbname =  process.env['DATABASE_NAME'];

// construct mongodb url
const uri = `mongodb+srv://${dbuser}:${dbpassword}@cluster0.w244q.mongodb.net/${dbname}?retryWrites=true&w=majority`;

module.exports.general = async event => {

  try {
    // connect to mongodb
    const client = await MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db(dbname);
    let dCollection = db.collection("general");

    const todayString = (new Date()).toDateString();
    let yesterdayString;

    // test if an entry for today exists
    const todayEntry = await dCollection.findOne({date: todayString});

    let latestData;
    
    if (todayEntry) {
      latestData = todayEntry;
      delete latestData.date;
      delete latestData._id;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate()-1);
      yesterdayString = yesterday.toDateString();

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

        latestData = {
            lastUpdate,
            ...cumulative,
        }

        // test if latest data is from today
        if (lastUpdateDateString == todayString) {
            const insert = await dCollection.insertOne({
                date: lastUpdateDateString,
                ...latestData
            });
        } else {
            const lastUpdateEntry = await dCollection.findOne({date: lastUpdateDateString});
            if (!lastUpdateEntry) {
                const insert = await dCollection.insertOne({
                    date: lastUpdateDateString,
                    ...latestData
                });
            }
        }

        const yesterday = new Date();
        yesterday.setDate(lastUpdateDate.getDate()-1);
        yesterdayString = yesterday.toDateString();

    }

    const yesterdayEntry = await dCollection.findOne({date: yesterdayString});
    let result;

    if (yesterdayEntry) {
        result = {
            ...latestData,
            difference: {
                recovered: latestData.recovered - yesterdayEntry.recovered,
                cases: latestData.cases - yesterdayEntry.cases,
                deaths: latestData.deaths - yesterdayEntry.deaths
            }
        }
    } else {
        result = {
            ...latestData,
            difference: {
                recovered: null,
                cases: null,
                deaths: null
            }
        };
    }

    // close database connection
    client.close();

    return {
      statusCode: 200,
      body: JSON.stringify(
        result,
        null,
        2
      )
    }

  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          error: e
        },
        null,
        2
      )
    }
  }

};

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // note parts[1]-1
  return new Date(parts[2], parts[1]-1, parts[0]);
}

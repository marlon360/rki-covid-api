'use strict';

const MongoClient = require('mongodb').MongoClient;

// get database credentials from environment
const dbuser = process.env['DATABASE_USER'];
const dbpassword = process.env['DATABASE_PASSWORD'];
const dbname = process.env['DATABASE_NAME'];

// construct mongodb url
const uri = `mongodb+srv://${dbuser}:${dbpassword}@cluster0.w244q.mongodb.net/${dbname}?retryWrites=true&w=majority`;

module.exports.general = async () => {
  try {
    // connect to mongodb
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbname);
    let dCollection = db.collection("general");
    let result;

    // test if an entry for today exists
    const latestEntries = await dCollection.find().sort({ _id: -1 }).limit(2).toArray();

    if (latestEntries.length == 0) {
      throw 'No entries in the database!';
    }

    if (latestEntries.length > 0) {

      const todayData = latestEntries[0];
      let yesterdayData = null;

      // check if one day difference
      if (latestEntries.length == 2) {
        const today = new Date(latestEntries[0].date);
        const yesterday = new Date(latestEntries[1].date);

        const oneDayDifference = 1000 * 60 * 60 * 24;
        if (today - yesterday == oneDayDifference) {
          yesterdayData = latestEntries[1]
        }
      }

      let difference;
      if (yesterdayData != null) {
        difference = {
          recovered: todayData.recovered - yesterdayData.recovered,
          cases: todayData.cases - yesterdayData.cases,
          deaths: todayData.deaths - yesterdayData.deaths
        }
      } else {
        difference = {
          recovered: null,
          cases: null,
          deaths: null
        }
      }

      // clear unimportant keys
      delete todayData.date;
      delete todayData._id;

      result = {
        ...todayData,
        difference
      }
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

  } catch (e) {
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
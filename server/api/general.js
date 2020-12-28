'use strict';

module.exports.general = async (req, res) => {
  try {
    const db = req.app.locals.database;
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
          deaths: todayData.deaths - yesterdayData.deaths,
          weekIncidence: todayData.weekIncidence - yesterdayData.weekIncidence,
          casesPerWeek: todayData.casesPerWeek - yesterdayData.casesPerWeek,
          casesPer100k: todayData.casesPer100k - yesterdayData.casesPer100k
        }
      } else {
        difference = {
          recovered: null,
          cases: null,
          deaths: null,
          weekIncidence: null,
          casesPerWeek: null,
          casesPer100k: null
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

    res.json({...result})

  } catch (e) {
    res.statusCode = 500;
    res.json({
      error: e
    })
  }

};

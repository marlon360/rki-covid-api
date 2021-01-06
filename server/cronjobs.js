const { CronJob } = require("cron");
const { updateDistricts } = require("./cronjobs/updateDistricts");
const { updateDistrictsMap } = require("./cronjobs/updateDistrictsMap");
const { updateGeneral } = require("./cronjobs/updateGeneral");
const { updateStates } = require("./cronjobs/updateStates");
const { updateStatesMap } = require("./cronjobs/updateStatesMap");

const { connectToDatabase } = require('./utils/database');

async function updateDataSources(database) {
    try {
      await updateGeneral(database);
      await updateDistricts();
      await updateStates();
      await updateStatesMap();
      await updateDistrictsMap();
    } catch (error) {
      console.log(error);
    }
  }

async function StartCronjobs() {
    console.log("Booting Cronjobs..");

    console.log("Connection to database..");
    const database = await connectToDatabase();
    
    console.log("Updating data sources..");
    await updateDataSources(database);
    
    console.log("Starting cronjob..");
    var job = new CronJob('0 */20 * * * *', () => updateDataSources(database));
    job.start();
}

StartCronjobs();
'use strict';

const axios = require('axios');

module.exports.general = async (req, res) => {
  try {

    const response = await axios.get("https://api.corona-zahlen.org/germany");
    const apidata = response.data;

    res.json({
      ...apidata,
      lastUpdate: (new Date(apidata.meta.lastUpdate)).toLocaleString("de-DE"),
      difference: {
        ...apidata.delta
      }
    })

  } catch (e) {
    res.statusCode = 500;
    res.json({
      error: e
    })
  }

};

const axios = require('axios');
const { District } = require('../models');
const fs = require('fs');
const path = require('path');

module.exports.districts =  async (req, res) => {
    res.sendFile(path.resolve(__dirname, '../cache/districts.json'));
}

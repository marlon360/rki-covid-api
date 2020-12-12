const axios = require('axios');
const { State } = require('../models');
const fs = require('fs');
const path = require('path');

module.exports.states =  async (req, res) => {
    res.sendFile(path.resolve(__dirname, '../cache/states.json'));
}
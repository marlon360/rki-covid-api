const path = require('path');
const express = require('express')
const cors = require('cors');
const compression = require('compression')

const { general } = require('./api/general');
const { states } = require('./api/states');
const { statesMap } = require('./api/states-map');
const { districts } = require('./api/districts');
const { districtsMap } = require('./api/districts-map');

const { connectToDatabase } = require('./utils/database');

const app = express()
const port = 3000

app.use(cors())
// compress all responses
app.use(compression())

app.get('/', async (req, res) => {
  res.sendFile(path.resolve(__dirname, 'static/index.html'));
})

app.get('/api', async (req, res) => {
  res.redirect('/api/general');
})

app.get('/api/general', general)

app.get('/api/states', states)
app.get('/api/states-map', statesMap)
app.get('/api/districts', districts)
app.get('/api/districts-map', districtsMap)

async function startServer() {
  console.log("Connection to database..");
  const database = await connectToDatabase();

  console.log("Starting server..");
  app.locals.database = database;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

startServer();

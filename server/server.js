const express = require('express')
const { general } = require('./api/general');
const app = express()
const port = 3000

app.get('/general', async (req, res) => {
  general().then((response) => {
    res.statusCode = response.statusCode;
    res.send(response.body);
  }).catch((error) => {
    res.statusCode = error.statusCode;
    res.send(error.body);
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
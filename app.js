const express = require('express')
require('dotenv').config(); // this loads the defined variables from .env
const app = express()
const port = process.env.PORT || 1920;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`++ Server started ==> PORT: ${port}`)
})

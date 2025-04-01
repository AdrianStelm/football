const express = require('express')
const app = express()
const path = require('path')
const routes = require('./routes/routes')
const port = 3000;

app.use("/", routes);
app.use(express.static(path.join(__dirname,'..','client','src')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
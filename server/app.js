const express = require('express')
const app = express()
const routes = require('./routes/routes')
const port = 3000

app.use("/", routes);
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
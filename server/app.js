const express = require('express')
const app = express()
const path = require('path')
const routes = require('./routes/routes')
const {run} = require('./models/db')
const port = 3000;

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'client', 'src')));
app.use("/", routes);


async function connectToDb(){
  await run()
}

app.listen(port, () => {
  connectToDb();
  console.log(`Example app listening on port ${port}`)
})
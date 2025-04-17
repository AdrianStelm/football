require('dotenv').config({ path: 'server/.env' });
const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes')
const { run } = require('./models/db')
const { secret } = require("../config")

const port = 3000;

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'client', 'src')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/", routes);


async function connectToDb(){
  await run()
}

app.listen(port, () => {
  connectToDb();
  console.log(`Example app listening on port ${port}`)
})
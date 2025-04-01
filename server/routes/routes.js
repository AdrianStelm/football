const express = require("express");
const router = express.Router();
const path = require('path')
const userController = require('../controllers/Users/userController')
const filePath = path.join(__dirname, "..", "..",'client','src', "public");

const {check} = require('express-validator')
router.get("/", async (req, res) => {
  res.sendFile(path.join(filePath,'index.html'));
});

router.get('/register')

router.post('/register', userController.registration,[
  check('username', 'Username can`t be empty').notEmpty(),
  check('password', 'Password should have 4 and more symbols and don`t have more than 16 symbols').isLength({min: 4, max: 16}),])
router.post('/login', userController.login)
router.get('/users', userController.getUsers)

module.exports = router;

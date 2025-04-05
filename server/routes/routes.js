const express = require("express");
const router = express.Router();
const path = require('path');
const userController = require('../controllers/Users/userController');
const filePath = path.join(__dirname, "..", "..", 'client', 'src', "public");
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const {check} = require('express-validator');

router.get("/", async (req, res) => {
  res.sendFile(path.join(filePath, 'index.html'));
});

router.get('/register', (req, res) => {
  res.send('Register page');
});


router.post('/register', [
  check('username', 'Username can`t be empty').notEmpty(),
  check('password', 'Password should have 4 and more symbols and don`t have more than 16 symbols').isLength({min: 4, max: 16}),
], userController.registration);

router.post('/login', userController.login);
router.post('/forgot-password',roleMiddleware(['User']), userController.retrievePassword);
router.post('/change-password/:token',roleMiddleware(['User']),userController.updatePassword);

router.get('/users', authMiddleware, roleMiddleware(['Admin']), userController.getUsers);

module.exports = router;
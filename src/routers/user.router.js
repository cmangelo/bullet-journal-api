const express = require('express');

const auth = require('../middleware/auth');
const UserController = require('../controllers/user.controller');

const router = express.Router();

router.post('/login', UserController.loginUser);

router.post('/logout', auth, UserController.logoutUser);

router.get('', auth, UserController.getUser);

router.post('', UserController.createUser);

module.exports = router;
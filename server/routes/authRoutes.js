const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/dev-login', authController.devLogin);
router.get('/dev-login-mentor', authController.devLoginMentor);
router.get('/logout', authController.logout);

module.exports = router;

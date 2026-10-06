const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.get('/dev-login', authController.devLogin);
router.get('/dev-login-mentor', authController.devLoginMentor);

module.exports = router;

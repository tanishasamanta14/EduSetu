const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const chatValidator = require('../validators/chatValidator');
const { apiLimiter } = require('../middleware/rateLimit');

// POST /api/chat
router.post('/', apiLimiter, chatValidator.validateChatRequest, chatController.handleChat);

module.exports = router;

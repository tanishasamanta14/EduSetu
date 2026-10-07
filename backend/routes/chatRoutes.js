/* ============================================================
   EduSetu — AI Tutor Chat Routes
   Protected routes for real-time Socratic AI tutoring
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const chatValidator = require('../validators/chatValidator');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');

// All chat endpoints require authenticated Supabase student session
router.use(protect);

// POST /api/chat — Send message to Grok AI Tutor
router.post('/', apiLimiter, chatValidator.validateChatRequest, chatController.handleChat);

// GET /api/chat/conversations — List user's conversation sessions
router.get('/conversations', chatController.getConversations);

// GET /api/chat/conversations/:id — Retrieve full message history for session
router.get('/conversations/:id', chatController.getConversationById);

// DELETE /api/chat/conversations/:id — Delete a session
router.delete('/conversations/:id', chatController.deleteConversation);

module.exports = router;

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.get('/quizzes', protect, quizController.getQuizzes);
router.get('/quizzes/:id', protect, quizController.getQuizById);
router.post('/quizzes/:id/attempt', protect, quizController.submitAttempt);

router.get('/quiz-attempts', protect, quizController.getAttempts);
router.get('/quiz-attempts/:id', protect, quizController.getAttemptById);

module.exports = router;

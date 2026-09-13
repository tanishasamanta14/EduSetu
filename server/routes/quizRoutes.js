const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/quizzes', quizController.getQuizzes);
router.get('/quizzes/:id', quizController.getQuizById);
router.post('/quizzes/:id/attempt', quizController.submitAttempt);

router.get('/quiz-attempts', quizController.getAttempts);
router.get('/quiz-attempts/:id', quizController.getAttemptById);

module.exports = router;

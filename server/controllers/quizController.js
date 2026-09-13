const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const Mastery = require('../models/Mastery');
const { sendSuccess } = require('../utils/response');
const AppError = require('../utils/AppError');

// GET /api/quizzes
exports.getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }).populate('topic', 'name slug subject gradeLevel');
    return sendSuccess(res, quizzes);
  } catch (error) {
    next(error);
  }
};

// GET /api/quizzes/:id
// Returns quiz with questions, but EXCLUDES isCorrect, explanation, misconceptionTag
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('topic', 'name slug subject')
      .populate({
        path: 'questions',
        select: 'text options.text difficulty topic' // Omit isCorrect, misconceptionTag, explanation
      });
      
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }
    
    return sendSuccess(res, quiz);
  } catch (error) {
    next(error);
  }
};

// POST /api/quizzes/:id/attempt
exports.submitAttempt = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { answers, timeTaken } = req.body; // answers: [{ questionId, selectedOptionText }]

    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) return next(new AppError('Quiz not found', 404));

    let correctCount = 0;
    const attemptAnswers = [];
    const misconceptionsFound = [];

    // Evaluate answers
    for (const q of quiz.questions) {
      const submittedAnswer = answers.find(a => a.questionId === q._id.toString());
      
      let isCorrect = false;
      let misconceptionTag = null;
      let selectedText = null;

      if (submittedAnswer) {
        selectedText = submittedAnswer.selectedOptionText;
        const selectedOption = q.options.find(opt => opt.text === selectedText);
        
        if (selectedOption) {
          isCorrect = selectedOption.isCorrect;
          if (!isCorrect && selectedOption.misconceptionTag) {
            misconceptionTag = selectedOption.misconceptionTag;
            misconceptionsFound.push({
              question: q.text,
              tag: misconceptionTag,
              explanation: q.explanation
            });
          }
        }
      }

      if (isCorrect) correctCount++;

      attemptAnswers.push({
        question: q._id,
        selectedOptionText: selectedText,
        isCorrect,
        misconceptionTag
      });
    }

    const totalQuestions = quiz.questions.length;
    const score = correctCount;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 80;

    // Create Attempt Record
    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quiz._id,
      score,
      totalQuestions,
      passed,
      answers: attemptAnswers,
      timeTaken: timeTaken || 0
    });

    // Update Mastery for this Topic
    let mastery = await Mastery.findOne({ user: req.user._id, topic: quiz.topic });
    if (!mastery) {
      mastery = new Mastery({ user: req.user._id, topic: quiz.topic });
    }

    mastery.lastScore = percentage;
    mastery.confidenceLevel = percentage;
    
    if (percentage >= 80) {
      mastery.status = 'mastered';
    } else if (percentage >= 60) {
      mastery.status = 'developing';
    } else if (percentage >= 40) {
      mastery.status = 'shaky';
    } else {
      mastery.status = 'weak';
    }
    await mastery.save();

    // Update Learning Progress
    const LearningProgress = require('../models/LearningProgress');
    let lp = await LearningProgress.findOne({ user: req.user._id });
    if (!lp) lp = new LearningProgress({ user: req.user._id });
    
    // Quick average logic (in a real app, average all Masteries)
    const allMasteries = await Mastery.find({ user: req.user._id });
    const sum = allMasteries.reduce((acc, m) => acc + (m.confidenceLevel || 0), 0);
    lp.overallConfidence = Math.round(sum / (allMasteries.length || 1));
    await lp.save();

    // Identify Recommended Topics
    // We recommend prerequisites if the topic is 'weak' or 'shaky'.
    // If mastered or developing, we recommend next topics (topics that have this one as a prerequisite).
    const Topic = require('../models/Topic');
    let recommendedTopics = [];
    
    if (mastery.status === 'weak' || mastery.status === 'shaky') {
      if (quiz.topic.prerequisites && quiz.topic.prerequisites.length > 0) {
        recommendedTopics = await Topic.find({ _id: { $in: quiz.topic.prerequisites } }).select('name slug');
      }
    } else {
      // Find topics that have THIS topic as a prerequisite
      recommendedTopics = await Topic.find({ prerequisites: quiz.topic._id }).select('name slug');
    }
    
    return sendSuccess(res, {
      attemptId: attempt._id,
      score,
      totalQuestions,
      percentage,
      passed,
      misconceptions: misconceptionsFound,
      newMasteryStatus: mastery.status,
      recommendedTopics
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/quiz-attempts
exports.getAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .populate({ path: 'quiz', populate: { path: 'topic' } })
      .sort('-createdAt');
    return sendSuccess(res, attempts);
  } catch (error) {
    next(error);
  }
};

// GET /api/quiz-attempts/:id
exports.getAttemptById = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findOne({ _id: req.params.id, user: req.user._id })
      .populate('quiz')
      .populate('answers.question');
    if (!attempt) return next(new AppError('Attempt not found', 404));
    return sendSuccess(res, attempt);
  } catch (error) {
    next(error);
  }
};

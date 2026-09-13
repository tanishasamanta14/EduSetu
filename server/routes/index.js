const express = require('express');
const router = express.Router();

const chatRoutes = require('./chatRoutes');
const healthRoutes = require('./healthRoutes');
const exploreRoutes = require('./exploreRoutes');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const quizRoutes = require('./quizRoutes');
const masteryRoutes = require('./masteryRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const mentorRoutes = require('./mentorRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/', quizRoutes); // maps to /api/quizzes and /api/quiz-attempts
router.use('/', masteryRoutes); // maps to /api/mastery, /api/mastery/map, /api/progress
router.use('/', dashboardRoutes); // maps to /api/dashboard/student
router.use('/', mentorRoutes); // maps to /api/mentor/students, /api/dashboard/mentor
router.use('/chat', chatRoutes);
router.use('/health', healthRoutes);
router.use('/', exploreRoutes); // Maps to /api/subjects and /api/topics

module.exports = router;

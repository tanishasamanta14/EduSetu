const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/mentor/students', protect, restrictTo('mentor', 'admin'), mentorController.addStudent);
router.get('/mentor/students', protect, restrictTo('mentor', 'admin'), mentorController.getStudents);
router.get('/dashboard/mentor', protect, restrictTo('mentor', 'admin'), mentorController.getMentorDashboard);

module.exports = router;

const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('mentor', 'admin'));

router.post('/mentor/students', mentorController.addStudent);
router.get('/mentor/students', mentorController.getStudents);
router.get('/dashboard/mentor', mentorController.getMentorDashboard);

module.exports = router;

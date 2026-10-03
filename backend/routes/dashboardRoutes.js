const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/dashboard/student', protect, dashboardController.getStudentDashboard);

module.exports = router;

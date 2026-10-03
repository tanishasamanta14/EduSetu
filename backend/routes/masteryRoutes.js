const express = require('express');
const router = express.Router();
const masteryController = require('../controllers/masteryController');
const { protect } = require('../middleware/auth');

router.get('/mastery', protect, masteryController.getMastery);
router.get('/mastery/map', protect, masteryController.getMasteryMap);
router.get('/progress', protect, masteryController.getProgress);

module.exports = router;

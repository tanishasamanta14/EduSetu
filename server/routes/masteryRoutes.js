const express = require('express');
const router = express.Router();
const masteryController = require('../controllers/masteryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/mastery', masteryController.getMastery);
router.get('/mastery/map', masteryController.getMasteryMap);
router.get('/progress', masteryController.getProgress);

module.exports = router;

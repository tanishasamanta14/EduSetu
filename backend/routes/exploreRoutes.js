const express = require('express');
const router = express.Router();
const exploreController = require('../controllers/exploreController');

router.get('/subjects', exploreController.getSubjects);
router.get('/topics', exploreController.getTopics);
// Support specific endpoints mentioned in prompt
router.get('/topics/search', exploreController.getTopics);
router.get('/topics/:id', exploreController.getTopicById);

module.exports = router;

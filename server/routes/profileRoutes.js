const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.use(protect); // Require authentication for all profile routes

router.route('/')
  .get(profileController.getProfile)
  .put(profileController.updateProfile);

module.exports = router;

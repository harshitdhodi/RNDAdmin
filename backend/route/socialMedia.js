const express = require('express');
const router = express.Router();
const socialMediaController = require('../controller/socialMedia');
const { requireAuth } = require('../middleware/authmiddleware');

router.post('/add', requireAuth, socialMediaController.createSocialMedia);
router.get('/', socialMediaController.getAllSocialMedia);
router.get('/getById', requireAuth, socialMediaController.getSocialMediaById);
router.put('/update', requireAuth, socialMediaController.updateSocialMedia);
router.delete('/delete', requireAuth, socialMediaController.deleteSocialMedia);

module.exports = router;
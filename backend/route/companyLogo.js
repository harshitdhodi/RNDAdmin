const express = require('express');
const router = express.Router();
const logoController = require('../controller/Logo');
const { requireAuth } = require('../middleware/requireAuth');
const { uploadLogo } = require('../middleware/logoUpload');

// Public route to get logo
router.get('/get-logo', logoController.getLogo);

// Protected routes - require authentication
router.post('/add', requireAuth, uploadLogo, logoController.addLogo);
router.put('/update', requireAuth, uploadLogo, logoController.updateLogo);
router.delete('/delete', requireAuth, logoController.deleteLogo);

module.exports = router;
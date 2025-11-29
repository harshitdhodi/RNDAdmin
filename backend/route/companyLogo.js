<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const logoController = require('../controller/Logo');
const { requireAuth } = require('../middleware/requireAuth');
const { uploadLogo } = require('../middleware/logoUpload');

// Public route to get logo
router.get('/get-logo', logoController.getLogo);

// Protected routes - require authentication
router.post('/add', requireAuth, uploadLogo, logoController.addLogo);
router.put('/update',  (req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
        uploadLogo(req, res, next);
    } else {
        next(); // Skip multer if no file is provided
    }
}, logoController.updateLogo);
router.delete('/delete', requireAuth, logoController.deleteLogo);

=======
const express = require('express');
const router = express.Router();
const logoController = require('../controller/Logo');
const { requireAuth } = require('../middleware/requireAuth');
const { uploadLogo } = require('../middleware/logoUpload');

// Public route to get logo
router.get('/get-logo', logoController.getLogo);

// Protected routes - require authentication
router.post('/add', requireAuth, uploadLogo, logoController.addLogo);
router.put('/update',  (req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
        uploadLogo(req, res, next);
    } else {
        next(); // Skip multer if no file is provided
    }
}, logoController.updateLogo);
router.delete('/delete', requireAuth, logoController.deleteLogo);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = router;
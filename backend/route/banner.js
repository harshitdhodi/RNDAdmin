const express = require('express');
const router = express.Router();
const bannerController = require('../controller/banner');
const upload = require('../middleware/imgUpload');

// Create new banner
router.post('/add', upload, bannerController.createBanner);

// Get all banners
router.get('/getAll', bannerController.getAllBanners);

// Get banner by ID
router.get('/get', bannerController.getBannerById);

// Update banner
router.put('/update', upload, bannerController.updateBanner);

// Delete banner
router.delete('/delete', bannerController.deleteBanner);

module.exports = router; 
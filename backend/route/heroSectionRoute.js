const express = require('express');
const router = express.Router();
const heroSectionController = require('../controller/heroSectionController');
const { uploadPhoto } = require('../middleware/fileUpload');

// Hero Section CRUD Routes
router.post('/', uploadPhoto, heroSectionController.createHeroSection);
router.get('/', heroSectionController.getHeroSections);
router.get('/:id', heroSectionController.getHeroSectionById);
router.put('/:id', uploadPhoto, heroSectionController.updateHeroSection);
router.delete('/:id', heroSectionController.deleteHeroSection);

// Marquee Routes
router.post('/:id/marquee', heroSectionController.addMarquee);
router.put('/:id/marquee/:marqueeId', heroSectionController.updateMarquee);
router.delete('/:id/marquee/:marqueeId', heroSectionController.deleteMarquee);

// Social Media Links Routes
router.post('/:id/social-media', heroSectionController.addSocialMediaLink);
router.put('/:id/social-media/:linkId', heroSectionController.updateSocialMediaLink);
router.delete('/:id/social-media/:linkId', heroSectionController.deleteSocialMediaLink);

module.exports = router;
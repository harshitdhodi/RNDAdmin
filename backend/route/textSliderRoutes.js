const express = require('express');
const router = express.Router();
const textSliderController = require('../controller/textSliderController');

// Define routes
router.get('/', textSliderController.getTextSlider);
router.post('/', textSliderController.createOrUpdateTextSlider);
router.delete('/', textSliderController.deleteTextSlider);

module.exports = router;

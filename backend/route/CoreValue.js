const express = require('express');
const router = express.Router();
const CoreValueController = require('../controller/CoreValue');
const upload = require('../middleware/imgUpload');

// Create new core value
router.post('/add', upload, CoreValueController.createCoreValue);
// Get all core values
router.get('/getAll', CoreValueController.getAllCoreValues);

// Get core value by ID
router.get('/get', CoreValueController.getCoreValueById);

// Update core value
router.put('/update', upload, CoreValueController.updateCoreValue);

// Delete core value
router.delete('/delete', CoreValueController.deleteCoreValue);

// Get core value by pageSlug
router.get('/getByPageSlug', CoreValueController.getCoreValueByPageSlug)

module.exports = router; 
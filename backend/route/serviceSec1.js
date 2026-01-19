const express = require('express');
const router = express.Router();
const {
  getServiceSec1,
  getAllServiceSec1,
  updateOrCreateServiceSec1,
  deleteServiceSec1,
  getServiceSec1ById
} = require('../controller/serviceSec1'); // Adjust path as needed

// GET all data
router.get('/', getAllServiceSec1);

// GET all data for a specific category
router.get('/:id', getServiceSec1ById);

// GET specific data by query params (categoryId, subCategoryId, subSubCategoryId)
router.get('/find', getServiceSec1);

// PUT (update or create) data
router.put('/', updateOrCreateServiceSec1);
router.put('/:id', updateOrCreateServiceSec1);

// DELETE data by query params
router.delete('/', deleteServiceSec1);

module.exports = router;
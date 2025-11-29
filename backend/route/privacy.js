<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const {
  createPrivacy,
  getAllPrivacy,
  getPrivacyById,
  updatePrivacy,
  deletePrivacy,
} = require('../controller/privacy');

// Create a new privacy document
router.post('/add', createPrivacy);

// Get all privacy documents
router.get('/', getAllPrivacy);

// Get a single privacy document by ID
router.get('/:id', getPrivacyById);

// Update a privacy document by ID
router.put('/:id', updatePrivacy);

// Delete a privacy document by ID
router.delete('/:id', deletePrivacy);

=======
const express = require('express');
const router = express.Router();
const {
  createPrivacy,
  getAllPrivacy,
  getPrivacyById,
  updatePrivacy,
  deletePrivacy,
} = require('../controller/privacy');

// Create a new privacy document
router.post('/add', createPrivacy);

// Get all privacy documents
router.get('/', getAllPrivacy);

// Get a single privacy document by ID
router.get('/:id', getPrivacyById);

// Update a privacy document by ID
router.put('/:id', updatePrivacy);

// Delete a privacy document by ID
router.delete('/:id', deletePrivacy);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = router;
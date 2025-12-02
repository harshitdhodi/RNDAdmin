const express = require('express');
const router = express.Router();
const {
  createCookies,
  getAllCookies,
  getCookiesById,
  updateCookies,
  deleteCookies,
} = require('../controller/cookies');

// Create a new cookies document
router.post('/', createCookies);

// Get all cookies documents
router.get('/', getAllCookies);

// Get a single cookies document by ID
router.get('/:id', getCookiesById);

// Update a cookies document by ID
router.put('/:id', updateCookies);

// Delete a cookies document by ID
router.delete('/:id', deleteCookies);

module.exports = router;
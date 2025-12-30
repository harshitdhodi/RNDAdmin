const express = require('express');
const router = express.Router();
const { uploadPhoto } = require('../middleware/fileUpload'); // your multer middleware

const whyChooseUsController = require('../controller/whyChooseUs');

// Create WhyChooseUs
router.post(
  '/',
  uploadPhoto,
  whyChooseUsController.createWhyChooseUs
);

// Get all WhyChooseUs with optional filters
// Query params: categoryId, subCategoryId, subSubCategoryId, page, limit
router.get(
  '/',
  whyChooseUsController.getAllWhyChooseUs
); 

// Get WhyChooseUs by ID
router.get(
  '/:id',
  whyChooseUsController.getWhyChooseUsById
);

// Get WhyChooseUs by category hierarchy
// Example: /category/:categoryId or /category/:categoryId/:subCategoryId or /category/:categoryId/:subCategoryId/:subSubCategoryId
router.get(
  '/category/:categoryId/:subCategoryId?/:subSubCategoryId?',
  whyChooseUsController.getWhyChooseUsByCategory
);

// Update WhyChooseUs
router.put(
  '/:id',
  uploadPhoto,
  whyChooseUsController.updateWhyChooseUs
);

// Delete WhyChooseUs
router.delete(
  '/:id',
  whyChooseUsController.deleteWhyChooseUs
);

// Delete a specific card from WhyChooseUs
router.delete(
  '/:id/cards/:cardId',
  whyChooseUsController.deleteCard
);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
<<<<<<< HEAD
  deleteCategory
=======
  deleteCategory,
  getCategoryBySlug
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
} = require('../controller/blogCategory'); // Path to the controller file

// Route to create a new category
router.post('/add', createCategory);

// Route to get all categories
router.get('/get', getAllCategories);

// Route to get a category by ID
router.get('/getById', getCategoryById);

// Route to update a category by ID
router.put('/update', updateCategory);

// Route to delete a category by ID
router.delete('/delete', deleteCategory);

<<<<<<< HEAD
=======
// Route to get a category by slug
router.get('/getBySlug', getCategoryBySlug);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = router;

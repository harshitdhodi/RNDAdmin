<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const blogCardController = require('../controller/blogCard');

// Create a new blog card
router.post('/addCard', blogCardController.createBlogCard);

// Get all blog cards
router.get('/getCard', blogCardController.getAllBlogCards);

// Get a single blog card by ID
router.get('/:id', blogCardController.getBlogCardById);

// Update a blog card by ID
router.put('/editCard/:id', blogCardController.updateBlogCard);

// Delete a blog card by ID
router.delete('/:id', blogCardController.deleteBlogCard);

=======
const express = require('express');
const router = express.Router();
const blogCardController = require('../controller/blogCard');

// Create a new blog card
router.post('/addCard', blogCardController.createBlogCard);

// Get all blog cards
router.get('/getCard', blogCardController.getAllBlogCards);

// Get a single blog card by ID
router.get('/:id', blogCardController.getBlogCardById);

// Update a blog card by ID
router.put('/editCard/:id', blogCardController.updateBlogCard);

// Delete a blog card by ID
router.delete('/:id', blogCardController.deleteBlogCard);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = router;
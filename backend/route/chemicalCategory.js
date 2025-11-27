const express = require('express');
const router = express.Router();
const chemicalCategoryController = require("../controller/chemicalCategory");

const { requireAuth } = require("../middleware/requireAuth");
const { uploadPhoto } = require("../controller/chemicalCategory"); // Assuming uploadPhoto is in the controller

// Public routes (no authentication required)
router.get('/getAll', chemicalCategoryController.getAll);
router.get('/getSpecificCategory', chemicalCategoryController.getSpecificCategory);
router.get('/getSpecificSubcategory', chemicalCategoryController.getSpecificSubcategory);
router.get('/getSpecificSubSubcategory', chemicalCategoryController.getSpecificSubSubcategory);
router.get('/getSpecificSubcategoryBySlug', chemicalCategoryController.getSpecificSubcategoryBySlug);
router.get('/getSpecificCategoryById', chemicalCategoryController.getSpecificCategoryById);
router.get('/getTopCategories', chemicalCategoryController.getTopCategories);

// All routes below this will be protected by requireAuth middleware
// router.use(requireAuth); // Uncomment this if all routes below need authentication

// For demonstration, I'll add requireAuth to each protected route.
// If all are protected, the router.use(requireAuth) is better.

router.post('/insertCategory', requireAuth, uploadPhoto, chemicalCategoryController.insertCategory);
router.post('/insertSubCategory', requireAuth, uploadPhoto, chemicalCategoryController.insertSubCategory);
router.post('/insertSubSubCategory', requireAuth, uploadPhoto, chemicalCategoryController.insertSubSubCategory);

router.put('/updateCategory', requireAuth, uploadPhoto, chemicalCategoryController.updateCategory);
router.put('/updateSubCategory', requireAuth, uploadPhoto, chemicalCategoryController.updateSubCategory);
router.put('/updatesubsubcategory', requireAuth, uploadPhoto, chemicalCategoryController.updatesubsubcategory);

router.delete('/deletecategory', requireAuth, chemicalCategoryController.deletecategory);
router.delete('/deletesubcategory', requireAuth, chemicalCategoryController.deletesubcategory);
router.delete('/deletesubsubcategory', requireAuth, chemicalCategoryController.deletesubsubcategory);

router.get('/fetchCategoryUrlPriorityFreq', requireAuth, chemicalCategoryController.fetchCategoryUrlPriorityFreq);
router.put('/editCategoryUrlPriorityFreq', requireAuth, chemicalCategoryController.editCategoryUrlPriorityFreq);
// router.delete('/deleteCategoryUrlPriorityFreq',deleteCategoryUrlPriorityFreq)
router.get('/fetchCategoryUrlPriorityFreqById', requireAuth, chemicalCategoryController.fetchCategoryUrlPriorityFreqById);

router.get('/fetchCategoryUrlmeta', requireAuth, chemicalCategoryController.fetchCategoryUrlmeta);
router.put('/editCategoryUrlmeta', requireAuth, chemicalCategoryController.editCategoryUrlmeta);
router.get('/fetchCategoryUrlmetaById', requireAuth, chemicalCategoryController.fetchCategoryUrlmetaById);

module.exports = router;
const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { insertCategory, insertSubCategory, insertSubSubCategory, updateCategory, updateSubCategory, updatesubsubcategory, deletecategory, deletesubcategory, deletesubsubcategory, getAll, getSpecificCategory, getSpecificSubcategory, getSpecificSubSubcategory, fetchCategoryUrlPriorityFreq, editCategoryUrlPriorityFreq,
=======
const { uploadPhoto, insertCategory, insertSubCategory, insertSubSubCategory, updateCategory, updateSubCategory, updatesubsubcategory, deletecategory, deletesubcategory, deletesubsubcategory, getAll, getSpecificCategory, getSpecificSubcategory, getSpecificSubSubcategory, fetchCategoryUrlPriorityFreq, editCategoryUrlPriorityFreq, getTopCategories,
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
    getSpecificSubcategoryBySlug,
    fetchCategoryUrlPriorityFreqById,getSpecificCategoryById, fetchCategoryUrlmeta, editCategoryUrlmeta, fetchCategoryUrlmetaById } = require("../controller/chemicalCategory")

const { requireAuth } = require("../middleware/requireAuth")
const { uploadLogo } = require("../middleware/logoUpload")
<<<<<<< HEAD
router.post('/insertCategory', uploadLogo, insertCategory)
router.post('/insertSubCategory', uploadLogo, insertSubCategory)
router.post('/insertSubSubCategory', uploadLogo, insertSubSubCategory)
router.put('/updateCategory', uploadLogo, updateCategory)
router.put('/updateSubCategory', uploadLogo, updateSubCategory)
router.put('/updatesubsubcategory', uploadLogo, updatesubsubcategory)
=======
router.post('/insertCategory', uploadPhoto, insertCategory)
router.post('/insertSubCategory', uploadPhoto, insertSubCategory)
router.post('/insertSubSubCategory', uploadPhoto, insertSubSubCategory)
router.put('/updateCategory', uploadPhoto, updateCategory)
router.put('/updateSubCategory', uploadPhoto, updateSubCategory)
router.put('/updatesubsubcategory', uploadPhoto, updatesubsubcategory)
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
router.delete('/deletecategory', deletecategory)
router.delete('/deletesubcategory', deletesubcategory)
router.delete('/deletesubsubcategory', deletesubsubcategory)
router.get('/getAll', getAll)
router.get('/getSpecificCategory', getSpecificCategory)
router.get('/getSpecificSubcategory', getSpecificSubcategory)
router.get('/getSpecificSubSubcategory', getSpecificSubSubcategory)
router.get('/fetchCategoryUrlPriorityFreq', fetchCategoryUrlPriorityFreq)
router.put('/editCategoryUrlPriorityFreq', editCategoryUrlPriorityFreq)
// router.delete('/deleteCategoryUrlPriorityFreq',deleteCategoryUrlPriorityFreq)
router.get('/fetchCategoryUrlPriorityFreqById', fetchCategoryUrlPriorityFreqById)
router.get('/fetchCategoryUrlmeta', fetchCategoryUrlmeta)
router.put('/editCategoryUrlmeta', editCategoryUrlmeta)
router.get('/fetchCategoryUrlmetaById', fetchCategoryUrlmetaById)
router.get('/getSpecificSubcategoryBySlug', getSpecificSubcategoryBySlug)
router.get('/getSpecificCategoryById', getSpecificCategoryById)
<<<<<<< HEAD
=======
router.get('/getTopCategories', getTopCategories)
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = router 
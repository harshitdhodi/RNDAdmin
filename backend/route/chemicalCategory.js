const express = require('express');
const router = express.Router();
const { uploadPhoto, insertCategory, insertSubCategory, insertSubSubCategory, updateCategory, updateSubCategory, updatesubsubcategory, deletecategory, deletesubcategory, deletesubsubcategory, getAll, getSpecificCategory, getSpecificSubcategory, getSpecificSubSubcategory, fetchCategoryUrlPriorityFreq, editCategoryUrlPriorityFreq, getTopCategories,
    getSpecificSubcategoryBySlug,
    fetchCategoryUrlPriorityFreqById,getSpecificCategoryById, fetchCategoryUrlmeta, editCategoryUrlmeta, fetchCategoryUrlmetaById } = require("../controller/chemicalCategory")

const { requireAuth } = require("../middleware/requireAuth")
const { uploadLogo } = require("../middleware/logoUpload")
router.post('/insertCategory', uploadPhoto, insertCategory)
router.post('/insertSubCategory', uploadPhoto, insertSubCategory)
router.post('/insertSubSubCategory', uploadPhoto, insertSubSubCategory)
router.put('/updateCategory', uploadPhoto, updateCategory)
router.put('/updateSubCategory', uploadPhoto, updateSubCategory)
router.put('/updatesubsubcategory', uploadPhoto, updatesubsubcategory)
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
router.get('/getTopCategories', getTopCategories)
module.exports = router 
const express = require('express');
const router = express.Router();
const chemicalController = require('../controller/chemical');
const upload = require('../middleware/chemicalImage')
// POST route to create a chemical
router.post('/add',upload, chemicalController.createChemical);
router.get('/getBySlug',chemicalController.getChemicalBySlug )
router.get('/getChemicalBysubsubCategorySlug',chemicalController.getChemicalBysubsubCategorySlug)
router.get('/search',chemicalController.searchChemicals)
// GET route to retrieve all chemicals
router.get('/get', chemicalController.getAllChemicals);
router.get('/latest', chemicalController.getLatestChemicals);
router.get('/count', chemicalController.countChemicals);
router.get('/filterChemical',chemicalController.filterChemical)
router.get('/getByNameAndCASNumber', chemicalController.filterChemicalByName_CASNumber);
router.get('/getChemical',chemicalController.getChemicalByCategorySubCategorySlug);
router.get('/getChemicalByCategoryAndAlphabet',chemicalController.getChemicalByCategoryAndAlphabet);
// GET route to retrieve a single chemical by ID
router.get('/getChemicalById', chemicalController.getChemicalById);
router.delete('/delete',chemicalController.deleteChemical)
router.put('/updateChemicalById',upload,chemicalController.updateChemical)
module.exports = router;

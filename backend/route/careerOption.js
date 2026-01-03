// routes/career.routes.js
const express = require('express');
const router = express.Router();
const careerController = require('../controller/careerOption');
const { uploadPhoto } = require('../middleware/fileUpload');
const { requireAuth } = require('../middleware/authmiddleware');
router.post('/add',requireAuth,uploadPhoto, careerController.createCareer);
router.get('/getCareeroption', requireAuth,careerController.getAllCareers);
router.get('/getActiveCareeroption',careerController.getAllActiveCareers);
router.get('/getCareeroptionById', careerController.getCareerById);
router.put('/updateCareeroption',uploadPhoto, careerController.updateCareer);
router.delete('/deleteCareeroption', requireAuth,careerController.deleteCareer);
router.delete('/:id/image/:imageFilename/:index', requireAuth,careerController.deletePhotoAndAltText);

module.exports = router;

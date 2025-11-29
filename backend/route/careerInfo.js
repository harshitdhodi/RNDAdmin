<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const careerInfoController = require('../controller/careerInfo');
const imgUpload = require('../middleware/imgUpload');
router.get('/', careerInfoController.getAllCareerInfo);
router.get('/:id', careerInfoController.getCareerInfoById);
router.post('/',imgUpload, careerInfoController.createCareerInfo);
router.put('/:id',imgUpload, careerInfoController.updateCareerInfo);
router.delete('/:id', careerInfoController.deleteCareerInfo);

=======
const express = require('express');
const router = express.Router();
const careerInfoController = require('../controller/careerInfo');
const imgUpload = require('../middleware/imgUpload');
router.get('/', careerInfoController.getAllCareerInfo);
router.get('/:id', careerInfoController.getCareerInfoById);
router.post('/',imgUpload, careerInfoController.createCareerInfo);
router.put('/:id',imgUpload, careerInfoController.updateCareerInfo);
router.delete('/:id', careerInfoController.deleteCareerInfo);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = router;
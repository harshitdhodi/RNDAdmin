<<<<<<< HEAD
const express = require('express');
const { uploadImage, getAllImages, getImageById, updateImage, deleteImage } = require('../controller/slideShow');
const { singleImage } = require('../middleware/singleImage');

const router = express.Router();

router.post('/addimages', singleImage, uploadImage);
router.get('/getAll', getAllImages);
router.get('/getById', getImageById);
router.put('/update', singleImage, updateImage);
router.delete('/delete', deleteImage);

module.exports = router;
=======
const express = require('express');
const { uploadImage, getAllImages, getImageById, updateImage, deleteImage } = require('../controller/slideShow');
const { singleImage } = require('../middleware/singleImage');

const router = express.Router();

router.post('/addimages', singleImage, uploadImage);
router.get('/getAll', getAllImages);
router.get('/getById', getImageById);
router.put('/update', singleImage, updateImage);
router.delete('/delete', deleteImage);

module.exports = router;
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b

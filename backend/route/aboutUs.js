const router = require('express').Router();
const { createAboutUs,
    getAboutUs,
    updateAboutUs,
    deleteAboutUs,
    getAboutUsById, } = require('../controller/aboutUs');
const image = require('../middleware/imgUpload');

router.post('/add', image, createAboutUs);
router.get('/get', getAboutUs);
router.put('/update', image, updateAboutUs);
router.delete('/delete', deleteAboutUs);
router.get('/getById', getAboutUsById);

module.exports = router; 
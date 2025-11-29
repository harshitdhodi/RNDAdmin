<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const metaController = require('../controller/staticMeta');

router.post('/add-meta', metaController.createMeta);
router.get('/get-meta', metaController.getAllMetas);
router.get('/get-meta/:id', metaController.getMetaById);
router.put('/update-meta/:id', metaController.updateMeta);
router.delete('/delete-meta/:id', metaController.deleteMeta);

=======
const express = require('express');
const router = express.Router();
const metaController = require('../controller/staticMeta');

router.post('/add-meta', metaController.createMeta);
router.get('/get-meta', metaController.getAllMetas);
router.get('/get-meta-by-slug/:slug', metaController.getMetaBySlug);
router.get('/get-meta/:id', metaController.getMetaById);
router.put('/update-meta/:id', metaController.updateMeta);
router.delete('/delete-meta/:id', metaController.deleteMeta);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = router;
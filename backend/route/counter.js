const express = require('express');
const router = express.Router();
const counterController = require('../controller/counterController');

router.post('/createCounter', counterController.createCounter);
router.get('/getCounters', counterController.getCounters);
router.get('/getCounterById', counterController.getCounterById);
router.put('/updateCounter', counterController.updateCounter);
router.delete('/deleteCounter', counterController.deleteCounter);

module.exports = router;

const express = require('express');
const router = express.Router();
const footerController = require('../controller/footer');

router.post('/add', footerController.createFooter);
router.get('/get', footerController.getAllFooters);
router.get('/getById', footerController.getFooterById);
router.put('/update', footerController.updateFooter);
router.delete('/delete', footerController.deleteFooter);

module.exports = router;

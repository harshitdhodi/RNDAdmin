<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const whatsupInfoController = require('../controller/whatsUpInfo');

router.post('/whatsupInfo', whatsupInfoController.createWhatsupInfo);
router.get('/whatsupInfo', whatsupInfoController.getAllWhatsupInfo);
router.get('/whatsupInfo/:id', whatsupInfoController.getWhatsupInfoById);
router.put('/whatsupInfo/:id', whatsupInfoController.updateWhatsupInfoById);
router.delete('/whatsupInfo/:id', whatsupInfoController.deleteWhatsupInfoById);

=======
const express = require('express');
const router = express.Router();
const whatsupInfoController = require('../controller/whatsUpInfo');

router.post('/whatsupInfo', whatsupInfoController.createWhatsupInfo);
router.get('/whatsupInfo', whatsupInfoController.getAllWhatsupInfo);
router.get('/whatsupInfo/:id', whatsupInfoController.getWhatsupInfoById);
router.put('/whatsupInfo/:id', whatsupInfoController.updateWhatsupInfoById);
router.delete('/whatsupInfo/:id', whatsupInfoController.deleteWhatsupInfoById);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = router;
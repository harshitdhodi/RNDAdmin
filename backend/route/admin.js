const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin,getAdminProfile ,updateAdminProfile
,logoutUser
} = require('../controller/admin');
const {uploadLogo} =  require('../middleware/logoUpload')

const { requireAuth } = require('../middleware/requireAuth');

// Admin registration route
router.post('/register',uploadLogo, registerAdmin);

router.get('/adminprofile', requireAuth, getAdminProfile);
router.put('/updateAdminprofile', requireAuth,uploadLogo,updateAdminProfile);

// Admin login route
router.post('/login', loginAdmin);
router.post('/logout',logoutUser
);

module.exports = router;

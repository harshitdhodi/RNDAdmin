<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const menuListingController = require('../controller/menuListing');

router.post('/add-menu', menuListingController.createMenuListing);
router.get('/get-menu', menuListingController.getAllMenuListings);
router.get('/get-menu/:id', menuListingController.getMenuListingById);
router.put('/update-menu/:id', menuListingController.updateMenuListing);
router.delete('/delete-menu/:id', menuListingController.deleteMenuListing);

=======
const express = require('express');
const router = express.Router();
const menuListingController = require('../controller/menuListing');

router.post('/add-menu', menuListingController.createMenuListing);
router.get('/get-menu', menuListingController.getAllMenuListings);
router.get('/get-menu/:id', menuListingController.getMenuListingById);
router.put('/update-menu/:id', menuListingController.updateMenuListing);
router.delete('/delete-menu/:id', menuListingController.deleteMenuListing);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = router;
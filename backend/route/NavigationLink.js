<<<<<<< HEAD
const express = require('express');
const { uploadLogo } = require('../middleware/logoUpload');
const {
  createNavigationLink,
  getAllNavigationLinks,
  getNavigationLinkById,
  updateNavigationLink,
  deleteNavigationLink,
} = require('../controller/navigationLink');

const router = express.Router();

router.post('/', uploadLogo, createNavigationLink);
router.get('/', getAllNavigationLinks);
router.get('/:id', getNavigationLinkById);
router.put('/:id', uploadLogo, updateNavigationLink);
router.delete('/:id', deleteNavigationLink);

=======
const express = require('express');
const { uploadLogo } = require('../middleware/logoUpload');
const {
  createNavigationLink,
  getAllNavigationLinks,
  getNavigationLinkById,
  updateNavigationLink,
  deleteNavigationLink,
} = require('../controller/navigationLink');

const router = express.Router();

router.post('/', uploadLogo, createNavigationLink);
router.get('/', getAllNavigationLinks);
router.get('/:id', getNavigationLinkById);
router.put('/:id', uploadLogo, updateNavigationLink);
router.delete('/:id', deleteNavigationLink);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = router;
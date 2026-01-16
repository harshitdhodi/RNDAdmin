const express = require('express');
const router = express.Router();
const videoController = require('../controller/video');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Define fields for upload (video and image)
const uploadFields = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

router.post('/createVideo', uploadFields, videoController.createVideo);
router.get('/getVideos', videoController.getVideos);
router.get('/getVideoById', videoController.getVideoById);
router.put('/updateVideo', uploadFields, videoController.updateVideo);
router.delete('/deleteVideo', videoController.deleteVideo);

module.exports = router;

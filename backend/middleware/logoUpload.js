const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');

// Specify the directory for logos
const uploadDir = path.join(__dirname, '../logos');

// Create logos directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage for uploaded photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store directly in logos directory
    cb(null, uploadDir);
  },
   filename: (req, file, cb) => {
    const name = `${file.fieldname}_${Date.now()}.webp`;
    cb(null, name);
  }
});

// Initialize multer with defined storage options and file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Process the image in place to ensure WebP format
const processToWebp = async (filePath) => {
  const buffer = await sharp(filePath).webp({ quality: 80 }).toBuffer();
  await fs.promises.writeFile(filePath, buffer);
};


// Middleware to handle the logo file upload and process the image
const uploadLogo = (req, res, next) => {
  upload.fields([
    { name: 'headerLogo', maxCount: 1 },
    { name: 'favIcon', maxCount: 1 },
    { name: 'footerLogo', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const files = req.files || {};
      for (const key of Object.keys(files)) {
        await processToWebp(files[key][0].path);
      }
      next();
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
};



module.exports = { uploadLogo };
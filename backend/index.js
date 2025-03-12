const express = require('express');
const fs = require('fs');
const path = require('path');
const admin = require("./route/admin")
const NodeCache = require('node-cache');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sharp = require('sharp'); // Add sharp for image processing
const compression = require('compression');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { generateAllSitemaps } = require('./route/sitemap');

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' })); // Reduced from 500mb
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(compression({ threshold: 1024 })); // Compress responses > 1KB

// Cache setup
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 600,
  useClones: false,
  deleteOnExpire: true,
  maxKeys: 1000,
});

// Cache middleware
const cacheMiddleware = (duration) => (req, res, next) => {
  if (req.method !== 'GET') return next();
  const key = `__express__${req.originalUrl}`;
  const cached = cache.get(key);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.send(cached);
  }
  res.setHeader('X-Cache', 'MISS');
  const originalSend = res.send;
  res.send = (body) => {
    if (res.statusCode < 300) cache.set(key, body, duration);
    originalSend.call(this, body);
  };
  next();
};

// Custom image optimization route
app.get('/images/:filename', async (req, res) => {
  const { filename } = req.params;
  const { w = 1200, q = 80, device = 'desktop' } = req.query; // Add device param
  const imagePath = path.join(__dirname, 'public', 'download', filename);

  try {
    if (!fs.existsSync(imagePath)) return res.status(404).send('Image not found');

    const cacheKey = `image_${filename}_${w}_${q}`;
    const cachedImage = cache.get(cacheKey);
    if (cachedImage) {
      res.setHeader('X-Cache', 'HIT');
      return res.type('image/webp').send(cachedImage);
    }

    // Adjust width based on device type
    const ua = req.headers['user-agent'] || '';
    let targetWidth = parseInt(w, 10);
    if (ua.includes('Mobile') || device === 'mobile') {
      targetWidth = Math.min(targetWidth, 600); // Cap at 600px for mobile
    }

    const optimizedImage = await sharp(imagePath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: parseInt(q, 10) })
      .toBuffer();

    cache.set(cacheKey, optimizedImage, 86400);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.type('image/webp').send(optimizedImage);
  } catch (err) {
    console.error('Image processing error:', err);
    res.status(500).send('Image processing failed');
  }
});

// Static file serving with cache headers
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '30d', // Cache static files for 30 days
  setHeaders: (res, filepath) => {
    if (filepath.match(/\.(jpg|jpeg|png|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else if (filepath.endsWith('.xml')) {
      res.setHeader('Content-Type', 'application/xml');
    }
  },
}));

app.use(express.static(path.join(__dirname, 'dist'), { maxAge: '30d' }));

// 1. First, define all your API routes
app.use('/api/admin', admin); 
app.use('/api/supplier', require('./route/supplier'));``
app.use('/api/chemicalCategory', require('./route/chemicalCategory'));
app.use('/api/chemical', require('./route/chemical'));
app.use('/api/customer', require('./route/customer'));
app.use('/api/chemicalType', require('./route/chemicalType'));
app.use('/api/unit', require('./route/unit'));
app.use('/api/smtp', require('./route/smtp_setting'));
app.use('/api/inquiry', require('./route/inquiry'));
app.use('/api/followUp' , require('./route/followUp'));
app.use('/api/status', require('./route/statusMaster'));
app.use('/api/source', require('./route/sourceMaster'));
app.use('/api/logo',require('./route/logo'))
app.use('/api/count', require('./route/dashboard'))
app.use('/api/image', require('./route/image'))
app.use('/api/blogCategory', require('./route/blogCategory'))
app.use("/api/blog",require('./route/blog'));
app.use('/api/email',require('./route/email'))
app.use('/api/template', require('./route/emailTemplate'))
app.use('/api/productInquiry', require('./route/productInquiry'))
app.use('/api/sitemap', require('./route/sitemapRoute'))
app.use('/api/banner', require('./route/banner'))
app.use('/api/aboutus', require('./route/aboutUs'));
app.use('/api/contactForm', require('./route/contactForm'));
app.use('/api/chemicalMail',require('./route/chemicalMail'))
app.use('/api/career', require('./route/carrer')); 
app.use('/api/worldwide', require('./route/worldwide'));
app.use('/api/contactinfo', require('./route/contactinfo'));
app.use('/api/emailCategory', require('./route/emailCategory'));
app.use('/api/companyLogo', require('./route/companyLogo'));
app.use('/api/meta', require('./route/staticMeta'));
app.use("/api/menulist", require('./route/menuListing'));
app.use("/api/slideshow",require('./route/slideShow'));
app.use('/api/whatsup', require('./route/whatsUpInfo'));
app.use('/api/events', require('./route/events'));
app.use('/api/blogCard', require('./route/blogCard'));
app.use('/api/navigationLink', require('./route/NavigationLink'));
app.use('/api/catalogue', require('./route/catalogue'));
app.use('/api/privacy', require('./route/privacy'));
app.use('/api/terms', require('./route/termscondition')); // 2. Then serve static files
// Using 'dist' since you're using Vite instead of Create React App
app.use('/api/careerInfo', require('./route/careerInfo'));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
        if (path.endsWith('.xml')) {
            res.setHeader('Content-Type', 'application/xml');
        }
    }
}));

// 3. Finally, add the catch-all route LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const PORT = process.env.PORT || 3028;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    generateAllSitemaps(); // Generate the sitemap when the server starts
});

// Add cache cleanup on server shutdown
process.on('SIGTERM', () => {
  cache.flushAll();
  // ... rest of shutdown logic ...
});

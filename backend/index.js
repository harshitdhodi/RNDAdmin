const express = require('express');
const fs = require('fs');
const path = require('path');
const admin = require("./route/admin");
const NodeCache = require('node-cache');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sharp = require('sharp');
const compression = require('compression');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { generateAllSitemaps } = require('./route/sitemap');
 
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(compression({ threshold: 1024 }));

// Cache setup with 5-hour default TTL
const cache = new NodeCache({
  stdTTL: 18000, // 5 hours in seconds
  checkperiod: 600,
  useClones: false,
  deleteOnExpire: true,
  maxKeys: 1000,
});

// Cache middleware - Fixed to avoid overriding res.send incorrectly
const cacheMiddleware = (duration = 18000) => (req, res, next) => {
  if (req.method !== 'GET') return next(); // Only cache GET requests

  const key = `__express__${req.originalUrl}`;
  const cached = cache.get(key);

  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Cache-Control', 'public, max-age=18000');
    return res.send(cached);
  }

  res.setHeader('X-Cache', 'MISS');
  const originalJson = res.json;
  res.json = function (data) {
    if (res.statusCode < 300) { // Cache only successful responses
      cache.set(key, data, duration);
    }
    return originalJson.call(this, data);
  };
  next();
};

// Custom image optimization route
app.get('/images/:filename', async (req, res) => {
  const { filename } = req.params;
  const { w = 1200, q = 80, device = 'desktop' } = req.query;
  const imagePath = path.join(__dirname, 'public', 'download', filename);

  try {
    if (!fs.existsSync(imagePath)) return res.status(404).send('Image not found');

    const cacheKey = `image_${filename}_${w}_${q}`;
    const cachedImage = cache.get(cacheKey);
    if (cachedImage) {
      res.setHeader('X-Cache', 'HIT');
      return res.type('image/webp').send(cachedImage);
    }

    const ua = req.headers['user-agent'] || '';
    let targetWidth = parseInt(w, 10);
    if (ua.includes('Mobile') || device === 'mobile') {
      targetWidth = Math.min(targetWidth, 600);
    }

    const optimizedImage = await sharp(imagePath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: parseInt(q, 10) })
      .toBuffer();

    cache.set(cacheKey, optimizedImage, 18000);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.type('image/webp').send(optimizedImage);
  } catch (err) {
    console.error('Image processing error:', err);
    res.status(500).send('Image processing failed');
  }
});

// Static file serving
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '30d',
  setHeaders: (res, filepath) => {
    if (filepath.match(/\.(jpg|jpeg|png|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else if (filepath.endsWith('.xml')) {
      res.setHeader('Content-Type', 'application/xml');
    }
  },
}));

app.use(express.static(path.join(__dirname, 'dist'), { maxAge: '30d' }));

// API Routes with caching
const apiRoutes = [
  ['/api/admin', admin],
  ['/api/supplier', require('./route/supplier')],
  ['/api/chemicalCategory', require('./route/chemicalCategory')],
  ['/api/chemical', require('./route/chemical')],
  ['/api/customer', require('./route/customer')],
  ['/api/chemicalType', require('./route/chemicalType')],
  ['/api/unit', require('./route/unit')],
  ['/api/smtp', require('./route/smtp_setting')], 
  ['/api/inquiry', require('./route/inquiry')],
  ['/api/followUp', require('./route/followUp')],
  ['/api/status', require('./route/statusMaster')],
  ['/api/source', require('./route/sourceMaster')],
  ['/api/logo', require('./route/logo')],
  ['/api/count', require('./route/dashboard')],
  ['/api/image', require('./route/image')],
  ['/api/blogCategory', require('./route/blogCategory')],
  ['/api/blog', require('./route/blog')],
  ['/api/email', require('./route/email')],
  ['/api/template', require('./route/emailTemplate')],
  ['/api/productInquiry', require('./route/productInquiry')],
  ['/api/sitemap', require('./route/sitemapRoute')],
  ['/api/banner', require('./route/banner')],
  ['/api/aboutus', require('./route/aboutUs')],
  ['/api/contactForm', require('./route/contactForm')],
  ['/api/chemicalMail', require('./route/chemicalMail')],
  ['/api/career', require('./route/carrer')],
  ['/api/worldwide', require('./route/worldwide')],
  ['/api/contactinfo', require('./route/contactinfo')],
  ['/api/emailCategory', require('./route/emailCategory')],
  ['/api/companyLogo', require('./route/companyLogo')],
  ['/api/meta', require('./route/staticMeta')],
  ['/api/menulist', require('./route/menuListing')],
  ['/api/slideshow', require('./route/slideShow')],
  ['/api/whatsup', require('./route/whatsUpInfo')],
  ['/api/events', require('./route/events')],
  ['/api/blogCard', require('./route/blogCard')],
  ['/api/navigationLink', require('./route/NavigationLink')],
  ['/api/catalogue', require('./route/catalogue')],
  ['/api/privacy', require('./route/privacy')],
  ['/api/terms', require('./route/termscondition')],
  ['/api/careerInfo', require('./route/careerInfo')],
];

// Apply cache middleware to all API routes
apiRoutes.forEach(([route, handler]) => {
  app.use(route, cacheMiddleware(18000), handler);
});

// Catch-all route for SPA
app.get('*', cacheMiddleware(18000), (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Server startup
const PORT = process.env.PORT || 3028;
app.listen(PORT, () => {
  console.log(`Environment Variables:`, {
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not Set',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not Set',
  });
  console.log(`Server running on port ${PORT}`);
  generateAllSitemaps(); // Generate sitemaps on startup
});

// Cache cleanup on shutdown
process.on('SIGTERM', () => {
  cache.flushAll();
  console.log('Cache flushed on shutdown');
  process.exit(0);
});

// SMTP Connection Test (assuming you have nodemailer setup)
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection failed:', error);
  } else {
    console.log('SMTP connection successful');
  }
});

// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const admin = require("./route/admin")
const app = express();
require('dotenv').config(); 
const cookieParser = require('cookie-parser');

app.use(cookieParser());  

app.use(express.json()); // For parsing JSON requests

// Increase payload size limit
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// Enhanced cache configuration with better options
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 600,
  useClones: false,
  deleteOnExpire: true,
  maxKeys: 1000 // Limit maximum cache entries
});

// Improved cache middleware with better error handling and selective caching
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Skip caching for specific conditions
    if (req.method !== 'GET' || 
        req.headers['cache-control'] === 'no-cache' ||
        req.headers['authorization']) {
      return next();
    }

    // Create unique cache key including query parameters
    const key = `__express__${req.originalUrl || req.url}`;
    
    try {
      const cachedResponse = cache.get(key);
      if (cachedResponse) {
        // Add cache hit headers
        res.setHeader('X-Cache', 'HIT');
        return res.send(cachedResponse);
      }

      res.setHeader('X-Cache', 'MISS');
      
      // Enhanced response interceptor
      const originalSend = res.send;
      res.send = function(body) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.set(key, body, duration);
        }
        originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next(); // Continue without caching on error
    }
  };
};

// Add cache monitoring and management endpoints
app.post('/api/cache/clear/:route', async (req, res) => {
  try {
    const route = req.params.route;
    const keys = cache.keys();
    let cleared = 0;
    
    keys.forEach(key => {
      if (key.includes(route)) {
        cache.del(key);
        cleared++;
      }
    });
    
    res.json({ 
      message: `Cache cleared for ${route}`,
      entriesCleared: cleared 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

app.get('/api/cache/stats', async (req, res) => {
  try {
    const stats = cache.getStats();
    res.json({
      keys: cache.keys().length,
      hits: stats.hits,
      misses: stats.misses,
      ksize: stats.ksize,
      vsize: stats.vsize
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cache stats' });
  }
});

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
    // generateAllSitemaps(); // Generate the sitemap when the server starts
});

// Add cache cleanup on server shutdown
process.on('SIGTERM', () => {
  cache.flushAll();
  // ... rest of shutdown logic ...
});

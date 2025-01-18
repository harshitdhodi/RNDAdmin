// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');

const mongoose = require('mongoose');
const supplier = require('./route/supplier');
const chemicalCategory = require('./route/chemicalCategory')
const chemical = require('./route/chemical')
const customer = require('./route/customer')
const chemicalType = require('./route/chemicalType')
const unit = require('./route/unit')
const smtp = require('./route/smtp_setting')
const inquiry = require('./route/inquiry')
const followup = require('./route/followUp')
const status = require('./route/statusMaster')
const source = require('./route/sourceMaster')
const admin = require("./route/admin")
const logo = require("./route/logo")
const count = require("./route/dashboard")
const blogCategory = require("./route/blogCategory")
const blog = require("./route/blog")
const image = require("./route/image")
const email = require("./route/email")
const template = require("./route/emailTemplate")
const {generateAllSitemaps} = require("./route/sitemap")
const productInquiry = require("./route/productInquiry")
const sitemapRoute = require("./route/sitemapRoute")   
const banner = require("./route/banner")
const aboutUsRoute = require('./route/aboutUs');
const contactForm = require('./route/contactForm');
const chemicalMail = require('./route/chemicalMail')
const career = require('./route/carrer')
const worldwide = require('./route/worldwide')
const emailCategory = require('./route/emailCategory')
const companyLogo = require('./route/companyLogo')
const contactinfo = require('./route/contactinfo')
const app = express();
 
require('dotenv').config(); 
const cookieParser = require('cookie-parser');

app.use(cookieParser());  

app.use(express.json()); // For parsing JSON requests

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
app.use('/api/supplier', supplier);
app.use('/api/chemicalCategory', chemicalCategory);
app.use('/api/chemical', chemical);
app.use('/api/customer', customer);
app.use('/api/chemicalType', chemicalType);
app.use('/api/unit', unit);
app.use('/api/smtp', smtp);
app.use('/api/inquiry', inquiry)
app.use('/api/followUp' , followup)
app.use('/api/status', status)
app.use('/api/source', source)
app.use('/api/logo',logo)
app.use('/api/count', count)
app.use('/api/image', image)
app.use('/api/blogCategory', blogCategory)
app.use("/api/blog",blog);
app.use('/api/email',email)
app.use('/api/template', template)
app.use('/api/productInquiry', productInquiry)
app.use('/api/sitemap', sitemapRoute)
app.use('/api/banner', banner)
app.use('/api/aboutus', aboutUsRoute);
app.use('/api/contactForm', contactForm);
app.use('/api/chemicalMail',chemicalMail)
app.use('/api/career', career); 
app.use('/api/worldwide', worldwide);
app.use('/api/contactinfo', contactinfo);
app.use('/api/emailCategory', emailCategory);
app.use('/api/companyLogo', companyLogo);
// 2. Then serve static files
// Using 'dist' since you're using Vite instead of Create React App
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

const PORT = 3028;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // generateAllSitemaps(); // Generate the sitemap when the server starts
});

// Add cache cleanup on server shutdown
process.on('SIGTERM', () => {
  cache.flushAll();
  // ... rest of shutdown logic ...
});
 
  
        
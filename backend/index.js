const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serveStatic = require('serve-static');
const path = require('path');
const cron = require('node-cron');
const compression = require('compression');
const { exportAndBackupAllCollectionsmonthly } = require("./controller/Backup");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mcache = require('memory-cache');
//test
const app = express();
// Enable compression
app.use(compression());
app.use(express.json()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "dist"), {
  setHeaders: (res, path) => {
    if (path.endsWith('.xml')) {
      res.setHeader('Content-Type', 'application/xml');
    }
  }
}));

// Cache middleware
const cache = (duration) => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      res.send(JSON.parse(cachedBody));
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, JSON.stringify(body), duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// Cache invalidation middleware
const invalidateCache = (route) => {
  return (req, res, next) => {
    // For wildcard invalidation of all cache entries that start with the route
    const cacheKeys = mcache.keys();
    for (const key of cacheKeys) {
      if (key.includes(route)) {
        mcache.del(key);
      }
    }
    next(); 
  };
};

cron.schedule('59 23 31 * *', () => {
  exportAndBackupAllCollectionsmonthly();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

// Static file serving
app.use('/uploads', serveStatic(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.DATABASE_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Use routes with caching
// Default cache duration in seconds (5 minutes)
const defaultCacheDuration = 300;

// GET requests are cached, POST/PUT/DELETE requests invalidate the cache
app.use('/api/product', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/product')(req, res, next);
  }
}, require('./routes/product'));

app.use('/api/news', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/news')(req, res, next);
  }
}, require('./routes/news'));

app.use('/api/pageHeading', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/pageHeading')(req, res, next);
  }
}, require('./routes/pageHeading'));

app.use('/api/image', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/image')(req, res, next);
  }
}, require('./routes/image'));

app.use('/api/staff', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/staff')(req, res, next);
  }
}, require('./routes/ourStaff'));

app.use('/api/banner', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/banner')(req, res, next);
  }
}, require('./routes/Banner'));

app.use('/api/aboutus', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/aboutus')(req, res, next);
  }
}, require('./routes/abotus'));

// Admin routes - shorter cache or no cache for sensitive data
app.use('/api/admin', require('./routes/admin'));
app.use('/api/password', require('./routes/forgotpassword'));

app.use('/api/email', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/email')(req, res, next);
  }
}, require('./routes/email'));

app.use('/api/logo', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/logo')(req, res, next);
  }
}, require('./routes/logo'));

app.use('/api/backup', require('./routes/backup'));
app.use('/api/inquiries', require('./routes/inquiry'));

app.use('/api/mission', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/mission')(req, res, next);
  }
}, require('./routes/mission'));

app.use('/api/vision', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/vision')(req, res, next);
  }
}, require('./routes/vision'));

app.use('/api/footer', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/footer')(req, res, next);
  }
}, require('./routes/footer'));

app.use('/api/header', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/header')(req, res, next);
  }
}, require('./routes/header'));

app.use('/api/googlesettings', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/googlesettings')(req, res, next);
  }
}, require('./routes/googlesettings'));
 
app.use('/api/menulisting', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/menulisting')(req, res, next);
  }
}, require('./routes/menulisting'));

app.use('/api/sitemap', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/sitemap')(req, res, next);
  }
}, require('./routes/sitemap'));

app.use('/api/productDetail', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/productDetail')(req, res, next);
  }
}, require('./routes/productdetail'));

app.use('/api/productInquiry', require('./routes/productinquiry'));

app.use('/api/colors', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/colors')(req, res, next);
  }
}, require('./routes/managecolor'));
app.use('/api/partners', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/partners')(req, res, next);
  }
}, require('./routes/partners'));

app.use('/api/WhyChooseUs', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/WhyChooseUs')(req, res, next);
  }
}, require('./routes/whyChooseUs'));

app.use('/api/ourpeople', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/ourpeople')(req, res, next);
  }
}, require('./routes/ourpeople'));

app.use('/api/packagingdetail', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/packagingdetail')(req, res, next);
  }
}, require('./routes/packagingdetail'));

app.use('/api/packagingtype', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/packagingtype')(req, res, next);
  }
}, require('./routes/packagingtype'));

app.use('/api/dynamicSlug', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/dynamicSlug')(req, res, next);
  }
}, require('./routes/dynamicSlug'));

app.use('/api/industry', (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/industry')(req, res, next);
  }
}, require('./routes/industry'));

app.use("/api/staticMeta", (req, res, next) => {
  if (req.method === 'GET') {
    cache(defaultCacheDuration)(req, res, next);
  } else {
    invalidateCache('/api/staticMeta')(req, res, next);
  }
}, require("./routes/staticMeta"));

// Add cache cleanup on interval (optional)
setInterval(() => {
  console.log('Cleaning expired cache entries');
  mcache.keys().forEach(key => {
    if (!mcache.get(key)) {
      mcache.del(key);
    }
  });
}, 3600000); // Run every hour

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3006;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

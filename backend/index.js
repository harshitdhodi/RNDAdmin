// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');

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
const app = express();
 
require('dotenv').config(); 
const cookieParser = require('cookie-parser');

app.use(cookieParser());  

 

app.use(cookieParser());


app.use(express.json()); // For parsing JSON requests

// Keep the general static file serving
app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.json()); // For parsing JSON data
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Keep the catch-all route last 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
    
// Use Routes   
app.use(express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
        if (path.endsWith('.xml')) {
            res.setHeader('Content-Type', 'application/xml');
        }
    }
}));

// Use Routes
// generateAllSitemaps();
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
app.use('/api/emailCategory', emailCategory);
const PORT = 3028;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // generateAllSitemaps(); // Generate the sitemap when the server starts
});
 
  
        

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/images', filename);
  
    res.download(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'File download failed' });
      }
    }); 
  });

  router.get('/view/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/images', filename);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); // Set to 'inline' to view in browser

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'File display failed' });
        }
    });
});  

// Add PDF download route
router.get('/pdf/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads/images', filename);

  // Verify file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'PDF download failed' });
    }
  });
});

// Add PDF view route
router.get('/pdf/view/:filename', (req, res) => {
  const { filename } = req.params;
  let filePath = path.join(__dirname, '../uploads/images', filename);

  // Check if file exists in images directory
  if (!fs.existsSync(filePath)) {
    // If not, check in catalogs directory
    filePath = path.join(__dirname, '../uploads/catalogs', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'PDF display failed' });
    }
  });
});

// Combined route for both MSDS and Specs viewing
router.get('/:docType/view/:filename', (req, res) => {
  const { docType, filename } = req.params;
  
  // Validate document type
  if (!['msds', 'specs'].includes(docType)) {
    return res.status(400).json({ message: 'Invalid document type' });
  }

  const filePath = path.join(__dirname, `../uploads/${docType}`, filename);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'File display failed' });
    }
  });
});

module.exports = router; 
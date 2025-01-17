const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../logos', filename);
  
    res.download(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'File download failed' });
      }
    }); 
  });

  module.exports = router; 
const mongoose = require('mongoose');

const ServiceSec1Schema = new mongoose.Schema({
  heading: {
    type: String,
  },
  subheading: {
    type: String
  },
  details: {
    type: String,
  },
  photo: {
    type: String,
  },
  alt: {
    type: String,
    default: ''
  },
  imgTitle: {
    type: String,
    default: ''
  },
  // Reference to main category (always required)
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
    required: true
  },
  // Reference to subcategory (optional - only if data is for subcategory)
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  // Reference to sub-subcategory (optional - only if data is for sub-subcategory)
  subSubCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  // Level indicator for easy filtering
  level: {
    type: String,
    enum: ['category', 'subcategory', 'subsubcategory'],
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one ServiceSec1 per category/subcategory/subsubcategory
ServiceSec1Schema.index(
  { categoryId: 1, subCategoryId: 1, subSubCategoryId: 1 },
  { unique: true }
);

// Pre-save middleware to automatically set the level
ServiceSec1Schema.pre('save', function(next) {
  if (this.subSubCategoryId) {
    this.level = 'subsubcategory';
  } else if (this.subCategoryId) {
    this.level = 'subcategory';
  } else {
    this.level = 'category';
  }
  next();
});

module.exports = mongoose.model('ServiceSec1', ServiceSec1Schema);
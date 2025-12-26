const mongoose = require('mongoose');

const ServiceSec1Schema = new mongoose.Schema({
  heading: {
    type: String,
    trim: true,
  },
  subheading: {
    type: String,
    trim: true,
  },
  details: {
    type: String,
    trim: true,
  },
  // Array of cards - each card can have these fields
  cards: [
    {
      title: {
        type: String,
        required: true,
      },
      subTitle: {
        type: String,
      },
      description: {
        type: String,
      },
      photo: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  imgTitle: {
    type: String,
    default: '',
  },
    },
  ],


  // Reference to main category (always required)
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
    required: true,
  },

  // Reference to subcategory (optional)
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'ServiceSubCategory', // adjust ref name as needed
    default: null,
  },

  // Reference to sub-subcategory (optional)
  subSubCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'ServiceSubSubCategory', // adjust ref name as needed
    default: null,
  },

}, {
  timestamps: true,
});

// Compound unique index to ensure only one document per category/subcategory/subsubcategory combo
ServiceSec1Schema.index(
  { categoryId: 1, subCategoryId: 1, subSubCategoryId: 1 },
  { 
    unique: true,
    partialFilterExpression: { // Helps with null values in unique index
      subCategoryId: { $type: "objectId" },
      subSubCategoryId: { $type: "objectId" }
    }
  }
);

// Pre-save hook to automatically determine the level
ServiceSec1Schema.pre('save', function(next) {
  if (this.subSubCategoryId && this.subSubCategoryId !== null) {
    this.level = 'subsubcategory';
  } else if (this.subCategoryId && this.subCategoryId !== null) {
    this.level = 'subcategory';
  } else {
    this.level = 'category';
  }
  next();
});

module.exports = mongoose.model('ServiceSec2', ServiceSec1Schema);
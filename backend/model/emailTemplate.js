<<<<<<< HEAD
const mongoose = require('mongoose');

const EmailTemplate = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmailCategory',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('emailTemplate', EmailTemplate);
=======
const mongoose = require('mongoose');

const EmailTemplate = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmailCategory',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('emailTemplate', EmailTemplate);
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b

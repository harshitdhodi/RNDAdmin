const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  subheading: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  video: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: ''
  },
  imgTitle: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);

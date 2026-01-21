const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  linkHeading: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  contactInfo: {
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    link: { type: String, default: '' } // Contact Info Link
  },
  socialMedia: [{
    platform: { type: String, default: '' },
    url: { type: String, default: '' },
    icon: { type: String, default: '' }
  }],
  links: [{
    title: { type: String, default: '' },
    url: { type: String, default: '' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Footer', footerSchema);

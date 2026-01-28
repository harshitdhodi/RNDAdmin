const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  icon: String,
  href: String
});

const footerSchema = new mongoose.Schema({
  description: {
    type: String,
    default: ''
  },
  social: [socialLinkSchema]
}, { timestamps: true });

module.exports = mongoose.model('Footer', footerSchema);

const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
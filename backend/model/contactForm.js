const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
   
  },
  organisation: {
    type: String,
   
  },
  department: String,
  address: String,
  country: String,
  phone: String,
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    
  },
  needCallback: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Contact', contactSchema);
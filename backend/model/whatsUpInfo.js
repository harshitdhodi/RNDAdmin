<<<<<<< HEAD
const mongoose = require('mongoose');

const whatsupInfoSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  }
}, { timestamps: true });

const WhatsupInfo = mongoose.model('WhatsupInfo', whatsupInfoSchema);

=======
const mongoose = require('mongoose');

const whatsupInfoSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  }
}, { timestamps: true });

const WhatsupInfo = mongoose.model('WhatsupInfo', whatsupInfoSchema);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = WhatsupInfo;
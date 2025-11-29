<<<<<<< HEAD
const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
  privacyPolicy: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Privacy = mongoose.model('Privacy', privacySchema);

=======
const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
  privacyPolicy: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Privacy = mongoose.model('Privacy', privacySchema);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = Privacy;
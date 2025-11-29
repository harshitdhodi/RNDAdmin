<<<<<<< HEAD
const mongoose = require('mongoose');

const termsConditionSchema = new mongoose.Schema({
  termsCondition: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const TermsCondition = mongoose.model('TermsCondition', termsConditionSchema);

=======
const mongoose = require('mongoose');

const termsConditionSchema = new mongoose.Schema({
  termsCondition: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const TermsCondition = mongoose.model('TermsCondition', termsConditionSchema);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = TermsCondition;
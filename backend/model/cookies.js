const mongoose = require('mongoose');

const CookiesSchema = new mongoose.Schema({
  CookiesPolicy: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Cookies = mongoose.model('cookies', CookiesSchema);

module.exports = Cookies;
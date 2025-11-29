<<<<<<< HEAD
const mongoose = require('mongoose');

const navigationLinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const NavigationLink = mongoose.model('NavigationLink', navigationLinkSchema);

=======
const mongoose = require('mongoose');

const navigationLinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const NavigationLink = mongoose.model('NavigationLink', navigationLinkSchema);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = NavigationLink;
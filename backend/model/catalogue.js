<<<<<<< HEAD
const mongoose = require('mongoose');

const catalogueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  catalogue: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Catalogue = mongoose.model('Catalogue', catalogueSchema);

=======
const mongoose = require('mongoose');

const catalogueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  catalogue: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Catalogue = mongoose.model('Catalogue', catalogueSchema);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = Catalogue; 
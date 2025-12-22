const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  photo: [{
    type: String, // Assuming the photo will be stored as a URL
  }],
  alt: [{
    type: String,
  }],
  color: {
    type: String,
  },
  altName: {
    type: String,
  },
  imgTitle: {
    type: String,
  },
});

const Clients = mongoose.model('Clients', clientSchema);

module.exports = Clients;
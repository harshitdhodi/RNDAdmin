<<<<<<< HEAD
const mongoose = require('mongoose');

const careerInfoSchema = new mongoose.Schema({
  info: {
    type: String,
    
  },
  image: {
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

careerInfoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const CareerInfo = mongoose.model('CareerInfo', careerInfoSchema);

=======
const mongoose = require('mongoose');

const careerInfoSchema = new mongoose.Schema({
  info: {
    type: String,
    
  },
  image: {
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

careerInfoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const CareerInfo = mongoose.model('CareerInfo', careerInfoSchema);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = CareerInfo;
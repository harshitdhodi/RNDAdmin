// models/career.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  jobtitle: String,
  department: String,
  jobType: String,
  employmentType: String,
  requirement: String,
  description: String,
  photo: [String],
  alt: [String],
  imgTitle: [String],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

module.exports = mongoose.model('Job', JobSchema);


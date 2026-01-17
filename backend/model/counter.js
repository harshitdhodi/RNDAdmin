const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: String,
    required: true,
  },
  sign: {
    type: String,
  },
  icon: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Counter', counterSchema);

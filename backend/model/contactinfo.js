const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  photo: {
    type: [String], // Array of image URLs
    required: true,
  },
  imgTitle: {
    type: [String], // Array of image URLs
    required: true,
  },
  altName: {
    type: [String], // Array of image URLs
    required: true,
  },
  address: {
    type: String, // Single address field
    required: true,
  },
  mapLink: {
    type: String, // Single map link field
    required: true,
  },      
  mobiles: {
    type: [String], // Array of mobile numbers
    required: true,
  },
  emails: {
    type: [String], // Array of email addresses
    required: true,
    validate: {
      validator: function (v) {
        return v.every((email) => /^\S+@\S+\.\S+$/.test(email));
      },
      message: (props) => `${props.value} contains an invalid email address.`,
    },
  },
  hrEmail: {
    type: String, // HR email address
    required: false,
    validate: {
      validator: function (v) {
        return !v || /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
  hrPhone: {
    type: String, // HR phone number
    required: false,
  },
}, { timestamps: true });

const User = mongoose.model('contactInfo', UserSchema);

module.exports = User;

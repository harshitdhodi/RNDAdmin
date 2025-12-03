const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    
  },
  message: {
    type: String,
    
  },
  companyName: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  url:{
    type: String,
    required: true
  },
  pinCode: {
    type: String,
    required: false
  },
  utm_source: {
    type: String,
    required: false
  },
  utm_medium: {
    type: String,
    required: false
  },
  utm_campaign: {
    type: String,
    required: false
  },
  utm_id: {
    type: String,
    required: false
  },
  gclid: {
    type: String,
    required: false
  },
  gcid_source: {
    type: String,
    required: false
  },
  utm_content:{
   type:String,
   required: false
  },
  utm_term:{
    type:String,
    required:false
  },
  ipaddress:{type:String}
}, {
  timestamps: true
});

const Inquiry = mongoose.model('ProductInquiry', inquirySchema);

module.exports = Inquiry;

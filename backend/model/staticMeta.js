<<<<<<< HEAD
const mongoose = require('mongoose');

const MetaSchema = new mongoose.Schema({
    pageName: { type: String },
    pageSlug:{type:String},
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeyword: { type: String },
});
 
module.exports = mongoose.model('Meta', MetaSchema);
=======
const mongoose = require('mongoose');

const MetaSchema = new mongoose.Schema({
    pageName: { type: String },
    pageSlug:{type:String},
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeyword: { type: String },
});
 
module.exports = mongoose.model('Meta', MetaSchema);
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b

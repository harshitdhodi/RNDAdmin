    const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    pageSlug: { 
        type: String,
        required: true 
    },
    image: { 
        type: String,
        required: true 
    },
    imgName: { 
        type: String,
        required: true 
    },
    altName: { 
        type: String,
        required: true 
    },
    title: { 
        type: String,
       default: "" 
    },
    details: { 
        type: String,
       default: "" 
    },
    heading: { 
        type: String,
       default: "" 
    },
    subheading: { 
        type: String,
       default: "" 
    },
    description: { 
        type: String,
       default: "" 
    },
    marque: { 
        type: String,
       default: "" 
    }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);

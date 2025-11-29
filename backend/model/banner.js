<<<<<<< HEAD
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
    }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
=======
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
    }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b

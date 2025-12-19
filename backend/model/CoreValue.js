    const mongoose = require('mongoose');

const CoreValueSchema = new mongoose.Schema({

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

module.exports = mongoose.model('CoreValue', CoreValueSchema);

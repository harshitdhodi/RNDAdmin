<<<<<<< HEAD
const mongoose = require('mongoose');

const MenuListingSchema = new mongoose.Schema(
    {
        parent: { 
            name: { type: String, required: true }, 
            path: { type: String, required: true } 
        },
        children: [
            {
                name: { type: String, required: true }, 
                path: { type: String, required: true },
                subChildren: [
                    {
                        name: { type: String, required: true }, 
                        path: { type: String, required: true }
                    }
                ]
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('MenuListing', MenuListingSchema);
=======
const mongoose = require('mongoose');

const MenuListingSchema = new mongoose.Schema(
    {
        parent: { 
            name: { type: String, required: true }, 
            path: { type: String, required: true } 
        },
        children: [
            {
                name: { type: String, required: true }, 
                path: { type: String, required: true },
                subChildren: [
                    {
                        name: { type: String, required: true }, 
                        path: { type: String, required: true }
                    }
                ]
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('MenuListing', MenuListingSchema);
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b

<<<<<<< HEAD
const mongoose = require('mongoose');

const BlogCardSchema = new mongoose.Schema({
    blogCard: {
        type: String,
        required: true
    },
}, { timestamps: true });

const BlogCard = mongoose.model('BlogCard', BlogCardSchema);

=======
const mongoose = require('mongoose');

const BlogCardSchema = new mongoose.Schema({
    blogCard: {
        type: String,
        required: true
    },
}, { timestamps: true });

const BlogCard = mongoose.model('BlogCard', BlogCardSchema);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = BlogCard;
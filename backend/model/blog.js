const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Blog
const BlogSchema = new Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    details: { type: String, required: true },
    image: [{ type: String, required: true }],
    alt: [{ type: String, default: '' }],
    imageTitle: [{ type: String, default: '' }],
    slug: { type: String, unique: true },
<<<<<<< HEAD
    postedBy: { type: String, required: true },
    visits: { type: Number, default: 0 },
=======
    postedBy: { type: String,  },
    visits: { type: Number, default: 0 },
    
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
    metatitle: { type: String },
    metadescription: { type: String },
    metakeywords: { type: String },
    metacanonical: { type: String },
    metalanguage: { type: String },
    metaschema: { type: String },
    otherMeta: { type: String },
    url: { type: String },
    priority: { type: Number },
    changeFreq: { type: String },
    lastmod: { type: Date, default: Date.now },
    status: { type: String, required: true },
<<<<<<< HEAD
    categories: { type: Schema.Types.ObjectId, ref: 'BlogCategory' },
=======
    viewedIPs: { type: [String], default: [] },
    category: { type: Schema.Types.ObjectId, ref: 'BlogCategory' },
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

BlogSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;

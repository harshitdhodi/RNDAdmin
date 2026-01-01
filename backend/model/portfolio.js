const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Portfolio
const PortfolioSchema = new Schema({
    title: { type: String,  },
    details: { type: String,  },
    photo: [{ type: String,  }],
    alt: [{ type: String, default: '' }],
    imgtitle: [{ type: String, default: '' }],
    slug: { type: String },
    link:{type:String},
    status: { type: String,  },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PortfolioCategory' }],
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PortfolioCategory' }],
    subSubcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PortfolioCategory' }],
    servicecategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' }],
    servicesubcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' }],
    servicesubSubcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' }],
    industrycategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'IndustriesCategory' }],
    industrysubcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'IndustriesCategory' }],
    industrysubSubcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'IndustriesCategory' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

PortfolioSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

module.exports = Portfolio;
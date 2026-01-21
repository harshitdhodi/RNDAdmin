const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
    platform: { type: String }, // facebook, twitter, instagram, linkedin, youtube, etc
    url: { type: String },
    icon: { type: String }, // optional icon class or name
    _id: false
});

const marqueeSchema = new mongoose.Schema({
    title: { type: String },
    speed: { type: Number, default: 50 }, // pixels per second
    backgroundColor: { type: String, default: '#000000' },
    textColor: { type: String, default: '#ffffff' },
    isActive: { type: Boolean, default: true },
    _id: false
});

const heroSectionSchema = new mongoose.Schema({
    title: [{ type: String }],
    subtitle: { type: String },
    imageUrl: { type: String },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    marquee: [marqueeSchema],
    socialMediaLinks: [socialMediaSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HeroSection', heroSectionSchema);
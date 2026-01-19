const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
    platform: { type: String, required: true }, // facebook, twitter, instagram, linkedin, youtube, etc
    url: { type: String, required: true },
    icon: { type: String }, // optional icon class or name
    _id: false
});

const marqueeSchema = new mongoose.Schema({
    text: { type: String, required: true },
    speed: { type: Number, default: 50 }, // pixels per second
    backgroundColor: { type: String, default: '#000000' },
    textColor: { type: String, default: '#ffffff' },
    isActive: { type: Boolean, default: true },
    _id: false
});

const heroSectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    marquee: [marqueeSchema],
    socialMediaLinks: [socialMediaSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HeroSection', heroSectionSchema);
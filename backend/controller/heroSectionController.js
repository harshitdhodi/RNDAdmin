const HeroSection = require('../model/heroSection');

// Create a new hero section
exports.createHeroSection = async (req, res) => {
    try {
        if (req.file) {
            req.body.imageUrl = req.file.filename;
        }
        // Parse JSON fields if they come as strings (from FormData)
        if (req.body.marquee && typeof req.body.marquee === 'string') {
            req.body.marquee = JSON.parse(req.body.marquee);
        }
        if (req.body.socialMediaLinks && typeof req.body.socialMediaLinks === 'string') {
            req.body.socialMediaLinks = JSON.parse(req.body.socialMediaLinks);
        }
        if (req.body.title && typeof req.body.title === 'string') {
            try {
                req.body.title = JSON.parse(req.body.title);
            } catch (error) {
                req.body.title = [req.body.title];
            }
        }

        const heroSection = new HeroSection(req.body);
        await heroSection.save();
        res.status(201).json({ success: true, data: heroSection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all hero sections
exports.getHeroSections = async (req, res) => {
    try {
        const heroSections = await HeroSection.find();
        res.status(200).json({ success: true, data: heroSections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get hero section by ID
exports.getHeroSectionById = async (req, res) => {
    try {
        const heroSection = await HeroSection.findById(req.params.id);
        if (!heroSection) {
            return res.status(404).json({ success: false, message: 'Hero section not found' });
        }
        res.status(200).json({ success: true, data: heroSection });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update hero section
exports.updateHeroSection = async (req, res) => {
    try {
        if (req.file) {
            req.body.imageUrl = req.file.filename;
        }
        // Parse JSON fields if they come as strings (from FormData)
        if (req.body.marquee && typeof req.body.marquee === 'string') {
            req.body.marquee = JSON.parse(req.body.marquee);
        }
        if (req.body.socialMediaLinks && typeof req.body.socialMediaLinks === 'string') {
            req.body.socialMediaLinks = JSON.parse(req.body.socialMediaLinks);
        }
        if (req.body.title && typeof req.body.title === 'string') {
            try {
                req.body.title = JSON.parse(req.body.title);
            } catch (error) {
                req.body.title = [req.body.title];
            }
        }

        const heroSection = await HeroSection.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!heroSection) {
            return res.status(404).json({ success: false, message: 'Hero section not found' });
        }
        res.status(200).json({ success: true, data: heroSection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete hero section
exports.deleteHeroSection = async (req, res) => {
    try {
        const heroSection = await HeroSection.findByIdAndDelete(req.params.id);
        if (!heroSection) {
            return res.status(404).json({ success: false, message: 'Hero section not found' });
        }
        res.status(200).json({ success: true, message: 'Hero section deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add marquee to hero section
exports.addMarquee = async (req, res) => {
    try {
        const { id } = req.params;
        const marqueeData = req.body;
        
        const heroSection = await HeroSection.findByIdAndUpdate(
            id,
            { $push: { marquee: marqueeData }, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!heroSection) {
            return res.status(404).json({ success: false, message: 'Hero section not found' });
        }
        res.status(200).json({ success: true, data: heroSection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update marquee
exports.updateMarquee = async (req, res) => {
    try {
        const { id, marqueeId } = req.params;
        
        const heroSection = await HeroSection.findByIdAndUpdate(
            id,
            {
                $set: {
                    'marquee.$[elem]': req.body,
                    updatedAt: Date.now()
                }
            },
            { arrayFilters: [{ 'elem._id': marqueeId }], new: true }
        );
        
        if (!heroSection) {
            return res.status(404).json({ success: false, message: 'Hero section not found' });
        }
        res.status(200).json({ success: true, data: heroSection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete marquee
exports.deleteMarquee = async (req, res) => {
    try {
        const { id, marqueeId } = req.params;
        
        const heroSection = await HeroSection.findByIdAndUpdate(
            id,
            { $pull: { marquee: { _id: marqueeId } }, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!heroSection) {
            return res.status(404).json({ success: false, message: 'Hero section not found' });
        }
        res.status(200).json({ success: true, data: heroSection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Add social media link
exports.addSocialMediaLink = async (req, res) => {
    try {
        const { id } = req.params;
        const socialMediaData = req.body;
        
        const heroSection = await HeroSection.findByIdAndUpdate(
            id,
            { $push: { socialMediaLinks: socialMediaData }, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!heroSection) {
            return res.status(404).json({ success: false, message: 'Hero section not found' });
        }
        res.status(200).json({ success: true, data: heroSection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update social media link
exports.updateSocialMediaLink = async (req, res) => {
    try {
        const { id, linkId } = req.params;
        
        const heroSection = await HeroSection.findByIdAndUpdate(
            id,
            {
                $set: {
                    'socialMediaLinks.$[elem]': req.body,
                    updatedAt: Date.now()
                }
            },
            { arrayFilters: [{ 'elem._id': linkId }], new: true }
        );
        
        if (!heroSection) {
            return res.status(404).json({ success: false, message: 'Hero section not found' });
        }
        res.status(200).json({ success: true, data: heroSection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete social media link
exports.deleteSocialMediaLink = async (req, res) => {
    try {
        const { id, linkId } = req.params;
        
        const heroSection = await HeroSection.findByIdAndUpdate(
            id,
            { $pull: { socialMediaLinks: { _id: linkId } }, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!heroSection) {
            return res.status(404).json({ success: false, message: 'Hero section not found' });
        }
        res.status(200).json({ success: true, data: heroSection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
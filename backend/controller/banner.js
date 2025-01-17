const Banner = require('../model/banner');

// Create new banner
exports.createBanner = async (req, res) => {
    try {
        const image = req.files['image'] ? req.files['image'][0].filename : null;

        const banner = new Banner({
            image: image,
            imgName: req.body.imgName,
            altName: req.body.altName,
            title: req.body.title,
            details: req.body.details
        });

        const savedBanner = await banner.save();
        res.status(201).json({ message: 'Banner created successfully', banner: savedBanner });
    } catch (err) {
        console.error('Error creating banner:', err);
        res.status(400).json({ message: err.message });
    }
}; 

// Get all banners
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json(banners);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get banner by ID
exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.query.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        res.status(200).json(banner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update banner
exports.updateBanner = async (req, res) => {
    try {
        const { id } = req.query;
        const existingBanner = await Banner.findById(id);

        if (!existingBanner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        const updateData = {
            ...req.body
        };

        // Handle image update if new image is uploaded
        if (req.files && req.files['image']) {
            updateData.image = req.files['image'][0].filename;
        }

        const updatedBanner = await Banner.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedBanner);
    } catch (err) {
        console.error('Error updating banner:', err);
        res.status(400).json({ message: err.message });
    }
};

// Delete banner
exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.query;
        const banner = await Banner.findById(id);
        
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        await Banner.findByIdAndDelete(id);
        res.status(200).json({ message: "Banner deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while deleting the banner" });
    }
};

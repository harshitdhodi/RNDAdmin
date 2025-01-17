const Inquiry = require('../model/inquiry');

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find();
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get inquiry by ID
exports.getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.query.id);
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json(inquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new inquiry
exports.createInquiry = async (req, res) => {
    try {
        const inquiryData = {
            ...req.body,
            needCallback: req.body.needCallback || false,
            status: req.body.status || 'New Inquiry',
            source: req.body.source || ''
        };
        
        const inquiry = new Inquiry(inquiryData);
        await inquiry.save();
        res.status(201).json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update inquiry by ID
exports.updateInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(req.query.id, req.body, { new: true });
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete inquiry by ID
exports.deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.query.id);
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json({ message: "Inquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTodayInquiries = async (req, res) => {
    try {
        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set to 12:00:00 AM
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Set to 11:59:59 PM
        console.log(startOfDay , endOfDay)
        // Fetch inquiries created today
        const todayInquiries = await Inquiry.find({
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        res.status(200).json(todayInquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


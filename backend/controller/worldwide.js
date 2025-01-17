const Worldwide = require('../model/worldwide');

// Create new worldwide entry
const createWorldwide = async (req, res) => {
    try {
        const { category, name, state, city } = req.body;

        if (!category || !name) {
            return res.status(400).json({
                success: false,
                message: 'Category and name are required'
            });
        }

        const worldwide = new Worldwide({
            category,
            name,
            state,
            city
        });

        await worldwide.save();

        res.status(201).json({
            success: true,
            message: 'Worldwide entry created successfully',
            data: worldwide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating worldwide entry',
            error: error.message
        });
    }
};

// Get all worldwide entries
const getAllWorldwide = async (req, res) => {
    try {
        const worldwide = await Worldwide.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: worldwide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching worldwide entries',
            error: error.message
        });
    }
};

// Get worldwide entry by ID
const getWorldwideById = async (req, res) => {
    try {
        const worldwide = await Worldwide.findById(req.query.id);
        
        if (!worldwide) {
            return res.status(404).json({
                success: false,
                message: 'Worldwide entry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: worldwide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching worldwide entry',
            error: error.message
        });
    }
};

// Update worldwide entry
const updateWorldwide = async (req, res) => {
    try {
        const { category, name, state, city } = req.body;
        const worldwide = await Worldwide.findByIdAndUpdate(
            req.query.id,
            { category, name, state, city },
            { new: true, runValidators: true }
        );

        if (!worldwide) {
            return res.status(404).json({
                success: false,
                message: 'Worldwide entry not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Worldwide entry updated successfully',
            data: worldwide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating worldwide entry',
            error: error.message
        });
    }
};

// Delete worldwide entry
const deleteWorldwide = async (req, res) => {
    try {
        const worldwide = await Worldwide.findByIdAndDelete(req.query.id);

        if (!worldwide) {
            return res.status(404).json({
                success: false,
                message: 'Worldwide entry not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Worldwide entry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting worldwide entry',
            error: error.message
        });
    }
};

// Add default international countries
const addInternationalCountries = async (req, res) => {
    try {
        // First, delete all existing entries
        await Worldwide.deleteMany({});

        const countries = [
            'Algeria', 'Cuba', 'Kuwait', 'Philippines', 'Togo',
            'Argentina', 'Egypt', 'Lebanon', 'Qatar', 'Tunisia',
            'Armenia', 'Estonia', 'Madagascar', 'Republic of Korea', 'Turkey',
            'Australia', 'Ethiopia', 'Malaysia', 'Romania', 'Uganda',
            'Azerbaijan', 'France', 'Mauritius', 'Russian Federation', 'Ukraine',
            'Bahrain', 'Germany', 'Mexico', 'Rwanda', 'United Arab Emirates',
            'Bangladesh', 'Ghana', 'Mozambique', 'Saudi Arabia', 'United Republic of Tanzania',
            'Belgium', 'Indonesia', 'Myanmar', 'Serbia', 'Uruguay',
            'Benin', 'Iran', 'Nepal', 'Singapore', 'Uzbekistan',
            'Bhutan', 'Iraq', 'New Zealand', 'South Africa', 'Yemen',
            'Botswana', 'Israel', 'Nigeria', 'Spain', 'Zimbabwe',
            'Brazil', 'Italy', 'Oman', 'Sri Lanka',
            'Cameroon', 'Jordan', 'Pakistan', 'Sudan',
            'Colombia', 'Kazakhstan', 'Panama', 'Switzerland',
            'Costa Rica', 'Kenya', 'Peru', 'Tajikistan'
        ];

        const countryObjects = countries.map(country => ({
            category: 'international',
            name: country,
            state: '',
            city: ''
        }));

        const result = await Worldwide.insertMany(countryObjects);

        res.status(201).json({
            success: true,
            message: 'International countries reset successfully',
            count: result.length,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error resetting international countries',
            error: error.message
        });
    }
};

const addIndianLocations = async (req, res) => {
    try {
        const indianLocations = [
            // Andaman Nicobar
            { state: 'Andaman Nicobar', city: 'Port Blair' },
            
            // Andhra Pradesh
            { state: 'Andhra Pradesh', city: 'Anantapur' },
            { state: 'Andhra Pradesh', city: 'Guntur' },
            { state: 'Andhra Pradesh', city: 'Hyderabad' },
            { state: 'Andhra Pradesh', city: 'Kakinada' },
            { state: 'Andhra Pradesh', city: 'Secunderabad' },
            { state: 'Andhra Pradesh', city: 'Tirupati' },
            { state: 'Andhra Pradesh', city: 'Vijayawada' },
            { state: 'Andhra Pradesh', city: 'Visakhapatnam' },
            { state: 'Andhra Pradesh', city: 'Warangal' },

            // Assam
            { state: 'Assam', city: 'Guwahati' },
            { state: 'Assam', city: 'Jorhat' },

            // Bihar
            { state: 'Bihar', city: 'Patna' },

            // Chandigarh
            { state: 'Chandigarh', city: 'Chandigarh' },

            // ... (continuing with all other states and cities)
            
            // West Bengal
            { state: 'West Bengal', city: 'Asansol' },
            { state: 'West Bengal', city: 'Jalpaiguri' },
            { state: 'West Bengal', city: 'Jamshedpur' },
            { state: 'West Bengal', city: 'Kolkatta' },
            { state: 'West Bengal', city: 'North 24 Parganas' },
            { state: 'West Bengal', city: 'Siliguri' }
        ];

        const locationObjects = indianLocations.map(location => ({
            category: 'india',
            name: 'India',
            state: location.state,
            city: location.city
        }));

        const result = await Worldwide.insertMany(locationObjects);

        res.status(201).json({
            success: true,
            message: 'Indian locations added successfully',
            count: result.length,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding Indian locations',
            error: error.message
        });
    }
};

module.exports = {
    createWorldwide,
    getAllWorldwide,
    getWorldwideById,
    updateWorldwide,
    deleteWorldwide,
    addInternationalCountries,
    addIndianLocations
};

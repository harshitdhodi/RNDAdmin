const Logo = require('../model/Logo');
const fs = require('fs');
const path = require('path');

const logoController = {
    // Add new logo
    addLogo: async (req, res) => {
        try {
            const { headerLogo, favIcon } = req.body;

            // Validate input
            if (!headerLogo || !favIcon) {
                return res.status(400).json({
                    success: false,
                    message: 'Both headerLogo and favIcon are required'
                });
            }

            // Check if logo already exists
            const existingLogo = await Logo.findOne();
            if (existingLogo) {
                // Delete the uploaded files since we can't use them
                try {
                    fs.unlinkSync(path.join(__dirname, '..', headerLogo));
                    fs.unlinkSync(path.join(__dirname, '..', favIcon));
                } catch (err) {
                    console.error('Error deleting uploaded files:', err);
                }

                return res.status(400).json({
                    success: false,
                    message: 'Logo already exists. Use update route to modify.'
                });
            }

            // Create new logo
            const logo = await Logo.create({ headerLogo, favIcon });

            res.status(201).json({
                success: true,
                data: logo,
                message: 'Logo created successfully'
            });

        } catch (error) {
            // Clean up uploaded files in case of error
            if (req.body.headerLogo) {
                try {
                    fs.unlinkSync(path.join(__dirname, '..', req.body.headerLogo));
                    fs.unlinkSync(path.join(__dirname, '..', req.body.favIcon));
                } catch (err) {
                    console.error('Error deleting uploaded files:', err);
                }
            }

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Update logo

    updateLogo: async (req, res) => {
        try {
            const { headerLogo, favIcon } = req.body;

            // Find existing logo
            let logo = await Logo.findOne();

            if (logo) {
                // If no new logo is provided, use the existing data
                const newHeaderLogo = headerLogo || logo.headerLogo;
                const newFavIcon = favIcon || logo.favIcon;

                // Update the logo if there are changes
                if (headerLogo || favIcon) {
                    // Store old file paths
                    const oldHeaderLogo = headerLogo ? logo.headerLogo : null;
                    const oldFavIcon = favIcon ? logo.favIcon : null;

                    // Update logo details
                    logo.headerLogo = newHeaderLogo;
                    logo.favIcon = newFavIcon;
                    await logo.save();

                    // Delete old files only if new files are provided
                    if (oldHeaderLogo) {
                        try {
                            fs.unlinkSync(path.join(__dirname, '..', oldHeaderLogo));
                        } catch (err) {
                            console.error('Error deleting old headerLogo:', err);
                        }
                    }

                    if (oldFavIcon) {
                        try {
                            fs.unlinkSync(path.join(__dirname, '..', oldFavIcon));
                        } catch (err) {
                            console.error('Error deleting old favIcon:', err);
                        }
                    }
                }

                res.status(200).json({
                    success: true,
                    data: logo,
                    message: 'Logo updated successfully'
                });
            } else {
              
                logo = await Logo.create({ headerLogo, favIcon });
                res.status(201).json({
                    success: true,
                    data: logo,
                    message: 'Logo created successfully'
                });
            }
        } catch (error) {
            // Clean up uploaded files in case of error
            if (headerLogo) {
                try {
                    fs.unlinkSync(path.join(__dirname, '..', headerLogo));
                } catch (err) {
                    console.error('Error deleting uploaded headerLogo:', err);
                }
            }

            if (favIcon) {
                try {
                    fs.unlinkSync(path.join(__dirname, '..', favIcon));
                } catch (err) {
                    console.error('Error deleting uploaded favIcon:', err);
                }
            }

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get logo
    getLogo: async (req, res) => {
        try {
            const logo = await Logo.findOne();

            if (!logo) {
                return res.status(404).json({
                    success: false,
                    message: 'Logo not found'
                });
            }

            res.status(200).json({
                success: true,
                data: logo
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete logo
    deleteLogo: async (req, res) => {
        try {
            const logo = await Logo.findOneAndDelete();

            if (!logo) {
                return res.status(404).json({
                    success: false,
                    message: 'Logo not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Logo deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = logoController;

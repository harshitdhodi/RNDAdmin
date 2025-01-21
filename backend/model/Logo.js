const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
    headerLogo: {
        type: String,
        required: true
    },
    favIcon: {
        type: String,
        required: true
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt fields
});

// Ensure only one logo record exists
logoSchema.pre('save', async function(next) {
    if (this.isNew) {
        const count = await this.constructor.countDocuments();
        if (count > 0) {
            throw new Error('Only one logo record can exist');
        }
    }
    next();
});

module.exports = mongoose.model('Logo', logoSchema);

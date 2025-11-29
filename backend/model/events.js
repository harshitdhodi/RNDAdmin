<<<<<<< HEAD
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    events: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

=======
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    events: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
module.exports = Event;
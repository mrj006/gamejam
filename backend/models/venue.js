const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    city: {
        type: String,
        unique: true,
        required: true,
    },
    country: {
        type: String,
        unique: true,
        required: true,
    },
    gamejam: {
        type: String,
        required: true,
    },
    localOrgs: {
        type: Array,
        default: [],
    },
    jammers: {
        type: Array,
        default: [],
    },
    mentors: {
        type: Array,
        default: [],
    },
    judges: {
        type: Array,
        default: [],
    },
});

module.exports = mongoose.model("Venue", venueSchema);
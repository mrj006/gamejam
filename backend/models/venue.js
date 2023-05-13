const mongoose = require("mongoose");

// _id wll be country + city
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
        type: Array,
        required: true,
        default: undefined,
    },
    localOrg: {
        type: Array,
        default: [],
    },
    jammer: {
        type: Array,
        default: [],
    },
    mentor: {
        type: Array,
        default: [],
    },
    judge: {
        type: Array,
        default: [],
    },
});

module.exports = mongoose.model("Venue", venueSchema);
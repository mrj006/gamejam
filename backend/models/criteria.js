const mongoose = require("mongoose");

// _id is the name
const criteriaSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
        enum: ["game", "pitch", "tie-breaker"],
    }
});

module.exports = mongoose.model("Criteria", criteriaSchema);
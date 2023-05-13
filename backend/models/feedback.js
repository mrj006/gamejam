const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    venue: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    participateAgain: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    recommendEvent: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    overallExperience: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    localOrganization: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    globalOrganization: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    communication: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    mentorship: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    jammerRelations: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
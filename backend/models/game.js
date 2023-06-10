const mongoose = require("mongoose");
const Caretaker = require("./caretaker");
const path = require("path");
require("dotenv").config({ path: path.resolve("backend", ".env") });

const gameSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    teamName: {
        type: String,
        required: true,
        match: [new RegExp(process.env.NAME_REGEX), process.env.NAME_ERROR],
    },
    venue: {
        type: String,
        required: true,
    },
    responsible: {
        type: String,
        match: [new RegExp(process.env.EMAIL_REGEX), process.env.EMAIL_ERROR],
        required: true,
    },
    teamMembers: {
        type: Array,
        required: true,
        default: undefined,
    },
    teamLogo: {
        type: String,
        required: function () {
            return this.phase > 0;
        },
    },
    teamExistence: {
        type: Number,
        required: function () {
            return this.phase > 0;
        },
    },
    aboutTeam: {
        type: String,
        required: function () {
            return this.phase > 0;
        },
        enum: [
            "Never worked together before and met in GameJamPlus",
            "Never worked together before and met before the event",
            "Some member already worked together and the rest met on GameJamPlus",
            "Some member already worked together and the rest met before the event",
            "All members had already worked together"
        ]
    },
    companyName: {
        type: String,
        default: "",
    },
    companyLink: {
        type: String,
        required: function () {
            return !!this.companyName;
        },
    },
    gameName: {
        type: String,
        required: function() {
            return this.phase > 1;
        },
    },
    description: {
        type: String,
        required: function() {
            return this.phase > 1;
        },
    },
    gameLogo: {
        type: String,
        required: function() {
            return this.phase > 1;
        },
    },
    isForUnderAge: {
        type: Boolean,
        required: function() {
            return this.phase > 1;
        },
    },
    themes: {
        type: Array,
        required: function() {
            return this.phase > 1;
        },
        default: undefined,
    },
    genres: {
        type: Array,
        required: function() {
            return this.phase > 1;
        },
        default: undefined,
    },
    categories: {
        type: Array,
    },
    engine: {
        type: String,
        required: function() {
            return this.phase > 1;
        },
    },
    platforms: {
        type: Array,
        required: function() {
            return this.phase > 1;
        },
        default: undefined,
    },
    gameFile: {
        type: Caretaker,
        required: function() {
            return this.phase > 2;
        },
    },
    pitchLink: {
        type: String,
        required: function() {
            return this.phase > 3;
        },
        match: [new RegExp(process.env.PITCH_REGEX), process.env.PITCH_ERROR],
    },
    phase: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Game", gameSchema);

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve("backend", ".env") });

//_id is the email, mongoose requirement https://mongoosejs.com/docs/guide.html#_id
const gameSchema = new mongoose.Schema({
    _id: {
        type: String,
        match: [new RegExp(process.env.TITLE_REGEX), process.env.TITLE_ERROR],
    },
    teamName: {
        type: String,
        required: true,
        match: [new RegExp(process.env.NAME_REGEX), process.env.NAME_ERROR],
    },
    responsible: {
        type: String,
        match: [new RegExp(process.env.EMAIL_REGEX), process.env.EMAIL_ERROR],
        required: true,
    },
    teamMembers: {
        type: Array,
        required: true,
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
    isForUnderage: {
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
    },
    genre: {
        type: Array,
        required: function() {
            return this.phase > 1;
        },
    },
    categories: {
        type: Array,
        default: [],
    },
    engine: {
        type: Array,
        required: function() {
            return this.phase > 1;
        },
    },
    platforms: {
        type: Array,
        required: function() {
            return this.phase > 1;
        },
    },
    gameFile: {
        type: String,
        required: function() {
            return this.phase > 2;
        },
    },
    pitchLink: {
        type: String,
        required: function() {
            return this.phase > 3;
        },
    },
    phase: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Game", gameSchema);

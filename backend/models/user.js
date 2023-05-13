const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config({ path: path.resolve("backend", '.env') });

//_id is the email, mongoose requirement https://mongoosejs.com/docs/guide.html#_id
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        match: [new RegExp(process.env.EMAIL_REGEX), process.env.EMAIL_ERROR],
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    discord: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        match: [new RegExp(process.env.PHONE_REGEX), process.env.PHONE_ERROR],
    },
    birthDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                let age = (new Date()).getFullYear() - v.getFullYear();
                return age >= 18;
            },
            message: () => process.env.BIRTH_ERROR,
        },
    },
    identification: {
        type: String,
        default: null,
    },
    academicInstitution: {
        type: String,
        required: true,
    },
    medicalConditions: {
        type: String,
        default: null,
    },
    dietaryConditions: {
        type: String,
        default: null,
    },
    hasParticipated: {
        type: Boolean,
        default: false,
    },
    gender: {
        type: String,
        required: true,
        enum: process.env.GENDERS.split(" "),
    },
    shirtSize: {
        type: String,
        enum: ['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        default: 'M',
    },
    skills: {
        type: Array,
        default: [],
    },
    jobOpportunities: {
        type: Boolean,
        default: false,
    },
    investments: {
        type: Boolean,
        default: false,
    },
    isGlobalOrg: {
        type: Boolean,
        default: false,
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
    game: {
        type: Array,
        default: [],
    },
    calification: {
        type: Array,
        default: [],
    },
});

module.exports = mongoose.model("User", userSchema);

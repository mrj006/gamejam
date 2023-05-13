const mongoose = require("mongoose");
const Category = require("./category");
const Theme = require("./theme");

//_id is the startDate, mongoose requirement https://mongoosejs.com/docs/guide.html#_id
const gameJamSchema = new mongoose.Schema({
    _id:{
        type: Date,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    categories:{
        type: Array,
        default: [],
    },
    themes:{
        type: Array,
        default: [],
    },
});

module.exports = mongoose.model("GameJam", gameJamSchema);
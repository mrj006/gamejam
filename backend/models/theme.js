const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config({ path: path.resolve("backend", '.env') });

//_id is the name, mongoose requirement https://mongoosejs.com/docs/guide.html#_id
const userSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    }

});

module.exports = mongoose.model("Theme", userSchema);
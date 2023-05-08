const mongoose = require("mongoose");

//_id is the name, mongoose requirement https://mongoosejs.com/docs/guide.html#_id
const userSchema = new mongoose.Schema({
    date:{
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

module.exports = mongoose.model("GameJam", userSchema);
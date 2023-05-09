const mongoose = require("mongoose");

//_id is the name, mongoose requirement https://mongoosejs.com/docs/guide.html#_id
const themeSchema = new mongoose.Schema({
    _id:{
        type: String,
    },
    description:{
        type: String,
        required: true,
    },
    gamejam:{
        type: Array,
        required: true,
    },
});

module.exports = mongoose.model("Theme", themeSchema);
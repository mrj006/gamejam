const mongoose = require("mongoose");

//_id is the name, mongoose requirement https://mongoosejs.com/docs/guide.html#_id
const categorySchema = new mongoose.Schema({
    _id:{
        type: String,
    },
    description:{
        type: String,
        required: true,
    },
    sponsor:{
        type: String,
        required: true,
    },
    rules:{
        type: String,
        required: true,
    },
});

module.exports = categorySchema;
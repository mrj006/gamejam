const mongoose = require("mongoose");

//_id is the name, mongoose requirement https://mongoosejs.com/docs/guide.html#_id
const genreSchema = new mongoose.Schema({
    _id:{
        type: String,
    },
});

module.exports = mongoose.model("Genre", genreSchema);
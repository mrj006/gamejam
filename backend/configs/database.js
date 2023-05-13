const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config({ path: path.resolve("backend", '.env') });
const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI)
    .then(connection => {
        module.exports = connection;
        console.log("Connected to MongoDB");
    })
    .catch((err) =>{
        console.error(err);
    });

mongoose.connection.on('error', err => {
    console.error(err);
});

mongoose.connection.once('disconnected', () => {
    console.log("Disconnected from MongoDB!");
});

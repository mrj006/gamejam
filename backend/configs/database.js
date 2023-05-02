const mongoose = require('mongoose');
const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI)
    .then(() => {
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
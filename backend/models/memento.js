const mongoose = require("mongoose");

const mementoSchema = new mongoose.Schema(
    {
        executable: {
            type: String,
            required: true,
        },
        version: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
    },
    {
        methods: {
            getExecutable() {
                return this.executable;
            },
            getVersion() {
                return this.version;
            },
            getDescription() {
                return this.description;
            },
            getDate() {
                return this.date;
            },
        },
    },
);

module.exports = mongoose.model("Memento", mementoSchema);
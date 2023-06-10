const mongoose = require("mongoose");

const originatorSchema = new mongoose.Schema(
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
            type: Number,
            required: true,
        },
    },
    {
        methods: {
            getExecutable() {
                return this.executable;
            },
            setExecutable(executable) {
                this.executable = executable;
            },
            getVersion() {
                return this.version;
            },
            setVersion(version) {
                this.version = version;
            },
            getDescription() {
                return this.description;
            },
            setDescription(description) {
                this.description = description;
            },
            getDate() {
                return this.date;
            },
            setDate(date) {
                this.date = date;
            },
            getCurrent() {
                return {
                    executable: this.executable,
                    version: this.version,
                    description: this.description,
                    date: this.date
                };
            },
            backup() {
                return new mementoModel({
                    executable: this.executable,
                    version: this.version,
                    description: this.description,
                    date: this.date,
                });
            },
            restore(memento) {
                if (!memento) return;

                this.executable = memento.getExecutable();
                this.version = memento.getVersion();
                this.description = memento.getDescription();
                this.date = memento.getDate();        
            },
        },
    },
);
module.exports = originatorSchema;
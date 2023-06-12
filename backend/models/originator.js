const mongoose = require("mongoose");
const Memento = require("./memento");

const schema = new mongoose.Schema(
    {
        _id: String,
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
            setData(data) {
                this.executable = data.executable;
                this.version = data.version;
                this.description = data.description;
                this.date = data.date;
            },
            async backup() {
                let _id = crypto.randomUUID();
                let memento = new Memento({
                    _id,
                    executable: this.executable,
                    version: this.version,
                    description: this.description,
                    date: this.date,
                });

                await memento.save();

                return _id;
            },
            async restore(mementoID) {
                if (!mementoID) return;

                let memento = await Memento.findById(mementoID);
                this.executable = memento.getExecutable();
                this.version = memento.getVersion();
                this.description = memento.getDescription();
                this.date = memento.getDate();        
            },
        },
    },
);

module.exports = mongoose.model("Originator", schema);
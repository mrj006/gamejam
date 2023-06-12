const mongoose = require("mongoose");
const Memento = require("./memento");
const Originator = require("./originator");

const schema = new mongoose.Schema(
    {
        _id: String,
        mementos: [String],
        originator: String,
    },
    {
        methods: {
            async backup() {
                let originator = await Originator.findById(this.originator);
                this.mementos.push(await originator.backup());
            },
            async undo() {
                const memento = this.mementos.pop();
                let originator = await Originator.findById(this.orignator);
                await originator.restore(memento);
            },
            async getLastVersion() {
                let memento = await Memento.findById(this.mementos.at(-1));

                return {
                    executable: memento.getExecutable(),
                    version: memento.getVersion(),
                    description: memento.getDescription(),
                    date: memento.getDate(),
                };
            },
            async getVersiones() {
                let versions = [];
                for (let mementoID of this.mementos) {
                    let memento = await Memento.findById(mementoID);
                    versions.push({
                        executable: memento.getExecutable(),
                        version: memento.getVersion(),
                        description: memento.getDescription(),
                        date: memento.getDate(),
                    });
                }

                return versions;
            },
        },
    },
);

module.exports = mongoose.model("Caretaker", schema);
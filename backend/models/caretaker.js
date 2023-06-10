const mongoose = require("mongoose");
const Memento = require("./memento");
const Originator = require("./originator");

const caretakerSchema = new mongoose.Schema(
    {
        mementos: [Memento],
        originator: Originator,
    },
    {
        methods: {
            backup() {
                this.mementos.push(this.originator.backup());
            },
            undo() {
                const memento = this.mementos.pop();

                this.originator.restore(memento);
            },
            getLastVersion() {
                const memento = this.mementos.at(-1);

                return {
                    executable: memento.getExecutable(),
                    version: memento.getVersion(),
                    description: memento.getDescription(),
                    date: memento.getDate(),
                };
            },
            getVersiones() {
                let versions = [];
                for (let memento of this.mementos) {
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
module.exports = caretakerSchema;
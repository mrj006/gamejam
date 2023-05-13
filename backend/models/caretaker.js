const mongoose = require("mongoose");

const caretakerSchema = new mongoose.Schema(
    {
        mementos: {
            type: [mementoSchema],
            default: [],
        },
        originator: {
            type: originatorSchema,
            required: true,
        },
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
            getVersiones() {
                for (let memento of this.mementos) {
                    console.log(memento.getExecutable());
                    console.log(memento.getVersion());
                    console.log(memento.getDescription());
                    console.log(memento.getDate());
                }
            },
        },
    },
);
module.exports = mongoose.model("Caretaker", caretakerSchema);
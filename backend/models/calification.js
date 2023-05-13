const mongoose = require("mongoose");

// _id is the name
const criteriaSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    comment: {
        type: String,
        required: function() {
            return !!this.score
        },
    },
});

const calificationSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },
        game: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            required: true,
        },
        criterias: [{
            id: {
                type: String,
            },
            section: {
                type: String,
                required: function() {
                    return !!this.criterias.id;
                },
                enum: ["game", "pitch", "tie-breaker"],
            },
            score: {
                type: String,
                required: function() {
                    return !!this.criterias.id;
                },
            },
            comment: {
                type: String,
                required: function() {
                    return !!this.criterias.id;
                },
            },
        }],
    },
    {
        virtuals: {
            // scoore without tie-breaker
            totalScore: {
                get() {
                    let score = 0;
                    let count = 0;

                    for (let criteria of this.criterias) {
                        if (criteria.section == "tie-breaker") continue;

                        score += criteria.score;
                        count++;
                    }

                    return score / count
                },
            },
            // score with tie-breaker
            finalScore: {
                get() {
                    let score = 0;

                    for (let criteria of this.criterias) {
                        score += criteria.score;
                    }
                    
                    return score / this.criterias.length;
                },
            },
        },
    },
);

module.exports = mongoose.model("Calification", calificationSchema);
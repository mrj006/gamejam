const GameJam = require("../models/gamejam");

module.exports = class Controller{
    static async getCurrentGameJam() {
        try {
            let gamejam = await GameJam.findOne({}).sort('-_id');

            if (!gamejam) {
                return null;
            }

            return gamejam;
        } catch(e) {
            console.error(e);
            return null;
        }
    };

    static getCurrentGameJamRoute = async (req, res) => {
        try {
            let gamejam = await GameJam.findOne({}).sort('-_id');

            if (!gamejam) {
                return res.status(404).send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: [gamejam],
            });
        } catch(e) {
            console.error(e);
            return res.status(500).send({
                message: "An error occured while fetching information! Try again later.",
                code: 500,
            });
        }
    }

    static getCurrentCategories = async (req, res) => {
        try {
            let gamejam = await GameJam.findOne({}).sort('-_id');

            if (!(gamejam && gamejam.categories)) {
                return res.status(404).send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: gamejam.categories,
            });
        } catch(e) {
            console.error(e);
            return res.status(500).send({
                message: "An error occured while fetching information! Try again later.",
                code: 500,
            });
        }
    };

    static getCurrentThemes = async (req, res) => {
        try {
            let gamejam = await GameJam.findOne({}).sort('-_id');

            if (!(gamejam && gamejam.themes)) {
                return res.status(404).send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: gamejam.themes,
            });
        } catch(e) {
            console.error(e);
            return res.send({
                message: "An error occured while fetching information! Try again later.",
                code: 500,
            });
        }
    };
};
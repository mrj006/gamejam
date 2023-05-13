const EngineModel = require("../models/engine");

module.exports = class Controller{
    static getEngines = async (req, res) => {
        try {
            let engines = await EngineModel.find();

            if (!engines) {
                return res.status(404).send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: engines,
            });
        } catch(e) {
            console.error(e);
            return res.status(500).send({
                message: "An error occured while fetching information! Try again later.",
                code: 500,
            });
        }
    }
};
const Engine = require("../models/engine");

module.exports = class Controller{
    static async getEngine(_id) {
        try {
            return await Engine.findById(_id);
        } catch(e) {
            console.log(e);
        }
    }

    static getEngines = async (req, res) => {
        try {
            let engines = await Engine.find();

            if (!engines) {
                return res.send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: engines,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    }
};
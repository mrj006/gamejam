const PlatformModel = require("../models/platform");

module.exports = class Controller{
    static getPlatforms = async (req, res) => {
        try {
            let platforms = await PlatformModel.find();

            if (!platforms) {
                return res.status(404).send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: platforms,
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
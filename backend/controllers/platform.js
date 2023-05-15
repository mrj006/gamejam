const Platform = require("../models/platform");

module.exports = class Controller{
    static async getPlatform(_id) {
        try {
            return await Platform.findById(_id);
        } catch(e) {
            console.log(e);
        }
    }

    static getPlatforms = async (req, res) => {
        try {
            let platforms = await Platform.find();

            if (!platforms) {
                return res.send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: platforms,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    }
};
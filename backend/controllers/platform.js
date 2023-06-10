const errorHandling = require("../configs/error");
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
    };

    static addPlatform = async (req, res) => {
        let _id = req.body._id;

        try {
            let user = await User.findById(req.user);

            if (!user.isGlobalOrg) {
                return res.send({
                    message: "You are not authorized to add GameJams!",
                    code: 403,
                });
            }

            let existingPlatform = await Platform.findById(_id);

            if (existingPlatform) {
                return res.send({
                    message: "The provided paltform already exists!",
                    code: 403,
                });
            }

            let platform = new Platform({
                _id,
            });

            await platform.save();

            return res.send({
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static deletePlatform = async (req, res) => {
        let _id = req.body._id;

        try {
            let user = await User.findById(req.user);

            if (!user.isGlobalOrg) {
                return res.send({
                    message: "You are not authorized to add GameJams!",
                    code: 403,
                });
            }

            await Platform.findByIdAndRemove(_id);

            return res.send({
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };
};
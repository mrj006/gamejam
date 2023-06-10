const errorHandling = require("../configs/error");
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
    };

    static addEngine = async (req, res) => {
        let _id = req.body._id;

        try {
            let user = await User.findById(req.user);

            if (!user.isGlobalOrg) {
                return res.send({
                    message: "You are not authorized to add GameJams!",
                    code: 403,
                });
            }

            let existingEngine = await Engine.findById(_id);

            if (existingEngine) {
                return res.send({
                    message: "The provided engine already exists!",
                    code: 403,
                });
            }

            let engine = new Engine({
                _id,
            });

            await engine.save();

            return res.send({
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static deleteEngine = async (req, res) => {
        let _id = req.body._id;

        try {
            let user = await User.findById(req.user);

            if (!user.isGlobalOrg) {
                return res.send({
                    message: "You are not authorized to add GameJams!",
                    code: 403,
                });
            }

            await Engine.findByIdAndRemove(_id);

            return res.send({
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };
};
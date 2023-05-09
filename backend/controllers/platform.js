const PlatformModel = require("../models/platform");

module.exports = class Controller{
    static getPlatforms = async (req, res) => {
        PlatformModel.find()
            .then(results => {
                res.send({
                    code: 200,
                    data: results
                });
            }).catch(e => {
                console.error(e);
                res.send({code: 500});
            });
    }
};
const EngineModel = require("../models/engine");

module.exports = class Controller{
    static getEngines = async (req, res) => {
        EngineModel.find()
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
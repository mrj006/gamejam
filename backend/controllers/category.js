const CategoryModel = require("../models/category");
const GameJamController = require("./gamejam");

module.exports = class Controller{
    static getCurrentCategories = async (req, res) => {
        let currentGameJam = GameJamController.getCurrentGameJam();

        CategoryModel.find({gamejam: currentGameJam})
            .then(results => {
                res.send(results);
            }).catch(e => {
                console.error(e);
                res.send({code: 500});
            });
    }
};
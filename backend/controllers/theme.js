const ThemeModel = require("../models/theme");
const GameJamController = require("./gamejam");

module.exports = class Controller{
    static getCurrentThemes = async (req, res) => {
        let currentGameJam = GameJamController.getCurrentGameJam();

        ThemeModel.find({gamejam: currentGameJam})
            .then(results => {
                res.send(results);
            }).catch(e => {
                console.error(e);
                res.send({code: 500});
            });
    }
};
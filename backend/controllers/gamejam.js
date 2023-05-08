const GameJam = require("../models/gamejam");

module.exports = class Controller{
    static getCurrentGameJam() {
        GameJam.findOne({}).sort('-date')
            .then(result => {
                return result._id;
            }).catch(e => {
                console.error(e);
                return false;
            });
    }
};
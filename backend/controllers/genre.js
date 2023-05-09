const GenreModel = require("../models/genre");

module.exports = class Controller{
    static getGenres = async (req, res) => {
        GenreModel.find()
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
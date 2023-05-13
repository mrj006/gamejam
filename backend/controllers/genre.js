const GenreModel = require("../models/genre");

module.exports = class Controller{
    static getGenres = async (req, res) => {
        try {
            let genres = await GenreModel.find();

            if (!genres) {
                return res.status(404).send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: genres,
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
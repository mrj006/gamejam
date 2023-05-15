const Genre = require("../models/genre");

module.exports = class Controller{
    static async getGenre(_id) {
        try {
            return await Genre.findById(_id);
        } catch(e) {
            console.log(e);
        }
    }

    static getGenres = async (req, res) => {
        try {
            let genres = await Genre.find();

            if (!genres) {
                return res.send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: genres,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    }
};
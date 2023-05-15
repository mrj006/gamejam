const GameJam = require("./gamejam");
const Venue = require("../models/venue");
const errorHandling = require("../configs/error");

module.exports = class Controller{
    static getCurrentVenues = async (req, res) => {
        try {
            let gamejam = await GameJam.getCurrentGameJam();

            if (!gamejam) {
                return res.send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });
            }

            let venues = await Venue.find({gamejam: gamejam._id});

            return res.send({
                code: 200,
                data: venues,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static addVenue = async (req, res) => {
        let {city, country} = req.body;

        try {
            let gamejam = await GameJam.getCurrentGameJam();

            if (!gamejam) {
                return res.send({
                    message: "We couldn't find the required GameJam information! Try again later.",
                    code: 404,
                });
            }
            let _id = crypto.randomUUID();

            let existingVenue = await Venue.find({city, country, gamejam});

            if (existingVenue == true) {
                return res.send({
                    message: "Venue already exists!",
                    code: 403
                });
            }

            let venue = new Venue({
                _id,
                city,
                country,
                gamejam: gamejam._id,
            });

            await venue.save();

            return res.send({
                message: "Venue saved successfully!",
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };
}

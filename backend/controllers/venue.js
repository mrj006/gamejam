const GameJam = require("./gamejam");
const Venue = require("../models/venue");

module.exports = class Controller{
    static getCurrentVenues = async (req, res) => {
        try {
            let gamejam = await GameJam.getCurrentGameJam();

            if (!gamejam) {
                return res.status(404).send({
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
            console.error(e);
            return res.status(500).send({
                message: "An error occured while fetching information! Try again later.",
                code: 500,
            });
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
            let _id = country + "/" + city;

            let existingVenue = await Venue.findById(_id);

            if (existingVenue) {
                return res.status(403).send({
                    message: "Venue already exists! Add a new GameJam to the existing one instead.",
                    code: 403
                });
            }

            let venue = new Venue({
                _id,
                city,
                country,
                gamejam: [gamejam._id],
            });

            await venue.save();

            return res.send({
                message: "Venue saved successfully!",
                code: 200,
            });
        } catch(e) {
            console.error(e);
            return res.status(500).send({
                message: "An error occured while fetching information! Try again later.",
                code: 500,
            });
        }
    };
}

const Game = require("../models/game");
const User = require("../models/user");

module.exports = class Controller {
    static findUsersByQuery = async (req, res) => {
        const query = req.query.user;
        try {
            const regex = new RegExp(`^${query}`, "i");
            const users = await User.find({ username: regex }).limit(10);

            if (!users || users.length === 0) {
                res.send({
                    message: 'No users found!',
                    code: 404,
                });
                return;
            }

            res.send({
                data: users,
                code: 200,
            });
        } catch (error) {
            console.error(error);
            res.send({
                message: "Error encountered while searching for users! Try again later.",
                code: 500,
            });
        }
    };

    static findUserGames = async (req, res) => {
        Game.find({ teamMembers: req.query.user })
            .then(results => {
                return res.send({
                    code: 200,
                    data: results,
                });
            }).catch(e => {
                console.error(e);
                return res.send({
                    message: "Error encountered retrieving your games! Try again later.",
                    code: 500,
                })
            });
    }

    static uploadFirstStage = async (req, res) => {
        let { gameName, teamName, responsible, teamMembers } = req.body;

        if (!(gameName && teamName && responsible && teamMembers)) {
            res.send({
                message: "You must fill all required fields!",
                code: 400,
            });

            return;
        }

        Game.findById(gameName)
            .then(() => {
                res.send({
                    message: "The name of the game is already registered!",
                    code: 403,
                });

                return;
            }).catch(e => {
                console.error(error);
                res.send({
                    message: "Error encountered while saving the form! Try again later.",
                    code: 500,
                });

                return;
            });

        const game = new Game({
            _id: gameName,
            teamName,
            responsible,
            teamMembers,
        });

        game.save()
            .then(() => {
                res.send({
                    message: "Game registered!",
                    code: 200,
                });
            }).catch(e => {
                console.error(error);
                res.send({
                    message: "Error encountered while saving the form! Try again later.",
                    code: 500,
                });

                return;
            });
    };

    static uploadTeamInfo = async (req, res) => {
        if (!req.file)
            return res.send({
                message: "You must upload a valid team logo!",
                code: 400
            });
                
        Game.findById(req.body.id)
            .then(game => {
                game.teamLogo = req.file.filename;
                game.teamExistence = req.body.teamExistence;
                game.aboutTeam = req.body.aboutTeam;
                game.companyName = req.body.companyName;
                game.companyLink = req.body.companyLink;

                return game.save();
            }).then(() => {
                return res.send({
                    message: "Stage saved successfully!",
                    code: 200,
                });
            }).catch(e => {
                console.error(e);
                return res.send({
                    message: "Error encountered while saving your changes! Try again later.",
                    code: 500,
                });
            });
    }

    static uploadGameInfo = async (req, res) => {
        if (!req.file)
            return res.send({
                message: "You must upload a valid team logo!",
                code: 400
            });
                
        Game.findById(req.body.id)
            .then(game => {
                game.description = req.body.description;
                game.gameLogo = req.file.filename;
                game.isForUnderage = req.body.isForUnderage;
                game.themes = req.body.themes;
                game.genre = req.body.companyLink;
                game.categories = req.body.categories;
                game.engine = req.body.engine;
                game.platforms = req.body.platforms;

                return game.save();
            }).then(() => {
                return res.send({
                    message: "Stage saved successfully!",
                    code: 200,
                });
            }).catch(e => {
                console.error(e);
                return res.send({
                    message: "Error encountered while saving your changes! Try again later.",
                    code: 500,
                });
            });
    }
};

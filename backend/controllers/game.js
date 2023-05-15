const Game = require("../models/game");
const EngineController = require("./engine");
const GameJamController = require("./gamejam");
const GenreController = require("./genre");
const PlatformController = require("./platform");
const User = require("../models/user");
const Venue = require("../models/venue");
const path = require('path');
const jwtDecode = require("jwt-decode");
const errorHandling = require("../configs/error");
require("dotenv").config({ path: path.resolve("backend", ".env") });

// required to push and pull objects from MongoDB
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { MongoClient, GridFSBucket } = require("mongodb");
const mongoClient = new MongoClient(process.env.MONGO_URI);
const db = mongoClient.db(process.env.DB_NAME);

module.exports = class Controller {
    static getFile = (req, res) => {
        const bucket = new GridFSBucket(db, {bucketName: req.query.bucket})
        const file = bucket.openDownloadStreamByName(req.query.name);
        
        if (!file) {
            return res.send({
                code: 404,
                message: "We couldn't find the requested file!",
            })
        }
        
        res.set("Content-Type", file.contentType);
        file.pipe(res);
    };

    static uploadFile(bucketName) {
        let storage = new GridFsStorage({
            db: db,
            cache: true,
            file: (req, file) => {
                let type;
                switch(bucketName) {
                    case "teamLogos":
                    case "gameLogos":
                        type = ['image/jpg', 'image/jpeg', 'image/png'];
                        break;
                    
                    case "gameBinaries":
                        type = ['application/zip'];
                        break;
                }

                if (!type.includes(file.mimetype)) return null;

                let filename = file.originalname + Date.now() + "." + file.mimetype.split('/')[1];
                return {
                    id: filename,
                    bucketName,
                    filename,
                };

            }

        })
        
        if (["teamLogos", "gameLogos"].includes(bucketName)) {
            let upload = multer({
                storage,
                limits: {fileSize: 5*1024**2},
            })

            return upload.single("file");
        }

        upload = multer({storage});
        
        return upload.single("file");
    }

    static async deleteFile(fileName, bucketName) {
        try {
            let bucket = new GridFSBucket(db, { bucketName: bucketName });
            await bucket.delete(fileName);
        } catch(e) {
            console.log(e);
        }
    }

    static findUserGames = async (req, res) => {
        try {
            let user = await User.findById(req.query.user);

            if (!(user && user.games)) {
                return res.send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });    
            }    

            return res.send({
                code: 200,
                data: user.games,
            });    
        } catch(e) {
            errorHandling(e, res);
        }    
    };    

    static getCurrentUserGameRoute = async (req, res) => {
        try {
            let game = await this.getCurrentUserGame(req.query._id);

            if (!game) {
                return res.send({
                    message: "We couldn't find the information you are looking for.",
                    code: 404,
                });    
            }    

            return res.send({
                code: 200,
                data: [game],
            });    
        } catch(e) {
            errorHandling(e, res);
        }    
    }    

    static async getCurrentUserGame(email) {
        try {
            let user = await User.findById(email);

            if (!user) return null;

            let gamejam = await GameJamController.getCurrentGameJam();

            if (!gamejam) return null;

            let gameID = user.games[0];
            let game = await Game.findById(gameID);

            if (!game) return null;

            let venue = await Venue.findById(game.venue);

            if (venue.gamejam != gamejam._id) return null;

            return game;
        } catch(e) {
            console.log(e);
        }    
    }    

    static uploadFirstStage = async (req, res) => {
        let _id = jwtDecode(req.query.token)._id;
        let {teamName, venue, responsible, teamMembers} = req.body;

        try {
            // Confirms the user and team members are not already part of a game in the current GJ
            let currentJammers = "";

            for (let jammer of [_id, ...teamMembers]) {
                if (await this.getCurrentUserGame(jammer)) currentJammers += jammer + "\n";
            }

            if (currentJammers) {
                return res.send({
                    message: "The following users are already part of a game on this GameJam:\n" + currentJammers,
                    code: 403,
                });
            }

            // Confirms that venue exists
            let existingVenue = await Venue.findById(venue);

            if (!existingVenue) {
                return res.send({
                    code: 400,
                    message: "The provided venue does not exist!"
                });
            }

            // Confirms the venue is valid for the current GJ
            let gamejam = await GameJamController.getCurrentGameJam();

            if (existingVenue.gamejam != gamejam._id) {
                return res.send({
                    code: 403,
                    message: "The provided venue is not participating in the current GameJam event!",
                });
            }

            let gameID = crypto.randomUUID();
            let game = new Game({
                _id: gameID,
                teamName,
                venue,
                responsible,
                teamMembers,
            });

            await game.save();
            let user = await User.findById(_id);

            user.games = [gameID, ...user.games];

            await user.save();
            res.send({
                message: "Game registered!",
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static uploadTeamInfo = async (req, res) => {
        let {_id, teamExistence, aboutTeam, companyName, companyLink} = req.body;
        let teamLogo = req.file.filename;

        try {
            let game = await Game.findById(_id);
            game.teamLogo = teamLogo;
            game.teamExistence = teamExistence;
            game.aboutTeam = aboutTeam;
            game.companyName = companyName;
            game.companyLink = companyLink;

            await game.save();
            res.send({
                message: "Stage saved successfully!",
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
            try {
                await this.deleteFile(req.file.filename, "teamLogos");
                console.log("File: " + req.file.filename + " deleted as the team information could not be saved!");
            } catch(e) {
                console.log("File: " + req.file.filename + " was supposed to be deleted but failed!");
            }
        }
    };

    static uploadGameInfo = async (req, res) => {
        let _id = req.body._id;
        let {gameName, description, isForUnderAge, themes, genres, categories, engine, platforms} = JSON.parse(req.body.body);
        let gameLogo = req.file.filename;

        try {
            let invalidThemes = "";
            for (let theme of themes) {
                if (!(await GameJamController.getCurrentTheme(theme))) invalidThemes += theme + "\n";
            }

            if (invalidThemes) {
                return res.send({
                    code: 400,
                    message: "The following themes are invalid for the current GameJam:\n" + invalidThemes,
                })
            }

            let invalidGenres = "";
            for (let genre of genres) {
                if (!(await GenreController.getGenre(genre))) invalidGenres += genre + "\n";
            }

            if (invalidGenres) {
                return res.send({
                    code: 400,
                    message: "The following genres are invalid:\n" + invalidGenres,
                })
            }

            let invalidCategories = "";
            for (let category of categories) {
                if (!(await GameJamController.getCurrentCategory(category))) invalidCategories += category + "\n";
            }

            if (invalidCategories) {
                return res.send({
                    code: 400,
                    message: "The following categories are invalid for the current GameJam:\n" + invalidCategories,
                })
            }

            if (!(await EngineController.getEngine(engine))) {
                return res.send({
                    code: 400,
                    message: "The provided engine is invalid: " + engine,
                })
            }

            let invalidPlatforms = "";
            for (let platform of platforms) {
                if (!(await PlatformController.getPlatform(platform))) invalidPlatforms += platform + "\n";
            }

            if (invalidPlatforms) {
                return res.send({
                    code: 400,
                    message: "The following paltforms are invalid:\n" + invalidPlatforms,
                })
            }

            let game = await Game.findById(_id);
            game.gameName = gameName;
            game.description = description;
            game.gameLogo = gameLogo;
            game.isForUnderAge = isForUnderAge;
            game.themes = themes;
            game.genres = genres;
            game.categories = categories;
            game.engine = engine;
            game.platforms = platforms;

            await game.save();
            res.send({
                message: "Stage saved successfully!",
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
            try {
                await this.deleteFile(req.file.filename, "gameLogos");
                console.log("File: " + req.file.filename + " deleted as the tem information could not be saved!");
            } catch(e) {
                console.log("File: " + req.file.filename + " was supposed to be deleted but failed!");
            }
        }
    };
};

const crypto = require("crypto");
const Caretaker = require("../models/caretaker");
const Game = require("../models/game");
const Originator = require("../models/originator");
const User = require("../models/user");
const Venue = require("../models/venue");
const EngineController = require("./engine");
const GameJamController = require("./gamejam");
const GenreController = require("./genre");
const PlatformController = require("./platform");
const path = require('path');
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

                let filename = file.originalname + "_" + Date.now() + "." + file.mimetype.split('/')[1];
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

        let upload = multer({storage});
        
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
                    data: [],
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

            let gamejam = await GameJamController.getCurrentGameJam();

            if (!gamejam) return false;

            let gameID = user.games[0];
            let game = await Game.findById(gameID);

            if (!game) return false;

            let venue = await Venue.findById(game.venue);

            if (venue.gamejam != gamejam._id) return false;

            return game;
        } catch(e) {
            console.log(e);
        }    
    }    

    static uploadFirstStage = async (req, res) => {
        let _id = req.user;
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
        try {
            let _id = req.body._id;
            let {gameName, description, isForUnderAge, themes, genres, categories, engine, platforms} = JSON.parse(req.body.body);
            let gameLogo = req.file.filename;
    
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
                console.log("File: " + req.file.filename + " deleted as the team information could not be saved!");
            } catch(e) {
                console.log("File: " + req.file.filename + " was supposed to be deleted but failed!");
            }
        }
    };

    static uploadGameExecutable = async (req, res) => {
        let userID = req.user;
        let gameID = req.body._id;
        let data = {
            _id: crypto.randomUUID(),
            executable: req.file.filename,
            version: req.body.version,
            description: req.body.description,
            date: req.file.filename.split("_")[1].split(".")[0],
        };

        try {
            let user = await User.findById(userID);

            if (!user.games.includes(gameID)) {
                return res.send({
                    message: "You can only edit your own games!",
                    code: 403,
                });
            }

            let game = await Game.findById(gameID);

            if (!game.gameFile) {
                let originator = new Originator(data);
                await originator.save();

                let caretaker = new Caretaker({
                    _id: crypto.randomUUID(),
                    originator: originator._id,
                });

                await caretaker.backup();
                await caretaker.save();
                game.gameFile = caretaker._id;
            } else {
                let caretaker = await Caretaker.findById(game.gameFile);
                let originator = await Originator.findById(caretaker.originator);
                originator.setData(data);

                await originator.save();
                await caretaker.backup();
                await caretaker.save();
            }

            await game.save();

            return res.send({
                message: "Stage saved successfully!",
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
            try {
                await this.deleteFile(req.file.filename, "gameBinaries");
                console.log("File: " + req.file.filename + " deleted as the game binary information could not be saved!");
            } catch(e) {
                console.log("File: " + req.file.filename + " was supposed to be deleted but failed!");
            }
        }
    };

    static uploadGamePitch = async (req, res) => {
        let userID = req.user;
        let gameID = req.body._id;
        let pitchLink = req.body.pitchLink;

        try {
            let user = await User.findById(userID);

            if (!user.games.includes(gameID)) {
                return res.send({
                    message: "You can only edit your own games!",
                    code: 403,
                });
            }
            
            let regex = new RegExp(process.env.PITCH_REGEX);
            let match = regex.exec(pitchLink);
            let domains = ['youtube.com', 'youtu.be'];

            if (!match && !domains.includes(match.groups.domain)) {
                return res.send({
                    message: process.env.PITCH_ERROR,
                    code: 403,
                });
            }

            let game = await Game.findById(gameID);
            game.pitchLink = pitchLink;
            
            await game.save();

            return res.send({
                message: "Stage saved successfully!",
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };
};

require("dotenv").config();
require("./configs/database");
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");

require("dotenv").config();
require("./configs/database");

const auth = require('./middleware/auth');
const engineController = require("./controllers/engine");
const gameController = require('./controllers/game');
const gamejamController = require("./controllers/gamejam");
const genreController = require("./controllers/genre");
const platformController = require ('./controllers/platform');
const userController = require('./controllers/user');
const venueController = require("./controllers/venue");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

///// ANGULAR /////
app.use(express.static(path.resolve("dist", "gamejam")));
app.get('/', (req, res) => res.sendFile(path.resolve("dist", "gamejam", "index.html")));

///// CATEGORY /////
app.get("/currentCategories", gamejamController.getCurrentCategoriesRoute);

///// ENGINE /////
app.get("/engines", engineController.getEngines);
app.post("/addEngine", auth, engineController.addEngine);
app.post("/deleteEngine", auth, engineController.deleteEngine);

////// GAME //////
app.get("/getUserGames", gameController.findUserGames);
app.get("/getCurrentUserGame", gameController.getCurrentUserGameRoute);
app.get("/file", gameController.getFile);
app.post("/firstStage", auth, gameController.uploadFirstStage);
app.post("/teamInfo", auth, gameController.uploadFile("teamLogos"), gameController.uploadTeamInfo);
app.post("/gameInfo", auth, gameController.uploadFile("gameLogos"), gameController.uploadGameInfo);

///// GAMEJAM /////
app.get("/currentGameJam", gamejamController.getCurrentGameJamRoute);
app.post("/addGameJam", auth, gamejamController.addGameJam);
app.post("/updateGameJam", auth, gamejamController.updateGameJam);
app.post("/deleteGameJam", auth, gamejamController.deleteGameJam);

///// GENRE //////
app.get("/genres", genreController.getGenres);

///// PLATFORM /////
app.get("/platforms", platformController.getPlatforms);
app.post("/addPlatform", auth, platformController.addPlatform);
app.post("/deletePlatform", auth, platformController.deletePlatform);

////// THEME /////
app.get("/currentThemes", gamejamController.getCurrentThemesRoute);

////// USER //////
app.post('/login', userController.loginUser);
app.post("/register", userController.registerUser);
app.get("/findUsers", userController.findUsersByQuery);
app.get("/getUser", userController.getUser);

///// VENUE /////
app.get("/currentVenues", venueController.getCurrentVenues);
app.post("/addVenue", auth, venueController.addVenue);

module.exports = app;
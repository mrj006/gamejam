require("dotenv").config();
require("./configs/database");
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: 'assets',
    filename: function (req, file, cb) {
        console.log(file);
        let filename = req.body.id + "_team_logo_" + Date.now() + "." + file.mimetype.split('/')[1];
        cb(null, filename);
    }
});
const upload = multer({ storage });

require("dotenv").config();
require("./configs/database");

const auth = require('./middleware/auth');
const categoryController = require("./controllers/category");
const loginController = require('./controllers/login');
const themeController = require("./controllers/theme");
const gameController = require ('./controllers/game')


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.get("/file", (req, res) => {
    res.sendFile(path.resolve("assets", req.query.id));
});

///// CATEGORY /////
app.get("/currentCategories", categoryController.getCurrentCategories);

////// THEME /////
app.get("/currentThemes", themeController.getCurrentThemes);

////// USER //////
app.get('/auth', auth);
app.post('/login', loginController.loginUser);
app.post("/register", loginController.registerUser);

////// GAME //////
app.get("/find-users", gameController.findUsersByQuery);
app.get("/getUserGames", gameController.findUserGames);
app.post("/first-stage", gameController.uploadFirstStage);
app.post("/teamInfo", upload.single("file"), gameController.uploadTeamInfo);
app.post("/gameInfo", upload.single("file"), gameController.uploadGameInfo);

module.exports = app;
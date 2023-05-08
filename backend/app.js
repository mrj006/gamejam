require("dotenv").config();
require("./configs/database");
const loginController = require('./controllers/login');
const gameController = require ('./controllers/game')
const auth = require('./middleware/auth');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

require("dotenv").config();
require("./configs/database");

const auth = require('./middleware/auth');
const categoryController = require("./controllers/category");
const loginController = require('./controllers/login');
const themeController = require("./controllers/theme");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

///// CATEGORY /////
app.get("/currentCategories", categoryController.getCurrentCategories);

////// THEME /////
app.get("/currentThemes", themeController.getCurrentThemes);

////// USER //////
app.get('/auth', auth);
app.post('/login', loginController.loginUser);
app.post("/register", loginController.registerUser);


app.get("/find-users", gameController.findUsersByQuery);

module.exports = app;
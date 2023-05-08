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

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.post('/login', loginController.loginUser);

app.post("/register", loginController.registerUser);

app.get('/auth', auth);

app.get("/find-users", gameController.findUsersByQuery);

module.exports = app;
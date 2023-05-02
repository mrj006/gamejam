require("dotenv").config();
require("./configs/database");
const loginController = require('./controllers/login');
const auth = require('./middleware/auth');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.post('/login', loginController.loginUser);

app.post("/register", loginController.registerUser);

module.exports = app;
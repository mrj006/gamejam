const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

require("dotenv").config();
require("./configs/database");

const categoryController = require("./controllers/category");
const loginController = require('./controllers/login');
const auth = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

///// CATEGORIES /////
app.get("/currentCategories", categoryController.getCurrentCategories)

//////// USER ////////
app.get('/auth', auth);
app.post('/login', loginController.loginUser);
app.post("/register", loginController.registerUser);

module.exports = app;
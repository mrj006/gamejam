const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const errorHandling = require("../configs/error");

module.exports = class Controller{    
    static registerUser = async (req, res) => {
        let { _id, password, name, lastName, username, discord, phone, birthDate, identification, academicInstitution, 
            medicalConditions, dietaryConditions, hasParticipated, gender, shirtSize, skills, jobOpportunities, investments } = req.body;
        
        try {
            let emailExists = await User.findById(_id);
            if (emailExists) {
                return res.send({
                    message: "Email is already registered!",
                    code: 403
                });
            }
        
            let userExists = await User.findOne({ username });
            if (userExists) {
                return res.send({
                    message: "User already exists!",
                    code: 403
                });
            }

            if (!(new RegExp(process.env.PASS_REGEX)).test(password)) {
                return res.send({
                    code: 401,
                    message: process.env.PASS_ERROR,
                });
            }
    
            //Encrypting password
            password = await bcrypt.hash(password, 10);
            const token = jwt.sign(
                {
                    _id,
                    exp: Date.now() + (1000*60*60*24*7),
                },
                process.env.TOKEN_KEY,
            );

            const user = new User({
                _id, 
                password,
                name, 
                lastName, 
                username,  
                discord, 
                phone, 
                birthDate, 
                identification, 
                academicInstitution, 
                medicalConditions, 
                dietaryConditions, 
                hasParticipated,
                gender,
                shirtSize, 
                skills,
                jobOpportunities,
                investments,
            });

            await user.save();
            return res.send({
                message: "User registered!",
                code: 200,
                token: token,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static loginUser = async (req, res) => {
        let { _id, password } = req.body;
    
        if (!(_id && password)) {
            return res.send({
                message: "You must fill all required fields!",
                code: 400
            });
        }
    
        try {
            const user = await User.findById(_id);

            if (!(user && (await bcrypt.compare(password, user.password)))) {
                return res.send({
                    message: "Invalid credentials!",
                    code: 401
                });
            }
            
            const token = jwt.sign(
                { 
                    _id,
                    exp: Math.floor(Date.now() / 1000) + (60*60*24*7),
                },
                process.env.TOKEN_KEY,
            );
            
            return res.send({
                code: 200,
                token: token,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static findUsersByQuery = async (req, res) => {
        let query = req.query.user;
        let regex = new RegExp(query);

        try {
            let users = await User.find({ $or: [{_id: regex}, {username: regex}]}).limit(10);

            if (!users) {
                return res.send({
                    message: "No users found!",
                    code: 404,
                });
            }

            res.send({
                data: users,
                code: 200,
            });
        } catch (error) {
            errorHandling(e, res);
        }
    };

    static updateUser = async (req, res) => {
        let { token, _id, password, name, lastName, username, discord, phone, birthDate, identification, academicInstitution, 
            medicalConditions, dietaryConditions, hasParticipated, gender, shirtSize, skills, jobOpportunities, investments } = req.body;
        
        const payload = jwtDecode(token);

        if (_id != payload._id) {
            return res.send({
                message: "Invalid token! Sign in again.",
                code: 403
            });
        }

        try {
            let user = await User.findById(_id);

            if (!user) {
                return res.send({
                    message: "You must provide a valid email!",
                    code: 400
                });
            }

            if (username != user.username) {
                return res.send({
                    message: "You cannot change your username!",
                    code: 403
                });
            }

            user.name = name;
            user.lastName = lastName;
            if (password) {
                password = await bcrypt.hash(password, 10);
                user.password = password;
            }
            user.discord = discord;
            user.phone = phone;
            user.birthDate = birthDate;
            user.identification = identification;
            user.academicInstitution = academicInstitution;
            user.medicalConditions = medicalConditions;
            user.dietaryConditions = dietaryConditions;
            user.hasParticipated = hasParticipated;
            user.gender = gender;
            user.shirtSize = shirtSize;
            user.skills = skills;
            user.jobOpportunities = jobOpportunities;
            user.investments = investments;

            await user.save();

            return res.send({
                message: "Changes saved succesfully!",
                code: 200,
            });
        } catch(e) {
            errorHandling(e, res);
        }
    };

    static getUser = async (req, res) => {
        try {
            let user = await User.findById(req.query._id);

            if (!user) {
                return res.send({
                    message: "The provided user was not found!",
                    code: 404,
                });
            }

            return res.send({
                code: 200,
                data: [user],
            });
        } catch(e) {
            errorHandling(e, res);
        }

    }
}

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");

module.exports = class Controller{    
    static registerUser = async (req, res) => {
        let { _id, password, name, lastName, username, discord, phone, birthDate, identification, academicInstitution, 
            medicalConditions, dietaryConditions, hasParticipated, gender, shirtSize, skills, jobOpportunities, investments } = req.body;
        
        if (!(_id && name && lastName && username && password && discord && phone && gender && birthDate && academicInstitution)) {
            return res.status(400).send({
                message: "You must fill all required fields!",
                code: 400
            });
        }
    
        try {
            let emailExists = await User.findById(_id);
            if (emailExists) {
                return res.status(403).send({
                    message: "Email is already registered!",
                    code: 403
                });
            }
        
            let userExists = await User.findOne({ username });
            if (userExists) {
                return res.status(403).send({
                    message: "User already exists!",
                    code: 403
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
            console.error(e);
            return res.status(500).send({
                message: "An error happened while creating your account! Please try again later.",
                code: 500
            });
        }
    };

    static loginUser = async (req, res) => {
        let { _id, password } = req.body;
    
        if (!(_id && password)) {
            return res.status(400).send({
                message: "You must fill all required fields!",
                code: 400
            });
        }
    
        try {
            const user = await User.findById(_id);

            if (!(user && (await bcrypt.compare(password, user.password)))) {
                return res.status(401).send({
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
            console.error(e);
            return res.status(500).send({
                message: "An error happened while logging you in! Please try again later.",
                code: 500
            })
        }
    };

    static findUsersByQuery = async (req, res) => {
        let query = req.query.user;
        let regex = new RegExp(query);

        try {
            let users = await User.find({ $or: [{_id: regex}, {username: regex}]}).limit(10);

            if (!users) {
                return res.status(404).send({
                    message: "No users found!",
                    code: 404,
                });
            }

            res.send({
                data: users,
                code: 200,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                message:
                    "Error encountered while searching for users! Try again later.",
                code: 500,
            });
        }
    };

    static updateUser = async (req, res) => {
        let { token, _id, password, name, lastName, username, discord, phone, birthDate, identification, academicInstitution, 
            medicalConditions, dietaryConditions, hasParticipated, gender, shirtSize, skills, jobOpportunities, investments } = req.body;
        
        if (!(_id && name && lastName && username && password && discord && phone && gender && birthDate && academicInstitution)) {
            return res.status(400).send({
                message: "You must fill all required fields!",
                code: 400
            });
        }
    
        const payload = jwtDecode(token);

        if (_id != payload._id) {
            return res.status(403).send({
                message: "Invalid token! Sign in again.",
                code: 403
            });
        }

        try {
            let user = await User.findById(_id);

            if (!user) {
                return res.status(400).send({
                    message: "You must provide a valid email!",
                    code: 400
                });
            }

            if (username != user.username) {
                return res.status(403).send({
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
            console.error(e);
            return res.status(500).send({
                message: "An error occurred while saving your changes! Try again later.",
                code: 500,
            });
        }
    };
}

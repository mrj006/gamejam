const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const path = require('path');

module.exports = class Controller{    
    static registerUser = async (req, res) => {
        let { email, password, name, lastName, username, discord, phone, birthDate, identification, academicInstitution, 
            medicalConditions, dietaryConditions, hasParticipated, gender, shirtSize, skills, jobOpportunities, investments } = req.body;
        
        if (!(email && name && lastName && username && password && discord && phone && gender && birthDate && academicInstitution)) {
            res.send({
                message: "You must fill all required fields!",
                code: 400
            });

            return;
        }
    
        let emailExists = await User.findById(email);
        if (emailExists) {
            res.send({
                message: "Email is already registered!",
                code: 403
            });

            return;
        }
    
        let userExists = await User.findOne({ username });
        if (userExists) {
            res.send({
                message: "User already exists!",
                code: 403
            });

            return;
        }
    
        //Encrypting password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error(err);

                res.send({
                    message: "An error happened while creating your account! Please try again later.",
                    code: 500
                });
    
                return;    
            }
    
            const token = jwt.sign(
                { 
                    email,
                    exp: Math.floor(Date.now() / 1000) + (60*60*24*7),
                },
                process.env.TOKEN_KEY,
            );
    
            const user = new User({
                _id: email, 
                password: hashedPassword,
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
    
            user.save()
                .then(() => {
                    res.send({
                        message: "User registered!",
                        code: 200,
                        token: token,
                    });
                });
        });
    };
    static loginUser = async (req, res) => {
        const { email, password } = req.body;
    
        if (!(email && password)) {
            console.error('You must fill all required fields!');
            
            res.send({
                message: "You must fill all required fields!",
                code: 400
            });

            return;
        }
    
        const user = await User.findById(email);
        
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { 
                    user: email,
                    exp: Math.floor(Date.now() / 1000) + (60*60*24*7),
                },
                process.env.TOKEN_KEY,
            );
            
            res.send({
                code: 200,
                token: token,
            });
        } else res.send({
            message: "Invalid credentials!",
            code: 401
        });
    };
}

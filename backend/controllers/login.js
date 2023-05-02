const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const path = require('path');

module.exports = class Controller{    
    static registerUser = async (req, res) => {
        let { email, password, name, lastName, username, discord, phone, birthDate, identification, academicInstitution, 
            medicalConditions, dietaryConditions, hasParticipated, gender, shirtSize, knowledge } = req.body;
        
        if (!(email && name && lastName && username && password && discord && phone && gender && birthDate && academicInstitution)) {
            console.error(new Error('You must fill all required fields!'));
        }
    
        let emailExists = await User.findById(email);
        if (emailExists) console.error(new Error('email is already registered!'));
    
        let userExists = await User.findOne({ username });
        if (userExists) console.error(new Error('User already exists!'));
    
        //Encrypting password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) console.error(err);
    
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
                knowledge,
            });
    
            user.save()
                .then(() => {
                    res.cookie('access-token', token);
                    res.sendStatus(200);
                });
        });
    };
    static loginUser = async (req, res) => {
        const { email, password } = req.body;
    
        if (!(email && password)) {
            console.error(new Error('You must fill all required fields!'));
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
            
            res.cookie('access-token', token);
            res.sendStatus(200);
        } else res.sendStatus(401);
    };
}

const sequelize = require("../config/database.js");
const url = require('url');
const User = require("../models/user.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { user } = require("../config/db.config.js");

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username) {
        return res.status(200).send({
            message: "username connot be empty!",
            success: false
        });
    }
    if (!password) {
        return res.status(200).send({
            message: "password connot be empty!",
            success: false
        });
    }
    if (!email) {
        return res.status(200).send({
            message: "email connot be empty!",
            success: false
        });
    }
    try{
        const oldUser = await User.findOne({where: {username:username}, paranoid: false});
        if(oldUser){
            return res.status(400).send({
                message: "User already existed.",
            })
        }
        bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS), async (bcryptErr, hash) => {
            if (bcryptErr) {
                return res.status(500).send({
                  message: bcryptErr.message || "Some error occurred while creating the auth register."
                });
              }
          
              await User.create({...req.body, password: hash});
              return res.json({success: true});
        })
    } 
    catch(error) {
        res.status(500).json({
            message: 'An error occured while registering the user',
            error
        });
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username) {
        return res.status(200).send({
            message: "username connot be empty!",
            success: false
        });
    }
    if (!password) {
        return res.status(200).send({
            message: "password connot be empty!",
            success: false
        });
    }
    try{
        const user = await User.scope('withPassword').findOne({where: {username: username}});
        if(!user){
            return res.status(400).send({
                message: "User not found.",
                success: false
            })
        }
        bcrypt.compare(password, user.password, (checkErr, result) => {
            if (checkErr) {
                console.error(checkErr);
                return res.status(500).send({
                message: "Error in Password check."
                });
            }
            if (result) {
                const {password, ...userWithoutPassword} = user.dataValues
                jwt.sign({ user: userWithoutPassword }, process.env.JWT_AUTH_SECRET, { expiresIn: "2h" }, (jwtErr, token) => {
                    if (jwtErr)
                        console.error('jwt error', jwtErr);
                    return res.json({ token, user: userWithoutPassword });
                });
            }else{
                return res.status(400).send({
                message: "Password doesn't match."
                });
            }
        });
    } catch(error) {
        res.status(500).json({
            message: 'An error occured while verifying the user',
            error
        });
    }
}
exports.logout = async (req, res) => {}
exports.getUser = async (req, res) => {
    return res.json(req.user);
}
exports.getUsers = async (req, res) => {}
exports.update = async (req, res) => {}
exports.delete = async (req, res) => {}

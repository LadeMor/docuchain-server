const userModel = require("../models/userModel");
const hashPassword = require("../utils/hashPassword");
const passwordCompare = require("../utils/passwordCompare");
const jwt = require("jsonwebtoken");

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (firstName, lastName, email, password, organization) => {
    const userExist = await userModel.getUserByEmail(email);
    if(userExist){
        const error = new Error("User already exists");
        error.code = "USER_EXISTS";
        throw error;
    }

    const hashedPassword = await hashPassword(password);
    return await userModel.createUser(firstName, lastName, email, hashedPassword, organization);
}

exports.loginUser = async (email, password) => {
   
    const user = await userModel.getUserByEmail(email);

    if(!user){
        const error = new Error("Invalid email or password");
        error.code = "INVALID_DATA";
        throw error;
    }

    const isPasswordValid = await passwordCompare(password, user.Password);

    if(!isPasswordValid){
        const error = new Error("Invalid email or password");
        error.code = "INVALID_DATA";
        throw error;
    }

    return await jwt.sign(
        {userId: user.Id, email: user.Email},
        JWT_SECRET,
        {expiresIn: "1h"}
    );
}

exports.getUserById = async (id) => {
    const user = await userModel.getUserDataById(id);

    if(!user){
        const error = new Error("Invalid id");
        error.code = "INVALID_ID";
        throw error;
    }

    return user;
}
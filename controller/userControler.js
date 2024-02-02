const User = require('../models/User');
const ProductsNumber = require('../models/ProductsNumbers.js');
const asyncHandler = require('express-async-handler');

//let usersCounter = 1;

const createNewUser = asyncHandler(async (req, res) => {
    const {username, password, confPassword, gender} = req.body;
    let role = '';

    //Counter for the users. The number_of_users field will be the id of the new user
    try {
        var counter = await ProductsNumber.findOneAndUpdate({id : "Users"}, {$inc : {number_of_products : 1}}, {new : true});
    } catch (error) {
        console.error("Error:", error); 
    }

    //Checks for empty input fields
    if(!username || !password || !confPassword || !gender) {
        return res.status(400).json({message : "All fields are required!"});
    }

    //Checks for valid configuration of the password
    if(password !== confPassword) {
        return res.status(400).json({message : "Please confirm your password correct!"});
    }

    //Checks if the password is less than 7 symbols
    if(password.length < 7) {
        return res.status(400).json({message : "The password should be at least 7 symbols!"});
    }

    //Checks if the password contains only numbers
    if(/^[0-9]+$/.test(password)) {
        return res.status(400).json({message : "The password should not contains just numbers!"});
    }

    const repeate = await User.findOne({username}).lean().exec();

    //Checks if there is alredy a user with the same username
    if(repeate) {
        return res.status(400).json({message : `A user with username : ${username} already exists!`});
    }
    
    //Check if the user has given a data to be given the admin role
    let newUsername; 
    if(password.includes("+e?_aDM") && username.includes("&admin")) {
        newUsername = username.replace("&admin", '');
        role = "admin";
    }
    else { 
        newUsername = username;
        role = "user";
    }

    //Creates the user in the database
    const user = await User.create({id: counter.number_of_products, username : newUsername, password, gender, role});

    if(user) {
        res.status(201).json({message : "User created!"})
    }
    else {
        res.status(400).json({message : "Invalid data recieved!"})
    }
});

const LoginUser = asyncHandler(async(req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({message : "All fields are required!"});
    }

    let userToFind = await User.findOne({
        username : username,
        password : password
    }).lean().exec();

    if(!userToFind) {
        return res.status(400).json({message : "Not such user found!"});
    }

    let userToSend = userToFind;
    delete userToSend["password"];
    return res.status(201).json({...userToSend, message : "Success"});
})

module.exports = {createNewUser, LoginUser};

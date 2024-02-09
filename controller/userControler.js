const User = require('../models/User');
const BanUser = require('../models/BannedUser.js');
const ProductsNumber = require('../models/ProductsNumbers.js');
const asyncHandler = require('express-async-handler');

const createNewUser = asyncHandler(async (req, res) => {
    const {username, password, confPassword, birthday, gender} = req.body;
    let todaysDate = new Date();
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

    let newUser = {
        id : counter.number_of_products,
        username : newUsername,
        password : password,
        gender : gender
    }

    //Creates the user in the database
    const user = await User.create({id: counter.number_of_products, username : newUsername, password, gender, birthday, acountCreation : todaysDate, role});

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
        //Looks wheather the user is banned
        let bannedUser = await BanUser.findOne({username : username});
        if(bannedUser) {
            return res.status(201).json({message : "You have been banned!", data : bannedUser});
        }
        else {
            return res.status(400).json({message : "Not such user found!"});
        }
    }

    let userToSend = userToFind;
    delete userToSend["password"];
    return res.status(201).json({...userToSend, message : "Success"});
});

const deleteFromBanCollection = asyncHandler(async (req, res) => {
    const {id} = req.query;
    
    let bannedUser = await BanUser.deleteOne({id : id});

    if(bannedUser.deletedCount > 0) {
        return res.status(201).json({message : "Deleted!"});
    }
    else {
        return res.status(400).json({message : "Not deleted!"});
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const banData = JSON.parse(req.query.banData);

    //deletes the user from user collection
    let user = await User.findOneAndDelete({id : banData.user});

    if(user) {
        //Increments the counter baned users and use it as banned user id
        let counter = await ProductsNumber.findOneAndUpdate({id : "banuser"}, {$inc : {number_of_products : 1}}, {$new : true});
        let bannedUserObject = {
            id : counter.number_of_products,
            username : user.username,
            from : banData.bannedFrom,
            reason : banData.reason,
            dateOfBanning : new Date()
        }

        //Decrement the counter of users
        counter = await ProductsNumber.findOneAndUpdate({id : "Users"}, {$inc : {number_of_products : -1}});

        //Decrements the ids of every user with bigger id than deleted one
        if(user.id !== counter.number_of_products + 1) {
            for(let i = user.id + 1; i <= counter.number_of_products + 1; i++) {
                await User.updateOne({id : i}, {$inc : {id : -1}});
            }
        }

        //creates the banned document
        let insertBan = BanUser.create(bannedUserObject);

        if(insertBan) {
            return res.status(201).json({message : "User banned!"});
        }
        else {
            return res.status(401).json({message : "Bad request"});
        }
    }
    else {  
        return res.status(404).json({message : "No such user found"});
    }
})

module.exports = {createNewUser, LoginUser, deleteFromBanCollection, deleteUser};

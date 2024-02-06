const User = require("../models/User");

const getAllUsers = async () => {
    try {
        const users = await User.find({}).exec();
        return users;
    } 
    catch(err) {
        console.error("Error finding users:", error);
        throw error;
    }
};

module.exports = getAllUsers;


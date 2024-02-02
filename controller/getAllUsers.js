//Test code to check the connection

const mongoose = require('mongoose');

const User = mongoose.model("Products", new mongoose.Schema({}), "Products");

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


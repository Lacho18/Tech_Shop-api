//Code that connects the server to MongoDB database

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/TechShop", {useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connection complite !");
    }
    catch(err) {
        console.log("MongoDB connection error " + err);
    }
};

module.exports = connectDB;
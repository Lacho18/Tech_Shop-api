const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id : Number,
    username : String,
    password : String,
    gender : String,
    birthday : Date,
    acountCreation : Date,
    role: String,
    comments : [Object],
    purchases : [Object],
    box : [String] 
})

module.exports = mongoose.model('User', userSchema);
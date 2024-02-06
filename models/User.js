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
    purchases : [String],
    box : [String] 
})

module.exports = mongoose.model('User', userSchema);
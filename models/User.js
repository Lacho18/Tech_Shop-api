const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id : Number,
    username : String,
    password : String,
    gender : String,
    role: String,
    comments : [Object],
    purchases : [String],
    box : [String] 
})

module.exports = mongoose.model('User', userSchema);
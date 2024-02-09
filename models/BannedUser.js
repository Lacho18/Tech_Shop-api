const mongoose = require('mongoose');

const bannedUserSchema = new mongoose.Schema({
    id : Number,
    username : String,
    from : String,
    reason : String,
    dateOfBanning : Date
})

module.exports = mongoose.model('banUser', bannedUserSchema);
const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    productID : Number,
    commentID : Number,
    userID : Number,
    timestamp : Date,
    comment : String
});

module.exports = mongoose.model('Comments', commentsSchema);
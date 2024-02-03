const { default: mongoose } = require('mongoose');
const fs = require("fs");
const path = require("path");
const CommentsSchema = require("../models/Comments");
const ProductNumbers = require("../models/ProductsNumbers");
const asyncHandler = require('express-async-handler');

//A function that returns all the comments for a specific product
const getComments = asyncHandler(async (req, res) => {
    //splits the coming query by every ',' and makes the numbers
    let usersID = req.query.usersID.split(',').map(Number);

    //removes the repeating elements in the array
    for (let i = 0; i < usersID.length - 1; i++) {
        for (let j = i + 1; j < usersID.length; j++) {
            if (usersID[i] && usersID[j] && usersID[i] === usersID[j]) {
                usersID.splice(j, 1);
                j--;
            }
        }
    }

    let collection = mongoose.connection.collection("users");
    let result = await collection.find({id : {$in : usersID}}, {projection : {_id : 0, id : 1, username : 1}}).toArray();

    if(result) {
        res.status(201).json(result);
    } else {
        res.status(400).json({message : "No comments found!"});
    }
});

//a function that add new comment to the database
const postComment = asyncHandler(async (req, res) => {
    const {userID, productID, productType, comment} = req.body;

    const counter = await ProductNumbers.findOneAndUpdate({id : "comments"}, {$inc : {number_of_products : 1}}, {new : true});
    const newComment = {
        userID : userID,
        productID : productID,
        commentID : counter.number_of_products,
        timestamp : new Date(),
        comment : comment
    }

    const collection = mongoose.connection.collection(`${productType}`);
    const product = await collection.findOne({id : productID});

    let result = 1;
    if(product) {
        if(product.comments.length <= 10) {
            result = await collection.updateOne({id : productID}, {$push : {comments : newComment}}, {new : true});
        }
        else {
            result = await CommentsSchema.create(newComment);
        }
    }

    if(result) {
        return res.status(201).json({message : "Comment submited!"});
    }
    else {
        return res.status(400).json({message : "Bad request"});
    }
});

//function that updates a comment
const updateComment = asyncHandler(async (req, res) => {

});

//function that deletes a comment
const deleteComment = asyncHandler(async (req, res) => {

});

module.exports = { getComments, postComment, updateComment, deleteComment }
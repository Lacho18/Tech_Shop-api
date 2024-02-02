const { default: mongoose } = require('mongoose');
const fs = require("fs");
const path = require("path");
const CommentsSchema = require("../models/Comments");
const ProductNumbers = require("../models/ProductsNumbers");
const asyncHandler = require('express-async-handler');

//A function that returns all the comments for a specific product
const getComments = asyncHandler(async (req, res) => {

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
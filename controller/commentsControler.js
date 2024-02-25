const { default: mongoose } = require('mongoose');
const fs = require("fs");
const path = require("path");
const CommentsSchema = require("../models/Comments");
const ProductNumbers = require("../models/ProductsNumbers");
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

//A function that returns all the comments for a specific product
const getComments = asyncHandler(async (req, res) => {
    let currentProductAndPageData = JSON.parse(req.query.pageNumber);

    /*
        if the page is first and first loaded takes the comments that are inside the comments atribute of the current product
        this code also gets the total number of the comments on this prduct and returns it so that it can be define how many pages should have for the comments        
    */
    if (currentProductAndPageData.page == 1 && !currentProductAndPageData.isAuthorized) {
        //Gets the total number of comments without the comments on the main component
        let totalNumberOFComments = await CommentsSchema.countDocuments({ productType: currentProductAndPageData.productType, productID: currentProductAndPageData.productID });
        console.log(totalNumberOFComments);
        //gets current product
        let collection = mongoose.connection.collection(`${currentProductAndPageData.productType}`);
        let product = await collection.findOne({ id: currentProductAndPageData.productID });
        let result = product.comments;
        usersID = result.map(indexValue => indexValue.userID);

        //removes the repeating elements in the array
        usersID = simplifyArray(usersID);

        //gets the users that have written comment
        collection = mongoose.connection.collection("users");
        let usersData = await collection.find({ id: { $in: usersID } }, { projection: { _id: 0, id: 1, username: 1 } }).toArray();

        //adds the username field to the comment object
        result = result.map(indexValue => {
            const matches = usersData.find(userData => userData.id === indexValue.userID);
            return matches ? { ...indexValue, username: matches.username } : indexValue;
        })

        if (result) {
            res.status(201).json({ comments: result, allComments: totalNumberOFComments + result.length });
        } else {
            res.status(400).json({ message: "No comments found!" });
        }
    }
    else if (!currentProductAndPageData.isAuthorized) {
        //Gets 10 comments from the collection with the comments. If the page is like 4 skips 20 comments because first 10 are in the main document
        let result = await CommentsSchema.find({ productType: currentProductAndPageData.productType, productID: currentProductAndPageData.productID })
            .skip((currentProductAndPageData.page - 2) * 10)
            .limit(10);

        //gets every userID and store it in an array
        let usersID = result.map(indexValue => indexValue.userID);

        //removes the repeating parts
        usersID = simplifyArray(usersID);

        //finds all the users with the left ids in usersID array
        let collection = mongoose.connection.collection("users");
        let usersData = await collection.find({ id: { $in: usersID } }, { projection: { _id: 0, id: 1, username: 1 } }).toArray();

        //adds the user username to the comment object
        result = result.map(indexValue => {
            const matches = usersData.find(userData => userData.id === indexValue.userID);
            return matches ? { ...indexValue._doc, username: matches.username } : indexValue._doc;
        })

        return res.status(201).json({ comments: result });
    }
    //Takes all the comments in the collection. Its a request that can be done only from admin page
    else {
        let totalNumberOFComments = await CommentsSchema.countDocuments({});
        let result = await CommentsSchema.find({}).skip((currentProductAndPageData.page - 1) * 10).limit(10);
        if (result) {
            res.status(201).json({ comments: result, allComments: totalNumberOFComments });
        } else {
            res.status(400).json({ message: "No comments found!" });
        }
    }

});

//a function that add new comment to the database
const postComment = asyncHandler(async (req, res) => {
    const { userID, productID, productType, comment } = req.body;

    const counter = await ProductNumbers.findOneAndUpdate({ id: "comments" }, { $inc: { number_of_products: 1 } }, { new: true });
    const newComment = {
        userID: userID,
        productType: productType,
        productID: productID,
        commentID: counter.number_of_products,
        timestamp: new Date(),
        comment: comment
    }

    const collection = mongoose.connection.collection(`${productType}`);
    const product = await collection.findOne({ id: productID });

    //Adds the comment to the product product array or inside the comments collection (depends on the number of already existing comments)
    let result;
    if (product) {
        if (product.comments.length <= 10) {
            result = await collection.updateOne({ id: productID }, { $push: { comments: newComment } }, { new: true });
        }
        else {
            result = await CommentsSchema.create(newComment);
        }
    }

    //Adds the comment to the user object, inside the comments array
    let commentObject = {
        type: product.type,
        brand: product.brand,
        model: product.model,
        comment: comment
    }
    await User.updateOne({ id: userID }, { $push: { comments: commentObject } });

    if (result) {
        return res.status(201).json({ message: "Comment submited!" });
    }
    else {
        return res.status(400).json({ message: "Bad request" });
    }
});

//function that updates a comment
const updateComment = asyncHandler(async (req, res) => {
    let data = JSON.parse(req.query.data);
    let commentID = Number(data.commentID);
    let redactedComment = data.correctedComment;

    let collection = mongoose.connection.collection(`${data.productType}`);
    let product = await collection.findOne({ id: data.productID });

    if (product) {
        let result = product.comments.find(indexValue => indexValue.commentID === commentID);

        //in case the comment is inside the main array in the product object
        if (result) {
            //finds the index of the object inside the comments array that should be updated
            let index = product.comments.map(x => x.commentID).indexOf(commentID);

            //updates the comment field in the specific index inside the array
            let document = await collection.updateOne({ id: data.productID }, { $set: { [`comments.${index}.comment`]: redactedComment } });
            if (document.modifiedCount > 0) {
                return res.status(201).json({ message: "Comment updated!" });
            }
            else {
                return res.status(404).json({ message: "Comment not found" });
            }
        }
        //in case the comment is inside the comments collection
        else {
            //upgrates the comment inside the comment field
            let updatedResult = await CommentsSchema.updateOne({ commentID: commentID }, { comment: redactedComment });
            if (updatedResult.modifiedCount > 0) {
                return res.status(201).json({ message: "Comment updated!" });
            }
            else {
                return res.status(404).json({ message: "Comment not found" });
            }

        }
    }
});

//function that deletes a comment
const deleteComment = asyncHandler(async (req, res) => {
    let data = JSON.parse(req.query.data);
    let id = Number(data.commentID);
    let counter = await ProductNumbers.findOneAndUpdate({ id: "comments" }, { $inc: { number_of_products: -1 } }, { new: true }); // Use { new: true } to return the updated document
    let result = await CommentsSchema.deleteOne({ commentID: id });

    if (result.deletedCount > 0) {
        if (counter.number_of_products + 1 !== id) {
            // Run the loop only after counter is updated
            for (let i = id + 1; i <= Number(counter.number_of_products + 1); i++) {
                try {
                    let updated = await CommentsSchema.updateOne({ commentID: i }, { $inc: { commentID: -1 } });
                    console.log(updated.upsertedCount);
                } catch (error) {
                    console.error("Error updating comment:", error);
                }
            }
        }

        return res.status(201).json({ message: "Comment deleted" });
    } else {
        let collection = mongoose.connection.collection(`${data.productType}`);
        let product = await collection.findOne({id : data.productID});
        let updateCount = await collection.updateOne({id : data.productID}, {$pull : {comments : {commentID : data.commentID}}});

        if(updateCount.modifiedCount > 0) {
            return res.status(201).json({ message: "Comment deleted" });
        }
        else {
            return res.status(401).json({ message: "Error" });
        }
    }
});

//removes the repeating elements in the array
function simplifyArray(array) {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] && array[j] && array[i] === array[j]) {
                array.splice(j, 1);
                j--;
            }
        }
    }

    return array;
}

module.exports = { getComments, postComment, updateComment, deleteComment }
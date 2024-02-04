const { default: mongoose } = require('mongoose');
const fs = require("fs");
const path = require("path");
const CommentsSchema = require("../models/Comments");
const ProductNumbers = require("../models/ProductsNumbers");
const asyncHandler = require('express-async-handler');

//A function that returns all the comments for a specific product
const getComments = asyncHandler(async (req, res) => {
    console.log(req.query.pageNumber);

    let currentProductAndPageData = JSON.parse(req.query.pageNumber);

    /*
        if the page is first and first loaded takes the comments that are inside the comments atribute of the current product
        this code also gets the total number of the comments on this prduct and returns it so that it can be define how many pages should have for the comments        
    */
    if (currentProductAndPageData.page == 1) {
        //Gets the total number of comments without the comments on the main component
        let totalNumberOFComments = await CommentsSchema.countDocuments({productType : currentProductAndPageData.productType, productID : currentProductAndPageData.productID});
        console.log(totalNumberOFComments);
        //gets current product
        let collection = mongoose.connection.collection(`${currentProductAndPageData.productType}`);
        let product = await collection.findOne({id : currentProductAndPageData.productID});
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
            res.status(201).json({comments : result, allComments : totalNumberOFComments + result.length});
        } else {
            res.status(400).json({ message: "No comments found!" });
        }
    }
    else {
        //Gets 10 comments from the collection with the comments. If the page is like 4 skips 20 comments because first 10 are in the main document
        let result = await CommentsSchema.find({productType : currentProductAndPageData.productType, productID : currentProductAndPageData.productID})
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
        
        return res.status(201).json({comments : result});
    }

});

//a function that add new comment to the database
const postComment = asyncHandler(async (req, res) => {
    const { userID, productID, productType, comment } = req.body;

    const counter = await ProductNumbers.findOneAndUpdate({ id: "comments" }, { $inc: { number_of_products: 1 } }, { new: true });
    const newComment = {
        userID: userID,
        productType : productType,
        productID: productID,
        commentID: counter.number_of_products,
        timestamp: new Date(),
        comment: comment
    }

    const collection = mongoose.connection.collection(`${productType}`);
    const product = await collection.findOne({ id: productID });

    let result = 1;
    if (product) {
        if (product.comments.length <= 10) {
            result = await collection.updateOne({ id: productID }, { $push: { comments: newComment } }, { new: true });
        }
        else {
            result = await CommentsSchema.create(newComment);
        }
    }

    if (result) {
        return res.status(201).json({ message: "Comment submited!" });
    }
    else {
        return res.status(400).json({ message: "Bad request" });
    }
});

//function that updates a comment
const updateComment = asyncHandler(async (req, res) => {

});

//function that deletes a comment
const deleteComment = asyncHandler(async (req, res) => {

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
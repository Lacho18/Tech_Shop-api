const { default: mongoose } = require('mongoose');
const asyncHandler = require('express-async-handler');
const User = require("../models/User");

const getPurchasedItems = asyncHandler((req, res) => {

});

const postPurchasedItems = asyncHandler(async (req, res) => {
    const items = req.body.items;

    //decrements the 'available' field of the product and adds the product to 'purchases' array of the user that made the purchase
    for(const item of items) {
        let collection = mongoose.connection.collection(`${item.type}`);
        let product = await collection.findOneAndUpdate({id : item.id}, {$inc : {available : -1}}, {$new : true});
        await User.updateOne({id : req.body.user}, {$push : {purchases : product}});
    }
});

module.exports = {getPurchasedItems, postPurchasedItems};
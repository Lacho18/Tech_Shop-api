const { default: mongoose } = require('mongoose');
const asyncHandler = require('express-async-handler');
const fs = require("fs");
const path = require("path");

const getSingleProduct = asyncHandler(async (req, res) => {
    const { id, type } = req.params;

    console.log("ALOOOOOOOOOOOO");

    //finds the product
    let collection = mongoose.connection.collection(`${type}`);
    let result = await collection.findOne({id : Number(id)});

    let currency = fs.readFileSync(path.resolve(__dirname, "../data/avaylableValutes.json"), "utf-8");
    currency = JSON.parse(currency);

    if (result) {
        return res.status(201).json({...result, currency: currency});
    }
    else {
        return res.status(500).json({ message: "Not found product or invalid data sended!" });
    }
});

module.exports = { getSingleProduct };
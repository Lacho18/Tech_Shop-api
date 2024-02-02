const { default: mongoose } = require('mongoose');
const Product = require('../models/Product.js');
const ProductsNumber = require('../models/ProductsNumbers.js');
const fs = require("fs");
const path = require("path");
const asyncHandler = require('express-async-handler');

const getProduct = asyncHandler(async (req, res) => {
    const { type } = req.params;
    let collection = mongoose.connection.collection(`${type}`);
    let result = await collection.find({}).toArray();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(401).json({ message: "Not such product found" });
    }
});

const postProduct = asyncHandler(async (req, res) => {
    const input = req.body;
    //Checks for empty input fields
    for (key in input) {
        if (input[key] === "" || input[key] === undefined || input[key] === -1) {
            return res.status(401).json({ message: "All fields are required!" });
        }
        if(key === "characteristics") {
            for(charKey in input[key]) {
                if((input.characteristics[charKey] === "" || input.characteristics[charKey] === undefined || input.characteristics[charKey] === -1)) {
                    return res.status(401).json({ message: "All fields are required!" });
                }
            }

            continue;
        }
        //Check if a field is an array and then if there is elements in it (it is posible to have 1 or 0 elements at this phase) splits the element by every , detected
        if(Array.isArray(input[key])) {
            if(input[key].length !== 0) {
                input[key] = input[key][0].split(',');
                
                if(input[key].length === 1) {
                    return res.status(401).json({message : `The value in ${key} contains only one atribute. Please add more or ensure that you separate them with , !`});
                }
            }
        }
    }

    //Sets the first letter of type atribute to lower case
    let typeWithLowerCase = input.type.substring(1);
    let firstLetter = input.type[0].toLowerCase();
    typeWithLowerCase = firstLetter + typeWithLowerCase;
    input.type = typeWithLowerCase;

    try {
        let collection = mongoose.connection.collection(`${input.type}`);
        let repeate = await collection.findOne({...input});
        console.log(repeate);
        if(repeate) {
            return res.status(401).json({message : "This product already exist!"})
        }

        //Increments the valuo for the documents that counts the product with specific type
        let counter = await ProductsNumber.findOneAndUpdate({id : input.type}, {$inc : {number_of_products : 1}}, {new : true});

        await collection.insertOne({id : counter.number_of_products, ...input});
        res.status(200).json({ message: "Product added successfully!", status: true });
    }
    catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: "Internal server error" });
    }

    console.log("The input field");
    console.log(input);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id, type } = req.body;

    try {
        let result = await Product.deleteOne({ id: id });
    }
    catch (err) {
        console.error(err);
    }
    if (result) {
        /*
        This code updates the counter. It depends on the database structure
        let counterFilter = await ProductsNumber.findOne({id : type});
        counterFilter.number_of_products--;
        counterFilter.save();
        */
        /*
        This code depends on the database structure
        for(let i = id + 1; i <= counterFilter.number_of_products; i++) {
            let productIdToChange = await Product.findOne({id : i});
        }
        */
        console.log(result);
    } else {
        console.log("No such product found"); 
    }
})

function setCharacteristicTypes(givenType) {
    let helpString = givenType;
    helpString += "Characteristics";

    let schema = fs.readFileSync(path.resolve(__dirname, `../models/Characteristics/${helpString}.json`), "utf-8");
    let result = JSON.parse(schema);

    return result;
}

module.exports = { getProduct, postProduct, deleteProduct, setCharacteristicTypes };
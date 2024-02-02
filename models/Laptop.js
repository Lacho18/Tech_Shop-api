const mongoose = require("mongoose");
const LaptopCharacteristics = require("./Characteristics/LaptopCharacteristics");

const laptopProduct = new mongoose.Schema({
    id : Number,
    type: String,
    brand : String,
    model : String,
    titleImage : String,
    images : [String],
});
const mongoose = require('mongoose');

const productNumbersSchema = new mongoose.Schema({
    id : String,
    number_of_products : Number
});

module.exports = mongoose.model('ProductsNumber', productNumbersSchema);
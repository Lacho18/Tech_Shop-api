const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id : Number,
    type : String,
    brand : String,
    model : String,
    titleImage : String,
    images : [String],
    characteristics : Object,
    warranty : Number,
    comments : [Object],
    price : Number,
    available : Number,
    buyed : Number,
    isNew : Boolean
});

module.exports = mongoose.model('Product', productSchema);

/*
    {
        processor : String,
        GPU : String,
        DRAM : {
            model : String,
            capacity : Number
        },
        Disk : {
            kind : String,
            capacity : Number
        },
    }
*/ 
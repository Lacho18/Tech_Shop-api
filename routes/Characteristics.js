const express = require('express');
const router = express.Router();
const {setCharacteristicTypes} = require("../controller/productsControler");

router.route('/:type').get(async (req, res) => {
    let {type} = req.params;

    let schema = await setCharacteristicTypes(type);

    if(schema) {
        return res.status(201).json(schema);
    }
    else {
        return res.status(400).json({message : "Not such schema found"});
    }   
});

module.exports = router;
const express = require('express');
const router = express.Router();
const getAllUsers = require('../controller/getAllUsers');

router.route('/').get(async (req, res) => {
    console.log("EHOOO");
    let allUsers = await getAllUsers();
    console.log(allUsers);
    if(allUsers) {
        return res.status(201).json(allUsers); 
    }
    else {
        return res.status(400).json({message : "No users found"});
    }
})

module.exports = router;
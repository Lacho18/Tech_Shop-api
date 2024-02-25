const express = require('express');
const router = express.Router();
const getAllUsers = require('../controller/getAllUsers');

router.route('/').get(async (req, res) => {
    let allUsers = await getAllUsers();
    if(allUsers) {
        return res.status(201).json(allUsers); 
    }
    else {
        return res.status(400).json({message : "No users found"});
    }
})

module.exports = router;
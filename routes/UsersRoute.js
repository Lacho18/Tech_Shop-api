const express = require('express');
const router = express.Router();
const userControler = require('../controller/userControler');

router.route('/*')
        .get(userControler.LoginUser)
        .post(userControler.createNewUser)
        .put(userControler.deleteFromBanCollection)
        .delete(userControler.deleteUser);

module.exports = router;
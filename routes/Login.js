const express = require('express');
const router = express.Router();
const userControler = require('../controller/userControler');

router.route('/')
        .post(userControler.LoginUser)
        .put(userControler.deleteFromBanCollection)
        .delete(userControler.deleteUser);

module.exports = router;
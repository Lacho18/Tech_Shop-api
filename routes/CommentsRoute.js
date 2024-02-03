const { default: mongoose } = require('mongoose');
const express = require('express');
const router = express.Router();
const commentsFunctions = require('../controller/commentsControler');
        

router.route("/*")
        .get(commentsFunctions.getComments)
        .post(commentsFunctions.postComment)
        .put(commentsFunctions.updateComment)
        .delete(commentsFunctions.deleteComment)

module.exports = router;
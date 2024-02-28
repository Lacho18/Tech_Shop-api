const express = require('express');
const router = express.Router();
const purchaseFunctions = require("../controller/purchaseControler");

router.route("/")
        .post(purchaseFunctions.postPurchasedItems);

module.exports = router;
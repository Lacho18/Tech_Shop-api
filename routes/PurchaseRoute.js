const express = require('express');
const router = express.Router();
const purchaseFunctions = require("../controller/purchaseControler");

router.route("/")
        .get(purchaseFunctions.getPurchasedItems)
        .post(purchaseFunctions.postPurchasedItems);

module.exports = router;
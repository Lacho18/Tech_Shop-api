const express = require('express');
const router = express.Router();
const productFunctions = require("../controller/productsControler.js");
const singleProductFunctions = require("../controller/singleProductControler.js");
const authMiddleWare = require("../middleware/authorize.js");

router.route('/single/:id/:type')
      .get(singleProductFunctions.getSingleProduct);

router.route('/*')
      .get(authMiddleWare, productFunctions.getProduct)
      .post(productFunctions.postProduct)
      .delete(productFunctions.deleteProduct);

module.exports = router;
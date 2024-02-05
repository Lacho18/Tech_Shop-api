const express = require('express');
const router = express.Router();
const productFunctions = require("../controller/productsControler.js");
const singleProductFunctions = require("../controller/singleProductControler.js");

router.route('/single/:id/:type')
      .get(singleProductFunctions.getSingleProduct);

router.route('/*')
      .get(productFunctions.getProduct)
      .post(productFunctions.postProduct)
      .delete(productFunctions.deleteProduct);

module.exports = router;
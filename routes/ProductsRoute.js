const express = require('express');
const router = express.Router();
const productFunctions = require("../controller/productsControler.js");
const singleProductFunctions = require("../controller/singleProductControler.js");

router.route('/:type')
      .get(productFunctions.getProduct)
      .post(productFunctions.postProduct)
      .delete(productFunctions.deleteProduct);

router.route('/single/:id/:type')
      .get(singleProductFunctions.getSingleProduct);

module.exports = router;
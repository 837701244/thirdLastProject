const express = require('express');
const router = express.Router();


let productController = require("../controller/productController");
let product= new productController();



/* GET home page. */
router.get('/findByCatIdOnePage', product.findByCatIdOnePage);
router.get('/findById', product.findById);









module.exports = router;

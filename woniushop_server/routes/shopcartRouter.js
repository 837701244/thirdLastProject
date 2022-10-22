const express = require('express');
const router = express.Router();


let shopcartController = require("../controller/shopcartController");
let shopcart= new shopcartController();



/* GET home page. */
router.get('/add', shopcart.add);
router.get('/findByUserId', shopcart.findByUserId);
router.get('/updataProductNum', shopcart.updataProductNum);
router.get('/delet', shopcart.delet);
router.get('/deletAll', shopcart.deletAll);
router.get('/batchAll', shopcart.batchAll);










module.exports = router;

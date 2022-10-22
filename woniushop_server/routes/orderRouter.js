var express = require('express');
var router = express.Router();
const OrderController = require("../controller/orderController");
const controller = new OrderController();

router.get("/pay", controller.alipay);
router.get("/payOk", controller.payOk);
router.get("/create", controller.create);
router.get("/one", controller.findOne);
router.get("/list", controller.findAll);

// router.get("/one", controller.findOne);

module.exports = router;

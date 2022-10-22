const express = require('express');
const router = express.Router();


let AddressController = require("../controller/addressController");
let address= new AddressController();



/* GET home page. */
router.get("/list",address.list);
router.get("/add",address.add);
router.get("/deletOne",address.deletOne);
router.get("/moren",address.updateMoren);
router.get("/findById",address.findById);
router.get("/update",address.update);
router.get("/findAll",address.findAll);












module.exports = router;

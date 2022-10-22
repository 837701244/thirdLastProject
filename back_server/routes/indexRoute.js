const express = require('express');
const router = express.Router();

const adminController = require("../controller/adminController");
const controller = new adminController();

/* GET users listing. */
router.post('/login',controller.authentication );
router.get('/logInfo',controller.getUserInfo);
router.get('/getOldPwd',controller.getOldPwd);
router.get('/updatePwd',controller.updatePwd);

module.exports = router;

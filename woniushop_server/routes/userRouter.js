const express = require('express');
const router = express.Router();


let UserController = require("../controller/userController");
let userController= new UserController();



/* GET home page. */
router.get('/info', userController.findById);
router.post('/update', userController.update);











module.exports = router;

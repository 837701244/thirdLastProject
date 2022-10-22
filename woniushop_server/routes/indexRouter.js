const express = require('express');
const router = express.Router();

let UserController = require("../controller/userController");
let user= new UserController();

let productController = require("../controller/productController");
let product= new productController();

let categoryController = require("../controller/categoryController");
let category= new categoryController();

/* GET home page. */
router.post('/login', user.authentication);
router.get('/list', user.userInfo);
router.get('/findUserName', user.findName);
router.post('/addUser', user.addUser);
router.get('/hotProduct', product.hotProduct);
router.get('/catrgory', category.Catgory);
router.get('/catrgoryBig', category.CatgoryBig);






module.exports = router;

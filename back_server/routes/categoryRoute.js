const express = require('express');
const router = express.Router();

const categoryController = require("../controller/categoryController");
const controller = new categoryController();

/* GET users listing. */
router.get('/catgoryId',controller.findCargory );

module.exports = router;
const express = require('express');
const router = express.Router();

const productController = require("../controller/productController");
const controller = new productController();

let {upload} = require("../util/fileUtil");

router.get("/list",controller.list);
router.get('/deletOne',controller.remove );
router.get('/batchDelet',controller.batchRemove );
router.post('/add',upload.single('imagePath'),controller.add );
router.get('/findById',controller.findById );
router.post('/edit',upload.single('imagePath'),controller.update );

module.exports = router;
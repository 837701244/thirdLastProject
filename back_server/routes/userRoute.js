const express = require('express');
const router = express.Router();

const userController = require("../controller/userController");
const controller = new userController();

let {upload} = require("../util/fileUtil");

router.get('/list',controller.findOnePage );
router.get('/deletOne',controller.remove );
router.get('/batchDelet',controller.batchRemove );
router.post('/add',upload.single('avatar'),controller.addUser );
router.get('/findById',controller.findById );
router.post('/edit',upload.single('editAvatar'),controller.editUser );


module.exports = router;

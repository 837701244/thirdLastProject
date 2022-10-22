const CategoryModel = require("../model/categoryModel");
const categoryModel = new CategoryModel();


class CategoryController {
    async update(req,res) {
        let param = req.body; // 获取表单参数
        if(req.file){
            let imgPath = fileServerPath(req.file); // 获取到文件上传的图片访问路径
        }
        // 调用model来更新数据
        let rows = await appModel.update(param);
        res.send(rows>0?{status:1,msg:"更新成功"}:{status:0,msg:"更新失败"});
    }

    async findCargory(req,res){
        let data = await categoryModel.findCatfory();
        res.send(data);
    }

}

module.exports = CategoryController;
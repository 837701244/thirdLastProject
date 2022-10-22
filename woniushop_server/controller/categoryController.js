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


    async  Catgory(req,res){
      let data = await categoryModel.catrgory();
        res.send(data.length>0?{status:1,msg:"查询成功",data}:{status:0,msg:"查询失败"})
    }

    async CatgoryBig(req,res){
        let data = await categoryModel.catrgoryBig();
        res.send(data.length>0?{status:1,msg:"查询成功",data}:{status:0,msg:"查询失败"})
    }

}

module.exports = CategoryController;
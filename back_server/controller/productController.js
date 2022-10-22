const ProductModel = require("../model/productModel");
const {fileServerPath} = require("../util/fileUtil");
const productModel = new ProductModel();


class ProductController {
    async update(req,res) {
        let param = req.body; // 获取表单参数
        if(req.file){
            param.imagePath = fileServerPath(req.file); // 获取到文件上传的图片访问路径

        }
        // 调用model来更新数据
        console.log("college的是",param);
        let rows = await productModel.update(param);

        res.send(rows>0?{status:1,msg:"更新成功"}:{status:0,msg:"更新失败"});
    }

    async list(req,res){
        let params = req.query;
        let page = params.page;
        page = parseInt(page);
        let pageSize =10;
        params.pageSize = pageSize;

      let data = await productModel.findOnePage(params);
      let total = await productModel.count(params);
      let totalPage = Math.ceil(total/pageSize);
      let prevPage = page == 1?totalPage:page-1;
      let nextPage = page == totalPage? 1: page+1;

        res.send({status:1,msg:"查询成功",page,pageSize,totalPage,total,prevPage,nextPage,data});
    }

    async remove(req,res){
        let {_id}= req.query;
        let data = await productModel.remove(_id);
        res.send(data > 0 ? {status:1,msg:"删除成功"}:{status:0,msg:"删除失败"})
    }

    async batchRemove(req,res){
        let {arr} = req.query;
        let data = await productModel.batchRemove(arr);
        res.send(data > 0 ? {status:1,msg:"删除成功"}:{status:0,msg:"删除失败"})
    }

    async add(req,res){
        let obj = req.body;
        if (req.file){
            obj.imagePath = fileServerPath(req.file);
        }
        console.log(obj);
        let promise =await productModel.addProduct(obj);
        res.send(promise !=null ? {status:1,msg:"添加成功",promise}:{status:0,msg:"添加失败",obj})
    }


    async findById(req,res){
        let {_id} = req.query;
        let data = await productModel.findById(_id);

        res.send(data!=null ? {status:1,data}:{status:0});
    }




}

module.exports = ProductController;
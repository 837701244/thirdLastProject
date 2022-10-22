let ProductModel = require("../model/productModel");
let productModel = new ProductModel();

class ProductController{

    async hotProduct(req,res){
        let data =await productModel.findHot();
        console.log(data)
        res.send({status:1,msg:"查询成功",data})
    }

    async findByCatIdOnePage(req,res){
        let obj= req.query;
        let page = obj.page
        page = page*1;
        let pageSize = 4;
        obj.pageSize = pageSize;


      let data = await productModel.findByCatIdOnePage(obj);

      let total = await  productModel.count(obj);

      let totalPage = Math.ceil(total/pageSize) ;

      let prevPage = page == 1 ? totalPage:page-1;

      let nextPage = page == totalPage ? 1: page+1;

      res.send(data!=null ?{status:1,msg:"查询成功",data,totalPage,prevPage,nextPage,total}:{status:0,msg:"查询失败"})

    }

    async findById(req,res){
       let {id} =  req.query;
        console.log(id)
        let data =await productModel.findById(id);

       res.send(data?{status:1,msg:"查询成功",data}:{status:0,msg:"查询失败"})
    }




}

module.exports = ProductController;
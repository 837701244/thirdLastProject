// model:通过mongoose连接 mongodb数据
//1. 加载mongoosemk
const mongoose = require("mongoose");

const {incrementId} =require("./seqModel");
require("../config/db");
//2. 创建校验规则


let productSchema = mongoose.Schema({
    _id : Number,
    pname : String,
    pinfo : String,
    imagePath : String,
    price : Number,
    stock : Number,
    sales : Number,
    catgoryId : Number,
    status : Number
})

//3. 获取操作数据库CRUD的model对象
const model = mongoose.model("productModel",productSchema,"product");

//4. 封装类
class ProductModel{




    async findOnePage(conditon){
        let {pname,page,start,end,pageSize} = conditon
        let startPage = (page-1)*pageSize;
            let x = [];
        let match = { pname : {$regex: pname}};
            if (start && end){
                match.price = {$gte:parseInt(start),$lte:parseInt(end)}
            }

            x.push({$match:match});
            x.push({$lookup:{from:"category",localField:"catgoryId",foreignField:"_id",as:"ProductType"}});
            x.push({$skip:startPage});
            x.push({$limit:pageSize})
       return await model.aggregate(x);
    }


    async findById(id,data={}){
        let result =  await model.find({_id: id});
        return result.length==1?result[0]:null;
    }

    async findByCatIdOnePage(obj){
        let {page,pageSize,id,keyword}=obj;
        page < 0 ?1:page;
        let start = (page-1)*pageSize;
        console.log(obj);
        let xx ={status:1}
        if (id){
            xx.catgoryId = id;
        }
        if (keyword){
            xx = {status:1,$or:[{pname:{$regex:keyword}},{pinfo:{$regex:keyword}}]}
            // xx.pname ={$regex:keyword}
            // xx.pinfo = {$regex:keyword}
        }
        console.log("22222222222222",xx)
        let result =  await model.find(xx).skip(start).limit(pageSize);

        return result.length > 0 ? result :null;
    }

    async remove(_id){
        let {deletedCount}  = await model.deleteOne({_id})
        return deletedCount
    }

    async batchRemove(arr){
        let {deletedCount} = await model.deleteMany({_id : {$in : arr}});
        return deletedCount;
    }

   async addProduct(obj){
       obj._id = await  incrementId("productId");
       console.log("11111111111",obj);
       let a =  await model.insertMany(obj)
       return a.length == 1 ? a[0]:null
   }



    async count(condition){
        let {id,keyword}=condition;
        let xx ={status:1}
        if (id){
            xx.catgoryId = id;
        }

        if (keyword){
            xx = {status:1,$or:[{pname:{$regex:keyword}},{pinfo:{$regex:keyword}}]}
        }

        return await model.count(xx);
    }

    async update(product){
        let {_id} = product;
        if(!_id) {
            return 0;
        }
        if (!product.imagePath){
            let obj =  await  this.findById(product._id);
            product.imagePath =obj.imagePath;
        }
        delete product._id;
        let {modifiedCount} = await model.update({_id},product);
        return modifiedCount;
    }

    async findHot(){
      return  await model.find().sort({sales:-1}).limit(9);
    }


    async updataNum(obj){
        let {modifiedCount} = await model.updateOne({_id:obj.pid},{$inc:{stock:-obj.num}});
        return modifiedCount
    }




}

//5. 暴露模块数据
module.exports = ProductModel;
let productModel = new ProductModel();
// productModel.findOnePage({pname:"",page:1,start:4000,end:5000,pageSize:5}).then(i=>{
//     console.log(i)
// })

// productModel.count({pname:"",start:"",end:""}).then(i=>{
//     console.log(i)
// })
//
// productModel.findByCatIdOnePage({page:1,pageSize:3,id:"",keyword:"宝马"}).then(i=>{
//     console.log(i)
// })
//
// productModel.findById(136).then(i=>{
//     console.log(i)
// })

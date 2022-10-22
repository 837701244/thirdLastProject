// model:通过mongoose连接 mongodb数据
//1. 加载mongoosemk
const mongoose = require("mongoose");

const {incrementId} =require("./seqModel");
// require("../config/db");
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

    async find(condition={}){
        let {page,type,platform,pageSize,keyword,sizeSort,downloadSort} = condition;
        let start = (page-1)*pageSize;
        let pipleArr = []; // 管道数组
        //1.  组合动态条件（关键词模糊+类型 +平台）
        let match = { name : {$regex: keyword}};
        if(type != "-1"){
            match.typeId = type;
        }
        if(platform != "-1"){
            match.platformId = platform;
        }
        pipleArr.push({$match : match});
        //2.分页查询
        pipleArr.push({
            $lookup : {
                from : "appType",
                localField:"typeId",
                foreignField : "_id",
                as : "type"
            }
        });
        pipleArr.push({
            $lookup : {
                from : "appPlatform",
                localField:"platformId",
                foreignField : "_id",
                as : "platform"
            }
        });
        //3. 排序
        if(sizeSort){
            pipleArr.push({$sort : {size : parseInt(sizeSort)}});
        }
        if(downloadSort){
            pipleArr.push({$sort : {downloadCount : parseInt(downloadSort)}});
        }
        pipleArr.push({$skip : start});
        pipleArr.push({$limit : pageSize});
        //4. 投影查询
        pipleArr.push({$project: {typeId:0, platformId:0, __v : 0}});
        //5. 使用mongoose管道查询
        return await model.aggregate(pipleArr);
    }


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


    async findById(id){
        let result =  await model.find({_id: id},{__v:0});
        return result.length==1?result[0]:null;
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
        let {pname,start,end} = condition;
        let match = { pname : {$regex: pname}};
        if (start && end){
            match.price = {$gte:parseInt(start),$lte:parseInt(end)}
        }

        return await model.count(match);
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
}

//5. 暴露模块数据
module.exports = ProductModel;
// let productModel = new ProductModel();
// productModel.findOnePage({pname:"",page:1,start:4000,end:5000,pageSize:5}).then(i=>{
//     console.log(i)
// })

// productModel.count({pname:"",start:"",end:""}).then(i=>{
//     console.log(i)
// })

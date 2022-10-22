// model:通过mongoose连接 mongodb数据
//1. 加载mongoosemk
const mongoose = require("mongoose");
let {incrementId} =require("./seqModel");

require("../config/db");
//2. 创建校验规则
let orderSchema = mongoose.Schema({
    _id : Number,
    orderNo : String,
    total : Number,
    createTime : String,
    finshTime : String,
    status : Number,
    uid : Number
})

//3. 获取操作数据库CRUD的model对象
const model = mongoose.model("AppModel",orderSchema,"order");

//4. 封装类
class OrderModel{

   async find(id){
       let arr =[];
       let match = {
           orderNo:id
       }
       let lookOne = {
           from:"orderDetail",
           localField:"orderNo",
           foreignField:"orderNo",
           as:"products"
       }

       arr.push({$match:match})
       arr.push({$lookup:lookOne})
       // console.log("arr",arr)
      return await model.aggregate(arr)
   }
    async findAll(id){
        let arr =[];
        let match = {
            uid:id
        }
        let lookOne = {
            from:"orderDetail",
            localField:"orderNo",
            foreignField:"orderNo",
            as:"products"
        }

        arr.push({$match:match})
        arr.push({$lookup:lookOne})
        // console.log("arr",arr)
        return await model.aggregate(arr)
    }



    async findById(id){
        let result =  await model.find({_id: id},{__v:0});
        return result.length==1?result[0]:null;
    }
    async findByUid(uid){
        let result =  await model.find({uid},{__v:0});
        return result.length>1?result:null;
    }
    async findByOrderId(id){
        let result =  await model.find({orderNo:id},{__v:0});
        return result.length>0?result[0]:null;
        // return result
    }

    async count(condition){
        let {type,platform,keyword} = condition;
        let match = {name : {$regex: keyword}};
        if(type != "-1"){
            match.typeId = type;
        }
        if(platform != "-1"){
            match.platformId = platform;
        }
        return await model.count(match);
    }

    async update(app){
        let {_id} = app;
        if(!_id) {
            return 0;
        }
        delete app._id;
        let {modifiedCount} = await model.update({_id},app);
        return modifiedCount;
    }

    async updateStatus(obj){
        let {modifiedCount} =  await model.updateMany({orderNo:obj.orderNo},obj)
        return modifiedCount;
    }


    async add(obj){
        obj._id = await incrementId("orderId");

        let a = await model.insertMany(obj)
        return a.length == 1 ? a[0]:null
    }
}

//5. 暴露模块数据
module.exports = OrderModel;

let orderModel = new OrderModel();
// orderModel.updateStatus ({orderNo:"WNSHOP20221081337301171",status:1,finshTime:22222}).then(i=>{
//     console.log(i)
// })

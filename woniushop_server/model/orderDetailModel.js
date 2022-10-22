// model:通过mongoose连接 mongodb数据
//1. 加载mongoosemk
const mongoose = require("mongoose");

let {incrementId} = require("./seqModel");

//2. 创建校验规则
let orderDetailSchema = mongoose.Schema({
    _id : Number,
    orderNo : String,
    pid : Number,
    count : Number,
})

//3. 获取操作数据库CRUD的model对象
const model = mongoose.model("orderDetail",orderDetailSchema,"orderDetail");

//4. 封装类
class OrderDetailModel{



    async findById(id){
        let result =  await model.find({_id: id},{__v:0});
        return result.length==1?result[0]:null;
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


    async batchAdd(Arr){
        for(let item of Arr){
            item._id = await incrementId("orderDetailId")
        }
     let a = await model.insertMany(Arr)


      return  a.length >0 ? a :null;
    }





}

//5. 暴露模块数据
module.exports = OrderDetailModel;
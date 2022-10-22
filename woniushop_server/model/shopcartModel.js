// model:通过mongoose连接 mongodb数据
//1. 加载mongoosemk
const mongoose = require("mongoose");

let {incrementId} = require("../model/seqModel");

require("../config/db");
//2. 创建校验规则
let shopcartSchema = mongoose.Schema({
    _id : Number,
    pid : Number,
    count : Number,
    uid : Number,
})

//3. 获取操作数据库CRUD的model对象
const model = mongoose.model("shopcartModel",shopcartSchema,"shopcart");

//4. 封装类
class ShopcartModel{

    async find(obj){
     return   await model.find(obj);
    }

    async findById(id){
        let result =  await model.find({_id: id},{__v:0});
        return result.length==1?result[0]:null;
    }

    async findByUserIdAndProductInfo(id){
          let num =  await model.find({uid: id});

          if (num.length <0){
              return null
          }else{
            return   await  model.aggregate([
                  {
                      $match:{uid:id}
                  },
                  {
                      $lookup:{
                          from:"product",
                          localField:"pid",
                          foreignField:"_id",
                          as:"product"
                      }
                  }
              ])
          }


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

    async update(ojb){
        let {uid} = ojb;
        let {pid} = ojb;
        let {num} =ojb;
        console.log(ojb);
        let {modifiedCount} = await model.updateOne({uid,pid},{$inc:{count:num}});
        return modifiedCount;
    }



    async updataNumber(obj){
        let {uid} = obj;
        let {pid} = obj;
        let {num} =obj;
        console.log(obj);
        let {modifiedCount} = await model.updateOne({uid,pid},{count:num});
        return modifiedCount;
    }


    async add(obj){
        obj["_id"]=await incrementId("shopcartId");
       let x =  model.insertMany(obj)
        return x;
    }


    async delet(obj){
      let {deletedCount} = await model.deleteOne(obj);
      return deletedCount
    }

    async deletAll(obj){
        let {deletedCount} = await model.deleteMany(obj);
        return deletedCount
    }

    async batchAll(obj){
        let {uid} =obj;
        let {pid} = obj;
        console.log("22222222222",obj)
        let {deletedCount} = await model.find({uid}).deleteMany({pid:{$in:pid}});
        return deletedCount
    }

}

//5. 暴露模块数据
module.exports = ShopcartModel;

let shopcartModel = new ShopcartModel();
// shopcartModel.find({uid:1,pid:1}).then(i=>{
//     console.log(i)
// })
// shopcartModel.add({uid:1,pid:1,count:10}).then(i=>{
//     console.log(i)
// })
// shopcartModel.update({uid:1,pid:1,num:10}).then(i=>{
//     console.log(i)
// })
// shopcartModel.findByUserIdAndProductInfo(1).then(i=>{
//     console.log(i)
// })
// shopcartModel.updataNumber({uid:1,pid:152 ,num:10}).then(i=>{
//     console.log(i)
// })

// shopcartModel.deletAll({uid:1}).then(i=>{
//     console.log(i)
// })

// shopcartModel.batchAll({uid:1,arr:[144,142]}).then(i=>{
//     console.log(i)
// })
shopcartModel.delet({uid:1,pid:176}).then(i=>{
    console.log(i)
})



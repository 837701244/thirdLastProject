// model:通过mongoose连接 mongodb数据
//1. 加载mongoosemk
const mongoose = require("mongoose");

require("../config/db");

let {incrementId} = require("./seqModel");


//2. 创建校验规则
let addressSchema =   mongoose.Schema({
    _id : Number,
    uid : Number,
    name : String,
    mobile : String,
    zone:String,
    address:String,
    postcode:String,
    status:Number
})

//3. 获取操作数据库CRUD的model对象
const model = mongoose.model("addressSchema" ,addressSchema,"address");

//4. 封装类
class AddressModel{
    async find(condition){
        return  await model.find(condition)

    }

    async findById(uid){
        return  await model.find({uid}).sort({status:-1});

    }


    async findName(username){
        return await model.find(username);

    }

    async addUser(user){
        user["_id"] = await incrementId("userId");
        user["level"] = 0;
        user["avatar"] = "http://localhost:3001/images/user/1.jpg";
        let a =  await model.insertMany(user)
        return a
    }

    async updataPwd(id,pwd){
        let {modifiedCount} = await  model.updateMany({"_id":id},{"password":pwd})
        return modifiedCount

    }

    async updata(obj){
        let {_id} = obj;
        if (!_id){
            return null
        }
        delete obj._id
        let {modifiedCount} = await model.updateMany({_id},obj)
        return modifiedCount == 1 ? modifiedCount : null
    }
    async  updataStatus(uid){
        let {modifiedCount} = await model.updateMany({uid},{status:0})
        return modifiedCount
    }


   async add(obj){
        obj._id = await incrementId("addressId");
        let a=  await model.insertMany(obj)
       return a.length>0?a[0]:null
   }

   async delete(_id,uid){
       let {deletedCount} = await  model.deleteOne({_id,uid})
        return deletedCount
   }

   async updataMoren(_id,uid){
       await this.updataStatus(uid)
       let {modifiedCount} = await  model.updateMany({_id,uid},{status:1})
        return modifiedCount
   }
   async findByIdEdit(_id){
   let a= await model.find({_id})
       return a.length>0?a[0]:null;
   }



}

//5. 暴露模块数据
module.exports = AddressModel;
let addressModel = new AddressModel();
addressModel.findById(1).then(i=>{
    console.log(i)
    }
)

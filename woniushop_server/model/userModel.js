// model:通过mongoose连接 mongodb数据
//1. 加载mongoosemk
const mongoose = require("mongoose");

require("../config/db");

let {incrementId} = require("./seqModel");


//2. 创建校验规则
let userSchema =   mongoose.Schema({
    _id : Number,
    username : String,
    password : String,
    gender : String,
    avatar:String,
    alias:String,
    mobile:String,
    email:String,
    level:Number

})

//3. 获取操作数据库CRUD的model对象
const model = mongoose.model("userModel" ,userSchema,"user");

//4. 封装类
class UserModel{
    async find(condition){
        return  await model.find(condition)

    }

    async findById(_id){
        let a=  await model.find({_id});
        return a.length>0? a[0]:null
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

}

//5. 暴露模块数据
module.exports = UserModel;
let userModel = new UserModel();
// userModel.findName({username:"小王"}).then(i=>{
//     console.log(i)
// })
userModel.find({_id:14}).then(i=>{
    console.log(i)
})

// model:通过mongoose连接 mongodb数据
//1. 加载mongoosemk
const mongoose = require("mongoose");

require("../config/db");
//2. 创建校验规则
let adminSchema =   mongoose.Schema({
    _id : Number,
    username : String,
    password : String,
    avatar : String,

})

//3. 获取操作数据库CRUD的model对象
const model = mongoose.model("adminModel",adminSchema,"admin");

//4. 封装类
class AdminModel{
        async find(condition){
            return await model.find(condition)
        }

        async findById(_id){
            let a=  await model.find({_id});
            return a.length>0? a[0]:null
        }

        async updataPwd(id,pwd){
           let {modifiedCount} = await  model.updateMany({"_id":id},{"password":pwd})
            return modifiedCount

        }

}

//5. 暴露模块数据
module.exports = AdminModel;
let adminModel = new AdminModel();
adminModel.updataPwd(3,"222").then(i=>{
    console.log(i)
})

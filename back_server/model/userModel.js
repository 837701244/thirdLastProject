// model:通过mongoose连接 mongodb数据
//1. 加载mongoosemk
const mongoose = require("mongoose");
let {incrementId} = require("../model/seqModel");


require("../config/db");
//2. 创建校验规则
let userSchema = mongoose.Schema({
    _id : Number,
    username : String,
    password : String,
    gender : String,
    avatar : String,
    alias : String,
    mobile : String,
    email : String,
    level : Number
})

//3. 获取操作数据库CRUD的model对象
const model = mongoose.model("userModel",userSchema,"user");

//4. 封装类
class UserModel{

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

   async finOnePage(condition){
       let {page,uid,username,mobile,pageSize} = condition;
        let start = (page-1)*pageSize

       let xx = {};

       if (uid){
           xx._id = uid
       }
       if (username){
           xx.username = {$regex:username};
       }
       if (mobile){
           xx.mobile = {$regex:mobile};
       }
       return await model.find(xx).skip(start).limit(pageSize)

    }

    async remove(_id){
        let {deletedCount}  = await model.deleteOne({_id})
        return deletedCount
    }

    async batchRemove(arr){
        let {deletedCount} = await model.deleteMany({_id : {$in : arr}});
        return deletedCount;
    }

    async addUser(obj){
        obj["_id"] = await incrementId("userId");
        let a =  await model.insertMany(obj)
        return a.length == 1 ? a[0]:null
    }
    async findById(id){
        let result =  await model.find({_id: id},{__v:0});
        return result.length==1?result[0]:null;
    }

    async count(condition){
        let {mobile,username,uid} = condition;
        let match = {};
        if (uid){
            match._id = uid
        }
        if (username){
            match.username = {$regex:username};
        }
        if (mobile){
            match.mobile = {$regex:mobile};
        }
        return await model.count(match);
    }

    async update(user){
        let {_id} = user;
        if(!_id) {
            return 0;
        }
        if (!user.avatar){
            let obj =  await  this.findById(user._id);
            user.avatar =obj.avatar;
        }
        user.gender = user.gender == '0'?'男':'女';
        delete user._id;
        let {modifiedCount} = await model.update({_id},user);
        return modifiedCount ==1?modifiedCount:null;
    }
}

//5. 暴露模块数据
module.exports = UserModel;

// const userModel = new UserModel;
// userModel.finOnePage({page:1,uid:"",username:"",mobile:"",pageSize:5}).then(i=>{
//     console.log(i)
// })


// const userModel = new UserModel;
// userModel.count({uid:"",username:"",mobile:""}).then(i=>{
//     console.log(i)
// })

// const userModel = new UserModel;
// userModel.batchRemove(["8","9"]).then(i=>{
//     console.log(i)
// })

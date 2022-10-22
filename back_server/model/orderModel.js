// model:通过mongoose连接 mongodb数据
//1. 加载mongoosemk
const mongoose = require("mongoose");

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
const model = mongoose.model("AppModel",appSchema,"order");

//4. 封装类
class OrderModel{

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
}

//5. 暴露模块数据
module.exports = OrderModel;
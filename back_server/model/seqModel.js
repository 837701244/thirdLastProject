// 操作数据库中的序列集合 sequence, 获取自动递增的id
const mongoose = require("mongoose");
require("../config/db");

let seqSchema = mongoose.Schema({
    _id: String,
    value : Number
})
let seqModel = mongoose.model("SeqModel",seqSchema, "sequence");

async function incrementId(seqName){
    let {value} = await seqModel.findOneAndUpdate({_id:seqName},{$inc:{value:1}});
    return value;
}

module.exports = {
    incrementId
}
const mongoose = require("mongoose");

let host = "localhost"; //主机地址
let port = 27017; // 端口号
let database = "woniushop2"; // 连接的数据库名

mongoose.connect(`mongodb://${host}:${port}/${database}`,function(err){
    if(err){
       return console.log("mongodb数据库连接失败");
    }
    console.log(`mongodb数据库${database}已成功连接...`);
})
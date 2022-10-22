const fs = require("fs"); // 内置模块
const {Parser} = require('json2csv'); // json转换CSV字符串
const csv = require("csvtojson"); // 将csv字符串转换成json

// 文件上传配置
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const uploadPath = "public/uploads"; //文件上传的路径

// 配置磁盘文件上传的规则
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        let filename = uuidv4().replaceAll("-",""); //  获取不重复的文件名
        let suffix = path.extname(file.originalname); //获取到源文件的扩展名
        cb(null, filename+suffix);
    }
});
const upload = multer({ storage: storage });

// 读取纯文本文件
function readTextFile(path) {
    return new Promise((resolve,reject) => {
        fs.readFile(path, "UTF-8", function (err,data) {
            if(err){
                return reject(`文件读取失败:${err.message}`)
            }
            resolve(data);
        })
    })
}

// 覆盖式写入内容
function writeFile(filePath, data){
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath,data,function (err) {
            if(err){
                return reject({status:0,msg:`文件写入失败:${err.message}`})
            }
            resolve({status:1,msg:"文件写入成功"});
        })
    })
}

// 追加写入内容
function appendFile(filePath, data){
    return new Promise((resolve, reject) => {
        fs.appendFile(filePath,data,function (err) {
            if(err){
                return reject({status:0,msg:`文件写入失败:${err.message}`})
            }
            resolve({status:1,msg:"文件写入成功"});
        })
    })
}

// 复制文件
function copy(source, target){
    return new Promise((resolve,reject) => {
        fs.readFile(source,function (err,data) {
            if(err){
                return reject({status:0,msg:"源文件不存在!"});
            }
            fs.writeFile(target,data, function (e) {
                if(e){
                    return reject({status:0,msg:"文件复制失败!"});
                }
                resolve({status:0,msg:"文件复制成功!"});
            } )
        })
    })
}

// 将jsons数据写到CSV
function writeCSV(filePath, data){
    return new Promise((resolve, reject) => {
        // CSV 的标题
        const fields = Object.keys(data[0]);
        try {
            const csv = new Parser({fields}).parse(data);
            // 写到一个csv格式的文件中
            fs.writeFile(filePath,csv,function (err) {
                if(err){
                    return reject({status:0,msg:"csv文件写入失败"});
                }
                resolve({status:1,msg:"csv文件写入成功"});
            })
        } catch (err) {
            reject({status:0,msg:"csv文件写入失败"});
        }
    })
}

// 读取csv恢复成js对象
function readCSV(csvPath){
    return csv().fromFile(csvPath); // fromFile返回的就是Promise
}

//获取到文件上传后服务器真实的访问路径
function fileServerPath(file){
    let {filename} = file; //获取到上传成功的文件信息
    return `http://localhost:3001/uploads/${filename}`;
}

module.exports = {
    readTextFile,writeFile,appendFile,copy,writeCSV,readCSV,upload,fileServerPath
}

const jwt = require("jsonwebtoken");
const {expressjwt} = require("express-jwt");



let secretKey = "woniuxy2022";
let expiresIn = "20h";
let algorithm = "HS256";


function getToken(userInfo) {
    return  jwt.sign(userInfo,secretKey,{expiresIn,algorithm});

}

function noFilter(routArr){
   return  expressjwt({
        secret:secretKey,
        algorithms:[algorithm],
        credentialsRequired:true
    }).unless({path:routArr})
}

function errHandler(err, req, res, next) {
    console.log(err);
    if (err.status == 401  ){

        if (err.message == "jwt expired"){
            res.send({status:401,msg:"token已失效"})
        }else {
            res.send({status:401,msg:"token不存在"})
        }

    }else if(err.status == 404){
        res.send({status:404,msg:"访问资源不存在"})
    }else {
        res.send({status:500,msg:`${err}`})
    }
}


module.exports = {
    getToken,noFilter,errHandler
}


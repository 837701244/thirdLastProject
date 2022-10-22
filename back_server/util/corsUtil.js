//CORS 跨域资源共享模块
//1. 允许跨域访问的白名单
let whiteList = ["http://localhost:8001","http://localhost:8000"];
//2. 实现跨域访问的中间件函数
function cors(req, res, next){
    if(whiteList.includes(req.headers.origin)){
        // 设置允许跨域访问的请求源
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin); // 可以直接指定访问的ip(* 任意IP都可以访问)
        //设置允许跨域访问的请求头
        res.setHeader("Access-Control-Allow-Headers","X-Requested-With,Origin,Content-Type,Accept,Authorization");
        // 设置允许跨域访问的请求类型
        res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
        // 允许cookie跨域请求发送到服务器（如果要发送cookie，Access-Control-Allow-Origin不能设置为 *）
        res.setHeader("Access-Control-Allow-Credentials","true");
    }
    next();
}
//3. 暴露中间件函数
module.exports = cors;
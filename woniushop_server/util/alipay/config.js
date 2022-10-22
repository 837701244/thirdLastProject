// 支付宝核心配置文件
let fs=require("fs");
let path=require("path");

// 从文件中分别获取到应用私钥 和 支付宝公钥
let appPrivateKey = fs.readFileSync(path.join(__dirname,'./private.txt'),'ascii');
let alipayPublicKey = fs.readFileSync(path.join(__dirname,'./public.txt'),'ascii');

// 配置支付宝应用参数
const alipayConfig = {
    // APPID 应用id
    appId:2016102200737304,
    // 应用私钥，我这里直接读取它生成的.txt文件
    privateKey:appPrivateKey.toString(),
    // 支付宝公钥,一样是读取的.txt文件
    alipayPublicKey:alipayPublicKey.toString(),
    // 支付宝网关
    gateway:'https://openapi.alipaydev.com/gateway.do',
    // 编码字符集
    charset:'utf-8',
    // 版本默认 1.0
    version:'1.0',
    // 对称加密 ： 与自己的加密方式对应即可
    signType:'RSA2'
}
// 将alipay沙箱环境的配置对象暴露
module.exports = alipayConfig

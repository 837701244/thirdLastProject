// 导入sdk环境 注意这个default
const AlipaySDK = require('alipay-sdk').default;
// 引入配置文件(自定义模块)
const config = require('./config');
// 实例化对象
let alipaySdk = new AlipaySDK(config);

// PC支付接口 alipay.trade.page.pay 返回的内容为 表单
let AlipayFormData = require('alipay-sdk/lib/form').default;

/**
 * 调用支付宝沙箱支付接口
 * @param {Object} params  商品支付订单信息
 */
const alipay = async (params) => {
    // 设置调用的接口
    let method = 'alipay.trade.page.pay';
    let bizContent = {
        out_trade_no: params.orderNo, //订单号 时间戳 具有唯一性
        product_code: 'FAST_INSTANT_TRADE_PAY', // 商品码
        total_amount: params.totalAmount, // 订单金额
        subject: "蜗牛商城", // 订单名称
        timeout_express: '5m', // 超时时间
        passback_params: JSON.stringify({success:200})//JSON.stringify(goods.pack_params) // 返回一个参数，用于自定义商品信息最后做通知使用
    }
    // 创建formData 对象
    const formData = new AlipayFormData();
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
    // 支付宝在完成交易后，需要跳转的商户地址
    formData.addField('returnUrl','http://localhost:3000/order/payOk');
    // 支付宝在用户支付成功之后会异步通知的回调地址，必须在公网ip才能收到 根据自己的网址
    formData.addField('notifyUrl','http://localhost:3000/order/success');
    // 将必要的参数集合添加进 form 表单
    formData.addField('bizContent', bizContent);
    // 异步向支付宝 发送生成订单请求，第二个参数为公共参数，可以为空
    const result = await alipaySdk.exec(method, {}, {
        formData: formData
    })
    return result;  // 返回调用支付宝的网页地址
}
// 导出方法
module.exports = {
    alipay
}
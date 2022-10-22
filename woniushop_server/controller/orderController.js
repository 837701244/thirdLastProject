const {alipay} = require("../util/alipay/pay"); // 加载支付宝沙箱环境模块

let {mydate,diyGetDateTime} = require("../util/getTimeUtil");

let ProductModel = require("../model/productModel");
let productModel = new ProductModel();

let orderModel = require("../model/orderModel");
let OrderModel1 = new orderModel();


let OrderDetailModel = require("../model/orderDetailModel");
let orderDetailModel = new OrderDetailModel();


let ShopcartModel = require("../model/shopcartModel");
let shopcartModel = new ShopcartModel();

class OrderController{

    async alipay(req, res){
        //1.获取到前端的支付参数
        let {orderNo, totalAmount} = req.query;
        if(!orderNo || orderNo=="" || !totalAmount || totalAmount<0){
            res.send({msg:"ok"});
        }
        totalAmount = parseInt(totalAmount);
        //2.调用支付宝的接口
        let address = await alipay({orderNo,totalAmount});
        // 调用支付宝的接口
        res.redirect(address); //redirect 重定向（跳转到任意指定的URL）
    }

    async payOk(req, res){
        //1. 从支付宝返回的信息中获取到订单号，订单金额，支付宝交易流水号，付款时间
        let {out_trade_no,total_amount,trade_no,timestamp} = req.query;
        //2.根据订单号来校验订单金额与付款金额是否一致
     let a =   await OrderModel1.findByOrderId(out_trade_no);
     if (a){
         if (a.total != total_amount){
             return res.send({status:0,msg:"支付金额不行"})
         }
     }

        console.log("根据订单号来校验订单金额与付款金额是否一致")
        //3. 更新订单信息（状态1， 支付宝交易流水号， 付款时间）
        console.log("更新订单信息（状态1， 支付宝交易流水号， 付款时间）")
        let obj = {}
     obj.orderNo = out_trade_no
        if (a.total != total_amount){
            obj.status = 1
        }
        obj.finshTime = timestamp

       let b=  await OrderModel1.updateStatus(obj)
        if (b == 1){
            res.send({status:1,msg:"支付成功"})
        }
        //4. 跳转到商城首页
        res.redirect("http://localhost:8000");
    }

    async create(req,res){
        let obj ={}

       let uid =  req.auth._id;
       let {arr} = req.query;//数组
       let nowTime = mydate();
       let subnum = 0;

       //获取总价
        for (let i = 0; i < arr.length; i++) {
           let id=  arr[i].pid
            let num = arr[i].num
          let {price} = await  productModel.findById(id)//没的话也返回null
            subnum+= price*num
        }
        //添加订单
        let onePid = arr[0].pid;
        let orderNo = `WNSHOP${nowTime+uid+onePid}`
        obj.uid = uid;
        obj.status = 0;
        obj.orderNo = orderNo
        obj.finshTime=""
        obj.total = subnum
        obj.createTime = diyGetDateTime("YYYY-MM-DD HH:mm:SS",new Date());
       let a =  await OrderModel1.add(obj)//没的话也返回null


        //添加订单明细
        let orderDetail = []
        for (let i = 0; i < arr.length; i++) {
            let pid = arr[i].pid;
            let count = arr[i].num;
            orderDetail.push({pid,count,orderNo});
        }
       let z = await orderDetailModel.batchAdd(orderDetail);//没的话会返回null

        //删除购物车已经结算的商品
        for (let item of arr) {
          let i = await shopcartModel.delet({uid:uid,pid:item.pid})
            if (i < 1){
                return res.send({status:0,msg:"删除购物车商品失败"})
            }
        }

        //更新商品库存
        for (let item of arr) {
            let i = await productModel.updataNum(item);
            if (i <0){
                return  res.send({status:0,msg:"更新商品库存失败"})
            }

        }





        if ( a && z){
            res.send({status:1,msg:"订单创建成功",orderNo})
        }else {
            res.send({status:0,msg:"订单创建失败",price})
        }



    }

    async findOne (req,res){
        let {id} = req.query;
        // console.log("11111",id)
        let a = await OrderModel1.find(id);

        if (a.length>0){
            for (let item of a[0].products) {
               item.product = await productModel.findById(item.pid)
            }
        }
        res.send(a.length>0?{status:1,msg:"订单创建成功",a:a[0]}:{status:0,msg:"订单创建失败"})
    }

    async findAll(req,res){
        let uid = req.auth._id;

      let a =  await OrderModel1.findAll(uid);
      if (a.length>0){
          for (let i = 0; i <a.length ; i++) {
              for (let j = 0; j < a[i].products.length; j++) {
                  a[i].products[j].proInfo = await productModel.findById(a[i].products[j].pid)
              }
          }
      }
        res.send(a.length>0?{status:1,msg:"订单查询成功",a}:{status:0,msg:"订单查询失败"})
    }


}

module.exports = OrderController;
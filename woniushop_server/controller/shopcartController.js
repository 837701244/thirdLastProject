const ShopcartModel = require("../model/shopcartModel");
const shopcartModel = new ShopcartModel();


let ProductModel = require("../model/productModel");
let productModel = new ProductModel();







class ShopcartController {
    async update(req,res) {
        let param = req.body; // 获取表单参数
        if(req.file){
            let imgPath = fileServerPath(req.file); // 获取到文件上传的图片访问路径
        }
        // 调用model来更新数据
        let rows = await appModel.update(param);
        res.send(rows>0?{status:1,msg:"更新成功"}:{status:0,msg:"更新失败"});
    }

    async add(req,res){
        let {pid,num} = req.query;
        let uid = req.auth._id;
      let {stock} = await productModel.findById(pid);
      if (num>stock){
       return  res.send({status:0,msg:"超出最大库存"});
      }
      let userObj = {};
        userObj.uid = uid;
        userObj.pid = pid;
        console.log("原来的userObj是",userObj);
     let item =  await shopcartModel.find(userObj);
     if (item.length < 1){
         if (stock>=num) {
             userObj.count = num;
             let data = await shopcartModel.add(userObj)
             return res.send(data.length > 0 ? {status: 1, msg: "添加成功", data} : {status: 0, msg: "添加失败"})
         }
     }else if(item.length == 1){
            let {count} = item[0];
                userObj.num = num;
            if (count*1 + num*1 <= stock){
              let data =  await shopcartModel.update(userObj)
                return  res.send(data == 1?{status:1,msg:"添加成功",data}:{status:0,msg:"添加失败"})
            }else {
                return  res.send({status:1,msg:"超出最大库存",chazhi:`${stock-count}`})
            }
     }else{
         res.send({status:0,msg:"发生意外错误"});
     }
    }

    async updataProductNum(req,res){
        let {pid,num} = req.query;
        let uid = req.auth._id;
        let userObj = {};
        userObj.uid = uid;
        userObj.pid = pid;
        let {stock} = await productModel.findById(pid);
        if (num>stock){
            userObj.num = stock;
            let data =  await shopcartModel.updataNumber(userObj)
            return  res.send(data ==1?{status:1,msg:"超出最大库存",stock}:{status:0,msg:"超出最大库存",stock});
        }

        console.log("行的方法的userObj是",userObj);
        let item =  await shopcartModel.find(userObj);
         if(item.length == 1){ //找到了这个数据
            let {count} = item[0];//获取这个商品的总数量
            userObj.num = num;//当前输入的数量
            if ( num*1 <= stock){
                let data =  await shopcartModel.updataNumber(userObj)
                return  res.send(data == 1?{status:1,msg:"添加成功",data}:{status:0,msg:"添加失败"})
            } else {
                return  res.send({status:1,msg:"超出最大库存",chazhi:`${stock-count}`})
            }
        }else{
            res.send({status:0,msg:"没找到这个数据"});
        }



    }

   async findByUserId(req,res){
        let id= req.auth._id;
     let data =  await shopcartModel.findByUserIdAndProductInfo(id);
       console.log(data)
     res.send(data.length > 0 ?{status:1,msg:"查询成功",data}:{status: 0,msg:"查询失败"});
   }


   async delet(req,res){
        let {id}= req.query;
        let uerId = req.auth._id;
        let obj ={};
        obj.uid = uerId;
        obj.pid = id;
     let result = await shopcartModel.delet(obj)
        res.send(result ==1?{status:1,msg:"删除成功"}:{status:0,msg:"删除失败"})
   }


    async deletAll(req,res){
        let uerId = req.auth._id;
        let obj = {uid:uerId};
        let result = await shopcartModel.deletAll(obj)
        res.send(result >0?{status:1,msg:"删除成功"}:{status:0,msg:"删除失败"})
    }

    async batchAll(req,res){
        let uerId = req.auth._id;
       let {arr} = req.query;
       let obj = {}
        obj.uid = uerId;
       obj.pid = arr;
        console.log(obj)
        let result = await shopcartModel.batchAll(obj)
        res.send(result >0?{status:1,msg:"删除成功"}:{status:0,msg:"删除失败"})
    }




}

module.exports = ShopcartController;
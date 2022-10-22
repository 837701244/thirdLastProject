let AdressModel = require("../model/addressModel");
let adressModel = new AdressModel();



class AddressController {


    async list(req,res){
        let uid = req.auth._id;
        let a = await adressModel.findById(uid);
        res.send(a.length>0?{status:1,msg:"用户收货地址查询成功",a}:{status:0,msg:"用户收货地址查询失败"})
        // res.send({status:1,msg:"查询成功",a,b:"xxx"})
    }
    async  add(req,res){
        let obj = req.query;
        let uid = req.auth._id;
        obj.uid = uid;
        obj.postcode = "123456"
        if (obj.status == 1){
          let a = await adressModel.updataStatus(uid);
        }



       let a =  await adressModel.add(obj)

        res.send(a?{status:1,msg:"添加成功",a}:{status:0,msg:"添加失败"})
    }

    async deletOne(req,res){
        let {id} = req.query;
        let uid = req.auth._id;

      let a = await  adressModel.delete(id,uid)

        res.send(a==1?{status:1,msg:"成功删除"}:{status:0,msg:"失败   删除"})
    }

    async updateMoren(req,res){
       let {id} = req.query
        let uid = req.auth._id;
       let a = await adressModel.updataMoren(id,uid);
        console.log("111111111",a)
        res.send(a==1?{status:1,msg:"设置默认地址成功"}:{status:0,msg:"设置默认地址失败"})
    }
    async findById(req,res){
        let {id} = req.query;
      let a = await adressModel.findByIdEdit(id)
        res.send(a?{status:1,msg:"查找成功",a}:{status:0,msg:"查找失败"})

    }
    async update(req,res){
        let obj = req.query;
        if (!obj.zone){
            let x = await adressModel.findByIdEdit(obj._id)
            obj.zone = x.zone
        }
        let y = await adressModel.findByIdEdit(obj._id);
        obj.status = y.status
      let a =  await adressModel.updata(obj)
        res.send(a == 1?{status:1,msg:"修改成功",a}:{status:0,msg:"修改失败"})
        // res.send(obj)
    }
    async findAll(req,res){
        let uid = req.auth._id;
       let data =  await  adressModel.findById(uid);
       res.send(data.length>0?{status:1,msg:"查询成功",data}:{status:0,msg:"查询失败"})
    }


}

module.exports = AddressController;
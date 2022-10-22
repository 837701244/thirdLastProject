let UserModel = require("../model/userModel");
let userModel = new UserModel();

let {getToken} = require("../util/jwtUtil");

class UserController {
    async find(req,res) {
        let param = req.body; // 获取表单参数
        if(req.file){
            let imgPath = fileServerPath(req.file); // 获取到文件上传的图片访问路径
        }
        // 调用model来更新数据
        let rows = await appModel.update(param);
        res.send(rows>0?{status:1,msg:"更新成功"}:{status:0,msg:"更新失败"});
    }

    async authentication(req,res){
        let param = req.body;
        console.log(param);
        let result = await userModel.find(param);
        let loginUser = result[0]
        if (loginUser){
            loginUser={...loginUser._doc};
            delete loginUser.password;
            let token = getToken(loginUser);
            res.send({status:1,msg:"登录认证通过",token:`Bearer ${token}`});

        }else {
            res.send({status:0,msg:"登录认证失败"});
        }

    }

    userInfo(req,res){
        let info = req.auth

        res.send({status:1,info})
    }

    async findName(req,res){
        let username = req.query;
       let a = await userModel.findName(username)

        res.send(a.length>0 ?{status:1,msg:"有这个名字",a}: {status:0,msg:"没这个名字",a})
    }

    async addUser(req,res){
        let user = req.body;
        console.log(user)
        let result = await userModel.addUser(user);
        console.log(result)
        res.send(result.length > 0 ?{status:1,msg:"成功注册",result}:{status:0,msg:"失败注册",result});
    }


    async findById(req,res){
        let id = req.auth._id;
        let a =  await userModel.findById(id);


        res.send(a?{status:1,msg:"查询成功",a}:{status:0,msg:"查询失败"})
    }

    async update(req,res){
        let obj = req.body;
        let id = req.auth._id;
            obj._id = id;
        if (obj.avatar ==-1){
          let {avatar} =  await userModel.findById(id)
            obj.avatar = avatar
        }
     let a = await userModel.updata(obj);
        res.send(a == 1? {status:1,msg:"修改成功",a}:{status:0,msg:"修改失败"})
    }

}

module.exports = UserController;
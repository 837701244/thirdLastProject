const AdminModel = require("../model/adminModel");
const adminModel = new AdminModel();

const {getToken} = require("../util/jwtUtil");


class AdminController {
    async update(req,res) {
        let param = req.body; // 获取表单参数
        if(req.file){
            let imgPath = fileServerPath(req.file); // 获取到文件上传的图片访问路径
        }
        // 调用model来更新数据
        let rows = await appModel.update(param);
        res.send(rows>0?{status:1,msg:"更新成功"}:{status:0,msg:"更新失败"});
    }

    //身份认证
    async   authentication(req,res){
        let param = req.body;
        let result = await adminModel.find(param)
        //根据数据库登陆验证的结果来判断是否需要生成token
        let loginUser = result[0];
        if (loginUser){
            loginUser = {...loginUser._doc}
            delete loginUser.password;//去除敏感数据
           let token =  getToken(loginUser);
           res.send({status:1,msg:"登陆认证通过",token:`Bearer ${token}`});
        }else {
            res.send({status:0,msg:"登陆认证失败"})
        }

        // res.send(result.length == 1 ?{status:1,msg:`登陆认证成功`}:{status:0,msg:`登陆认证失败`})
    }

     getUserInfo(req,res){
        let info = req.auth
        res.send({status:1,msg:`登陆认证成功`,info})
    }


    async getOldPwd(req,res){
        let {val} =req.query;
        let id = req.auth._id;
        let x = await adminModel.findById(id);
        res.send(x.password == val ? {status:1,msg:`旧密码正确`}:{status:0,msg:`旧密码错误`});
    }

    async updatePwd(req,res){
        let id = req.auth._id;
        let {Pwd}=req.query;
        let x = await adminModel.updataPwd(id,Pwd);
        res.send( x>0 ? {status:1,msg:`正确`}:{status:0,msg:`错误`});
    }

}

module.exports = AdminController;
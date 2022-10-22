const UserModel = require("../model/userModel");
const userModel = new UserModel();

let {fileServerPath} = require("../util/fileUtil");

class UserController {
    async update(req,res) {
        let param = req.body; // 获取表单参数
        if(req.file){
            let imgPath = fileServerPath(req.file); // 获取到文件上传的图片访问路径
        }
        // 调用model来更新数据
        let rows = await appModel.update(param);
        res.send(rows>0?{status:1,msg:"更新成功"}:{status:0,msg:"更新失败"});
    }

    async findOnePage(req,res){
        let  param= req.query;
        let page = param.page;
        let pageSize = 5;
        page = parseInt(page)
        param.pageSize = pageSize;
        //1. 查询到当前这一页的数据
        let data = await userModel.finOnePage(param);
        //2. 获取总条数 count
        let total = await userModel.count(param);
        //3.计算总页码
        let totalPage = Math.ceil(total/pageSize);
        //4. 上一页
        let prevPage = page == 1?totalPage:page-1;
        //5.下一页
        let nextPage = page == totalPage ?1:page + 1;

        res.send({status:1,msg:"查询成功",data,totalPage,prevPage,nextPage,total,pageSize})
    }

    async remove(req,res){
        let {_id}= req.query;
        let data = await userModel.remove(_id);
        res.send(data > 0 ? {status:1,msg:"删除成功"}:{status:0,msg:"删除失败"})
    }

    async batchRemove(req,res){
        let {arr} = req.query;
        let data = await userModel.batchRemove(arr);
        res.send(data > 0 ? {status:1,msg:"删除成功"}:{status:0,msg:"删除失败"})
    }

    async addUser(req,res){
        let obj = req.body;
        if (req.file){
            obj.avatar = fileServerPath(req.file);
        }
        obj.gender = obj.gender == '0' ? '男' :'女';
        let promise =await userModel.addUser(obj);
        res.send(promise !=null ? {status:1,msg:"添加成功",promise}:{status:0,msg:"添加失败",obj})
    }

    async findById(req,res){
        let {id} = req.query;
        let data = await userModel.findById(id);
        res.send(data!=null ? {status:1,msg:"查询成功",data}:{status:0,msg:"查询失败"})
    }

    async editUser(req,res){
        let obj = req.body;
        if (req.file){
            obj.avatar = fileServerPath(req.file);
        }
        let a = await  userModel.update(obj);

        res.send(a >0?{status:1,msg:"修改成功"}:{status:0,msg:"修改失败"})
    }
}

module.exports = UserController;
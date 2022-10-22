
// 用户管理模块(实现了用户的所有DOM操作)
import api from "../api/userApi.js";
import {preview} from"../util/preview";
render();
//编号搜索
$("#uid").blur(function () {
    $("#uname").val("");
    $("#uphone").val("");
    render()
});
//用户名，手机号模糊查询
$("#userSearch").click(function () {
    $("#uid").val("");
    render();
});
//全选
$("#uall").click(function () {
   $('[name="users"]').prop("checked",this.checked)
})

//全选优化
$("#UserTable").on('click','[name="users"]',function () {
    let xx = $('[name="users"]');
    xx = [...xx];
    let flag = xx.every(i=>i.checked);
    $("#uall").prop("checked",flag);

})

//删除单个

$("#UserTable").on('click','.delet-itm',async function (e) {
    e.preventDefault();
    let _id = $(this).data("id");
    if (confirm("宁确定要删除吗")){
        let {status,msg} = await api.removeOne(_id);
        if (status == 401){
            return location.href="./login.html";
        }
        alert(msg)
        if (status ==1){
            render();
        }
    }


})

//删除多个
$("#userBatchDelete").click(async function () {
    let xuanze = $('[name="users"]:checked')
    if (xuanze.length == 0){
        return alert("请选择")
    }
    if (confirm("宁确定要删除")){
        xuanze = [...xuanze]
        let shuzu = xuanze.map(i=>i.value)
        console.log(shuzu)
        let {status,msg} = await api.batchRemove(shuzu);
       alert(msg)
        if (status == 401){
            return location.href="./login.html";
        }
        if (status>0){
            render();
        }
    }


})

//添加模态框显示
$("#userAdd").click(function () {
    $("#addUserModal").modal('show');
})
//确认添加
$("#btnUserAdd").click(async function () {
    console.log(new FormData($("#addUserForm")[0]));
    let {status,msg} = await api.addUser(new FormData($("#addUserForm")[0]));
    alert(msg);
    if (status == 401){
        location.href = "./login.html";
    }
    if (status == 1){
        $("#addUserModal").modal('hide');
        render();
        $('#addUserForm')[0].reset(); //  表单节点.reset()  重置表单数据
        $('#UserAddImgBox').prop("src","");
    }
})
// 添加模态框图片预览
$('#addUserImgPath').change(function () {
    preview(this, $('#UserAddImgBox')[0]);
})

//修改框回显数据
$("#UserTable").on('click','.edit-item',async function () {
    let id = $(this).data("id")
    let {status,msg,data} = await api.findById(id);
    if (status == 401){
        location.href = "./login.html"
    }
    if (status == 1){
        $("#editUserModal").modal('show');
        $("#editUserName").val(data.username);
        $("#editUserPwd").val(data.password);
        $("#editUserAlias").val(data.alias);
        $("#editUserMobile").val(data.mobile);
        $("#editUserEmail").val(data.email);
        $("#editUserLevel").val(data.level);
        $("#editUserId").val(data._id);
        $("#editUserGender").val(data.gender=='男'?0:1);
        if (data.avatar){
            $("#editImgBox").prop("src",data.avatar);
        }
    }


})

//确认修改
$("#btnUserEdit").click(async function () {
    let obj = new FormData($("#editForm")[0])
    let {status,msg} = await api.editUser(obj);
    alert(msg)
    if (status == 401){
        location.href = "./login.html"
    }
    if (status == 1){
        render();
        $("#editUserModal").modal('hide');
    }

})
//修改框图片预览
$("#editUserImgPath").change(function () {
    preview(this, $('#editImgBox')[0]);
})

 function render(page =1) {
    let promas = {}
    let uid = $("#uid").val();
    let username = $("#uname").val();
    let mobile = $("#uphone").val();
    promas.uid = uid;
    promas.username = username;
    promas.mobile = mobile;
    promas.page = page;
    console.log(promas)

    api.list(promas).then((i)=>{
       let {data,msg,nextPage,pageSize,prevPage,status,total,totalPage} = i
       if (status == 401){
          return location.href = './login.html';
       }
       if (page>1 && data.length ==0){
           return  render(page-1)
       }



        console.log(i)

       let xx =  data.map(item=>(`
                            <tr>
                                <td><input type="checkbox" name="users" value="${item._id}"></td>
                                <td>${item._id}</td>
                                <td>${item.username}</td>
                                <td>${item.alias}</td>
                                <td>${item.mobile}</td>
                                <td>
                                    <img src="${item.avatar}" width="50px" class="img-circle" alt="">
                                </td>
                                <td>${item.level==1?"88VIP":"普通会员"}</td>
                                <td><a href="#" class="btn btn-primary edit-item" data-id="${item._id}"  data-toggle="modal" data-target="#updateModal"><span class="glyphicon glyphicon-pencil"></span>修改</a></td>
                                <td><a href="#" class="btn btn-danger delet-itm" data-id="${item._id}"> <span class="glyphicon glyphicon-remove"> </span>删除</a></td>
                            </tr>
       `))
       $("#UserTable > tbody").html(xx)
        let lis = `<li><a href="javascript:;" class="prev" id="UserPrev">&laquo;</a></li>`

        for (let j = 1; j <=totalPage; j++) {
            if (page == j){
                lis +=`<li class="active"><a href="javascript:;">${j}</a></li>`;
            }else{
                lis += `<li ><a href="" class="page">${j}</a></li>`;
            }
        }
        lis += `<li><a href="" class="next" id="UserNext">&raquo;</a></li>`;

        $("#UserPage").html(lis);

        if(totalPage == 1 ){
            $("#UserPage").html("")
        }
        $("#UserPrev").click(function (e) {
            e.preventDefault();
            render(prevPage)
        })
        $("#UserNext").click(function (e) {
            e.preventDefault();
            render(nextPage)
        })
       $(".page").click(function (e) {
           e.preventDefault();
           render($(this).text())
       })

    })


}

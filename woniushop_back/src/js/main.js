import "../css/main.css";
import "./modules/user.js";
import "./modules/order.js";
import "./modules/product.js";

import loginApi from  "./api/loginApi";

//登录后用户数据回显

loginApi.heardInfo().then(({status,msg,info})=>{
    console.log(status,msg,info)
    if (status == 401 && msg == "token不存在"){
        alert('请先登录')
        return location.href ='../login.html'
    }else if (status == 401 && msg == "token已失效"){
        alert('访问已过期，请重新登录')
        return location.href ='../login.html'
    }else {
        $("#loginUserImg").prop('src',info.avatar);
        $("#loginUserName").html(info.username)
        console.log("info",info)
    }
})



//用户注销
$("#destory").click(function () {
    if (confirm("宁确定要删除吗啊")){
        localStorage.removeItem('backToken')
        alert("注销成功");
        location.href="../login.html"
    }
})

//修改密码
    //判断旧密码是否正确
let flag = false
$("#oldPwd").blur(async function () {
    let val = $("#oldPwd").val();
    if (!val){
        return alert("旧密码不能为空")
    }
    let {msg,status} = await loginApi.quedingPwd(val);
    if (status ==401){
        return location.href="../static/login.html";
    }

    if (status ==0){
        return  alert(msg)
    }
    if (status ==1){
        alert(msg)
        flag = true;
    }
})

    //确认修改
$("#queren").click(async  function () {
    let oldPwd = $("#oldPwd").val();
    let newPwd = $("#pwd").val();
    let rePwd = $("#repwd").val();
    if (oldPwd == newPwd){
        return alert("新密码不能与老密码一样")
    }
    if (newPwd != rePwd){
        return  alert("新密码不一致")
    }

    if (flag){
        console.log("flag是T")
        let {msg,status} = await loginApi.updatePwd(newPwd);
        alert(msg)
        if (status == 401 ){
            return location.href='./login.html'
        }
        if (status ==1){
            return location.href='./login.html'
        }
    }else {
        alert("有错误")
    }
})
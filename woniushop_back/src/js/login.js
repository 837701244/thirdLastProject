import "../css/login.css";
import api from "../js/api/loginApi";

//登陆事件
$("#btnLogin").click(async function () {
    let username = $("#username").val();
    let password = $("#password").val();
    if (username == "" || password == ""){
        return alert("用户名或密码不能为空");
    }
   let {status,msg,token}=  await api.login({username,password});
    console.log(status,msg,token);

    if (status == 1){
        localStorage.setItem("backToken",token);
        location.href = "../main.html";
    }else {
        alert("用户名或密码错误")
    }
})



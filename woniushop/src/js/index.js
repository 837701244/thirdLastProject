import "../css/index.css";
import "../css/head.css";

import userApi  from "../js/api/userApi.js";
import productApi from "./api/productApi";
import categoryApi from "./api/categoryApi";

// 模态框的配置
$('.modal').modal({
   backdrop: "static",
   keyboard : true,
   show : false
});

render();
hotProduct();
catgory();
catgoryBig();

//打开登录模态框
$("#loginUser").click(function () {
    if (localStorage.hasOwnProperty("user")){
        $("#rememberPwd").prop("checked",true);
        let {username,password} = JSON.parse(localStorage.getItem('user'));
        $("#uname").val(username);
        $("#pwd").val(password);
    }

})

//点击登录判断
$("#userLogin").click(async function () {

  let username = $("#uname").val();
  let password = $("#pwd").val();
  let flag = $("#rememberPwd").prop("checked");
  if (username == "" || password == ""){
      return alert("不能为空")
  }
    let {status,msg,token} = await userApi.login({username,password})
    if (status == 1){
        if (flag){
            localStorage.setItem("user",JSON.stringify({username,password}));
        }else {
            localStorage.removeItem("user")
        }
        localStorage.setItem("Token",token);
        $("#uname").val("");
        $("#pwd").val("");
        render();
        $("#loginModal").modal("hide");
    }else{
        alert("用户名或密码错误")
    }


})

//注销
$("#zhuxiao").click(function () {
    localStorage.removeItem("Token");
    alert("注销成功");
    location.reload();

})

//渲染名字以及图片

function render() {
    if (localStorage.hasOwnProperty("Token")){
        userApi.heardInfo().then(({status,info})=>{
            console.log(info)
            if (status ==1){
                $("#heardLeft").show();
                $("#heardLeft > .img-circle").prop("src",info.avatar)
                $("#heardLeft>.person ").text(info.username);
                $("#loginBox").hide();
                $("#destoryBox").show();
                $("#personal").show();
                $("#shpcar").show();
            }else {
                return  console.log("服务器报错");
            }
            if (status == 401){
                console.log("服务器报错,401");
            }
        })
    }
}






//判断注册用户名是否重复
let flag = false
$("#rg_uname").change(async function () {
    let name = $(this).val();
    let {status,msg} =  await userApi.findUsername(name)
    if (status == 0){
        console.log(name)
        if (name == ""){
           return $("#zhuceUser").text("用户名只能是字母，且6~16位");
        }
        $("#zhuceUser").text("√");
        flag = true;

    }else {
        $("#zhuceUser").text("名字重复");
    }
    console.log(msg)
})

$("#rg_pwd").change(function () {
    let oldPwd = $("#rg_pwd").val();
    let newPwd = $("#rg_repwd").val();
    if (oldPwd==""){
        $("#zhuceOldPwd").text("6~16字母数字下划线组成")
    }else {
        $("#zhuceOldPwd").text("√")
        flag  = true;
    }

})

$("#rg_repwd").change(function () {
    let oldPwd = $("#rg_pwd").val();
    let newPwd = $("#rg_repwd").val();
    if (newPwd == ""){
        $("#querenPwd").text("请再次确认密码")
        flag = false;
    }
    if (oldPwd !=newPwd){
        $("#querenPwd").text("密码不一致")
    }else{
        $("#querenPwd").text("√")
    }

})

//点击注册
$("#registerUser").click(async function () {
   let tongyi = $("#xieyi").prop("checked");
   if (!tongyi){
       return alert("未同意协议")
   }
   if (tongyi && flag){
       console.log("都是T")
   }else {
       return  alert("表格有错误")
   }
    console.log($("#UserAdd").serialize());
  let {status,msg,result} = await userApi.addUser($("#UserAdd").serialize());
    console.log(result)
        alert(msg)
    if (status ==1 ){
        $("#UserAdd")[0].reset();
        $("#zhuceUser").val("用户名只能是字母，且6~16位");
        $("#zhuceOldPwd").val("6~16字母数字下划线组成");
        $("#querenPwd").val("请再次确认密码")
        $("#registerModal").modal("hide");
    }



})

//热销商品查询
function hotProduct() {
    productApi.findHot().then(i=>{

        let {status,data,msg} = i;
        if (status ==1){
            console.log(data,msg)
           let str = data.map(item=>(`
                         <div class="col-xs-6 col-sm-4 col-md-3">
                                    <div class="thumbnail pro-item">
                                        <a href="page/detail.html?pid=${item._id}">
                                            <img src=${item.imagePath} style="width: 120px;height: 120px">
                                            <div class="caption">
                                                <h4 class="title">${item.pname}</h4>
                                                <p class="info">${item.pinfo}</p>
                                                <p class="price">￥${item.price}起</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
           `)
           ).join("")
            $("#hotProduct").html(str);
        }
    })
}

//渲染首页商品类型
function catgory() {
    categoryApi.catgoryList().then(i=>{
        let {status,msg,data} = i
        let arr = data;
        arr.sort((a,b)=>Math.random()-0.5);
        let Newarr = arr.slice(0,8);
        console.log(Newarr)
       let str =  Newarr.map(item=>(`
            <li><a href="./page/proList.html?category=${item._id}">${item.cname}</a></li>
       `)).join("")
        $("#caregoryUl").html(str)
    })
}

//渲染轮播边上的大类
function catgoryBig() {
    categoryApi.catgoryBig().then(i=>{
       let  {status,msg,data} = i
        console.log(i)

      let newArr =  data.filter(item=>{
            if (item.parentId){
                return false
            }else{
                return  true
            }
        })
       let lis = newArr.map(i=>(`
        <li> <li><a href="">${i.cname}</a></li></li>
       `))
        $("#bigCaregory").html(lis)
    })
}








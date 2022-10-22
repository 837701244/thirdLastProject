import "../../css/head.css";
import "../../css/page/personal.css";
import "../util/city.js";
import userApi from "../api/userApi"; // 省市区三级联动插件

import addressApi from "../api/addressApi";
import orderApi from "../api/orderApi";


    // import  {preview} from "../util/preview";

userInfo();

personalUserInfo();

adress();


//头像改变事件
$("#imagePath").change(function () {

    if (this.value == -1){
        userApi.info().then(i=>{
            let {status,msg,a} = i
            $("#showBox>img").prop("src",a.avatar)
        })
    }else{
        $("#showBox>img").prop("src",this.value)
    }
})

//点击修改事件
$("#btnEdit").click(function () {
    let arr = $("#UserForm").serializeArray();
    let a = {}
    $.each(arr,function (index,field) {
        a[field.name] = field.value
    })

    console.log("aaaaaa",a)
    userApi.update(a).then(i=>{
        console.log(i)
        let {status,msg} = i
        if (status == 1){
            alert(`${msg}请重新成功`)
            localStorage.removeItem("Token")
            location.href="../"
        }else {
            alert(msg)
        }
    })
})

//重名判断
$("#personal").change(async function () {
    let name = $(this).val();
    let {status,msg} =  await userApi.findUsername(name)
    if (status == 0){
        console.log(name)
        if (name == ""){
            return  alert("不能为空") ;
        }
    }else {
      alert("名字重复")
    }


})








//个人中心数据回显
function personalUserInfo() {
    userApi.info().then(i=>{
        let {status,msg,a} = i
        console.log(i)
        $("#showBox>img").prop("src",a.avatar);
        $("#personal").val(a.username);
        $("#pwd").val(a.password);
        $("#mobile").val(a.mobile);
    })
}


//头部数据回显
function userInfo() {
    if (localStorage.hasOwnProperty("Token")) {
        userApi.heardInfo().then(({status, info}) => {
            console.log(info)
            if (status == 1) {
                $("#personalInfo").show();
                $("#personalInfo > .img-circle").prop("src", info.avatar)
                $("#personalInfo>.person ").text(info.username);

            } else {
                location.href="../"
                return console.log("服务器报错");
            }
            if (status == 401) {
                location.href="../"
                console.log("服务器报错,401");
            }
        })
    }
}

//收货地址渲染
function adress() {
    addressApi.list().then(i=>{
        let {status,msg,a} = i
        console.log(i)
        if (status == 0){
           return  $("#noAdress").show();
        }
        if (status == 1){
            $("#addressTab").show();
               let lis = a.map(item=>{
                   if (item.status == 1){
                       return `
                        
                  <tr>
                           <td>${item.name}</td>
                           <td>${item.mobile}</td>
                           <td>${item.zone}</td>
                           <td>${item.address}</td>
                           <td>${item.postcode}</td>
                           <td><span class="default-addr" >默认地址</span></td>
                           <td><button class="btn btn-info  update-item" data-id="${item._id}">修改</button></td>
                           <td><button class="btn btn-danger delet-item" value="-1" data-id="${item._id}">删除</button></td>
                  </tr>
            
                       `
                   }else{
                       return  `  <tr>
                                               <td>${item.name}</td>
                                               <td>${item.mobile}</td>
                                               <td>${item.zone}</td>
                                               <td>${item.address}</td>
                                               <td>${item.postcode}</td>
                                               <td>
                                                   <button class="btn btn-success  moren-item" data-id="${item._id}">设置默认</button>
                                               </td>
                                               <td><button class="btn btn-info update-item" data-id="${item._id}">修改</button></td>
                                               <td><button class="btn btn-danger delet-item" data-id="${item._id}">删除</button></td>
                                           </tr>`
                   }
               }).join("")


            $("#personalAddress").html(lis)
        }
    })
}


//保存地址
$("#baocun").click(function () {
    let a = $("#addUserAddress").serializeArray();
    let obj = {}
    for (let item of a) {
        obj[item.name] = item.value
    }

    obj.zone = obj.province + obj.city + obj.district
    delete  obj.province
    delete  obj.city
    delete  obj.district


    if ($("[name='flag']").prop("checked")){
        obj.status = 1
    }else{
        obj.status = 0
    }

    addressApi.add(obj).then(i=>{
        let {status,msg,a} = i
        console.log(i)
        alert(msg)
        if (status == 1){
            adress()
            $("#addAddress").modal('hide')
        }
    })



})

//删除地址
$("#personalAddress").on('click','.delet-item',function () {
    let id =$(this).data("id")
    if ($(this).val()){
        return alert("不能删除默认地址")
    }
    if (confirm("宁确定要删除")){
        addressApi.deletOne(id).then(i=>{
            let {status,msg} = i
            alert(msg)
            if (status == 1){
                adress()
            }
        })
    }


})

//默认地址
$("#personalAddress").on('click','.moren-item',function () {
    let id =$(this).data("id")
    addressApi.moren(id).then(i=>{
        let {status,msg} = i
        alert(msg)
        if (status == 1){
            adress()
        }
    })
})

//修改数据回显
$("#personalAddress").on('click','.update-item',async function () {
    let id = $(this).data("id");
   $("#editAddress").modal("show")
   let x  = await addressApi.findById(id)
    let {status,msg,a } =x
    console.log(x);
   $("#editname").val(a.name)
    $("#editphone").val(a.mobile);
   $("#editfullAddress").val(a.address);
   $("#editZone").val(a.zone)
    $("#editId").val(a._id)
    // $("#editbaocun").attr("data-id",id);
})

//修改
$("#editbaocun").click(async function () {
    let obj = {};
    // let id = $(this).parents("#editUserAddress").data("id");
    // let id = $(this).parents("#editUserAddress")
    // let id = $(this).data("id");
    let id = $("#editId").val();
    obj._id = id
    console.log(id)
    let a =$("#editUserAddress").serializeArray();
    for (let item of a) {
        obj[item.name] = item.value
    }
    if (obj.province!=-1){
            obj.zone = obj.province + obj.city + obj.district
    }

    delete obj.province
    delete obj.city
    delete obj.district
    obj.status = 0
   if ($("#shezhimoren").prop("checked")){
       obj.status = 1
   }
    console.log(obj)
   let b = await addressApi.update(obj)
    console.log(b)
    let {status,msg,data}=b
    alert(msg)
    if (status == 1){
        adress()
        $("#editAddress").modal("hide")
    }
})

//修改地址的小按钮
let flag2 = true
$("#xiugaidizhi").click(function () {
    if (flag2){
        $("#xuanzediqu").slideDown()
        flag2 = false
    }else {
        $("#xuanzediqu").slideUp();
        flag2 = true
    }
})


//订单管理渲染
orderRender()
function orderRender() {
    orderApi.list().then(i=>{
        let {msg,status,a} = i
        console.log(i)
            let lis = ''
            for (let j = 0; j <a.length ; j++) {
                lis += `
                  <div class="item">
                                <div class="row info">
                                    <div class="col-md-5 orderNo">订单号: <span>${a[j].orderNo}</span></div>
                                    <div class="col-md-3 orderAmount">订单金额: ¥<span>${a[j].total}</span>元</div>
                                    <div class="col-md-3 col-md-offset-1 text-right">`

                                    if(a[j].status == 0){
                                        lis +=`  <a href="http://localhost:3000/order/pay?orderNo=${a[j].orderNo}&totalAmount=${a[j].total}" class="btn btn-success">立即支付</a>
<button type="button" class="btn btn-info" data-toggle="modal" data-target="#orderDetail">订单详情</button>
                                    </div>
                                </div>`
                                    }else
                                    {
                                        lis +=` <button type="button" class="btn btn-danger">删除订单</button>
<button type="button" class="btn btn-info" data-toggle="modal" data-target="#orderDetail">订单详情</button>
                                    </div>
                                </div>`
                                    }




                for (let k = 0; k <a[j].products.length ; k++) {
                    lis+=`
 
                         <div class="detail">
                                    <div class="subItem">
                                        <div class="col-md-2">
                                            <img src=${a[j].products[k].proInfo.imagePath} width="60">
                                        </div>
                                        <div class="col-md-4 desc">
                                           ${a[j].products[k].proInfo.pname} 
                                        </div>
                                        <div class="col-md-2 text-center"> ${a[j].products[k].proInfo.price}</div>
                                        <div class="col-md-2 text-center">&times; ${a[j].products[k].count}</div>
                                        <div class="col-md-2 text-center">${a[j].products[k].proInfo.price*1*a[j].products[k].count}元</div>
                                    </div>
                    `
                    if (k == a[j].products.length-1){
                        lis+=`
                             </div>
                            </div>
                        `
                    }
                }
            }
            $("#orderGuanli").html(lis)
    })
    }







import "../../css/head.css";
import "../../css/page/order.css";
import orderDetailApi from "../api/orderDetailApi.js";
import orderApi from "../api/orderApi.js";
import userApi from "../api/userApi";
import addressApi from "../api/addressApi";

import  {getRequestParam} from "../util/urlView";

let param = getRequestParam(location.href)
let {oid:id} = param;
console.log(id)

$('#shippingAddress').on("mouseover", ".item", function () {
    $(this).addClass("choose");
})

$('#shippingAddress').on("mouseout", ".item", function () {
    $(this).removeClass("choose");
})

$('#shippingAddress').on("click", ".item", function () {
    // 获取到该地址的数据
    let info = $(this).children(".info").children();
    let name = info.eq(0).children(".name").text();
    let mobile = info.eq(0).children(".mobile").text();;
    let address = info.eq(1).text().trim();
    // 关闭地址模态框
    $('#shippingAddress').modal("hide");
    // 更新页面数据
    $('.addr .name').text(name);
    $('.addr .mobile').text(mobile);
    $('.addr .address').text(address);
})

userInfo()
 render();



//渲染订单数据

function render() {
    orderApi.one(id).then(i=>{
        let {status,msg,a} = i
        console.log(i)
        console.log(msg);
        if (status ==1){
            $("#orderBody .orderNO > span").html(a.orderNo);
            $("#orderBody .orderAmount > span").html(a.total);
            $("#lijizhifu").html(`
             <a href="http://localhost:3000/order/pay?orderNo=${a.orderNo}&totalAmount=${a.total}" class="btn btn-primary">立即支付</a>
            `)
            let lis = a.products.map(item=>(`
                 <div class="subItem">
                            <div class="col-md-2">
                                <img src=${item.product.imagePath} width="60">
                            </div>
                            <div class="col-md-4 desc">
                                ${item.product.pname}
                            </div>
                            <div class="col-md-2 text-center">${item.product.price}</div>
                            <div class="col-md-2 text-center">&times; ${item.count}</div>
                            <div class="col-md-2 text-center">${item.product.price * item.count }元</div>
                        </div>
            `)).join("")
            $("#orderProductInfo").html(lis)
        }
    })
}




//用户信息渲染
function userInfo() {
    if (localStorage.hasOwnProperty("Token")) {
        userApi.heardInfo().then(({status, info}) => {
            console.log(info)
            if (status == 1) {
                $("#orderUser").show();
                $("#orderUser > .img-circle").prop("src", info.avatar)
                $("#orderUser>.person ").text(info.username);

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


userAddress()
//收货模态框渲染
function userAddress() {
    addressApi.findAll().then(i=>{
        console.log(i)
        let {status,msg,data} = i
        let lis = '';
        for (let j = 0; j < data.length; j++) {
            if (j == 0){
                lis+=`
                      <div class="row item">
                                <div class="col-md-1 col-md-offset-1 logo">
                                    <span class="glyphicon glyphicon-home"></span>
                                </div>
                                <div class="col-md-8 col-md-offset-1 info">
                                    <div>
                                        <span class="name">${data[j].name[0]}先生</span>
                                        <span class="mobile">${data[j].mobile}</span>
                                        <span class="default">默认</span>
                                    </div>
                                    <div>
                                        ${data[j].zone+''+data[j].address}
                                    </div>
                                </div>
                            </div>
                `
            }else {
               lis+=`
                 <div class="row item">
                    <div class="col-md-1 col-md-offset-1 logo">
                        <span>${data[j].name[0]}</span>
                    </div>
                    <div class="col-md-8 col-md-offset-1 info">
                        <div>
                            <span class="name">${data[j].name[0]}先生</span>
                            <span class="mobile">${data[j].mobile}</span>
                        </div>
                        <div>
                            ${data[j].zone+''+data[j].address}
                        </div>
                    </div>
                </div>
               `
            }
        }

        let liis = ``
        for (let j = 0; j <data.length ; j++) {
            if (j == 0){
                liis+=`
                        <div class="logo col-md-2">
                    <span class="glyphicon glyphicon-map-marker"></span>
                </div>
                <div class="info col-md-10">
                    <p>
                        <span class="name">${data[j].name}</span>
                        <span class="mobile">>${data[j].mobile}</span>
                    </p>
                    <p>
                        <span class="address"> ${data[j].zone+''+data[j].address}</span>
                        <span class="btn btn-link" data-toggle="modal" data-target="#shippingAddress">更换地址</span>
                    </p>
                    <p class="msg">收货不便时，可选择暂存服务</p>
                </div>
                `
            }
        }

        $("#myshouhuo").html(lis)
        $("#personalAddress").html(liis)

    })
}




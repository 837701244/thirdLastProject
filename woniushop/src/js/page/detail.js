import "../../css/head.css";
import "../../css/page/detail.css";
import productApi from "../api/productApi.js";
import shopcartApi from "../api/shopcartApi";
import {getRequestParam} from "../util/urlView.js";
import userApi from "../api/userApi";

// 选择颜色
$('#color>div').click(function () {
    $(this).addClass("active").siblings().removeClass("active");
})
// 选择版本
$('#version>div').click(function () {
    $(this).addClass("active").siblings().removeClass("active");
})
let {pid} = getRequestParam(location.href);
console.log(pid);


userInfo();
renderProduct();

//渲染商品
function renderProduct() {
    productApi.findById(pid).then(i=>{
        let {status,msg,data} = i;
        console.log(i)
        if (status == 1){
            let lis = `
                 <!--商品的轮播图区域-->
            <div class="col-md-5" style="height: 500px;">
                <div id="showImg" class="carousel slide" data-ride="carousel">
                    <!-- Indicators -->
                    <ol class="carousel-indicators">
                        <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                        <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                        <li data-target="#carousel-example-generic" data-slide-to="2"></li>
                    </ol>

                    <!-- Wrapper for slides -->
                    <div class="carousel-inner" role="listbox">
                        <div class="item active">
                            <img src=${data.imagePath} alt="">
                        </div>
                        <div class="item">
                            <img src=${data.imagePath}  alt="">
                        </div>
                        <div class="item">
                            <img src=${data.imagePath}  alt="">
                        </div>
                    </div>
                    <!-- Controls -->
                    <a class="left carousel-control" href="#showImg" role="button" data-slide="prev" style="background:none;">
                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="right carousel-control" href="#showImg" role="button" data-slide="next" style="background:none;">
                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>

            <!--商品详情区域-->
            <div class="col-md-7 detail" style="height: 500px;">
                <div class="row">
                    <span class="title">${data.pname}</span>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <span class="activity">「火爆抢购中，最高享24期免息，低至221元起/期；加149元得199元55W立式风冷无线充；加69元得皮革保护壳」</span><br>
                         <span class="info" > 要突出产品特点和优势。
任何一种商品都有自己独特的特点。不要认为不是品牌名牌的产品没有优点，最起码的价格便宜是个大优点吧。当然做产品，价格不是突出的特点。
介绍商品不能一律对待，要根据不同客户的不同需求，要有针对性，突出重点，满足客户的需求。介绍优点，但要准确真实，不可欺骗消费者。</span><br>
                        <span class="info" style="margin-top: 40px;display: block">${data.pinfo}</span> 
                    </div>
                </div>
                

                <div class="row"  style="margin-top: 160px;margin-left: 0" >
                    <span class="price">￥${data.price}</span>
                </div>
                
                <div style="margin-top: 20px">
                    数量：<input id="productNumber" type="number" min="1" max=${data.stock} value="1" class="text-center">&nbsp;&nbsp;
                    库存（<span>${data.stock}</span>）件
                </div>

                <div class="option">
                    <div class="shopcart" id="addShopCart" style="cursor: pointer">加入购物车</div>
                    <div class="buy" id="goBuy" style="cursor: pointer">立即购买</div>
                </div>
            </div>
            `
            $("#productShow").html(lis)

            //判断数量改变的阈值
            $("#productNumber").change(function () {
                let val = $("#productNumber").val();
                if (val < 1){
                    alert("不能小于1")
                    $("#productNumber").val("1")
                }
                if (val>data.stock){
                    alert("大于库存");
                    val = $("#productNumber").val(data.stock)
                }
            })

            //点击加入购物车
            $("#addShopCart").click(function () {

                let obj ={}
               let num =  $("#productNumber").val();
               obj.num = num;
               obj.pid = pid;
                console.log(obj)
                shopcartApi.add(obj).then(i=>{
                    let {status,msg,chazhi}=i;
                    alert(msg);
                    if (status == 401){
                        alert("请先登录");
                        location.href="../"
                    }
                    if (status == 1 && msg == "超出最大库存"){
                        $("#productNumber").val(chazhi)
                    }
                    console.log("加入购物车的LOG",i)


                })
            })
        }
    })




}







//用户登录信息
function userInfo() {
    if (localStorage.hasOwnProperty("Token")){
        userApi.heardInfo().then(({status,info})=>{
            console.log(info)
            if (status ==1){
                $("#edtailUserInfo").show();
                $("#edtailUserInfo > .img-circle").prop("src",info.avatar)
                $("#edtailUserInfo>.person ").text(info.username);

            }else {
                return  console.log("服务器报错");
            }
            if (status == 401){
                console.log("服务器报错,401");
            }
        })
    }
}





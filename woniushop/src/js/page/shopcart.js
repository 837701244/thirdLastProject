import "../../css/head.css"
import "../../css/index.css"
import "../../css/page/shopcart.css";
import shopcartApi from "../api/shopcartApi.js";
import userApi from "../api/userApi";
import productApi from "../api/productApi";
import orderApi from "../api/orderApi";

// 结算
$("#btnCalculate").click(async function () {
    let lks = $("[name='product']:checked");
    let item = []
  if (lks.length == 0){
      return alert("请选择商品")
  }
  lks = [...lks];
  let newLks = lks.map(item=>{
      let pid = $(item).val();
      let num = ($(item).parent().parent().children(".num").children("input").val())*1
      return {pid,num}
  })
    console.log(newLks)
   let a = await orderApi.createOrder(newLks);
    let {status,msg,orderNo} = a;
    alert(msg)
    if (status == 1){
        // 结算成功后会跳转到订单页面（需要携带订单号）
        // location.href = `./order.html?oid=2020322302032`;
        location.href = `./order.html?oid=${orderNo}`;
    }






});

userInfo();
renderShopcart();




//购物车商品的信息
    function renderShopcart() {
        shopcartApi.findByUserId().then(i=> {
            let {status, msg, data} = i;
            console.log(i)
            $("#noShopCatr").hide();
            if (status == 401) {
                alert("请登录");
                return location.href = "../"
            }
            console.log(msg);
            if (status == 0) {

                return $("#noShopCatr").show();
            }

            if (status == 1) {
                $("#BigTable").show();
                let lis = data.map(item => (`
                 <tr class="item">
                    <td class="check">
                        <input type="checkbox" name="product" value=${item.product[0]._id}>
                    </td>
                    <td class="pimg">
                        <img src=${item.product[0].imagePath}>
                    </td>
                    <td class="info">
                        ${item.product[0].pname}
                    </td>
                     <td class="size">
                        <p>单支</p>
                        <p>硬货</p>
                    </td>
                    <td class="price">
                        ¥<span>${item.product[0].price}</span>
                    </td>
                    <td class="num">
                        <input type="number" min="1" max=${item.product[0].stock} value=${item.count} data-id="${item.pid}" name="count">
                    </td>
                    <td class="subtotal">
                        ¥<span>${(item.count * 1 * item.product[0].price)}</span>
                    </td>
                    <td class="del">
                        <span data-id=${item.pid} class="del-item" style="cursor: pointer">&times;</span>
                    </td>
                </tr>
                `)).join("");
                $("#productTbody").html(lis);

            }else {
                alert("发现未知错误")
            }
            allCount();
        })

    }


//小计改变事件
$("#productTbody").on('change', "[name='count']", async function () {
    let obj = {}
    let num = $(this).val();
    let pid = $(this).data("id");
    obj.num = num;
    obj.pid = pid;

    let price = parseInt($(this).parent().prev().children("span").text()) ;
    let subTotal = price * obj.num;
    $(this).parent().next().children("span").text(subTotal);

    let  x = await productApi.findById(pid)

    console.log(obj);
    if (num<1){
        alert("请输入正确数值")
        obj.num = 1;
        $(this).val("1")
        let price = parseInt($(this).parent().prev().children("span").text()) ;
        let subTotal = price * obj.num;
        $(this).parent().next().children("span").text(subTotal);
        // console.log("总价",subTotal)
    }
    if (num>x.data.stock){
        alert("超出最大库存")
        obj.num = x.data.stock;
        $(this).val(obj.num)
        let price = parseInt($(this).parent().prev().children("span").text()) ;
        let subTotal = price * obj.num;
        $(this).parent().next().children("span").text(subTotal);
        // console.log("总价",subTotal)
    }
    if (num == ""){
        obj.num = 1;
        free("span")
        $(this).val("1")
    }



   let i =  await shopcartApi.updataProductNum(obj)
        console.log(i)
        let {status,msg,stock}=i;
        console.log(msg)
        if (status == 401){
            alert("请先登录");
            return  location.href="../"
        }
    allCount();
    })


//点击删除
$("#productTbody").on("click",".del-item",async function () {

      let pid =  $(this).data("id")
    if (confirm("宁确定删除吗")){
        let a = await shopcartApi.remove(pid);
        let {status,msg} =a;
        console.log(a)
        alert(msg);
        if (status ==1){
            renderShopcart();
            allCount();
        }
        if (status == 401){
            return location.href="../"
        }
    }



})


//清理购物车
$("#clean").click(async function () {

    if (confirm("宁确定要清空吗")){
        let a =await shopcartApi.removeAll();
        let {status,msg}=a
        alert(msg)
        if (status ==1){
            renderShopcart()
        }
    }
    allCount();

})


//全选
$("#all").click(function () {
    $('[name="product"]').prop("checked",$(this).prop("checked"));
    allCount();
})
//全选优化
$("#productTbody").on("click","[name='product']",function () {
    let arr = $("[name='product']");
    arr = [...arr]
    let flag = arr.every(item=>item.checked);
    $("#all").prop('checked',flag);
    allCount()
})


//删除选中商品
$("#deleOne").click(async  function () {

    let arr= $('[name="product"]:checked');
    // arr= [...arr]
    console.log(arr)
    if (arr.length == 0){
      return   alert("未选择")
    }
if (confirm("宁确定要删除选中商品吗")){
    arr =[...arr]
    let newArr = arr.map(item=>item.value);
    console.log(newArr)
    let {status,msg} =  await shopcartApi.batchRemove(newArr);
    alert(msg);
    if (status == 1){
        renderShopcart();
    }
}




})

//计算总价
function allCount() {
        let sum =0
    $('[name="product"]:checked').each(function (index,ele){
        let subTotal =$(this).parent().parent().children('.subtotal').children('span').text();
        // console.log(subTotal)
        sum+=subTotal*1
    })
    $("#totalPrice").text(`￥${sum}`);
        $("#chooseNum").text($('[name="product"]:checked').length)
    console.log(sum)
}



//小计计算函数
function free(Doc) {
        let price = parseInt($(this).parent().prev().children(Doc).text()) ;
        let num = $(this).val();
        let subTotal = price * num;
        $(this).parent().next().children(Doc).text(subTotal);
    }


//用户登录信息
function userInfo() {
                if (localStorage.hasOwnProperty("Token")) {
                    userApi.heardInfo().then(({status, info}) => {
                        console.log(info)
                        if (status == 1) {
                            $("#shopCartUserInfo").show();
                            $("#shopCartUserInfo > .img-circle").prop("src", info.avatar)
                            $("#shopCartUserInfo>.person ").text(info.username);

                        } else {
                            return console.log("服务器报错");
                        }
                        if (status == 401) {
                            console.log("服务器报错,401");
                        }
                    })
                }
            }

//
// shopcartApi.updataProductNum(obj).then(i => {
//     console.log(i)
//     let {status,msg,stock}=i;
//     console.log(msg)
//     if (status == 401){
//         alert("请先登录");
//         return  location.href="../"
//     }
//     if ( msg == "超出最大库存"){
//         console.log(msg);
//         let price = parseInt($(this).parent().prev().children("span").text()) ;
//         let subTotal = price * num;
//         $(this).parent().next().children("span").text(subTotal);
//         return  $(this).val(stock)
//     }
//     if (status ==1){
//         let price = parseInt($(this).parent().prev().children("span").text()) ;
//         let subTotal = price * num;
//         $(this).parent().next().children("span").text(subTotal);
//     }
//
// })

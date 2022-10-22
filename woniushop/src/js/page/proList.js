import "../../css/head.css";
import "../../css/index.css";
import categoryApi from "../api/categoryApi.js";
import productApi from "../api/productApi.js";
import userApi from "../api/userApi";

let morenPage = null
// 从地址栏获取到请求参数
//location.href
let param = getRequestParam(location.href);

let {category} = param
let {keyword} =param;

if (keyword){
    keyword = decodeURI(keyword);
}

console.log(keyword)
render();
renderHeader();
catgory();


function renderHeader() {
    if (localStorage.hasOwnProperty("Token")){
        userApi.heardInfo().then(({status,info})=>{
            console.log(info)
            if (status ==1){
                $("#proListHeader").show();
                $("#proListHeader > .img-circle").prop("src",info.avatar)
                $("#proListHeader>.person ").text(info.username);

            }else {
                return  console.log("服务器报错");
            }
            if (status == 401){
                console.log("服务器报错,401");
            }
        })
    }
}



//点击搜查
$("#productSearch").click(function () {
    let val = $("#kw").val();
   location.href=`http://localhost:8000/page/proList.html?keyword=${val}`
})

 function render(page=1) {
     let obj ={};
     obj.page = page;
     obj.id = category;
     obj.keyword = keyword;
     console.log(obj)
    productApi.findByCatIdOnePage(obj).then(i=>{
       let {status,msg,data,totalPage,prevPage,nextPage,total} = i;
        console.log("status",status,"msg",msg,"data",data,"totalPage",totalPage,"prevPage",prevPage,"nextPage",nextPage,"total",total);
        if (status ==1){
            let str = data.map(item=>(`
            <div class="col-xs-6 col-sm-4 col-md-3">
            <div class="thumbnail pro-item">
                <a href="detail.html?pid=${item._id}">
                    <img src="${item.imagePath}"   style="height: 130px;width: 130px">
                    <div class="caption">
                        <h4 class="title">${item.pname}</h4>
                        <p class="info">${item.pinfo} </p>
                        <p class="price">￥${item.price}起</p>
                    </div>
                </a>
            </div>
        </div>
            `)).join("");
            $("#productZhanshi").html(str);
            let list = `  <li><a href="" id="prevPage">&laquo;</a></li>`
                for (let i =1;i<=totalPage;i++){
                    if (page == i){
                        list+=`<li class="active"><a href="" >${i}</a></li>`;
                    }else {
                        list+=`<li ><a href=""  class="page">${i}</a></li>`;
                    }
                }
            list+=`<li><a href="" id="nextPage">&raquo;</a></li>`;
            $("#productPage").html(list);
            if (totalPage == 1){
               return  $("#productPage").html("")
            }
            $("#productPage").on('click','.page',function (e) {
                e.preventDefault()
                render($(this).text());
            })
            $("#prevPage").click(function (e) {
                e.preventDefault()
                render(prevPage)
            })
            $("#nextPage").click(function (e) {
                e.preventDefault()
                render(nextPage)
            })

        }else {
            $("#productZhanshi").html(`<h1>${msg}</h1>`)
            $("#productPage").html("")
        }
    })
}

//渲染商品列表
function catgory() {
    categoryApi.catgoryList().then(i=>{
        let {status,msg,data} = i
        let arr = data;
        arr.sort((a,b)=>Math.random()-0.5);
        let Newarr = arr.slice(0,8);
        console.log(Newarr)
        let str =  Newarr.map(item=>(`
            <li><a href="" class="menu" data-id="${item._id}">${item.cname}</a></li>
       `)).join("")
        $("#ProductUl").html(str)
    })
}


$("#ProductUl").on('click','.menu',function (e) {
    e.preventDefault();
   let pid =  $(this).data("id");
    location.href=`http://localhost:8000/page/proList.html?category=${pid}`
});


function getRequestParam(url) {
    let paramStr = url.split("?")[1];
    let params = paramStr.split("&");
    let obj = {};
    for(let param of params){
        let kv = param.split("=");
        obj[kv[0]] = kv[1];
    }
    return obj;
}




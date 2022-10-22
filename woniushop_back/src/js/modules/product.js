
import api from "../api/productApi";
import {preview} from "../util/preview";

let dangqianPage = null;

render();
catgory($("#addProductCatId"));
catgory($("#editProductCatgoryId"));
//全选
$("#pall").click(function () {
    $("[name='products']").prop("checked",this.checked);
})
//全选优化
$("#productTable").on('click','[name="products"]',function () {
    let xx = $("[name='products']");
    xx = [...xx]
    let flag = xx.every(i=>i.checked);
    $("#pall").prop("checked",flag);
})
//删除单个
$("#productTable").on('click','.delet-item',async function (e) {
    e.preventDefault();
   let _id = $(this).data("id");
   if (confirm("宁确定删除")){
      let {status,msg} =  await api.removeOne(_id);
      alert(msg);
      if (status == 401){
          location.href='./login.html'
      }
      if (status ==1){
          render(dangqianPage);
      }
   }

})

//批量删除
$("#proBatchDelete").click(async function () {
    let arr = $("[name='products']:checked");

    if (arr.length == 0){
        return alert("请选择")
    }
    arr = [...arr]
    let Arr = arr.map(i=>i.value);
    console.log(Arr);
    if (confirm("宁确定删除")){
        let {msg,status}=await api.batchRemove(Arr);
        alert(msg)
        if (status == 401){
            location.href='./login.html'
        }
        if (status == 1){
            render(dangqianPage)
        }
    }

})

//添加商品框弹出
$("#productAdd").click(function () {
    $("#addProudtModal").modal("show");
})
// 添加模态框图片预览
$('#addProductImgPath').change(function () {
    preview(this, $('#ProductAddImgBox')[0]);
})
//添加商品
$("#btnProductAdd").click(async function () {
    let obj = new FormData($("#addProductForm")[0])
    let {msg,status} =await  api.add(obj);
        alert(msg);
        if (status==401){
          return   location.href="./login.html"
        }
        if (status == 1){
            render(dangqianPage)
            $("#addProudtModal").modal('hide');
            $('#addProductForm')[0].reset(); //  表单节点.reset()  重置表单数据
            $('#UserAddImgBox').prop("src","");
        }
})

//修改商品框弹出
$("#productTable").on('click','.edit-item',async function (e) {
    e.preventDefault();
    let _id = $(this).data("id");
    let {status,data} = await api.findById(_id);
    if (status == 401){
        return location.href="./login.html";
    }
    if (status ==1){
        $("#editProductModal").modal("show");
        console.log(data)
        $("#editProductId").val(data._id);
        $("#editProductPname").val(data.pname);
        $("#editProductCatgoryId").val(data.catgoryId);
        $("#editproductPrice").val(data.price);
        $("#editproductStock").val(data.stock);
        $("#editproductSales").val(data.sales);
        $("#editproductStatus").val(data.status);
        $("#addProductPinfo").val(data.pinfo);
        $("#editProductImgBox").prop('src',data.imagePath);
    }

})
//修改框图片预览
$("#editProductImgPath").change(function () {
    preview(this, $('#editProductImgBox')[0]);
})
//确认修改
$("#btnEditProduct").click(async function () {
    let obj = new FormData($("#editProductForm")[0])
    let {status,msg} = await api.editProduct(obj);
    alert(msg)
    if (status == 401){
        local.href="./login.html";
    }
    if (status == 1){
        render(dangqianPage);
        $("#editProductModal").modal('hide');
        $('#editProductForm')[0].reset(); //  表单节点.reset()  重置表单数据
        $('#editProductImgBox').prop("src","");
    }

})

$("#pname").blur(function () {
    render()
})


 function render(page =1) {
    let obj ={};
    let val = $("#pname").val();
    let start = $("#productStart").val();
   let  end = $("#productEnd").val();
    obj.page = page;
    obj.pname= val;
    obj.start = start;
    obj.end = end;
     console.log(obj);
api.list(obj).then(a=>{
   let {page,pageSize,totalPage,total,prevPage,nextPage,data,status} =a;
    console.log(a)
    if (status==401){
       return  location.href ="./login.html";
    }
   let str = data.map(item=>(`
     <tr>
                                       <td><input type="checkbox" name="products" value="${item._id}"></td>
                                       <td>${item._id}</td>
                                       <td>${item.pname}</td>
                                       <td>
                                           <img src="${item.imagePath}" width="60px" alt="">
                                       </td>
                                       <td>${item.price}元</td>
                                       <td>${item.stock}</td>
                                       <td>${item.sales}</td>
                                       <td>${item.ProductType[0].cname}</td>
                                       <td>${item.status ==0?'下架':'上架'}</td>
                                       <td><a href="#" class="btn btn-danger delet-item" data-id="${item._id}"><span class="glyphicon glyphicon-remove"></span>删除</a></td>
                                       <td><a href="#" class="btn btn-primary edit-item" data-id="${item._id}"  data-toggle="modal" data-target="#updateModal"><span class="glyphicon glyphicon-pencil"></span>修改</a></td>
                                   </tr>
   `))
    $("#productTable>tbody").html(str)
    let lis = `<li><a href="javascript:;" class="prev" id="productPrev">&laquo;</a></li>`

    for (let i =1;i<=totalPage;i++){
        if (page == i){
            lis +=`<li class="active"><a href="javascript:;">${i}</a></li>`;
        }else {
            lis +=`<li><a href="javascript:;" class="page">${i}</a></li>`;
        }

    }
    lis += `<li><a href="" class="next" id="productNext">&raquo;</a></li>`;
    dangqianPage = page;
    $("#productPage").html(lis);
    if (totalPage == 1){
        $("#productPage").html("")
    }

    $("#productPage").on('click','.page',function () {
        render($(this).text())
    })
    $("#productPrev").click(function (e) {
        e.preventDefault();
        render(prevPage)
    })
    $("#productNext").click(function (e) {
        e.preventDefault();
        render(nextPage)
    })

})

}

function catgory(weizhi){
    api.catgoryId().then(i=>{
        console.log("111111111111111",i)
        let lis = i.map(item=>(`
             <option value="${item._id}">${item.cname}</option>
        `))
        weizhi.html(lis)
    })
}
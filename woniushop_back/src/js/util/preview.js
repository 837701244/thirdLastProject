// 图片预览的模块
export function preview(fileDom, imgDom) {
    //1.验证文件的类型是否式图片类型（image/xxx）
    let file = fileDom.files[0];
    if(!/^image\/[a-zA-Z]+$/.test(file.type)){  // 正则校验是否是 image/...
        alert('您选择的不是图片!');
        fileDom.value = "";
    }
    //2.创建文件预览器来完成图片的预览
    let fr = new FileReader();
    fr.readAsDataURL(file); //读取的是一个二进制文件对象
    fr.onload = function () {
        imgDom.src = this.result; //将图片预览的结果与img的src绑定
    }
}
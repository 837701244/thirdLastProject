function mydate() {
    //创建日期对象
    let myData=new Date();
    //获取日期
    let year=myData.getFullYear();
    let month=myData.getMonth();
    let day=myData.getDate();
    let hours=myData.getHours();
    let minutes=myData.getMinutes();
    let seconds=myData.getSeconds();
    return year+""+(month+1)+day+hours+minutes+seconds
}

function diyGetDateTime(str,date){
    let now = date;
    str = str.replaceAll("YYYY",now.getFullYear());
    str = str.replaceAll("MM",now.getMonth()+1);
    str = str.replaceAll("DD",now.getDate());
    str = str.replaceAll("HH",now.getHours());
    str = str.replaceAll("mm",now.getMinutes());
    str = str.replaceAll("SS",now.getSeconds());

    return str
}

module.exports={mydate,diyGetDateTime}
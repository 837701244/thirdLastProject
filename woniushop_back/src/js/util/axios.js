export let axios = {
    get(url,data) {
        return new Promise((resolve, reject) => {
                        $.ajax({
                            url,
                            data : data ? data : {},
                            type : "get",
                            dataType:"json",
                            headers:{
                                Authorization:localStorage.getItem("backToken")
                            },
                            success(res){
                                resolve(res); // 异步任务成功返回响应结果
                            },
                            error(err){
                                reject(err); // 异步任务失败返回错误原因
                            }
            })
        })
    },
    post(url,data,flag=false) {
        return new Promise((resolve, reject) => {
            let param = {
                url,
                data : data ? data : {},
                type : "post",
                dataType:"json",
                headers:{
                    Authorization:localStorage.getItem("backToken")
                },
                success(res){
                    resolve(res); // 异步任务成功返回响应结果
                },
                error(err){
                    reject(err); // 异步任务失败返回错误原因
                }
            }
            if(flag){
                param.contentType = false;
                param.processData= false;
            }
            $.ajax(param); // ajax只有一个配置对象参数
        })
    }
}

export let BASE_SERVER = "http://localhost:3001"




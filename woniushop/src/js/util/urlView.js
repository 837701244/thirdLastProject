export function getRequestParam(url) {
    let paramStr = url.split("?")[1];
    let params = paramStr.split("&");
    let obj = {};
    for(let param of params){
        let kv = param.split("=");
        obj[kv[0]] = kv[1];
    }
    return obj;
}


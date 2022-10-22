import {BASE_SERVER,axios} from "../util/axios.js";

async  function add(obj){
    return await axios.get(`${BASE_SERVER}/shopcart/add`,obj)
}
async  function findByUserId(){
    return await axios.get(`${BASE_SERVER}/shopcart/findByUserId`)
}

async function updataProductNum(obj) {
    return await axios.get(`${BASE_SERVER}/shopcart/updataProductNum`,obj)
}

async function remove(id){
    return await axios.get(`${BASE_SERVER}/shopcart/delet`,{id})

}
async function removeAll(){
    return await axios.get(`${BASE_SERVER}/shopcart/deletAll`)

}
async function batchRemove(arr){
    return await axios.get(`${BASE_SERVER}/shopcart/batchAll`,{arr})

}



export default  {
add,findByUserId,updataProductNum,remove,removeAll,batchRemove
}
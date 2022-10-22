import {BASE_SERVER,axios} from "../util/axios.js";

async function createOrder(arr){
   return await axios.get(`${BASE_SERVER}/order/create`,{arr})
}

async function one(id){
    return await axios.get(`${BASE_SERVER}/order/one`,{id})
}
async function list(){
    return await axios.get(`${BASE_SERVER}/order/list`)
}




export default  {
    createOrder,one,list
}
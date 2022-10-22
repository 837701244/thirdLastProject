import {BASE_SERVER,axios} from "../util/axios.js";

async function list() {
 return   await axios.get(`${BASE_SERVER}/address/list`);
}
async function add(obj) {
 return   await axios.get(`${BASE_SERVER}/address/add`,obj);
}
async function deletOne(id){
    return await axios.get(`${BASE_SERVER}/address/deletOne`,{id})
}
async function moren(id){
    return await axios.get(`${BASE_SERVER}/address/moren`,{id})
}
async function findById(id){
    return await axios.get(`${BASE_SERVER}/address/findById`,{id})
}
async function update(obj){
    return await axios.get(`${BASE_SERVER}/address/update`,obj)
}
async function findAll(){
    return await axios.get(`${BASE_SERVER}/address/findAll`)
}


export default  {
    list,add,deletOne,moren,findById,update,findAll
}
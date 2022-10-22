import {axios,BASE_SERVER} from "../util/axios";



async  function list(condition){
   return  await axios.get(`${BASE_SERVER}/user/list`,condition);
}

async function removeOne(_id) {
   return  await axios.get(`${BASE_SERVER}/user/deletOne`,{_id});
}

async function batchRemove(arr) {
    return  await axios.get(`${BASE_SERVER}/user/batchDelet`, {arr});
}
async function addUser(obj) {
    return await axios.post(`${BASE_SERVER}/user/Add`,obj,true);
}
async function findById(id) {
    return await axios.get(`${BASE_SERVER}/user/findById`, {id});
}
async function editUser(obj) {
    return await axios.post(`${BASE_SERVER}/user/edit`, obj,true);
}

export default {
    list,removeOne,batchRemove,addUser,findById,editUser
}
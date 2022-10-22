import {axios,BASE_SERVER} from "../util/axios";


async function list(condition) {
    return await axios.get(`${BASE_SERVER}/product/list`,condition);
}

async function removeOne(_id) {
    return  await axios.get(`${BASE_SERVER}/product/deletOne`,{_id});
}
async function batchRemove(arr) {
    return  await axios.get(`${BASE_SERVER}/product/batchDelet`, {arr});
}
async function catgoryId() {
    return  await axios.get(`${BASE_SERVER}/category/catgoryId`);
}
async function add(obj) {
    return  await axios.post(`${BASE_SERVER}/product/add`, obj,true);
}

async  function editProduct(obj) {
    return  await axios.post(`${BASE_SERVER}/product/edit`, obj,true);
}

async function findById(_id) {
    return  await axios.get(`${BASE_SERVER}/product/findById`, {_id});
}

export default {
    list,removeOne,batchRemove,catgoryId,add,findById,editProduct
}
import {BASE_SERVER,axios} from "../util/axios.js";

async function login(obj) {
    return await axios.post(`${BASE_SERVER}/login`,obj)
}

async function heardInfo() {
    return await axios.get(`${BASE_SERVER}/list`);
}

async function findUsername(username) {
    return await axios.get(`${BASE_SERVER}/findUserName`,{username});
}
async function addUser(obj) {
    return await axios.post(`${BASE_SERVER}/addUser`,obj);
}
async function info() {
    return await axios.get(`${BASE_SERVER}/user/info`);
}
async function update(obj) {
    return await axios.post(`${BASE_SERVER}/user/update`,obj);
}







export default  {
    login,heardInfo,findUsername,addUser,info,update
}
import {axios} from "../util/axios";

async function list() {
    return "用户数据查询成功";
}

async function login(condition) {
    return  await axios.post("http://localhost:3001/login",condition)
}

async function heardInfo() {
    return await axios.get("http://localhost:3001/logInfo")


}


async function quedingPwd(val) {
    return await axios.get("http://localhost:3001/getOldPwd",{val})
}

async function updatePwd(Pwd) {
    return await axios.get("http://localhost:3001/updatePwd",{Pwd})
}

export default {
    list,login,heardInfo,quedingPwd,updatePwd
}
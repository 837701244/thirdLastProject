import {BASE_SERVER,axios} from "../util/axios.js";


async function findHot() {
    return await axios.get(`${BASE_SERVER}/hotProduct`)
}
async function findByCatIdOnePage(obj) {
    return await axios.get(`${BASE_SERVER}/product/findByCatIdOnePage`,obj)
}
async function findById(id) {
    return await axios.get(`${BASE_SERVER}/product/findById`,{id})
}



export default  {
    findHot,findByCatIdOnePage,findById

}
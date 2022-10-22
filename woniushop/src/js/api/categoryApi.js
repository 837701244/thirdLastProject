import {BASE_SERVER,axios} from "../util/axios.js";


async function catgoryList() {
  return  await axios.get(`${BASE_SERVER}/catrgory`)
}

async function catgoryBig() {
    return  await axios.get(`${BASE_SERVER}/catrgoryBig`)
}

export default  {
    catgoryList,catgoryBig
}
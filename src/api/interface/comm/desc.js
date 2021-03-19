// 社区列表
import axios from '@/libs/api.request'

export default {

  findpage: req => {
    return axios.request({
      url: '/forms/desc/info',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
}

import axios from '@/libs/api.request'

export default {

  findpage: req => {
    return axios.request({
      url: '/consume/group/findtree',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },

}

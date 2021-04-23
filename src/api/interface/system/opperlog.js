import axios from '@/libs/api.request'

export default {

  findpage: req => {
    return axios.request({
      url: '/opperlog/findpage',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  getSearchCondition: () => {
    return axios.request({
      url: '/opperlog/findpage/condition',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      // params: req
    })
  },
  export: req => {
    return axios.request({
      url: '/opperlog/findpage/download',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  getExportStatus: () => {
    return axios.request({
      url: '/opperlog/findpage/download/state',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },

}
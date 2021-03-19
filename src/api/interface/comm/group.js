import axios from '@/libs/api.request'

export default {

  findpage: req => {
    return axios.request({
      url: '/group/findtree',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  findById: req => {
    return axios.request({
      url: '/group/findbyid',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params: req
    })
  },
  add: req => {
    return axios.request({
      url: '/group/add',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  edit: req => {
    return axios.request({
      url: '/group/updatebyid',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  delete: req => {
    return axios.request({
      url: '/group/deletebyid',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params: req
    })
  }

}

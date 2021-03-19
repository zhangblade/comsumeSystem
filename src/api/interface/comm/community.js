// 社区列表
import axios from '@/libs/api.request'

export default {

  findpage: req => {
    return axios.request({
      url: 'community/findpage',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  findById: req => {
    return axios.request({
      url: 'community/findbyid',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params: req
    })
  },
  add: req => {
    return axios.request({
      url: 'community/add',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  edit: req => {
    return axios.request({
      url: 'community/updatebyid',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  delete: req => {
    return axios.request({
      url: 'community/deletebyid',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params: req
    })
  }
}

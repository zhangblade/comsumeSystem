import axios from '@/libs/api.request'

// 账号管理
export default {
  findpage: req => {
    return axios.request({
      url: 'user/findpage',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  findById: req => {
    return axios.request({
      url: 'user/findbyid',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params: req
    })
  },
  add: req => {
    return axios.request({
      url: 'user/save',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  edit: req => {
    return axios.request({
      url: 'user/save',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  delete: req => {
    return axios.request({
      url: 'user/remove',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params: {
        userId: req
      }
    })
  },
  findRoleByUser: req => {
    return axios.request({
      url: 'user/role/subdominant',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
  toggleUserRole: req => {
    return axios.request({
      url: 'role/saveuserroles',
      method: 'get',
      params: req,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
}
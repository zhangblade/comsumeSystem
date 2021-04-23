// 角色管理
import axios from '@/libs/api.request'

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
  findRoleByUser: req => {
    return axios.request({
      url: 'role/findrolebyuser',
      method: 'get',
      params: req,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
  saveRole: req => {
    return axios.request({
      url: 'role/saveuserrole',
      method: 'get',
      params: req,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
  

}
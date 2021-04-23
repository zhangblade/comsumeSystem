// 角色管理
import axios from '@/libs/api.request'

export default {
  findpage: req => {
    return axios.request({
      url: 'role/findpage',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  findById: req => {
    return axios.request({
      url: 'role/findbyroleid',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params: req
    })
  },
  add: req => {
    return axios.request({
      url: 'role/save',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  edit: req => {
    return axios.request({
      url: 'role/update',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  delete: req => {
    return axios.request({
      url: 'role/delete',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  permission_findpage: req => {
    return axios.request({
      url: 'role/findmenusbyrole',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params: req
    })
  },
  permission_edit: req => {
    return axios.request({
      url: 'role/saveRoleMenus',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },

  // 操作员管理 -- 根据用户查角色
  findRoleByUser: req => {
    return axios.request({
      url: 'role/findrolebyuser',
      method: 'get',
      params: {
        userId: req
      },
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
  // 操作员管理 -- 分配角色
  toggleUserRole: req => {
    return axios.request({
      url: 'role/saveuserrole',
      method: 'get',
      params: req,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
  password: req => {
    return axios.request({
      url: 'user/resetpassword',
      method: 'POST',
      data: req,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
  dataAuthor: req => {
    return axios.request({
      url: 'user/dataauthor',
      method: 'POST',
      data: req,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
  getPermissionById: req => {
    return axios.request({
      url: 'user/operdatascope/findbyid',
      method: 'get',
      params: req,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
  // 获取部门信息
  getDepartment: () => {
    return axios.request({
      url: 'user/finddepttree',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
  // 获取组织数据范围结构
  getScopeDepartment: req => {
    return axios.request({
      url: 'user/findoperdatascopetree',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params: req
    })
  }

}
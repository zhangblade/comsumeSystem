import axios from '@/libs/api.request'

// 账号管理
export default {
  findpage: req => {
    return axios.request({
      url: '/consume/commdate/query',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 导出
  export: req => {
    return axios.request({
      url: '/consume/commdate/download/query',
      method: 'post',
      data: req,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
  // 导出状态
  getExportStatus: req => {
    return axios.request({
      url: '/consume/commdate/download/state',
      method: 'post',
      data: req,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
}
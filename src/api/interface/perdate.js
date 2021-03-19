import axios from '@/libs/api.request'

// 账号管理
export default {
  findpage: req => {
    return axios.request({
      url: '/consume/perdate/query',
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
      url: '/consume/perdate/download/query',
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
      url: '/consume/perdate/download/state',
      method: 'post',
      data: req,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
    })
  },
}
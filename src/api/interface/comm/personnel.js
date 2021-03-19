// 人员管理

import axios from '@/libs/api.request'
import PureAxios from 'axios' // 文件上传需要纯净 axios 不能序列化
import { getToken } from '@/libs/util'

// 房屋管理
export default {

  findpage: req => {
    return axios.request({
      url: 'personnel/findpage',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  findById: req => {
    return axios.request({
      url: 'personnel/findbyid',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  add: req => {
    return axios.request({
      url: 'personnel/add',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  edit: req => {
    return axios.request({
      url: 'personnel/updatebyid',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  delete: req => {
    return axios.request({
      url: 'personnel/deletebyid',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  batchRemove: req => {
    return axios.request({
      url: 'personnel/batch/remove',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  batchEdit: req => {
    return axios.request({
      url: 'personnel/batch/update',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  updateRegLimit: req => {
    return axios.request({
      url: 'personnel/batch/updatereglimit',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  updatecardtype: req => {
    return axios.request({
      url: 'personnel/batch/updatecardtype',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  updatepervaliddate: req => {
    return axios.request({
      url: 'personnel/batch/updatepervaliddate',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  export: req => {
    return axios.request({
      url: 'personnel/findpage/download',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  getExportStatus: req => {
    return axios.request({
      url: 'personnel/findpage/download/state',
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params: req
    })
  },
  import: (req, callback) => {
    var config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': getToken() || '',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
          callback && callback(progressEvent)
        }
      },
    }
    return PureAxios.post(axios.baseUrl + '/personnel/import', req, config)
  },
  uploadImg: (req, callback) => {
    var config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': getToken() || '',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent && progressEvent.lengthComputable) {
          callback && callback(progressEvent)
        }
      },
    }
    return PureAxios.post(axios.baseUrl + '/personnel/photo/upload', req, config)
  },
  faceRecognition: (req, callback) => {
    var config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': getToken() || '',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent && progressEvent.lengthComputable) {
          callback && callback(progressEvent)
        }
      },
    }
    return PureAxios.post(axios.baseUrl + '/personnel/photo/face/get', req, config)
  },
  depositList: req => {
    return axios.request({
      url: 'personnel/deposit/list',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 发行
  publishcard_findById: req => {
    return axios.request({
      url: 'personnel/publishcard',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  publishcard_submit: req => {
    return axios.request({
      url: 'personnel/publishcard/do',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 续期
  renewcard_findById: req => {
    return axios.request({
      url: 'personnel/renewcard',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  renewcard_submit: req => {
    return axios.request({
      url: 'personnel/renewcard/do',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 激活
  enablecard_findById: req => {
    return axios.request({
      url: 'personnel/enablecard',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  enablecard_submit: req => {
    return axios.request({
      url: 'personnel/enablecard/do',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 挂失
  losecard_findById: req => {
    return axios.request({
      url: 'personnel/losecard',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  losecard_submit: req => {
    return axios.request({
      url: 'personnel/losecard/do',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 换卡
  changecard_findById: req => {
    return axios.request({
      url: 'personnel/changecard',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  changecard_submit: req => {
    return axios.request({
      url: 'personnel/changecard/do',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 退卡
  backcard_findById: req => {
    return axios.request({
      url: 'personnel/backcard',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  backcard_submit: req => {
    return axios.request({
      url: 'personnel/backcard/do',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  getCardKind: req => {
    return axios.request({
      url: '/personnel/dict/get',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 获取附属群组
  getsubsidiaryGroup: req => {
    return axios.request({
      url: 'personnel/groupsupp/get',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 设置附属群组
  setsubsidiaryGroup: req => {
    return axios.request({
      url: 'personnel/groupsupp/setup',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 批量设置附属群组
  batchsetsubsidiaryGroup: req => {
    return axios.request({
      url: 'personnel/groupsupp/batch/setup',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },
  // 人员类别列表
  pertypeList: req => {
    return axios.request({
      url: '/personnel/pertype/list',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: req
    })
  },

}

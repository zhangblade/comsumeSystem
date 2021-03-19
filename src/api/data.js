import axios from '@/libs/api.request'
import qs from "qs"
import common from "./interface/common" //通用
// 概述
import desc from "./interface/comm/desc" //概述
// 报表
import charge from "./interface/charge" //充值明细
import source from "./interface/source" //消费
import devdate from "./interface/devdate" // 设备
import perdate from "./interface/perdate" // 人员
import groupdate from "./interface/groupdate" // 群组
import commdate from "./interface/commdate" // 社区
// 社区管理
import community from "./interface/comm/community" // 社区
import group from "./interface/comm/group" // 人员群组
import personnel from "./interface/comm/personnel" // 人员群组
import pvcgroup from "./interface/comm/pvcgroup" // 设备组
import pvcdevice from "./interface/comm/pvcdevice" // 设备
// 系统管理
import operator from "./interface/system/operator" // 操作员管理

const Interface = {
  common,

  desc,
  
  charge,
  source,
  devdate,
  perdate,
  groupdate,
  commdate,

  community,
  group,
  personnel,
  pvcgroup,
  pvcdevice,

  operator,
  
}

//获取验证码
export const getIdentifyCode = ({userName}) => {
  return axios.request({
    url: 'login/identifycode',
    method: 'post',
    data:qs.stringify({userName})
  })
}
// 获取菜单
export const getMuneDate = userName => {
  return axios.request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    url: 'menu/findnavtree',
    method: 'get',
    params: {
      userName: userName
    }
  })
}


export default Interface

//  -------------     custom end ----------------------



export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData, getDragList, uploadImage, getOrgData, getTreeSelectData, getMenuTree, Interface } from './data'
import { getMessageInit, getContentByMsgId, hasRead, removeReaded, restoreTrash, messageCount } from './user'
// import { getIdentifyCode } from './login'
/* eslint-disable */
// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 500
})

// 登录相关和获取用户信息
Mock.mock(/\/login$/, login)
Mock.mock(/\/get_info$/, getUserInfo)
Mock.mock(/\/logout/, logout)
Mock.mock(/\/get_table_data/, getTableData)
Mock.mock(/\/get_drag_list/, getDragList)
Mock.mock(/\/save_error_logger/, 'success')
Mock.mock(/\/image\/upload/, uploadImage)
Mock.mock(/\/message\/init/, getMessageInit)
Mock.mock(/\/message\/content/, getContentByMsgId)
Mock.mock(/\/message\/has_read/, hasRead)
Mock.mock(/\/message\/remove_readed/, removeReaded)
Mock.mock(/\/message\/restore/, restoreTrash)
Mock.mock(/\/message\/count/, messageCount)
Mock.mock(/\/get_org_data/, getOrgData)
Mock.mock(/\/get_tree_select_data/, getTreeSelectData)
Mock.mock(/\/menu\/findMenuTree/, getMenuTree)
Mock.mock(/\/user\/findPage/, Interface.queryUserPageList)


Mock.mock(/\/login\/identifyCode$/, {
  message: '获取成功',
  data: {identifyCode:Mock.Random.integer(1000, 9999)}
})
Mock.mock(/\/api-admin\/login$/, {
  message:"密码错误",
  token:"1151566116"
})

export default Mock

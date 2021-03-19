import { getParams } from '@/libs/util'
const USER_MAP = {
  super_admin: {
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avatar: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avatar: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
}
const userData = {"status":200,"data":{"message":"登录成功","router":[{"path":null,"component":null,"id":78,"name":"内容管理","redirect":null,"leaf":false,"menuShow":true,"parentId":0,"iconCls":"fa fa-th-list","children":[{"path":"/cms/content","component":null,"id":83,"name":"博客管理","redirect":null,"leaf":true,"menuShow":true,"parentId":78,"iconCls":null,"children":[]},{"path":"/cms/file","component":null,"id":81,"name":"文件管理","redirect":null,"leaf":true,"menuShow":true,"parentId":78,"iconCls":null,"children":[{"path":"/file/upload","component":null,"id":87,"name":"上传","redirect":null,"leaf":false,"menuShow":true,"parentId":81,"iconCls":null,"children":[]},{"path":"/api-cms/file","component":null,"id":82,"name":"列表","redirect":null,"leaf":false,"menuShow":true,"parentId":81,"iconCls":null,"children":[]}]}]},{"path":null,"component":null,"id":90,"name":"系统工具","redirect":null,"leaf":false,"menuShow":true,"parentId":0,"iconCls":"fa fa-wrench","children":[]},{"path":null,"component":null,"id":88,"name":"系统监控","redirect":null,"leaf":false,"menuShow":true,"parentId":0,"iconCls":"fa fa-video-camera","children":[{"path":"http://192.168.2.151:10010","component":null,"id":89,"name":"服务注册","redirect":null,"leaf":true,"menuShow":true,"parentId":88,"iconCls":null,"children":[]}]},{"path":null,"component":null,"id":84,"name":"基础信息","redirect":null,"leaf":false,"menuShow":true,"parentId":0,"iconCls":"fa fa-bars","children":[{"path":"/base/log","component":null,"id":85,"name":"系统日志","redirect":null,"leaf":true,"menuShow":true,"parentId":84,"iconCls":null,"children":[{"path":"/api-base/log","component":null,"id":86,"name":"列表","redirect":null,"leaf":false,"menuShow":true,"parentId":85,"iconCls":null,"children":[]}]}]},{"path":null,"component":null,"id":3,"name":"系统管理","redirect":null,"leaf":false,"menuShow":true,"parentId":0,"iconCls":"fa fa-desktop","children":[{"path":"/admin/user","component":null,"id":6,"name":"用户管理","redirect":null,"leaf":true,"menuShow":true,"parentId":3,"iconCls":"fa fa-user","children":[{"path":"/api-admin/user","component":null,"id":14,"name":"删除","redirect":null,"leaf":false,"menuShow":true,"parentId":6,"iconCls":null,"children":[]},{"path":"/api-admin/user","component":null,"id":13,"name":"编辑","redirect":null,"leaf":false,"menuShow":true,"parentId":6,"iconCls":"","children":[]},{"path":"/api-admin/user","component":null,"id":12,"name":"新增","redirect":null,"leaf":false,"menuShow":true,"parentId":6,"iconCls":"","children":[]},{"path":"/api-admin/user/resetPwd","component":null,"id":26,"name":"重置密码","redirect":null,"leaf":false,"menuShow":true,"parentId":6,"iconCls":"","children":[]},{"path":"/api-admin/user/disable","component":null,"id":25,"name":"停用","redirect":null,"leaf":false,"menuShow":true,"parentId":6,"iconCls":null,"children":[]},{"path":"/api-admin/user","component":null,"id":24,"name":"批量删除","redirect":null,"leaf":false,"menuShow":true,"parentId":6,"iconCls":"","children":[]}]},{"path":"/admin/role","component":null,"id":7,"name":"角色管理","redirect":null,"leaf":true,"menuShow":true,"parentId":3,"iconCls":"fa fa-paw","children":[{"path":"/api-admin/role/batchRemove","component":null,"id":62,"name":"批量删除","redirect":null,"leaf":false,"menuShow":true,"parentId":7,"iconCls":null,"children":[]},{"path":"/api-admin/role","component":null,"id":56,"name":"删除","redirect":null,"leaf":false,"menuShow":true,"parentId":7,"iconCls":null,"children":[]},{"path":"/api-admin/role","component":null,"id":55,"name":"编辑","redirect":null,"leaf":false,"menuShow":true,"parentId":7,"iconCls":"","children":[]},{"path":"/api-admin/role","component":null,"id":15,"name":"新增","redirect":null,"leaf":false,"menuShow":true,"parentId":7,"iconCls":"","children":[]}]},{"path":"/admin/menu","component":null,"id":2,"name":"系统菜单","redirect":null,"leaf":true,"menuShow":true,"parentId":3,"iconCls":"fa fa-th-list","children":[{"path":"/api-admin/menu","component":null,"id":77,"name":"列表","redirect":null,"leaf":false,"menuShow":true,"parentId":2,"iconCls":null,"children":[]},{"path":"/api-admin/menu/batchRemove","component":null,"id":61,"name":"批量删除","redirect":null,"leaf":false,"menuShow":true,"parentId":2,"iconCls":null,"children":[]},{"path":"/api-admin/menu","component":null,"id":20,"name":"新增","redirect":null,"leaf":false,"menuShow":true,"parentId":2,"iconCls":"","children":[]},{"path":"/api-admin/menu","component":null,"id":22,"name":"删除","redirect":null,"leaf":false,"menuShow":true,"parentId":2,"iconCls":"","children":[]},{"path":"/api-admin/menu","component":null,"id":21,"name":"编辑","redirect":null,"leaf":false,"menuShow":true,"parentId":2,"iconCls":"","children":[]}]}]}],"perms":["admin:role:batchRemove","admin:role:remove","cms:content","admin:role:edit","admin:menu:list","cms:file","admin:menu:batchRemove","admin:user:remove","admin:menu:add","admin:user:edit","admin:user:add","admin:role:add","admin:user:user","admin:user:resetPwd","admin:user:disable","admin:menu:remove","admin:user:batchRemove","admin:menu:edit","admin:role:role","admin:menu:menu"],"user":{"userId":1,"username":"admin","name":"超级管理员","password":"d0af8fa1272ef5a152d9e27763eea293","deptId":6,"deptName":null,"email":"admin@example.com","mobile":"17699999999","status":1,"userIdCreate":1,"gmtCreate":"2017-08-15","gmtModified":"2017-08-15","roleIds":null,"sex":96,"birth":"2017-12-14","picId":138,"liveAddress":"ccc","hobby":"","province":"北京市","city":"北京市市辖区","district":"东城区"},"token":"this is mock token"}}

export const login = req => {
  // req = JSON.parse(req.body)
  return userData //{ token: USER_MAP[req.userName].token }
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  return USER_MAP[params.token]
}

export const logout = req => {
  return null
}

import Main from '@/components/main'

// 概述
const desc = () => import('@/view/comm/desc/index')

// 系统管理
// 操作员管理
const operator = () => import('@/view/system/operator/index')
const addoperator = () => import('@/view/system/operator/children/add')
const editoperator = () => import('@/view/system/operator/children/edit')
// 角色管理
const role = () => import('@/view/system/role/index')
const addrole = () => import('@/view/system/role/children/add')
const editrole = () => import('@/view/system/role/children/edit')
const permissionrole = () => import('@/view/system/role/children/permission')
// 操作员角色分配
const userrole = () => import('@/view/system/userrole/index')
const assignrolesuserrole = () => import('@/view/system/userrole/children/assignroles')
// 操作日志
const opperlog = () => import('@/view/system/opperlog/index')

// 报表
// 充值明细
const charge = () => import('@/view/report/charge/index')
// 充值明细汇总
const charge_gather = () => import('@/view/report/charge_gather/index')
// 消费明细报表
const source = () => import('@/view/report/source/index')
// 设备按日统计
const devdate = () => import('@/view/report/devdate/index')
// 设备按日期范围统计报表
const devdatescope = () => import('@/view/report/devdatescope/index')
// 人员按日统计
const perdate = () => import('@/view/report/perdate/index')
// 人员按日期范围统计报表
const perdatescope = () => import('@/view/report/perdatescope/index')
// 群组按日统计
const groupdate = () => import('@/view/report/groupdate/index')
// 群组按日期范围统计报表
const groupdatescope = () => import('@/view/report/groupdatescope/index')
// 社区按日统计
const commdate = () => import('@/view/report/commdate/index')
// 社区按日期范围统计报表
const commdatescope = () => import('@/view/report/commdatescope/index')
// 社区管理
// 社区
const community = () => import('@/view/comm/community/index')
const addcommunity = () => import('@/view/comm/community/children/add')
const editcommunity = () => import('@/view/comm/community/children/edit')
// 人员群组
const group = () => import('@/view/comm/group/index')
// 人员
const personnel = () => import('@/view/comm/personnel/index')
// 设备组
const pvcgroup = () => import('@/view/comm/pvcgroup/index')
// 设备
const pvcdevice = () => import('@/view/comm/pvcdevice/index')


import config from '@/config'
const { homeName } = config
const homeRoutePath = '/'+ homeName.replace('_', '/')


/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '',
    redirect: homeRoutePath,
    component: Main,
    meta: {
      notCache: true,
    },
    children: [
        {
          path: 'desc',
          icon: "fa fa-flag",
          name: "desc",
          meta: {
              "icon": "fa fa-flag",
              "title": "概述"
          },
          component: desc
        },
    ]
  },
  /***************开始*/

  {
    path: '/system',
    icon: "logo-buffer",
    name: "system",
    component:Main,
    redirect: '/system/operator',
    meta: {
      icon: "logo-buffer",
      title: "系统管理"
    },
    children: [
      {
        path: 'operator',
        icon: "fa fa-flag",
        name: "system_operator",
        meta: {
            "icon": "fa fa-flag",
            "title": "操作员管理"
        },
        component: operator
      },
      {
        path: 'operator/add',
        icon: "fa fa-flag",
        name: "system_operator_add",
        meta: {
            "icon": "fa fa-flag",
            "title": "操作员管理-新增"
        },
        component: addoperator
      },
      {
        path: 'operator/edit',
        icon: "fa fa-flag",
        name: "system_operator_edit",
        meta: {
            "icon": "fa fa-flag",
            "title": "操作员管理-编辑"
        },
        component: editoperator
      },

      {
        path: 'role',
        icon: "fa fa-flag",
        name: "system_role",
        meta: {
            "icon": "fa fa-flag",
            "title": "角色管理"
        },
        component: role
      },
      {
        path: 'role/add',
        icon: "fa fa-flag",
        name: "system_role_add",
        meta: {
            "icon": "fa fa-flag",
            "title": "角色管理-新增"
        },
        component: addrole
      },
      {
        path: 'role/edit',
        icon: "fa fa-flag",
        name: "system_role_edit",
        meta: {
            "icon": "fa fa-flag",
            "title": "角色管理-编辑"
        },
        component: editrole
      },
      {
        path: 'role/permission',
        icon: "fa fa-flag",
        name: "system_role_permission",
        meta: {
            "icon": "fa fa-flag",
            "title": "角色管理-权限"
        },
        component: permissionrole
      },
      
      {
        path: 'userrole',
        icon: "fa fa-flag",
        name: "system_userrole",
        meta: {
            "icon": "fa fa-flag",
            "title": "操作员管理"
        },
        component: userrole
      },
      {
        path: 'userrole/assignroles',
        icon: "fa fa-flag",
        name: "system_userrole_assignroles",
        meta: {
            "icon": "fa fa-flag",
            "title": "操作员管理-角色分配"
        },
        component: assignrolesuserrole
      },
      {
        path: 'opperlog',
        icon: "fa fa-flag",
        name: "system_opperlog",
        meta: {
            "icon": "fa fa-flag",
            "title": "操作日志"
        },
        component: opperlog
      },
      
    ]
  },

  {
    path: '/forms',
    icon: "logo-buffer",
    name: "forms",
    component:Main,
    redirect: '/forms/charge',
    meta: {
      icon: "logo-buffer",
      title: "消费报表"
    },
    children: [
      {
        path: 'charge',
        icon: "fa fa-th-list",
        name: "forms_charge",
        meta: {
            "icon": "fa fa-th-list",
            "title": "充值明细"
        },
        component: charge
      },
      {
        path: 'charge_gather',
        icon: "fa fa-th-list",
        name: "forms_charge_gather",
        meta: {
            "icon": "fa fa-th-list",
            "title": "充值明细汇总"
        },
        component: charge_gather
      },
      {
        path: 'source',
        icon: "fa fa-th-list",
        name: "forms_source",
        meta: {
            "icon": "fa fa-th-list",
            "title": "消费明细报表"
        },
        component: source
      },
      {
        path: 'dev_date',
        icon: "fa fa-th-list",
        name: "forms_dev_date",
        meta: {
            "icon": "fa fa-th-list",
            "title": "设备按日统计"
        },
        component: devdate
      },
      {
        path: 'dev_datescope',
        icon: "fa fa-th-list",
        name: "forms_dev_datescope",
        meta: {
            "icon": "fa fa-th-list",
            "title": "设备按日期范围统计报表"
        },
        component: devdatescope
      },
      {
        path: 'per_date',
        icon: "fa fa-th-list",
        name: "forms_per_date",
        meta: {
            "icon": "fa fa-th-list",
            "title": "人员按日统计"
        },
        component: perdate
      },
      {
        path: 'per_datescope',
        icon: "fa fa-th-list",
        name: "forms_per_datescope",
        meta: {
            "icon": "fa fa-th-list",
            "title": "人员按日期范围统计报表"
        },
        component: perdatescope
      },
      {
        path: 'group_date',
        icon: "fa fa-th-list",
        name: "forms_group_date",
        meta: {
            "icon": "fa fa-th-list",
            "title": "群组按日统计"
        },
        component: groupdate
      },
      {
        path: 'group_datescope',
        icon: "fa fa-th-list",
        name: "forms_group_datescope",
        meta: {
            "icon": "fa fa-th-list",
            "title": "群组按日期范围统计报表"
        },
        component: groupdatescope
      },
      {
        path: 'comm_date',
        icon: "fa fa-th-list",
        name: "forms_comm_date",
        meta: {
            "icon": "fa fa-th-list",
            "title": "社区按日统计"
        },
        component: commdate
      },
      {
        path: 'comm_datescope',
        icon: "fa fa-th-list",
        name: "forms_comm_datescope",
        meta: {
            "icon": "fa fa-th-list",
            "title": "社区按日期范围统计报表"
        },
        component: commdatescope
      },
      
    ]
  },
  {
    path: '/comm',
    icon: "logo-buffer",
    name: "comm",
    component:Main,
    redirect: '/comm/manager',
    meta: {
      icon: "logo-buffer",
      title: "社区管理"
    },
    children: [
      {
        path: 'manager',
        icon: "fa fa-th-list",
        name: "comm_manager",
        meta: {
            "icon": "fa fa-th-list",
            "title": "社区管理"
        },
        component: community
      },
      {
        path: 'manager/add',
        icon: "fa fa-th-list",
        name: "comm_manager_add",
        meta: {
            "icon": "fa fa-th-list",
            "title": "社区管理-新增"
        },
        component: addcommunity
      },
      {
        path: 'manager/edit',
        icon: "fa fa-th-list",
        name: "comm_manager_edit",
        meta: {
            "icon": "fa fa-th-list",
            "title": "社区管理-编辑"
        },
        component: editcommunity
      },

      {
        path: 'group',
        icon: "fa fa-th-list",
        name: "comm_group",
        meta: {
            "icon": "fa fa-th-list",
            "title": "人员群组"
        },
        component: group
      },

      {
        path: 'personnel',
        icon: "fa fa-th-list",
        name: "comm_personnel",
        meta: {
            "icon": "fa fa-th-list",
            "title": "人员"
        },
        component: personnel
      },

      {
        path: 'pvcgroup',
        icon: "fa fa-th-list",
        name: "comm_pvcgroup",
        meta: {
            "icon": "fa fa-th-list",
            "title": "设备组"
        },
        component: pvcgroup
      },

      {
        path: 'pvcdevice',
        icon: "fa fa-th-list",
        name: "comm_pvcdevice",
        meta: {
            "icon": "fa fa-th-list",
            "title": "设备"
        },
        component: pvcdevice
      },
      
    ]
  },
  


  /******** */
  
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]

  import routers from '@/router/routers'
  
  export default {
    state: {
        editItem: {
            roleId: "",
            roleName: "",
            roleSign: "",
            remark: "",
            roleLevel: "",
            roleType: "",
        },
        roleId: 0,
    },
    getters: {
    //   menuList: (state, getters, rootState) => {
    //     getMenuByRouter(routers, rootState.user.access)
    //   },
    //   errorCount: state => state.errorList.length
    },
    mutations: {
        fillEditItem(state, item){
            Object.keys(state.editItem).forEach(key=>{
                state.editItem[key] = item[key]
            })
        },
        setRoleId(state, id){
            state.roleId = id
        },
    },
    actions: {
        
    }
  }
  
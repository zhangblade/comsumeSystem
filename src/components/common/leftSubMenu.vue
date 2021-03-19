<template>
        
    <Sider hide-trigger class="main_left_submenu" collapsible :width="subMenu.width" :collapsed-width="subMenu.colWidth" v-model="subMenu.collapsed">
        <div v-bind:class="['btn_toggle_sider', {'btn_collapsed': !subMenu.collapsed}]" @click="toggleSubMenu"></div>
        <div class="submenu_wrap">

            <SideMenu class="left_sub_module" accordion ref="side_menu" :active-name="$route.name" @on-select="turnToPage" :menu-list="$store.state.app.mainMenuList"></SideMenu>

            <slot></slot>
        </div>

    </Sider>
    
</template>

<script>

import SideMenu from '@/components/main/components/side-menu'

export default {
    name: 'leftSubMenu',
    components: {
        SideMenu
    },
    data () {
        return {
            
        }
    },
    props: {
        subMenu: {
            type: Object,
            default: () => {}
        },
    },
    created() {
        
    },
    methods: {
        toggleSubMenu(){
            this.$emit('toggleSubMenu')
        },
        turnToPage (route) {
            
            let { name, params, query } = {}
            if (typeof route === 'string') name = route
            else {
                name = route.name
                params = route.params
                query = route.query
            }
            if (name.indexOf('isTurnByHref_') > -1) {
                window.open(name.split('_')[1])
                return
            }
            this.collapsed = false
            this.$router.push({
                name,
                params,
                query
            })
        },
    },
    watch: {
        $route: {
            handler(newRoute) {
                this.$nextTick(() => {
                    if(this.$refs.side_menu && this.$refs.side_menu.updateOpenName){
                        this.$refs.side_menu.updateOpenName(newRoute.name)
                    }
                })
            },
            deep: true,
            immediate: true,
        }
        
    },
    mounted () {
        // 更新侧边栏展开状态 
        this.$nextTick(() => {
			if(this.$refs.side_menu && this.$refs.side_menu.updateOpenName){
				this.$refs.side_menu.updateOpenName(this.$route.name)
			}
        })
    }
}
</script>

<style lang="less" scoped>
</style>


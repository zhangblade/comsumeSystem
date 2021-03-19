<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
            <Content>

                <Tree ref="rolesTree" class="cus_padding" :data="roleList" show-checkbox check-directly check-strictly @on-check-change="checkTree"></Tree>
                
                <div style="padding: 20px 0;">
                    <Button type="primary" @click="handleSubmit()">提交</Button>
                    <Button @click="backPrevPage()" style="margin-left: 20px;">取消</Button>
                </div>

            </Content>
        </div>
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

    import { recursionByFiled } from '@/libs/tools'

	export default {
        name: 'assignRoles',
		data () {
			return {
                roleList: [],
                checkList: [],
                exportTypeKey: 'userView',
			}
        },
		created(){
            this.findRoleByUser()
        },
        computed: {
            roleIds () {
                return this.checkList.map(item => item.roleId).join()
            }
        },
		methods: {
            checkTree(arr){
                this.checkList = arr
            },
            findRoleByUser(){
                var req = this.$route.query
                
                Interface[this.exportTypeKey].findRoleByUser(req).then(res=>{
                    if(res.status == 200){
                        this.roleList = recursionByFiled(recursionByFiled(res.data, 'title', 'roleName'), 'checked', 'uHave')
                    }else{
                        this.roleList = []
                    }
                })
            },
            handleSubmit(){
                var req = { userId: this.$route.query.userId, roleIds: this.roleIds }
                Interface[this.exportTypeKey].toggleUserRole(req).then(res=>{
                    if(res.status == 200){
                        this.$Message.success('角色分配成功!')
                        this.backPrevPage()
                    }else{
                        this.$Message.success('角色分配失败!')
                    }
                })
            },
            backPrevPage(){
                this.$router.replace({ name: this.$route.query.nps.split('|').shift(), params: this.$route.query })
                this.$router.go(-1)
            },
        },
	}
</script>

<style lang="less" scoped>
</style>

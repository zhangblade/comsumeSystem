<template>
        
    <Layout id="role_authority" class="router_view" v-loading="loadingPage">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
            <div class="head_right">
                <Button class="btn" type="default" icon="md-arrow-back" @click="$router.go(-1)">返回</Button>
            </div>
        </div>
        <div class="adapt_wrap">
                        
            <Content>
                <RadioGroup v-model="checkedRole" vertical>
                    <Radio :label="item.value" v-for="(item, index) in roleList" :key="index">{{item.label}}</Radio>
                </RadioGroup>
                <div style="padding-top: 20px;">
                    <Button type="primary" :loading="isSubmitting" @click="handleSubmit">提交</Button>
                    <Button type="default" style="margin-left: 20px;" @click="cancel">取消</Button>
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
                checkedRole: '',
                userId: '',
                
                loadingPage: false,
                isSubmitting: false,
                exportTypeKey: 'userrole',
			}
        },
        created(){
            this.userId = this.$route.query.id
            this.findRoleByUser()
        },
		methods: {
            findRoleByUser(){
                var req = {userId: this.userId}
                this.loadingPage = true
                Interface[this.exportTypeKey].findRoleByUser(req).then(res=>{
                    if(res.status == 200 && res.data){
                        let filedObj = {label: 'roleName', checked: 'uHave', value: 'roleId'}
                        this.roleList = recursionByFiled(res.data, filedObj, 'replaceKey')
                        this.checkedRole = this.roleList.filter(i=>i.checked)[0].value
                    }else{
                        this.roleList = []
                    }
                    this.loadingPage = false
                }).catch(err=>{
                    this.loadingPage = false
                })
            },
            handleSubmit() {
                var req = {
                    userId: this.userId,
                    roleId: this.checkedRole,
                }
                this.isSubmitting = true
                Interface[this.exportTypeKey].saveRole(req).then(res=>{
                    if(res.status == 200){
                        this.$Message.success(res.message)
                        this.$router.go(-1)
                    }
                    this.isSubmitting = false
                }).catch(err=>{
                    this.isSubmitting = false
                })
            },
            cancel() {
                this.$router.go(-1)
            },
        }
	}
</script>

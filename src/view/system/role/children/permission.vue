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

                <div class="permission">

                    <Tree ref="tree" :data="Tbody" show-checkbox check-directly></Tree>
                    
                    <div style="padding-top: 20px;">
                        <Button type="primary" :loading="isSubmitting" @click="handleSubmit">提交</Button>
                        <Button type="default" style="margin-left: 20px;" @click="cancel">取消</Button>
                    </div>
                    
                </div>

            </Content>
        </div>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    import customSwitch from "@/components/common/custom_switch"

	export default {
        name: 'permisssion',
        components: { customSwitch },
		data () {
			return {
                Theader: [
                    { title: '角色', key: 'name', slot: 'name' },
					{ title: '操作', type: 'template', template: 'action', width: 80 },
                ],
                allUserData: [],
                pager: {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                },
                loadingPage: false,
                Tbody:[],
                isSubmitting: false,
                exportTypeKey: 'role',
			}
        },
        created(){
            this.findRoleByUser()
        },
		methods: {
            formatData (arr) {
                var res = []
                res = arr.map(item=>{
                    item.title = item.name
                    item.checked = item.rHave
                    if(item.children && item.children.length){
                        this.formatData(item.children)
                    }
                    return item
                })
                return res                
            },
            findRoleByUser(curPage){
                var req = {roleId: this.$route.query.id}
                this.loadingPage = true
                Interface[this.exportTypeKey].permission_findpage(req).then(res=>{
                    if(res.status == 200){
                        this.Tbody = this.formatData(res.data)
                    }
                    this.loadingPage = false
                }).catch(err=>{
                    this.loadingPage = false
                })
            },
            handleSubmit() {
                var req = this.$refs.tree.getCheckedNodes().map(item=>{
                    var obj = {
                        menuId: item.menuId,
                        parentId: item.parentId,
                        roleId: this.$route.query.id,
                    }
                    return obj
                })
                this.isSubmitting = true
                Interface[this.exportTypeKey].permission_edit(req).then(res=>{
                    if(res.status == 200){
                        this.$Message.success('权限分配成功')
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

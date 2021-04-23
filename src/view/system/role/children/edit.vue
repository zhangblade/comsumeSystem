<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
            <Content>
                <Form ref="itemData" :model="itemData" :label-width="90" :rules="formRules">
                    
                    <FormItem label="角色名称" prop="roleName"><Input v-model="itemData.roleName" placeholder="请输入角色名称" :maxlength="50"></Input></FormItem>

                    <FormItem label="角色标识" prop="roleSign"><Input v-model="itemData.roleSign" placeholder="请输入角色标识" :maxlength="50"></Input></FormItem>

                    <FormItem label="备注" prop="remark"><Input v-model="itemData.remark" placeholder="请输入备注信息" :maxlength="50"></Input></FormItem>

                    <FormItem>
                        <Button type="primary" :loading="isSubmitting" @click="handleSubmit('itemData')">提交</Button>
                        <Button type="default" style="margin-left: 20px;" @click="cancel('itemData')">取消</Button>
                    </FormItem>

                </Form>
            </Content>
        </div>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

	export default {
        name: 'edit',
		data () {
            
			return {
                formRules: {
                    roleName: [
                        { required: true, message: '角色名称不能为空', trigger: 'blur' }
                    ],
                },
                itemData: {
                    roleId: "",
                    roleName: "",
                    roleSign: "",
                    remark: "",
                },
                isSubmitting: false,
                exportTypeKey: 'role',
			}
        },
		created(){
            this.getEditItemData()
        },
		methods: {
            getEditItemData(){

                var req = { roleId: this.$route.query.id }

				Interface[this.exportTypeKey].findById(req).then(res=>{
					if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
					}
				})
            },
            fillForm(beFilledItem, item){
                Object.keys(beFilledItem).forEach(key=>{
                    if (item[key]) {
                        beFilledItem[key] = item[key]
                    }
                })
            },
            handleSubmit(validInfo){

                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        this.isSubmitting = true
                        Interface[this.exportTypeKey].edit(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.$router.go(-1)
                            }
                            this.isSubmitting = false
                        }).catch(err=>{
                            this.isSubmitting = false
                        })
                    }
                })
                
            },
            cancel(validInfo){
                this.handleReset(validInfo)
                this.$router.go(-1)
            },
            handleReset(validInfo) {
                this.$refs[validInfo].resetFields()
            }
        },
	}
</script>

<style lang="less" scoped>
</style>

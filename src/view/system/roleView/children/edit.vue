<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            
            <div class="adapt_wrap">
                <Content>
                    <!-- 增加角色 -->
                    <Form ref="editItem" :model="editItem" :label-width="110" :rules="formRules">

                        <FormItem label="角色名称" prop="roleName"><Input v-model="editItem.roleName" placeholder="请输入角色名称" :maxlength="50"></Input></FormItem>

                        <FormItem label="角色标识" prop="roleSign"><Input v-model="editItem.roleSign" placeholder="请输入角色标识" :maxlength="50"></Input></FormItem>

                        <FormItem label="备注" prop="remark"><Input v-model="editItem.remark" placeholder="请输入备注信息" :maxlength="50"></Input></FormItem>

                        <FormItem label="角色等级" placeholder="请选择" prop="roleLevel">
                            <RadioGroup v-model="editItem.roleLevel">
                                <Radio label="1">管理员角色</Radio>
                                <Radio label="2">普通角色</Radio>
                            </RadioGroup>
                        </FormItem>

                        <FormItem label="角色类型" placeholder="请选择" prop="roleType">
                            <RadioGroup v-model="editItem.roleType">
                                <Radio label="1">通用</Radio>
                                <Radio label="2">定制</Radio>
                            </RadioGroup>
                        </FormItem>
                        
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('editItem')">提交</Button>
                            <Button type="error" @click="backPrevPage()" style="margin-left:20px">取消</Button>
                        </FormItem>
                    </Form>
                </Content>
            </div>
        </Layout>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

	export default {
        name: 'add',
		data () {
            
			return {
                formRules: {
                    roleName: [
                        { required: true, message: '角色名称不能为空', trigger: 'change' }
                    ],
                    roleSign: [
                        { required: true, message: '角色标识不能为空', trigger: 'blur' }
                    ],
                },
                editItem: {
                    roleId: "",
                    roleName: "",
                    roleSign: "",
                    remark: "",
                    roleLevel: "1",
                    roleType: "1",
                },

                exportTypeKey: 'roleView',
			}
        },
		created(){
            this.getEditItemData()
        },
		methods: {
            getEditItemData(){

                var req = {roleId : this.$route.query.id }

				Interface[this.exportTypeKey].findById(req).then(res=>{
					if (res.status == 200) {
                        if(res.data){
                            this.fillForm(this.editItem, res.data)
                        }
					}else{
                        this.$Message.error(res.message)
                    }
				}).catch(err=>{
                    this.$Message.error(err.message)
                })
            },
            fillForm(beFilledItem, item){
                Object.keys(beFilledItem).forEach(key=>{
                    beFilledItem[key] = item[key]
                })
            },
            handleSubmit(validInfo){

                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].edit(this.editItem).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success('更新成功')
                                this.backPrevPage()
                            }else{
                                this.$Message.error(res.message)
                            }
                        })

                    } else {
                        this.$Message.error('更新失败')
                    }
                })
                
            },
            backPrevPage(){
                if(this.$route.query.nps){
                    this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
                }
                this.$router.go(-1)
            },
        },
	}
</script>

<style lang="less" scoped>
</style>

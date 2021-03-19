<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            <div class="adapt_wrap">
                
                <Content>
                    <Form ref="addItem" :model="addItem" :label-width="110" :rules="formRules">
                        
                        <FormItem label="角色名称" prop="roleName"><Input v-model="addItem.roleName" placeholder="请输入角色名称" :maxlength="50"></Input></FormItem>

                        <FormItem label="角色标识" prop="roleSign"><Input v-model="addItem.roleSign" placeholder="请输入角色标识" :maxlength="50"></Input></FormItem>

                        <FormItem label="备注" prop="remark"><Input v-model="addItem.remark" placeholder="请输入备注信息" :maxlength="50"></Input></FormItem>

                        <FormItem label="角色等级" placeholder="请选择" prop="roleLevel">
                            <RadioGroup v-model="addItem.roleLevel">
                                <Radio label="1">管理员角色</Radio>
                                <Radio label="2">普通角色</Radio>
                            </RadioGroup>
                        </FormItem>

                        <FormItem label="角色类型" placeholder="请选择" prop="roleType">
                            <RadioGroup v-model="addItem.roleType">
                                <Radio label="1">通用</Radio>
                                <Radio label="2">定制</Radio>
                            </RadioGroup>
                        </FormItem>
                        
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('addItem')">提交</Button>
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
                        { required: true, message: '公司名不能为空', trigger: 'blur' }
                    ],
                    roleSign: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                },
                addItem: {
                    roleName: '',
                    roleSign: '',
                    remark: '',
                    roleLevel: '1',
                    roleType: '1',
                },
                

                exportTypeKey: 'roleView',
			}
        },
		methods: {
            handleSubmit(validInfo){

                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].add(this.addItem).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success('增加成功')
                                this.$router.go(-1)
                            }else{
                                this.$Message.error(res.message)
                            }
                        }).catch(err=>{
                            var message = err.message || '新增失败'
                            this.$Message.error(message)
                        })

                    } else {
                        this.$Message.error('新增失败')
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

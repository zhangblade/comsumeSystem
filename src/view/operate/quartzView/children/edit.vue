<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            <div class="adapt_wrap">
                
                <Content>
                    <!-- 增加角色 -->
                    <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">

                        <FormItem label="任务名称" prop="jobName"><Input v-model="itemData.jobName" placeholder="请输入任务名称"></Input></FormItem>

                        <FormItem label="任务分组" prop="jobGroup"><Input v-model="itemData.jobGroup" placeholder="请输入任务分组"></Input></FormItem>

                        <FormItem label="调用目标类" prop="beanClass"><Input v-model="itemData.beanClass" placeholder="请输入调用目标类"></Input></FormItem>

                        <FormItem label="执行表达式" prop="cronExpression"><Input v-model="itemData.cronExpression" placeholder="请输入执行表达式"></Input></FormItem>

                        <FormItem label="任务描述" prop="description"><Input v-model="itemData.description" placeholder="请输入任务描述"></Input></FormItem>
                        
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('itemData')">提交</Button>
                            <Button @click="backPrevPage()" style="margin-left:20px">取消</Button>
                        </FormItem>
                        
                    </Form>
                </Content>
            </div>
        </Layout>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    
    import mx_opt from './mixin_opt'

	export default {
        name: 'edit',
        mixins: [ mx_opt ],
		data () {
			return {
                itemData: {
                    id: '',
                    jobName: '',
                    jobGroup: '',
                    beanClass: '',
                    cronExpression: '',
                    description: '',
                },
			}
        },
        created(){
            this.getEditItemData()
        },
        mounted () {
            
        },
		methods: {
            getEditItemData(){
                var req = {id : this.$route.query.id}
                Interface[this.exportTypeKey].findById(req).then(res=>{
                    if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            handleSubmit(validInfo){
                
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].edit(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.backPrevPage()
                            }else{
                                this.$Message.error(res.message)
                            }
                        })
                    }
                })
                
            },
        },
	}
</script>
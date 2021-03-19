<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            <div class="adapt_wrap">
                
                <Content>
                    <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">

                        <FormItem label="任务名称" prop="jobName"><Input v-model="itemData.jobName" placeholder="请输入任务名称"></Input></FormItem>

                        <FormItem label="任务分组" prop="jobGroup"><Input v-model="itemData.jobGroup" placeholder="请输入任务分组"></Input></FormItem>

                        <FormItem label="调用目标类" prop="beanClass"><Input v-model="itemData.beanClass" placeholder="请输入调用目标类"></Input></FormItem>

                        <FormItem label="执行表达式" prop="cronExpression"><Input v-model="itemData.cronExpression" placeholder="请输入执行表达式"></Input></FormItem>

                        <FormItem label="任务描述" prop="description"><Input v-model="itemData.description" placeholder="请输入任务描述"></Input></FormItem>

                        <!-- <FormItem label="任务状态" prop="jobStatus">
                            <Select v-model="itemData.jobStatus">
                                <Option v-for="(item, index) in jobStatusList" :value="item.value" :key="index">{{item.label}}</Option>
                            </Select>
                        </FormItem> -->
                        
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
        name: 'add',
        mixins: [ mx_opt ],
		data () {
			return {
                itemData: {
                    jobName: '',
                    jobGroup: '',
                    beanClass: '',
                    cronExpression: '',
                    description: '',
                },

			}
        },
        created(){
            
        },
        mounted () {
            
        },
		methods: {
            handleSubmit(validInfo){
                
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].add(this.itemData).then(res=>{
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

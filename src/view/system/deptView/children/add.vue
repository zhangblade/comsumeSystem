<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{ $route.meta.title }}</h5>
        </div>
        <div class="adapt_wrap">
            <Content>
                <!-- 增加角色 -->
                <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">
                    
                    <FormItem v-if="$route.query.deptName" label="父级部门"><p>{{ $route.query.deptName }}</p></FormItem>
                    
                    <FormItem label="部门简称" prop="name"><Input v-model="itemData.name" placeholder="请输入部门简称"></Input></FormItem>
                    
                    <FormItem label="部门全称" prop="fullName"><Input v-model="itemData.fullName" placeholder="请输入部门全称"></Input></FormItem>
                    
                    <FormItem label="排序" prop="orderNum"><Input-number class="dblock" v-model="itemData.orderNum" placeholder="请输入排序"></Input-number></FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleSubmit('itemData')">提交</Button>
                        <Button type="default" @click="backPrevPage()" style="margin-left: 20px;">取消</Button>
                    </FormItem>

                </Form>
            </Content>
        </div>
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

	export default {
        name: 'add',
		data () {
            
			return {
                formRules: {
                    fullName: [
                        { required: true, message: '部门全称不能为空', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '部门简称不能为空', trigger: 'blur' }
                    ],
                    orderNum: [
                        { required: true, type: 'number', validator: this.validOrderNum, trigger: 'blur' }
                    ],
                    
                },
                itemData: {
                    fullName: "",
                    name: "",
                    orderNum: null,
                    parentId: "",
                },
                exportTypeKey: 'deptView',
			}
        },
        created(){
            this.itemData.parentId = this.$route.query.parentId
        },
		methods: {
            validOrderNum(rule, value, callback) {
                if(value<= 0 || value > 999999999 || (value+'').indexOf('.') != -1) {
                    callback(new Error('请输入0-999999999的正整数排序值'));
                } else {
                    callback();
                }
            },
            handleSubmit(validInfo){

                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].add(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success('增加成功')
                                this.backPrevPage()
                            }else{
                                this.$Message.error(res.message)
                            }
                        }).catch(err=>{
                            var msg = err.message || '新增失败'
                            this.$Message.error(msg)
                        })

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
    .dblock{
        display: block;
        width: 100%;
    }
</style>

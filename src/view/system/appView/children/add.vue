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
                        
                        <FormItem label="appId" prop="appId"><Input v-model="itemData.appId" placeholder="请输入appId"></Input></FormItem>

                        <FormItem label="服务名称" prop="appName"><Input v-model="itemData.appName" placeholder="请输入服务名称"></Input></FormItem>

                        <FormItem label="服务代码" prop="productCode"><Input v-model="itemData.productCode" placeholder="请输入服务代码"></Input></FormItem>

                        <FormItem label="默认角色" prop="deftRoleid">
                            <Select v-model="itemData.deftRoleid" label-in-value>
                                <Option v-for="item in rolesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="排序" prop="orderNum"><Input-number class="dblock" :min="0" v-model="itemData.orderNum" placeholder="请输入序号"></Input-number></FormItem>
                        
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('itemData')">提交</Button>
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
                    appId: [
                        { required: true, message: 'appId不能为空', trigger: 'blur' }
                    ],
                    appName: [
                        { required: true, message: '服务名称不能为空', trigger: 'blur' }
                    ],
                    productCode: [
                        { required: true, message: '服务代码不能为空', trigger: 'blur' }
                    ],
                    deftRoleid: [
                        { required: true, type: 'number', message: '默认角色不能为空', trigger: 'change' }
                    ],
                    orderNum: [
                        { required: true, type: 'number', validator: this.validOrderNum, trigger: 'blur' }
                    ],
                },
                itemData: {
                    appId: '',
                    appName: '',
                    productCode: '',
                    deftRoleid: null,
                    orderNum: null,
                },
                precision: 0,
                rolesList: [],

                exportTypeKey: 'appView',
			}
        },
        created(){
            this.getAppRole()
        },
		methods: {
            validOrderNum(rule, value, callback) {
                if(value<= 0 || value > 999999999 || (value+'').indexOf('.') != -1) {
                    callback(new Error('请输入0-999999999的正整数排序值'));
                } else {
                    callback();
                }
            },
            getAppRole(){
                var req = { appId: '' }
                Interface[this.exportTypeKey].getAppRole(req).then(res=>{
                    if(res.status == 200){
                        this.rolesList = res.data.children.map(i=>{
                            i.value = Number(i.id)
                            i.label = i.text
                            return i
                        })
                    }else{
                        this.$Message.error(res.message)
                    }
                })
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
    .dblock{
        width: 100%;
    }
</style>

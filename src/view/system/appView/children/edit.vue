<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            
            <div class="adapt_wrap">
                <Content>
                    <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">
                        
                        <FormItem label="appId" prop="appId"><Input v-model="itemData.appId" placeholder="请输入appId" disabled /></FormItem>

                        <FormItem label="服务名称" prop="appName"><Input v-model="itemData.appName" placeholder="请输入服务名称" /></FormItem>

                        <FormItem label="服务代码" prop="productCode"><Input v-model="itemData.productCode" placeholder="请输入服务代码" /></FormItem>

                        <FormItem label="排序" prop="orderNum"><Input-number class="dblock" :min="0" v-model="itemData.orderNum" placeholder="请输入序号"></Input-number></FormItem>

                        <FormItem label="服务状态" prop="status">
                            <RadioGroup v-model="itemData.status"><Radio :label="0">禁用</Radio><Radio :label="1">启用</Radio></RadioGroup>
                        </FormItem>
                        
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
        name: 'edit',
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
                    orderNum: [
                        { required: true, type: 'number', validator: this.validOrderNum, trigger: 'blur' }
                    ],
                },
                itemData: {
                    appId: '',
                    appName: '',
                    productCode: '',
                    status: null,
                    orderNum: null,
                },
                precision: 0,
                exportTypeKey: 'appView',
			}
        },
		created(){
            this.getitemDataData()
        },
		methods: {
            validOrderNum(rule, value, callback) {
                if(value<= 0 || value > 999999999 || (value+'').indexOf('.') != -1) {
                    callback(new Error('请输入0-999999999的正整数排序值'));
                } else {
                    callback();
                }
            },
            getitemDataData(){

                var req = this.$route.query

				Interface[this.exportTypeKey].findById(req).then(res=>{
					if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
                        this.itemData.status = Number(res.data.status)
					}else{
                        this.$Message.error(res.message)
                    }
				}).catch(err=>{
                    this.$Message.error(err.message)
                })
            },
            fillForm(beFilledItem, item){
                Object.keys(beFilledItem).forEach(key=>{
                    if(beFilledItem.hasOwnProperty(key) && item.hasOwnProperty(key)){
                        beFilledItem[key] = item[key]
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

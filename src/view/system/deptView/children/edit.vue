<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
            <Content>
                <!-- 增加角色 -->
                <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">
                    
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
        name: 'edit',
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
                    deptId: '',
                    fullName: "",
                    name: "",
                    orderNum: null,
                    parentId: "",
                },
                exportTypeKey: 'deptView',
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

                var req = { id: this.$route.query.id }

				Interface[this.exportTypeKey].findById(req).then(res=>{
					if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
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
                        var req = JSON.parse(JSON.stringify(this.itemData))
                        Interface[this.exportTypeKey].edit(req).then(res=>{
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
        display: block;
        width: 100%;
    }
</style>
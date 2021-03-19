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

                        <FormItem label="公司全称" prop="bName"><Input v-model="itemData.bName" placeholder="请输入公司全称" :maxlength="50"></Input></FormItem>

                        <FormItem label="公司简称" prop="bChsshortname"><Input v-model="itemData.bChsshortname" placeholder="请输入公司简称"></Input></FormItem>

                        <FormItem label="归属" placeholder="请选择" prop="belongto">
                            <Select v-model="itemData.belongto"><Option value="1">企业</Option><Option value="2">党政机关</Option></Select>
                        </FormItem>

                        <FormItem label="公司性质" placeholder="请选择" prop="bTenemattrib">
                            <Select v-model="itemData.bTenemattrib"><Option value="1">非集团公司</Option><Option value="2">集团公司</Option></Select>
                        </FormItem>
                        
                        <FormItem label="联系电话" prop="bTel"><Input v-model="itemData.bTel" placeholder="请输入联系电话" :maxlength="11"></Input></FormItem>

                        <FormItem label="省市区" prop="barea"><Cascader placeholder="请选择省市区" :data="addressList" v-model="itemData.barea"></Cascader></FormItem>

                        <FormItem label="详细地址" prop="bAddress"><Input v-model="itemData.bAddress" placeholder="请输入公司详细地址"></Input></FormItem>
                        
                        <FormItem label="备注" prop="bRemark"><Input v-model="itemData.bRemark" placeholder="请输入备注信息"></Input></FormItem>
                        
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
    import addr from '@/components/common/region'

	export default {
        name: 'add',
		data () {
            
			return {
                formRules: {
                    bName: [
                        { required: true, message: '公司全称不能为空', trigger: 'blur' }
                    ],
                    bChsshortname: [
                        { required: true, message: '公司简称不能为空', trigger: 'blur' }
                    ],
                    bTel: [
                        { required: true, message: '联系电话不能为空', trigger: 'blur' }
                    ],
                    barea: [
                        { required: true, type: 'array', message: '所在地区不能为空', trigger: 'blur' },
                    ],
                },
                addressList: [],
                itemData: {
                    bName: '',
                    bChsshortname: '',
                    bProvince: '',
                    bCity: '',
                    bDistrict: '',
                    bAddress: '',
                    bTel: '',
                    bRemark: '',
                    belongto: '1',
                    bTenemattrib: '1',
                    barea: [],
                },
                exportTypeKey: 'customerView',

			}
        },
        created(){
            setTimeout(()=>{
                this.addressList = addr.data
            },500)
        },
		methods: {
            handleSubmit(validInfo){
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        if(!this.itemData.bProvince){
                            this.$Message.info('请选择所在地')
                            return
                        }
                        Interface[this.exportTypeKey].add(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.backPrevPage()
                            }else{
                                this.$Message.error(res.message)
                            }
                        }).catch(err=>{
                            this.$Message.error(err.message)
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
        watch: {
            "itemData.barea" : {
                handler(area){
                    this.itemData.bProvince = area.length ? area[0] : ''
                    this.itemData.bCity = area.length ? area[1] : ''
                    this.itemData.bDistrict = area.length ? area[2] : ''
                },
                immediate: true,
            }
        },
	}
</script>

<style lang="less" scoped>
</style>

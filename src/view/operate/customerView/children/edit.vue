<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            <div class="adapt_wrap">
                
                <Content>
                    <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">

                        <FormItem label="公司全称" prop="bName"><Input v-model="itemData.bName" placeholder="请输入公司全称" :maxlength="50"></Input></FormItem>

                        <FormItem label="公司简称" prop="bChsshortname"><Input v-model="itemData.bChsshortname" placeholder="请输入公司简称"></Input></FormItem>

                        <FormItem label="归属" placeholder="请选择" prop="belongto">
                            <Select v-model="itemData.belongto"><Option value="1">企业</Option><Option value="2">党政机关</Option></Select>
                        </FormItem>

                        <FormItem label="公司性质" placeholder="请选择" prop="bTenemattrib">
                            <Select v-model="itemData.bTenemattrib"><Option value="1">非集团公司</Option><Option value="2">集团公司</Option></Select>
                        </FormItem>
                        
                        <FormItem label="联系电话" prop="bTel"><Input v-model="itemData.bTel" placeholder="请输入联系电话"></Input></FormItem>

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
        name: 'edit',
		data () {
            const mobileValid =  (rule, value, callback)=> {
                    if (!/^(13|14|15|17|18)\d{9}$/.test(value)) {
                        callback(new Error('请输入11位手机号码'));
                    } else {
                        callback();
                    }
                }
            
			return {
                formRules: {
                    bName: [
                        { required: true, message: '公司全称不能为空', trigger: 'blur' }
                    ],
                    bChsshortname: [
                        { required: true, message: '公司简称不能为空', trigger: 'blur' }
                    ],
                    belongto: [
                        { required: true, message: '公司归属不能为空', trigger: 'change' }
                    ],
                    bTenemattrib: [
                        { required: true, message: '公司性质不能为空', trigger: 'change' }
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
                    bTenementid: '',
                    bName: '',
                    bChsshortname: '',
                    bProvince: '',
                    bCity: '',
                    bDistrict: '',
                    bAddress: '',
                    bTel: '',
                    bRemark: '',
                    belongto: '',
                    bTenemattrib: '',
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
		mounted(){
            this.getItemData()
        },
		methods: {
            getItemData(){
                var req = { tenementId: this.$route.query.bTenementid }
				Interface[this.exportTypeKey].findById(req).then(res=>{
					if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
                        
                        if(this.itemData.bProvince){
                            this.itemData.barea.push(this.itemData.bProvince)
                            this.itemData.barea.push(this.itemData.bCity)
                            this.itemData.barea.push(this.itemData.bDistrict)
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
                    if(beFilledItem.hasOwnProperty(key) && item.hasOwnProperty(key)){
                        beFilledItem[key] = item[key]
                    }
                })
            },
            handleSubmit (validInfo) {
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].edit(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.backPrevPage()
                            }else {
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
            },
        },
	}
</script>

<style lang="less" scoped>
</style>

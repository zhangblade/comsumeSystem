<template>
        
    <Layout id="tenementmanage" class="router_view">

        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
        </div>

        <Content style="padding-left: 10px;">
            <Form ref="tenementItem" :model="tenementItem" :label-width="110" :rules="formRules" style="max-width:1200px;">
                <h6>公司信息</h6>
                <FormItem class="companyInfo" label="公司全称：" prop="bName">
                    <Input v-show="isEdit" v-model="tenementItem.bName" placeholder="请输入公司全称" :maxlength="50"></Input>
                    <p v-show="!isEdit">{{ tenementItem.bName }}</p>
                </FormItem>
                <FormItem class="companyInfo" label="公司简称：" prop="bChsshortname">
                    <Input v-show="isEdit" v-model="tenementItem.bChsshortname" placeholder="请输入公司简称"></Input>
                    <p v-show="!isEdit">{{ tenementItem.bChsshortname }}</p>
                </FormItem>
                <FormItem class="companyInfo" label="英文简码：" prop="bTenemcode">
                    <Input v-show="isEdit" v-model="tenementItem.bTenemcode" placeholder="请输入英文简码"></Input>
                    <p v-show="!isEdit">{{ tenementItem.bTenemcode }}</p>
                </FormItem>

                <h6>联系信息</h6>
                <FormItem class="companyInfo" label="所在地：" prop="bDistrict">
                    <Input v-model="tenementItem.bDistrict" style="display:none;"></Input>
                    <Cascader v-show="isEdit" placeholder="请选择所在地" :data="address.data" v-model="address.curAddr" @on-change="getVal"></Cascader>
                    <p v-show="!isEdit"><span v-show="tenementItem.bProvince">{{ (tenementItem.bProvince || '') + " / " + (tenementItem.bCity || '') + " / " + (tenementItem.bDistrict || '') }}</span></p>
                </FormItem>
                <FormItem class="companyInfo" label="详细地址：" prop="bAddress">
                    <Input v-show="isEdit" v-model="tenementItem.bAddress" placeholder="请输入公司详细地址"></Input>
                    <p v-show="!isEdit">{{ tenementItem.bAddress }}</p>
                </FormItem>
                <FormItem class="companyInfo" label="联系电话：" prop="bTel">
                    <Input v-show="isEdit" v-model="tenementItem.bTel" placeholder="请输入联系电话" :maxlength="11"></Input>
                    <p v-show="!isEdit">{{ tenementItem.bTel }}</p>
                </FormItem>
                <FormItem class="companyInfo">
                    <Button v-show="isEdit" type="primary" @click="handleSubmit('tenementItem')">保存</Button>
                    <Button v-show="isEdit" type="default" @click="cancel()" style="margin-left:20px;">取消</Button>
                    <Button v-show="!isEdit" type="primary" @click="fnEdit()">编辑</Button>
                </FormItem>
            </Form>
        </Content>
        
    </Layout>
    
</template>

<script>

    import addr from '@/components/common/provinces'
    import Interface from '@/api/data'
    import qs from 'qs'
    import { setTimeout } from 'timers'

	export default {
		data () {

			return {
                formRules: {
                    bName: [
                        { required: true, message: '公司全称不能为空', trigger: 'blur' }
                    ],
                    bChsshortname: [
                        { required: true, message: '公司简称不能为空', trigger: 'blur' }
                    ],
                },
                address:{
                    data: [],
                    curAddr:[],
                },
                tenementItem: {
                    bTenementid: '',
                    bName: '',
                    bChsshortname: '',
                    bTenemcode: '',
                    bProvince: '',
                    bCity: '',
                    bDistrict: '',
                    bAddress: '',
                    bTel: '',
                    bRemark: '',
                    bTenemtype: '',
                    belongto: '',
                    bTenemattrib: '',
                },
                isEdit: false,
                cacheData: null,
                exportTypeKey: 'customerView'
			}
        },
        created(){
            setTimeout(()=>{
                this.address.data = addr.data
            },300)
        },
		mounted(){
            this.getPageListData()
        },
		methods: {
            fillForm(beFilledItem, item){
                Object.keys(beFilledItem).forEach(key=>{
                    beFilledItem[key] = item[key]
                })
            },
            getVal(val ){
                this.address.curAddr = val
                this.setAreaList(val)
            },
            setAreaList(areaList){
                this.tenementItem.bProvince = areaList[0]
                this.tenementItem.bCity = areaList[1]
                this.tenementItem.bDistrict = areaList[2]
            },
            setAreaData(areaData){
                this.address.curAddr.push(areaData.bProvince)
                this.address.curAddr.push(areaData.bCity)
                this.address.curAddr.push(areaData.bDistrict)
            },
			getPageListData(){
				Interface[this.exportTypeKey].findById().then(res=>{
					if (res.status == 200) {
                        this.fillForm(this.tenementItem, res.data)
                        this.setAreaData(this.tenementItem)
					}else{
                        this.$Message.error(res.message)
                    }
				})
            },
            handleSubmit (validInfo) {
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].edit(this.tenementItem).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success('更新成功!')
                                this.isEdit = false
                            }else{
                                this.$Message.error("更新失败")
                            }
                        }).catch(err=>{
                            this.$Message.error(err.message)
                        })
                    } else {
                        this.$Message.error('Fail!')
                    }
                })
            },
            fnEdit(){
                this.isEdit = true
                this.cacheData = JSON.parse(JSON.stringify(this.tenementItem))
            },
            cancel(){
                this.isEdit = false
                this.tenementItem = this.cacheData
                this.setAreaData(this.tenementItem)
            }
        },
        watch: {
            'address.curAddr': {
                handler(newVal){ this.setAreaList(newVal) },
                deep: true,
                immediate: true
            }
        }
	}
</script>

<style lang="less" scoped>
    h6{
        font-size: 14px;
        line-height: 34px;
        font-weight: 500;
    }
    .companyInfo{
        margin-left: 15px;
        max-width: 700px;
        height: 32px;
    }
    p{
        text-indent: 7px;
        vertical-align: top;
        line-height: 32px;
    }
</style>




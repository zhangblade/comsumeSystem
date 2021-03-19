<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
                    
            <Content>
                <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">
                    
                    <FormItem label="人员编号"><Input v-model="bPerno" disabled></Input></FormItem>
                    
                    <FormItem label="人员名称"><Input v-model="bPername" disabled></Input></FormItem>
                    
                    <FormItem label="群组" prop="bGroupid"><Input v-model="bGroupName" disabled></Input></FormItem>
                    
                    <FormItem label="卡类型">
                        <Input v-model="bCardtypeName" placeholder="请选择卡类型" disabled></Input>
                    </FormItem>

                    <FormItem label="卡号" prop="bCardno"><Input v-model="itemData.bCardno" placeholder="请输入卡号" disabled></Input></FormItem>
                    
                    <FormItem label="发行日期" prop="publishTime">
                        <Input v-model="publishTime" placeholder="请输入发行日期" disabled></Input>
                    </FormItem>

                    <FormItem label="卡种类">
                        <Input v-model="bIsidicName" placeholder="请选择卡种类" disabled></Input>
                    </FormItem>

                    <FormItem label="押金">
                        <Input disabled v-model="itemData.bDeposit" placeholder="请选择押金"></Input>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" :loading="isSubmitting" @click="handleSubmit('itemData')">提交</Button>
                        <Button type="default" @click="backList()" style="margin-left: 20px;">取消</Button>
                    </FormItem>

                </Form>
            </Content>
        </div>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    import { validCondition } from '@/components/common/util'
    import { recursionByFiled } from '@/libs/tools'

	export default {
        name: 'losecard',
		data () {
			return {
                formRules: {
                    
                },
                bPerno: "",
                bPername: "",
                bGroupName: "",
                publishTime: '',
                bIsidicName: "",
                bCardtypeName: '',
                itemData: {
                    bCommid: this.$store.state.app.bCommid,
                    bPerid: "",
                    bCardno: "",
                    bCardtype: "", // 卡类型 0: c 1: 临时卡
                    bIsidic: "", // 卡片种类 D: ID卡 C: IC卡
                    bDeposit: "",
                },
                
                isSubmitting: false,
                exportTypeKey: 'personView',
			}
        },
        created() {
            this.getData()
        },
		methods: {
            getData(){
                var req = { bPerid: this.$route.query.bPerid, bCommid: this.$store.state.app.bCommid }
                Interface[this.exportTypeKey].losecard_findById(req).then(res=>{
                    if (res.status == 200) {
                        Object.keys(this.itemData).forEach(key=>{
                            if(res.data[key]){
                                this.itemData[key] = res.data[key]
                            }
                        })
                        this.bPerno = res.data.bPerno
                        this.bPername = res.data.bPername
                        this.bGroupName = res.data.bGroupName
                        this.bIsidicName = res.data.bIsidicName
                        this.bCardtypeName = res.data.bCardtypeName
                        this.publishTime = res.data.bBegintime.split(' ')[0] + '  ~  ' + res.data.bEndtime.split(' ')[0]
                    }
                })
            },
            handleSubmit(validInfo){
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        var req = { bPerid: this.$route.query.bPerid, bCommid: this.$store.state.app.bCommid }
                        this.isSubmitting = true
                        Interface[this.exportTypeKey].losecard_submit(req).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.backList()
                            }
                            this.isSubmitting = false
                        }).catch(err=>{
                            this.isSubmitting = false
                        })
                    }
                })
                
            },
            backList(id){
                let listPage = this.$route.name.substring(0, this.$route.name.lastIndexOf('_'))
                let query = {}
                if(id || this.$route.query.groupId) query.groupId = id || this.$route.query.groupId
                this.$router.replace({ name: listPage, query: query })
            },
            handleReset(validInfo) {
                this.$refs[validInfo].resetFields()
            },
        },
	}
</script>

<style lang="less" scoped>
</style>

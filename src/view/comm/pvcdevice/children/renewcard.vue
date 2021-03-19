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

                    <FormItem label="卡号" prop="bCardno"><Input v-model="itemData.bCardno" placeholder="请输入卡号" :maxlength="8" disabled></Input></FormItem>
                    
                    <FormItem label="发行开始日期" prop="bBegintime">
                        <DatePicker type="date" placeholder="请输入发行开始日期" :value="itemData.bBegintime" @on-change="itemData.bBegintime=$event"></DatePicker>
                    </FormItem>
                    
                    <FormItem label="发行结束日期" prop="bEndtime">
                        <DatePicker type="date" placeholder="请输入发行结束日期" :value="itemData.bEndtime" @on-change="itemData.bEndtime=$event"></DatePicker>
                    </FormItem>

                    <FormItem label="卡种类">
                        <Input v-model="bIsidicName" placeholder="请选择卡种类" disabled></Input>
                    </FormItem>

                    <FormItem label="押金" prop="bDeposit">
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

	export default {
		data () {
            const validatebCardno = (rule, value, callback) => {
                if (!value || value.length !== 8) {
                    return callback(new Error('请输入8位卡号'));
                }else{
                    if(!/^[0-9A-F]{8}$/.test(value)) return callback(new Error('请输入8位16进制卡号(0-9A-F)'))
                    else callback()
                }
            };
			return {
                formRules: {
                    
                    bPerno: [{ required: true, message: '人员编号不能为空', trigger: 'blur' }],
                    bPername: [{ required: true, message: '人员名称不能为空', trigger: 'blur' }],
                    bGroupName: [{ required: true, message: '群组不能为空', trigger: 'blur' }],
                    bCardno: [
                        { required: true, message: '卡号不能为空', trigger: 'blur' },
                        { validator: validatebCardno, trigger: 'blur' }
                    ],
                    bBegintime: [{ required: true, message: '发行开始日期不能为空', trigger: 'blur', pattern: /.+/ }],
                    bEndtime: [{ required: true, message: '发行结束日期不能为空', trigger: 'blur', pattern: /.+/ }],
                    bCardtype: [{ required: true, message: '卡类型不能为空', trigger: 'blur' }],
                    bIsidic: [{ required: true, message: '卡种类不能为空', trigger: 'blur' }],
                    
                },
                bPerno: "",
                bPername: "",
                bGroupName: "",
                bIsidicName: "",
                bCardtypeName: '',
                itemData: {
                    bCommid: this.$store.state.app.bCommid,
                    bBegintime: '',
                    bEndtime: '',
                    bPerid: "",
                    bCardno: "",
                    bCardtype: "", // 卡类型 0: c 1: 临时卡
                    bIsidic: "", // 卡片种类 D: ID卡 C: IC卡
                    bDeposit: null,
                },
                
                isSubmitting: false,
                exportTypeKey: 'personView',

			}
        },
        created() {
            this.getData()
        },
        computed: {
            baseParams () {
                return { bCommid: this.$store.state.app.bCommid }
            },
        },
		methods: {
            getData(){
                var req = { bPerid: this.$route.query.bPerid, bCommid: this.$store.state.app.bCommid }
                Interface[this.exportTypeKey].renewcard_findById(req).then(res=>{
                    if (res.status == 200 && res.data) {
                        Object.keys(this.itemData).forEach(key=>{
                            if(res.data.hasOwnProperty(key) && this.itemData.hasOwnProperty(key) && res.data[key]){
                                this.itemData[key] = res.data[key]
                            }
                        })
                        this.bPerno = res.data.bPerno
                        this.bPername = res.data.bPername
                        this.bGroupName = res.data.bGroupName
                        this.bIsidicName = res.data.bIsidicName
                        this.bCardtypeName = res.data.bCardtypeName
                    }
                })
            },
            validDateRange(){
                let s = new Date(this.itemData.bBegintime).getTime(),
                    e = new Date(this.itemData.bEndtime).getTime()
                return e >= s
            },
            handleSubmit(validInfo){
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        if(!this.validDateRange()){
                            this.$Message.info('结束日期不能早于开始日期')
                            return
                        }
                        var req = this.itemData
                        req.bBegintime = this.itemData.bBegintime.split(' 00:00:00')[0] + ' 00:00:00'
                        req.bEndtime = this.itemData.bEndtime.split(' 00:00:00')[0] + ' 00:00:00'
                        this.isSubmitting = true
                        Interface[this.exportTypeKey].renewcard_submit(req).then(res=>{
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

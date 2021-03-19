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
                    
                    <FormItem label="卡类型" prop="bCardtype">
                        <Select v-model="itemData.bCardtype" placeholder="请选择卡类型">
                            <Option v-for="item in perCardType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="卡号" prop="bCardno"><Input v-model="itemData.bCardno" placeholder="请输入卡号" :maxlength="8"></Input></FormItem>
                    
                    <FormItem label="发行开始日期" prop="bBegintime"><DatePicker type="date" placeholder="请输入发行开始日期" :value="itemData.bBegintime" @on-change="itemData.bBegintime=$event"></DatePicker></FormItem>
                    
                    <FormItem label="发行结束日期" prop="bEndtime"><DatePicker type="date" placeholder="请输入发行结束日期" :value="itemData.bEndtime" @on-change="itemData.bEndtime=$event"></DatePicker></FormItem>

                    <FormItem label="卡种类" prop="bIsidic">
                        <Select v-model="itemData.bIsidic" placeholder="请选择卡种类" prop="bIsidic">
                            <Option v-for="item in cardKind" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="押金" prop="bDeposit">
                        <Input disabled v-model="itemData.bDeposit" placeholder="请选择押金">
                            <Button slot="append" @click="fnShowDrawer()">选择押金</Button>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" :loading="isSubmitting" @click="handleSubmit('itemData')">提交</Button>
                        <Button type="default" @click="backList()" style="margin-left: 20px;">取消</Button>
                    </FormItem>

                </Form>
            </Content>
        </div>

        <Drawer :width="375" :transfer="false" :inner="true" :title="'押金列表'" v-model="showDrawer">
            <div class="table_box" v-if="pageListData.length">
                <Table ref="selection" :data="pageListData" :columns="tableHeader">
                    <template slot-scope="{ row }" slot="action">
                        <span class="btn_action" @click="chooseItem(row)">选择</span>
                    </template>
                </Table>
                <div class="pager_box" v-show="pager.totalPages>1">
                    <Page size="small" show-total show-elevator :page-size="pager.pageSize" @on-page-size-change="changePageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
                </div>
            </div>
            <p class="nodata_tip" v-else><span class="">暂无卡押金，是否前往</span><span class="btn" @click="routeToAddCardPledge()">添加卡押金</span></p>
        </Drawer>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

    import pageList from '@/mixin/pageList'

	export default {
        mixins: [ pageList ],
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
                    bCardtype: "", // 卡类型
                    bIsidic: "", // 卡片种类
                    bDeposit: null,
                },
                perCardType: [],
                cardKind: [],
                
                showDrawer: false,

                tableHeader: [
                    { title: '名称', key: 'bDepname' },
                    { title: '金额', key: 'bDeposit' },
                    { title: '操作', key: 'action', width: 60, slot: 'action' },
                ],

                isSubmitting: false,

                exportTypeKey: 'personView',

			}
        },
        created() {
            this.getCardKind()
            this.getData()
        },
        computed: {
            baseParams () {
                return { bCommid: this.$store.state.app.bCommid }
            },
        },
		methods: {
            getCardKind(){
                var req = { bCommid: this.$store.state.app.bCommid }
                Interface[this.exportTypeKey].getCardKind(req).then(res=>{
                    if (res.status == 200 && res.data) {
                        this.cardKind = res.data.cardKind.map(i=>{
                            return {value: i.value, label: i.description}
                        })
                        if(this.cardKind.length){
                            this.itemData.bIsidic = this.cardKind[0].value
                        }
                        this.perCardType = res.data.perCardType.map(i=>{
                            return {value: i.value, label: i.description}
                        })
                        if(this.perCardType.length){
                            this.itemData.bCardtype = this.perCardType[0].value
                        }
                    }
                })
            },
            getData(){
                var req = { bPerid: this.$route.query.bPerid, bCommid: this.$store.state.app.bCommid }
                Interface[this.exportTypeKey].publishcard_findById(req).then(res=>{
                    if (res.status == 200 && res.data) {
                        Object.keys(this.itemData).forEach(key=>{
                            if(res.data.hasOwnProperty(key) && this.itemData.hasOwnProperty(key) && res.data[key]){
                                this.itemData[key] = res.data[key]
                            }
                        })
                        this.bPerno = res.data.bPerno
                        this.bPername = res.data.bPername
                        this.bGroupName = res.data.bGroupName
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
                        Interface[this.exportTypeKey].publishcard_submit(req).then(res=>{
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
            fnShowDrawer() {
                this.showDrawer = true
            },
            /** 获取群组列表 */
            getPageListData(req){
                Interface[this.exportTypeKey].depositList(req).then(res=>{
                    if (res.status == 200) {
                        this.loadData(res)
                    }else{
                        this.pageListData = []
                    }
                })
            },
            chooseItem(item) {
                this.itemData.bDeposit = item.bDeposit
                this.showDrawer = false
            },
            routeToAddCardPledge(){
                this.$router.push({name: 'community_cardPledgePage_add'})
            },
        },
	}
</script>

<style lang="less" scoped>
    .nodata_tip{
        line-height: 32px;
        text-align: center;
        span{
            vertical-align: middle;
            &.btn{
                text-decoration: underline;
                color: #0099cc;
                padding: 0 2px;
                cursor: pointer;
            }
        }
    }
</style>

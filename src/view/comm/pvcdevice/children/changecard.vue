<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
                    
            <Content>
                <!-- 增加角色 -->
                <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">
                    
                    <FormItem label="人员编号" prop="bPerno"><Input v-model="itemData.bPerno" disabled></Input></FormItem>
                    
                    <FormItem label="人员名称" prop="bPername"><Input v-model="itemData.bPername" disabled></Input></FormItem>
                    
                    <FormItem label="群组" prop="bGroupName"><Input v-model="itemData.bGroupName" disabled></Input></FormItem>
                    
                    <FormItem label="卡类型" prop="bCardtype">
                        <Select v-model="itemData.bCardtype" placeholder="请选择卡类型">
                            <Option v-for="item in perCardType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="原卡号" prop="bCardno"><Input v-model="itemData.bCardno" placeholder="请输入卡号" disabled></Input></FormItem>

                    <FormItem label="新卡号" prop="newCardNo"><Input v-model="itemData.newCardNo" placeholder="请输入卡号" :maxlength="8"></Input></FormItem>
                    
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
                    bCardno: [{ required: true, message: '卡号不能为空', trigger: 'blur' } ],
                    newCardNo: [
                        { required: true, message: '新卡号不能为空', trigger: 'blur' },
                        { validator: validatebCardno, trigger: 'blur' }
                    ],
                    bBegintime: [{ required: true, message: '发行开始日期不能为空', trigger: 'change' } ],
                    bEndtime: [{ required: true, message: '发行结束日期不能为空', trigger: 'change' } ],
                    bPerno: [{ required: true, message: '人员编号不能为空', trigger: 'blur' } ],
                    bPername: [{ required: true, message: '人员名称不能为空', trigger: 'blur' } ],
                    bGroupName: [{ required: true, message: '群组不能为空', trigger: 'blur' } ],
                    bCardtype: [{ required: true, message: '卡类型不能为空', trigger: 'change' } ],
                    bIsidic: [{ required: true, message: '卡种类不能为空', trigger: 'change' } ],
                },

                itemData: {
                    bCommid: this.$store.state.app.bCommid,
                    bPerno: "",
                    bPername: "",
                    bGroupName: "",
                    bPerid: "",
                    bCardno: "",
                    newCardNo: "",
                    bBegintime: '',
                    bEndtime: '',
                    bCardtype: "0", // 卡类型
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
                        this.perCardType = res.data.perCardType.map(i=>{
                            return {value: i.value, label: i.description}
                        })
                    }
                })
            },
            getData(){
                var req = { bPerid: this.$route.query.bPerid, bCommid: this.$store.state.app.bCommid }
                Interface[this.exportTypeKey].changecard_findById(req).then(res=>{
                    if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
                    }
                })
            },
            fillForm(beFilledItem, item){
                Object.keys(this.itemData).forEach(key=>{
                    if(beFilledItem.hasOwnProperty(key) && item.hasOwnProperty(key) && item[key]){
                        beFilledItem[key] = item[key]
                    }
                })
            },
            handleSubmit(validInfo){

                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        var req = this.itemData
                        req.bBegintime = this.itemData.bBegintime.split(' 00:00:00')[0] + ' 00:00:00'
                        req.bEndtime = this.itemData.bEndtime.split(' 00:00:00')[0] + ' 00:00:00'
                        this.isSubmitting = true
                        Interface[this.exportTypeKey].changecard_submit(this.itemData).then(res=>{
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
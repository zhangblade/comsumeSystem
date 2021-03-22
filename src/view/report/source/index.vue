<template>
        
    <Layout id="source" class="router_view" v-loading="loadingTable">
        <Layout class="right_wrap">

            <div class="content_header">
                <h5>{{$route.meta.title}}</h5>
                <div class="head_right"></div>
            </div>

            <div class="opt_box">
                <div class="adapt_cell">
                    <DatePicker class="cus_datePicker" type="daterange" placeholder="请选择日期范围" v-model="daterange" @on-change="changeDateRange"></DatePicker>
                </div>
                
                <div class="adapt_cell cus_cell_wid">
                    <treeselect v-model="extParams.pertype" :options="personnel_type" placeholder="请选择人员类型" />
                </div>
                <div class="adapt_cell cus_cell_wid">
                    <treeselect v-model="extParams.bStatus" :options="source_status" placeholder="请选择消费状态" />
                </div>
                <div class="adapt_cell cus_cell_wid">
                    <treeselect v-model="extParams.bPaytype" :options="source_pay_type" placeholder="请选择支付方式" />
                </div>
                <div class="adapt_cell cus_cell_wid">
                    <treeselect v-model="extParams.bSystem" :options="source_pay_scen" placeholder="请选择支付场景" />
                </div>
                <div class="adapt_cell cus_cell_wid">
                    <treeselect v-model="extParams.bCosttype" :options="source_cost_type" placeholder="请选择消费类型" />
                </div>

                

                <div class="adapt_cell cus_wid">
                    <treeselect v-model="extParams.bCommids" :multiple="true" :options="communityList"
                    @open="getCommunityList" @input="fnChooseComm" placeholder="请选择社区" :limit="2" :limitText="fnLimitText" :flat="true" />
                </div>
                <div class="adapt_cell cus_wid" v-if="extParams.bCommids.length">
                    <treeselect v-model="extParams.groupIds" :multiple="true" :options="devGroupList"
                    @open="getDevGroup" @input="fnChooseDevGroup" placeholder="请选择设备组" :limit="2" :limitText="fnLimitText" :flat="true" />
                </div>
                <el-select size="small" class="adapt_cell cus_el_selectpage" v-if="extParams.groupIds.length" v-model="extParams.devIds" multiple clearable placeholder="请选择设备" value-key="id">
                    <div class="selectpage_search">
                        <Input class="selectpage_search_ipt" size="small" v-model="devPage.searchQuery" placeholder="请输入设备名称" search @on-search="fnSearchDev"></Input>
                    </div>
                    <el-option class="cus_el_selectpage_option"
                        v-for="item in devList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                    <div class="selectpage_pager">
                        <Page size="small" simple :total="devPage.totalSize" :current="devPage.pageNum" @on-change="changeDevPage"></Page>
                    </div>
                    <div class="selectpage_empty" slot="empty">
                        <div class="selectpage_search">
                            <Input class="selectpage_search_ipt" size="small" v-model="devPage.searchQuery" placeholder="请输入设备名称" search @on-search="fnSearchDev"></Input>
                        </div>
                        <p class="selectpage_empty_text">暂无数据</p>
                        <div class="selectpage_pager">
                            <Page size="small" simple :total="devPage.totalSize" :current="devPage.pageNum" @on-change="changeDevPage"></Page>
                        </div>
                    </div>
                </el-select>


                <div class="adapt_cell cus_wid" v-if="extParams.bCommids.length">
                    <treeselect v-model="extParams.bGroupids" :multiple="true" :options="groupList"
                    @open="getPersonGroup" @input="fnChooseGroup" placeholder="请选择人员群组" :limit="2" :limitText="fnLimitText" :flat="true" />
                </div>
                <el-select size="small" class="adapt_cell cus_el_selectpage" v-if="extParams.bGroupids.length" v-model="extParams.bPerids" multiple clearable placeholder="请选择人员" value-key="id">
                    <div class="selectpage_search">
                        <Input class="selectpage_search_ipt" size="small" v-model="personPage.searchQuery" placeholder="请输入人员名称" search @on-search="fnSearchPerson"></Input>
                    </div>
                    <el-option class="cus_el_selectpage_option"
                        v-for="item in personList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                    <div class="selectpage_pager">
                        <Page size="small" simple :total="personPage.totalSize" :current="personPage.pageNum" @on-change="changePersonPage"></Page>
                    </div>
                    <div class="selectpage_empty" slot="empty">
                        <div class="selectpage_search">
                            <Input class="selectpage_search_ipt" size="small" v-model="personPage.searchQuery" placeholder="请输入人员名称" search @on-search="fnSearchPerson"></Input>
                        </div>
                        <p class="selectpage_empty_text">暂无数据</p>
                        <div class="selectpage_pager">
                            <Page size="small" simple :total="personPage.totalSize" :current="personPage.pageNum" @on-change="changePersonPage"></Page>
                        </div>
                    </div>
                </el-select>

                <div class="adapt_cell">
                    <Button class="inline_block_space ivu_btn_padding" @click="fnSearch()">查询</Button>
                    <Button class="inline_block_space ivu_btn_padding" :loading="Export.exporting" @click="fnExport()">导出</Button>
                    <Button class="inline_block_space ivu_btn_padding" @click="fnDld()">下载</Button>
                </div>
            </div>

            <Content>
                <div class="">
                    <Table ref="selection" :data="pageListData" :columns="tableHeader"></Table>
                    <div class="pager_box" v-show="pager.totalSize">
                        <Page show-total show-sizer show-elevator :page-size="pager.pageSize" @on-page-size-change="changePageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
                    </div>
                </div>
            </Content>
        </Layout>

    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

    import searchbox from '@/components/common/searchbox'

    import pageList from '@/mixin/pageList'
    
    import { recursionByFiled, getDateStr } from '@/libs/tools'

    // import the component
    import Treeselect from '@riophae/vue-treeselect'
    // import the styles
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    import mx_report from '@/mixin/mx_report'

	export default {
        mixins: [ pageList, mx_report ],
        components: { searchbox, Treeselect },
		data () {
            
			return {
                tableHeader: [

                    { title: '社区名称', key: 'bCommName', minWidth: 90, className: 'cus_td_pad', ellipsis: true, tooltip: true },
                    { title: '群组名称', key: 'groupName', minWidth: 90, className: 'cus_td_pad', ellipsis: true, tooltip: true },
                    { title: '人员编号', key: 'bPerno', minWidth: 90, className: 'cus_td_pad', ellipsis: true, tooltip: true },
                    { title: '人员名称', key: 'bPername', minWidth: 90, className: 'cus_td_pad', ellipsis: true, tooltip: true },
                    { title: '设备名称', key: 'devName', minWidth: 90, className: 'cus_td_pad', ellipsis: true, tooltip: true },

                    { title: '消费时间', key: 'conTime', minWidth: 130, className: 'cus_td_pad' },
                    { title: '人员卡号', key: 'bCardno', minWidth: 90, className: 'cus_td_pad' },
                    { title: '人员类型', key: 'pertypeName', minWidth: 90, className: 'cus_td_pad' },
                    { title: '消费金额', key: 'money', minWidth: 70, className: 'cus_td_pad' },
                    { title: '优惠金额', key: 'discmoney', minWidth: 70, className: 'cus_td_pad' },
                    { title: '现金钱包支付金额', key: 'cash', minWidth: 70, className: 'cus_td_pad' },
                    { title: '补贴钱包支付金额', key: 'subsidy', minWidth: 70, className: 'cus_td_pad' },
                    { title: '本次消费后总余额', key: 'remain', minWidth: 70, className: 'cus_td_pad' },
                    { title: '消费状态', key: 'bStatusName', minWidth: 70, className: 'cus_td_pad' },
                    { title: '数据类型', key: 'bDatatypeName', minWidth: 70, className: 'cus_td_pad' },
                    { title: '支付方式', key: 'bPaytypeName', minWidth: 70, className: 'cus_td_pad' },
                    { title: '消费类型', key: 'bCosttypeName', minWidth: 70, className: 'cus_td_pad' },
                    { title: '支付场景', key: 'bSystemName', minWidth: 70, className: 'cus_td_pad' },
                    { title: '退款金额', key: 'refmoney', minWidth: 70, className: 'cus_td_pad' },
                    { title: '备注', key: 'remark', minWidth: 70, className: 'cus_td_pad', ellipsis: true, tooltip: true },
                    { title: '第三方订单号', key: 'otUid', minWidth: 85, className: 'cus_td_pad' },
                    { title: '撤销关联消费订单号', key: 'otUidC', minWidth: 80, className: 'cus_td_pad' },
                    
                ],
                extParams: {
                    bCommids: [],
                    bGroupids: [],
                    bPerids: [],
                    groupIds: [],
                    devIds: [],

                    pertype: null,   //		人员类型
                    bStatus: null,   //		消费状态
                    bPaytype: null,   //		支付方式
                    bCosttype: null,   //		消费类型
                    bSystem: null,   //		支付场景

                    userName: '',   //	收银员姓名

                    beginTime: '',
                    endTime: '',
                },
                daterange: [],

                communityList: [],
                groupList: [],
                personList: [],
                devGroupList: [],
                devList: [],

                personPage: {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                    totalPages: 1,
                    searchQuery: '',
                },
                
                devPage: {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                    totalPages: 1,
                    searchQuery: '',
                },

                personnel_type: [],   //		人员类型
                source_status: [],   //		消费状态
                source_pay_type: [],   //		支付类型
                source_pay_scen: [],   //		支付场景
                source_cost_type: [],   //		支付状态
                
                dictFiled: ['personnel_type', 'source_status', 'source_pay_type', 'source_pay_scen', 'source_cost_type'],
                
                exportTypeKey: 'source',
			}
		},
		created(){
            
        },
        computed: {
            
        },
		methods: {
            beforecreatedFn(){
                this.getDict()
                this.initCondition()
                let aMonthTime = 86400*1000*30
                let today = new Date().getTime()
                let aMonthAgo = today - aMonthTime
                let endDate = getDateStr(today, 'year')
                let startDate = getDateStr(aMonthAgo, 'year')
                this.daterange = [startDate, endDate]
                this.extParams.beginTime = startDate
                this.extParams.endTime = endDate
            },
            createdFn(){
                if(this.needInitData){
                    this.fnSearch()
                }
            },
            changeDateRange(val, type){
                if(val.length && val[0]){
                    let start = new Date(val[0]).getTime()
                    let end = new Date(val[1]).getTime()
                    let aMonthTime = 86400*1000*30
                    if(end - start > aMonthTime){
                        this.$Message.info('最多查询一个月')
                        this.daterange = ['', '']
                    }else{
                        this.daterange = val
                    }
                }
            },
            getDict(){
                let req = {types: this.dictFiled.join()}
                Interface.common.getDict(req).then(res=>{
                    if(res.status == 200 && res.data){
                        Object.keys(res.data).forEach(key=>{
                            let arr = []
                            Object.keys(res.data[key]).forEach(el=>{
                                let item = {}
                                item.id = el
                                item.label = res.data[key][el]
                                arr.push(item)
                            })
                            this[key] = arr
                        })
                    }
                })
            },
			getPageListData(req){
                this.loadingTable = true
				Interface[this.exportTypeKey].findpage(req).then(res=>{
					if (res.status == 200) {
                        this.loadData(res)
					}else{
                        this.$Message.error(res.message)
                    }
                    this.loadingTable = false
				}).catch(err=>{
                    this.loadingTable = false
                    this.$Message.error(err.message)
                })
            },
            
            getCommunityList(){
                if(this.communityList.length) return
                Interface.common.getCommunityList().then(res=>{
                    if(res.status == 200 && res.data && res.data.length > 0){
                        this.communityList = res.data.map(i=>{
                            i.title = i.bCommname
                            i.label = i.bCommname
                            i.id = i.bCommid
                            return i
                        })
                    }else{
                        this.communityList = []
                    }
                })
            },
            getPersonGroup(){
                if(!this.extParams.bCommids.length || this.groupList.length) return
                let req = { bCommids: this.extParams.bCommids }
                Interface.common.getPersonGroup(req).then(res=>{
                    if(res.status == 200 && res.data && res.data.length > 0){
                        let filed = { label: 'groupName', id: 'groupId' }
                        this.groupList = recursionByFiled(res.data, filed)
                    }else{
                        this.groupList = []
                    }
                })
            },
            getPersonByGroup(){
                let req = {
                    pageNum: this.personPage.pageNum, pageSize: this.personPage.pageSize,
                    params: {
                        bCommids: this.extParams.bCommids, bGroupids: this.extParams.bGroupids, bPername: this.personPage.searchQuery
                    }
                }
                Interface.common.getPersonByGroup(req).then(res=>{
                    if(res.status == 200 && res.data && res.data.content && res.data.content.length > 0){
                        this.personList = res.data.content.map(i=>{
                            i.label = i.bPername
                            i.id = i.bPerid
                            return i
                        })
                        this.personPage.pageNum = res.data.pageNum
                        this.personPage.pageSize = res.data.pageSize
                        this.personPage.totalPages = res.data.totalPages
                        this.personPage.totalSize = res.data.totalSize
                    }else{
                        this.personList = []
                    }
                })
            },
            getDevGroup(){
                if(!this.extParams.bCommids.length || this.devGroupList.length) return
                let req = { bCommids: this.extParams.bCommids }
                Interface.common.getDevGroup(req).then(res=>{
                    if(res.status == 200 && res.data && res.data.length > 0){
                        let filed = { label: 'groupName', id: 'groupId' }
                        this.devGroupList = recursionByFiled(res.data, filed)
                    }else{
                        this.devGroupList = []
                    }
                })
            },
            getDevByGroup(){
                let req = {
                    pageNum: this.devPage.pageNum, pageSize: this.devPage.pageSize,
                    params: {
                        bCommids: this.extParams.bCommids, groupIds: this.extParams.groupIds, devName: this.devPage.searchQuery
                    }
                }
                Interface.common.getDevByGroup(req).then(res=>{
                    if(res.status == 200 && res.data && res.data.content && res.data.content.length > 0){
                        this.devList = res.data.content.map(i=>{
                            i.label = i.devName
                            i.title = i.devName
                            i.id = i.devId
                            return i
                        })
                        this.devPage.pageNum = res.data.pageNum
                        this.devPage.pageSize = res.data.pageSize
                        this.devPage.totalPages = res.data.totalPages
                        this.devPage.totalSize = res.data.totalSize
                    }else{
                        this.devList = []
                    }
                })
            },
            fnChooseComm(value, instanceId){
                this.resetDevGroupInfo()
                this.resetPersonGroupInfo()
            },
            fnChooseGroup(value, instanceId){
                this.resetPersonInfo()
                if(value.length){
                    this.changePersonPage(1)
                }
            },
            fnChooseDevGroup(value, instanceId){
                this.resetDevInfo()
                if(value.length){
                    this.changeDevPage(1)
                }
            },
            resetDevInfo(){
                this.devList = []
                this.extParams.devIds = []
                this.devPage = {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                    totalPages: 1,
                    searchQuery: '',
                }
            },
            resetDevGroupInfo(){
                this.extParams.groupIds = []
                this.devGroupList = []
                this.resetDevInfo()
            },
            resetPersonInfo(){
                this.personList = []
                this.extParams.bPerids = []
                this.personPage = {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                    totalPages: 1,
                    searchQuery: '',
                }
            },
            resetPersonGroupInfo(){
                this.extParams.bGroupids = []
                this.groupList = []
                this.resetPersonInfo()
            },
            fnChooseDev(value, instanceId){
                
            },
            fnChoosePerson(value, instanceId){
                
            },
            changePersonPage(page){
                this.personPage.pageNum = page
                this.getPersonByGroup()
            },
            fnSearchPerson(searchQuery){
                this.personPage.searchQuery = searchQuery
                this.getPersonByGroup()
            },
            fnSearchDev(searchQuery){
                this.devPage.searchQuery = searchQuery
                this.getDevByGroup()
            },
            changeDevPage(page){
                this.devPage.pageNum = page
                this.getDevByGroup()
            },
            fnLimitText(count){
                return '+'+count
            },
        },
        watch: {
            daterange: {
                handler(val){
                    if(val.length){
                        this.extParams.beginTime = val[0].length ? val[0] + ' 00:00:00' : val[0]
                        this.extParams.endTime = val[1].length ? val[1] + ' 23:59:59' : val[1]
                    }else{
                        this.extParams.beginTime = ''
                        this.extParams.endTime = ''
                    }
                },
                deep: true,
                immediate: true
            },
        }
	}
</script>
<style lang="less" scoped>
    .adapt_cell{
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        margin-bottom: 10px;
        .cus_btn_search{
            margin-right: 10px;
        }
        &.tree_select{
            width: 300px;
        }
        &.cus_wid{
            width: 200px;
        }
        &.cus_cell_wid{
            width: 150px;
        }
    }
    .text_right{
        text-align: right;
    }
</style>

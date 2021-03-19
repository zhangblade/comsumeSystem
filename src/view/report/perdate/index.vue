<template>
        
    <Layout id="perdate" class="router_view" v-loading="loadingTable">
        <Layout class="right_wrap">

            <div class="content_header">
                <h5>{{$route.meta.title}}</h5>
                <div class="head_right"></div>
            </div>

            <div class="opt_box">
                <div class="adapt_cell">
                    <DatePicker class="cus_datePicker" type="daterange" placeholder="请选择日期范围" v-model="daterange" @on-change="daterange=$event"></DatePicker>
                </div>
                
                <div class="adapt_cell cus_cell_wid">
                    <treeselect v-model="extParams.bPaytype" :options="source_pay_type" placeholder="请选择支付方式" />
                </div>
                <div class="adapt_cell cus_cell_wid">
                    <treeselect v-model="extParams.bCosttype" :options="source_cost_type" placeholder="请选择消费类型" />
                </div>

                <div class="adapt_cell cus_wid">
                    <treeselect v-model="extParams.bCommids" :multiple="true" :options="communityList"
                    @open="getCommunityList" @input="fnChooseComm" placeholder="请选择社区" :limit="2" :limitText="fnLimitText" :flat="true" />
                </div>

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
    
    import { recursionByFiled } from '@/libs/tools'

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

                    { title: '社区名称', key: 'bCommName', minWidth: 120 },
                    { title: '人员组名称', key: 'groupName', minWidth: 120 },
                    { title: '人员名称', key: 'bPername', minWidth: 120 },
                    { title: '累计消费次数', key: 'num', minWidth: 120 },
                    { title: '累计消费金额', key: 'summoney', minWidth: 120 },
                    { title: '累计优惠金额', key: 'sumdiscmoney', minWidth: 120 },
                    { title: '累计现金钱包支付金额', key: 'sumcash', minWidth: 120 },
                    { title: '累计补贴钱包支付金额', key: 'sumsubsidy', minWidth: 120 },
                    { title: '支付方式', key: 'bPaytypeName', minWidth: 120 },
                    { title: '消费类型', key: 'bCosttypeName', minWidth: 120 },
                    { title: '消费日期', key: 'conDate', minWidth: 120 },
                    
                ],
                
                extParams: {
                    type: '01',

                    bCommids: [],
                    bGroupids: [],
                    bPerids: [],

                    bPaytype: null,   //		支付方式
                    bCosttype: null,   //		消费类型

                    beginTime: '',
                    endTime: '',
                },
                daterange: [],

                communityList: [],
                groupList: [],
                personList: [],

                personPage: {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                    totalPages: 1,
                    searchQuery: ''
                },
                
                source_pay_type: [],   //		支付类型
                source_cost_type: [],   //		支付状态
                
                dictFiled: ['source_pay_type', 'source_cost_type'],
                
                exportTypeKey: 'perdate',
			}
		},
		created(){
            this.getCommunityList()
        },
        computed: {
            
        },
		methods: {
            beforecreatedFn(){
                this.getDict()
            },
            createdFn(){
                if(this.needInitData){
                    this.fnInitPage()
                }else{
                    this.initCondition()
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
            fnChooseComm(value, instanceId){
                this.resetPersonGroupInfo()
            },
            fnChooseGroup(value, instanceId){
                this.resetPersonInfo()
                if(value.length){
                    this.changePersonPage(1)
                }
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
            fnSearchPerson(searchQuery){
                this.personPage.searchQuery = searchQuery
                this.getPersonByGroup()
            },
            changePersonPage(page){
                this.personPage.pageNum = page
                this.getPersonByGroup()
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

<template>
        
    <Layout id="charge" class="router_view" v-loading="loadingTable">
        <Layout class="right_wrap">

            <div class="content_header">
                <h5>{{$route.meta.title}}</h5>
                <div class="head_right"></div>
            </div>

            <div class="opt_box">
                <div class="adapt_cell">
                    <DatePicker class="cus_datePicker" type="daterange" placeholder="请选择日期范围" v-model="daterange" @on-change="daterange=$event"></DatePicker>
                </div>
                <div class="adapt_cell small">
                    <treeselect v-model="extParams.bChatype" :options="charge_type" placeholder="请选择充值类型" />
                </div>
                <div class="adapt_cell tree_select">
                    <treeselect v-model="extParams.bCommids" :multiple="true" :options="communityList" @open="getCommunityList" @input="fnChooseComm" placeholder="请选择社区" :limit="2" :limitText="fnLimitText" :flat="true" />
                </div>
                <div class="adapt_cell tree_select" v-if="extParams.bCommids.length">
                    <treeselect v-model="extParams.bGroupids" :multiple="true" :options="groupList" @open="getPersonGroup" @input="fnChooseGroup" placeholder="请选择群组" :limit="2" :limitText="fnLimitText" :flat="true" />
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
                    <Select v-model="extParams.chargeOrRefund" placeholder="充值或退款" clearable>
                        <Option v-for="item in chargeOrRefundList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                
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
                tableHeader: [ // 表格  theader
                    { title: '社区名称', key: 'bCommName', minWidth: 100 },
                    { title: '人员编号', key: 'bPerid', minWidth: 100 },
                    { title: '人员名称', key: 'bPerName', minWidth: 120 },
                    { title: '群组名称', key: 'bGroupName', minWidth: 100 },
                    { title: '充值或退款', key: 'chargeOrRefundName', minWidth: 100 },
                    { title: '金额', key: 'bMoney', minWidth: 80 },
                    { title: '充值/退款前余额', key: 'bRemain', minWidth: 125 },
                    { title: '充值/退款后余额', key: 'aRemain', minWidth: 125 },
                    { title: '充值/退款类别', key: 'bChatypeName', minWidth: 115 },
                    { title: '补助标识', key: 'bIssubName', minWidth: 100 },
                    { title: '充值时间', key: 'bCreatetime', minWidth: 150 },
                ],
                extParams: {
                    type: '01',
                    bCommids: [],
                    bGroupids: [],
                    bPerids: [],
                    bChatype: null,
                    chargeOrRefund: '',

                    beginTime: '',
                    endTime: '',
                },
                daterange: [],
                
                communityList: [],
                groupList: [],
                personList: [],
                
                chargeOrRefundList: [
                    {value: '01', label: '充值'},
                    {value: '02', label: '退款'},
                ],
                personPage: {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                    totalPages: 1,
                    searchQuery: ''
                },
                
                charge_type: [],
                dictFiled: ['charge_type'],
                
                exportTypeKey: 'charge',
			}
		},
		created(){
            
        },
        computed: {
            
        },
		methods: {
            beforecreatedFn(){
                this.getDict()
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
                            i.title = i.bPername
                            i.id = i.bPerid
                            return i
                        })
                        
                        this.personPage.pageNum = res.data.pageNum
                        this.personPage.pageSize = res.data.pageSize
                        this.personPage.totalPages = res.data.totalPages
                        this.personPage.totalSize = res.data.totalSize
                    }else{
                        this.personList = []
                        this.personPage = {
                            pageNum: 1,
                            pageSize: 10,
                            totalSize: 0,
                            totalPages: 1,
                        }
                    }
                })
            },
            fnChooseComm(value, instanceId){
                this.resetPersonGroupInfo()
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
            fnChooseGroup(value, instanceId){
                this.resetPersonInfo()
                if(value.length){
                    this.changePersonPage(1)
                }
            },
            fnSearchPerson(searchQuery){
                this.personPage.searchQuery = searchQuery
                this.getPersonByGroup()
            },
            fnLimitText(count){
                return '+'+count
            },
            changePersonPage(page){
                this.personPage.pageNum = page
                this.getPersonByGroup()
            }
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
    }
    .text_right{
        text-align: right;
    }
</style>
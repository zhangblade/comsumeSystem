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
                <div class="adapt_cell tree_select cus_wid">
                    <treeselect v-model="extParams.type" :options="typeList" @input="changeType" :clearable="false" />
                </div>
                <div class="adapt_cell tree_select">
                    <treeselect v-model="extParams.bCommids" :multiple="true" :options="communityList" @close="fnChooseComm" placeholder="请选择社区" :limit="2" :limitText="fnLimitText" :flat="true" />
                </div>
                <div class="adapt_cell small">
                    <treeselect v-model="extParams.bChatype" :options="charge_type" placeholder="请选择充值类型" />
                </div>
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
                tableHeader: [],
                typeList: [
                    {id: '02', label: '明细按社区汇总'},
                    {id: '03', label: '明细按日期汇总'},
                ],
                extParams: {
                    type: '02',
                    bCommids: [],
                    bChatype: null,
                    chargeOrRefund: '',

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
                },
                chargeOrRefundList: [
                    {value: '01', label: '充值'},
                    {value: '02', label: '退款'},
                ],
                charge_type: [],
                
                dictFiled: ['charge_type'],
                
                exportTypeKey: 'charge',
			}
		},
		created(){
            this.setTableHeaer('02')
            this.getCommunityList()
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
            fnChooseComm(value, instanceId){
                
            },
            changeType(value, instanceId){
                if(value !== '02'){
                    this.extParams.bCommids = []
                }
                this.setTableHeaer(value)
                this.fnSearch()
            },
            setTableHeaer(val){
                let arr1 = [
                    { title: '社区名称', key: 'bCommName', minWidth: 100 },
                    { title: '充值金额', key: 'bMoney', minWidth: 100 },
                    { title: '充值或退款', key: 'chargeOrRefundName', minWidth: 100 },
                    { title: '充值/退款类别', key: 'bChatypeName', minWidth: 100 },
                ]
                let arr2 = [
                    { title: '充值日期', key: 'creatDateStr', minWidth: 120 },
                    { title: '充值金额', key: 'bMoney', minWidth: 100 },
                    { title: '充值或退款', key: 'chargeOrRefundName', minWidth: 100 },
                    { title: '充值/退款类别', key: 'bChatypeName', minWidth: 100 },
                ]
                if(val == '02'){
                    this.tableHeader = arr1
                }
                if(val == '03'){
                    this.tableHeader = arr2
                }
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
    }
    .text_right{
        text-align: right;
    }
</style>

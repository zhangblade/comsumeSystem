<template>
        
    <Layout id="sys_opperlogView" class="router_view">

        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
            <div class="head_right"></div>
        </div>
        <div class="opt_box">
            
            <searchbox @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current">
                <div class="dib" slot="mutil_before">
                    <DatePicker class="cus_datePicker cus_margin_right" type="datetimerange" placeholder="请选择日期范围" :value="daterange" @on-change="changeDate"></DatePicker>
                </div>
                <div class="export_box dib" slot="right">
                    <Poptip class="more_opts inline_block_space " confirm @on-ok="fnExport()" placement="top-end" padding="4px 0" title="导出后可以在下载列表中下载，确认导出？">
                        <Button class="ivu_btn_padding relative" :disabled="Export.exporting">
                            <span class="export_text">{{Export.exporting ? '导出中': '导出'}}</span>
                            <Spin fix v-if="Export.exporting"><Icon type="ios-loading" size=18 class="spin_loading"></Icon></Spin>
                        </Button>
                    </Poptip>
                    <Button class="inline_block_space ivu_btn_padding" @click="fnDld()">下载</Button>
                </div>
            </searchbox>
            
        </div>
        <Content>
            <div class="table_box">
                <Table ref="selection" :data="pageListData" :columns="tableHeader"></Table>
                <div class="pager_box" v-show="pager.totalSize">
                    <Page show-total show-sizer show-elevator :page-size="pager.pageSize" @on-page-size-change="changePageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
                </div>
            </div>
        </Content>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

    import searchbox from '@/components/common/searchbox'

    import mx_report from '@/mixin/mx_report'
    
    import pageList from '@/mixin/pageList'

    import { getOneDayRange } from '@/libs/tools'
    
	export default {
        mixins: [ pageList, mx_report ],
        components: { searchbox },
		data () {
            var TH = [
                { title: '操作员', key: 'userName', minWidth: 90 },
                { title: '操作时间', key: 'createTime', minWidth: 90 },
                { title: '操作描述', key: 'operDesc', minWidth: 200 },
                { title: 'ip', key: 'ip', minWidth: 75 },
                { title: '操作结果', key: 'result', minWidth: 75 },
                { title: '操作类型', key: 'operTypeName', minWidth: 75 },
            ]
			return {
                tableHeader: TH,
                condition: {
                    list: [],
                },

                extParams: {
                    startDateTime: null,
                    endDateTime: null,
                },

                daterange: [],
                defaultDate: getOneDayRange(),

                needInitData: false,
                exportTypeKey: 'opperlog',
			}
		},
		created(){

        },
        computed: {
            
        },
		methods: {
            // 设置搜索参数
            setSearchParams(){
                var params = {}
                
                params.searchKey = this.current.key == 'all' ? '' : this.current.key
                params.searchVal = this.current.val
                
                this.searchParams = params
            },
            beforecreatedFn(){
                this.getSearchCondition()
                this.changeDate(this.defaultDate)
            },
            createdfn(){
                if(this.needInitData){
                    this.fnSearch()
                }
            },
            getSearchCondition(){
                Interface[this.exportTypeKey].getSearchCondition().then(res=>{
                    if (res.status == 200 && res.data && res.data.opperlogTypeList.length > 0) {
                        let temp = res.data.opperlogTypeList.map(i=>{
                            return { value: i.value, label: '操作员', formatLabel: i.description, type: 'input' }
                        })
                        let item = { value: 'all', label: '操作员', formatLabel: '操作类型', type: 'input' }
                        temp.unshift(item)
                        this.condition.list = temp
                        this.initCondition()
                    }
                })
            },
            changeDate(range, type){
                if(range && range[1].split(' ')[1] == '00:00:00'){
                    range[1] = range[1].replace('00:00:00', '23:59:59')
                }
                this.daterange = range
                this.extParams.startDateTime = range[0]
                this.extParams.endDateTime = range[1]
                this.fnSearch()
            }
        },
	}

</script>
<style lang="less">
    .cus_margin_right{
        margin-right: 5px;
        width: auto;
    }
    .dib{
        display: inline-block;
    }
    .cus_datePicker{
        min-width: 280px;
    }
</style>
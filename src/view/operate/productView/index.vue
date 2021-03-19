<template>
        
    <Layout id="parkFeeView" class="router_view">

        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
            <div class="head_right">
                <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="fnAdd()">增加</Button>
            </div>
        </div>

        <div class="opt_box">
            <searchbox class="inline_block_space" @fnSearch="fnSearch" v-if="loadedRemoteCondition" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>
        </div>
        <Content>
            <div class="table_box">
                <!-- 表格数据 -->
                <Table ref="selection" :data="pageListData" :columns="tableHeader">
                    <template slot-scope="{ row }" slot="action">
                        <span class="btn_action" v-if="row.state != 3" @click="fnEdit(row)">编辑</span>
                        <Poptip v-if="row.state == '0'" class="delete_module" confirm @on-ok="fnPublish(row)" title="确认发布？" transfer placement="top-end">
                            <span class="btn_action" style="margin-right: 5px;">发布</span>
                        </Poptip>
                        <Poptip v-if="row.state == '1'" class="delete_module" confirm @on-ok="fnUnPublish(row)" title="确认取消发布？" transfer placement="top-end">
                            <span class="btn_action" style="margin-right: 5px;">取消发布</span>
                        </Poptip>
                        <Poptip v-if="row.state == '2'" class="delete_module" confirm @on-ok="fnPublish(row)" title="确认发布？" transfer placement="top-end">
                            <span class="btn_action" style="margin-right: 5px;">重新发布</span>
                        </Poptip>
                        <Poptip v-if="row.state != 3" class="delete_module" confirm @on-ok="fnRemove(row)" title="删除后不可恢复，确定要删除吗?" transfer placement="top-end">
                            <span class="btn_action" style="margin-right: 5px;">删除</span>
                        </Poptip>
                    </template>
                </Table>
                <!-- 分页器 -->
                <div class="pager_box" v-show="pager.totalSize">
                    <div class="pager">
                        <Page show-total show-sizer show-elevator :page-size="pager.pageSize" @on-page-size-change="changePageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
                    </div>
                </div>
            </div>
        </Content>

    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

    import searchbox from '@/components/common/searchbox'
    
    import pageList from '@/mixin/pageList'
    
	export default {
        mixins: [ pageList ],
        components: { searchbox },
		data () {
            
			return {
                tableHeader: [ // 表格  theader
                    {
                        title: '服务名称',
                        key: 'appName',
                        minWidth: 80,
                    },
                    {
                        title: '商品名称',
                        key: 'proName',
                        minWidth: 80,
                    },
                    {
                        title: '商品描述',
                        key: 'proDesc',
                        minWidth: 80,
                    },
                    {
                        title: '状态',
                        key: 'timeUnit',
                        align: 'center',
                        minWidth: 50,
                        render: (h,params)=>{
                            const timeUnit = { '0': '年', '1': '季度', '2': '月 ' }
                            var text = timeUnit[params.row.timeUnit]
                            return h('span',text)
                        }
                    },
                    {
                        title: '创建日期',
                        key: 'createDatetime',
                        minWidth: 80,
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 90,
                        align: 'center',
                    }
                ],
                
                condition: {
                    list: [
                        {value: 'appId', label: '云应用', type: 'select'},
                        {value: 'proName', label: '商品名称', type: 'input'},
                    ]
                },
                loadedRemoteCondition: false,
                extParams: {},
                exportTypeKey: 'productView',

			}
		},
		created(){
            this.getAppList()
        },
        computed: {
            
        },
		methods: {
            // 获取 select 下拉 option 数据
            getAppList(){
                Interface.appView.list({}).then(res=>{
                    if (res.status == 200) {
                        var selects = this.condition.list.filter(item=>item.type == 'select')
                        selects.forEach(ele=>{
                            const matchingFiled = ele.matchingFiled || ele.value
                            let _selects = res.data.map(item=>{
                                item.label = item.appName;
                                item.value = item.appId;
                                return item
                            })
                            var tipsOption = { label: '请选择'+ ele.label, value: 'all' }
                            _selects.unshift(tipsOption)
                            this.condition[ele.value] = _selects
                        })
                        this.changeQueryKey(this.condition.list[this.current.index], this.current.index)
                    }else{
                        this.$Message.error(res.message)
                    }
                    this.loadedRemoteCondition = true
                })
            },
            changeStartTime(val){
                this.extParams.queryStartTime = val
                this.fnSearch()
            },
            changeEndTime(val){
                this.extParams.queryEndTime = val
                this.fnSearch()
            },
            fnAdd(){
                this.$router.push({ name: this.$route.name + '_add'})
            },
            fnEdit(row){
                this.$router.push({ name: this.$route.name + '_edit', query: {id: row.id, nps: this.nps }})
            },
            fnRemove(row){
                var deleteItem = {id: row.id}
                Interface[this.exportTypeKey].delete(deleteItem).then(res=>{
                    if (res.status == 200) {
                        this.removeSuccessCallback()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            fnPublish(row){
                var req = {id: row.id}
                Interface[this.exportTypeKey].publish(req).then(res=>{
                    if (res.status == 200) {
                        this.$Message.success(res.message)
                        this.fnSearch()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            fnUnPublish(row){
                var req = {id: row.id}
                Interface[this.exportTypeKey].unPublish(req).then(res=>{
                    if (res.status == 200) {
                        this.$Message.success(res.message)
                        this.fnSearch()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
			getPageListData(req){
				Interface[this.exportTypeKey].findpage(req).then(res=>{
					if (res.status == 200) {
                        this.loadData(res)
					}else{
                        this.pageListData = []
                        this.$Message.error(res.message)
                    }
				})
				
            },
            /** 设置搜索参数 */
            setSearchParams(){
                var params = {}
                const type = this.current.type,
                    val = this.current.val
                if( (type == 'input' && val !== '') || (type == 'select' && val !== 'all') ){
                    params[this.current.key] = this.current.val
                }
                this.searchParams = params
            },
        },
	}
</script>
<style lang="less">

    .custom_select_box{
        &.datetimerange{
            .suffix_right{
                font-size: 16px;
            }
        }
        padding: 0 24px 0 4px;
        box-sizing: border-box;
        outline: none;
        user-select: none;
        cursor: pointer;
        position: relative;
        background-color: #fff;
        border-radius: 0;
        border: 1px solid #dddddd;
        height: 32px;
        display: flex;
        align-items: center;
        .cur_time_range{
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .suffix_right{
            position: absolute;
            right: 0;
            top: 0;
            width: 24px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            font-size: 14px;
            transition: transform .2s;
            &.ani_rotate{
                transform: rotate(180deg);
            }
        }
    }
</style>


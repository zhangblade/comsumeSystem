<template>
        
    <Layout id="accessPubliccfgView" class="router_view">

        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
            <div class="head_right">
                <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="fnAdd()">增加</Button>
            </div>
        </div>
        <div class="opt_box">
            <searchbox class="inline_block_space" @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>
        </div>
        <Content>
            <div class="table_box">
                <Table ref="selection" :data="pageListData" :columns="tableHeader">
                    <template slot-scope="{ row }" slot="action">
                        <span class="btn_action" @click="fnEdit(row)">编辑</span>
                        <Poptip v-if="row.cfgType !== '1'" class="delete_module" confirm @on-ok="fnRemove(row)" title="删除后不可恢复，确定要删除吗?" transfer placement="top-end">
                            <span class="btn_action" style="margin-right: 5px;">删除</span>
                        </Poptip>
                    </template>
                </Table>
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

    import pageList from '@/mixin/pageList'
    import { recursionByFiled } from '@/libs/tools'
    
	export default {
        mixins: [ pageList ],
        components: { searchbox },
		data () {
            
			return {
                tableHeader: [ // 表格  theader
                    { title: '社区编号', key: 'bCommid', minWidth: 110 },
                    { title: '描述', key: 'cfgDesc', minWidth: 110 },
                    { title: '参数', key: 'cfgItem', minWidth: 110 },
                    { title: '值', key: 'cfgValue', minWidth: 110 },
                    { title: '分类', key: 'cataTitle', minWidth: 110, ellipsis: true, tooltip: true },
                    { title: '操作', key: 'action', width: 75, slot: 'action' }
                ],
                condition: {
                    list: [
                        {label: '社区编号', value: 'bCommid', type: 'input'},
                        {label: '描述', value: 'cfgDesc', type: 'input'}
                    ]
                },
                extParams: {
                    sort: '',
                    order: 'DESC',
                    cataId: ''
                },

                exportTypeKey: 'accessPubliccfgView',
			}
		},
		created(){
            this.beforecreatedFn()
        },
        computed: {
            baseParams () {
                return { mode: '1' }
            }
        },
		methods: {
            // 设置搜索参数
            setSearchParams(){
                var params = {
                    searchKey: '',
                    searchVal: '',
                }
                const type = this.current.type,
                    val = this.current.val
                
                if( val !== '' || (type == 'select' && val !== 'all') ){
                    params.searchKey = this.current.key
                    params.searchVal = this.current.val
                }
                this.searchParams = params
            },
            fnAdd(){
                this.$router.push({ name: this.$route.name + '_add' })
            },
            fnEdit(row){
                this.$router.push({ name: this.$route.name + '_edit', query: { cfgItem: row.cfgItem, bCommid: row.bCommid, nps: this.nps }})
            },
            fnRemove(row){
                let req = { bCommid: row.bCommid, cfgItem: row.cfgItem }
                Interface[this.exportTypeKey].remove(req).then(res=>{
                    if(res.status == 200){
                        this.removeSuccessCallback()
                    }
                })
            },
        }
	}
</script>
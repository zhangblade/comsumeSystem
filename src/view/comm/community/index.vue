<template>
        
    <Layout id="community" class="router_view">

            <div class="content_header">
                <h5>{{$route.meta.title}}</h5>
                <div class="head_right">
                    <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="showAddModule()">增加</Button>
                </div>
            </div>
            <div class="opt_box">
                <searchbox @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>
            </div>
            <Content>
                <div class="table_box">
                    <Table ref="selection" :data="pageListData" :columns="tableHeader" >
                        <template slot-scope="{ row }" slot="action">
                            <span class="btn_action" @click="showEditModule(row)">编辑</span>
                            <Poptip class="delete_module" confirm @on-ok="fnRemove(row)" title="删除后不可恢复，确定要删除吗?" transfer placement="top-end">
                                <span class="btn_action">删除</span>
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
    import { groupByProvince } from '@/libs/util'
    
	export default {
        mixins: [ pageList ],
        components: { searchbox },
		data () {
            
			return {
                tableHeader: [ // 表格  theader
                    {
                        title: '社区ID',
                        key: 'bCommid',
                        minWidth: 90,
                    },
                    {
                        title: '社区名称',
                        key: 'bCommname',
                        minWidth: 110,
                    },
                    {
                        title: '联系人',
                        key: 'bCommcontactn',
                        minWidth: 110,
                    },
                    {
                        title: '手机号码',
                        key: 'bCommcontactt',
                        minWidth: 110,
                    },
                    {
                        title: '备注',
                        key: 'bCommremark',
                        minWidth: 65,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        slot: 'action',
                    }
                ],
                condition: {
                    list: [
                        {label: '社区id', value: 'bCommid', type: 'input'},
                        {label: '社区名称', value: 'bCommname', type: 'input'},
                    ]
                },
                exportTypeKey: 'community',
			}
		},
		created(){
            
        },
        computed: {
            
        },
		methods: {
            showAddModule(){
                this.$router.push({ name: this.$route.name+"_add" })
            },
            showEditModule(row){
                this.$router.push({
                    name: this.$route.name+'_edit',
                    query: { id: row.bCommid, deptName: row.deptName }
                })
            },
            fnRemove(row){
                var deleteItem = {id: row.bCommid}
                Interface[this.exportTypeKey].delete(deleteItem).then(res=>{
                    if (res.status == 200) {
                        this.removeSuccessCallback(res)
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
                    }
				})
            },
        }
	}
</script>


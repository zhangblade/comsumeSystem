<template>
        
    <Layout id="dictView" class="router_view">

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
                        <span class="btn_action" v-if="row.state != 3" @click="fnEdit(row)">编辑</span>
                        <Poptip v-if="row.state != 3" class="delete_module" confirm @on-ok="fnRemove(row)" title="删除后不可恢复，确定要删除吗?" transfer placement="top-end">
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
    
	export default {
        mixins: [ pageList ],
        components: { searchbox },
		data () {
            
			return {
                tableHeader: [ // 表格  theader
                    { title: '编号', key: 'id', minWidth: 80, },
                    { title: '标签名', key: 'name', minWidth: 80, },
                    { title: '数据值', key: 'value', minWidth: 80, },
                    { title: '类型', key: 'type', minWidth: 80, },
                    { title: '描述', key: 'description', minWidth: 70, },
                    { title: '备注', key: 'remarks', minWidth: 80, },
                    { title: '操作', slot: 'action', width: 80 }
                ],
                
                condition: {
                    list: [
                        {value: 'name', label: '标签名', type: 'input'},
                        {value: 'type', label: '类型', type: 'input'},
                    ]
                },
                exportTypeKey: 'dictView',

			}
		},
		created(){
            
        },
        computed: {
            
        },
		methods: {
            fnAdd(){
                this.$router.push({ name: this.$route.name + '_add'})
            },
            fnEdit(row){
                this.$router.push({ name: this.$route.name + '_edit', query: {id: row.id, nps: this.nps}})
            },
            fnRemove(row){
                var deleteItem = {id: row.id}
                Interface[this.exportTypeKey].delete(deleteItem).then(res=>{
                    if (res.status == 200) {
                        this.removeSuccessCallback()
                    }
                })
            },
        },
	}
</script>
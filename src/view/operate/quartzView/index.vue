<template>
        
    <Layout id="quartzView" class="router_view">

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
                    <template slot-scope="{ row }" slot="jobStatus">
                        <span class="btn_action" v-if="row.jobStatus == '0'" @click="fnChangeStatus(row)">开启</span>
                        <span class="btn_action" v-else @click="fnChangeStatus(row)">停止</span>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <span class="btn_action" @click="fnEdit(row)">编辑</span>
                        <Poptip class="delete_module" confirm @on-ok="fnRemove(row)" title="删除后不可恢复，确定要删除吗?" transfer placement="top-end">
                            <span class="btn_action" style="margin-right: 5px;">删除</span>
                        </Poptip>
                        <span class="btn_action" @click="fnRun(row)">立即执行一次</span>
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
                    { title: '名称', key: 'jobName', minWidth: 80 },
                    { title: '任务分组', key: 'jobGroup', minWidth: 80 },
                    { title: '执行表达式', key: 'cronExpression', minWidth: 80 },
                    { title: '调用目标类', key: 'beanClass', minWidth: 80 },
                    { title: '停启操作', key: 'jobStatus', width: 65, slot: 'jobStatus' },
                    { title: '任务描述', key: 'description', minWidth: 80 },
                    { title: '操作', slot: 'action', width: 150 }
                ],
                
                condition: {
                    list: [
                        {value: 'jobName', label: '名称', type: 'input'},
                        {value: 'jobGroup', label: '任务分组', type: 'input'},
                    ]
                },
                exportTypeKey: 'quartzView',

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
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            fnRun(row){
                var req = { id: row.id }
                Interface[this.exportTypeKey].run(req).then(res=>{
                    if (res.status == 200) {
                        this.$Message.success(res.message)
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            fnChangeStatus(row){
                let cmd = row.jobStatus == '1' ? 'stop' : 'start'
                var req = { id: row.id, cmd: cmd }
                Interface[this.exportTypeKey].changeStatus(req).then(res=>{
                    if (res.status == 200) {
                        this.$Message.success(res.message)
                        this.fnSearch()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
        },
	}
</script>
<template>
        
    <Layout id="role" class="router_view">
        <Layout class="right_wrap">

            <div class="content_header">
                <h5>{{$route.meta.title}}<span class="">{{'('+$route.meta.subtitle+')'}}</span></h5>
                <div class="head_right">
                    <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="showAddModule()">增加</Button>
                    <Button class="btn" type="error" icon="ios-trash-outline" @click="showDeleteModule()">批量删除</Button>
                </div>
            </div>

            <div class="opt_box">
                <searchbox class="inline_block_space" @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>
            </div>

            <Content>
                <div class="table_box">
                    <Table ref="selection" :data="pageListData" :columns="tableHeader" @on-selection-change="getSel" >
                        <template slot-scope="{ row }" slot="action">
                            <span class="btn_action" @click="showEditModule(row)">编辑</span>
                            <span class="btn_action" @click="showPermissionModule(row)">权限</span>
                            <span class="btn_action" @click="showDeleteModule(row)">删除</span>
                            
                        </template>
                    </Table>
                    
                    <div class="pager_box" v-show="pager.totalSize">
                        <div class="pager">
                            <Page show-total show-sizer show-elevator :page-size="pager.pageSize" @on-page-size-change="changePageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
                        </div>
                    </div>
                </div>
            </Content>
        </Layout>

        <Modal v-model="showDeleteBox" @on-ok="fnDelete()" @on-cancel="fnCancelDelete()" :title="'确认删除'" class-name="vertical-center-modal" width="300">
            <p>确认删除后,被删除的数据将无法恢复!!!</p>
        </Modal>
        
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
                        type: 'selection',
                        align: 'center',
                        width: 50,
                    },
					{
                        type: 'curIndex',
                        title: '序号',
                        align: 'center',
                        width: 60,
                        render: (h, params) => {
                            var text = (this.pager.pageNum-1)*this.pager.pageSize + params.index+1
                            return h('span', {}, text)
                        }
                    },
                    {
                        title: '角色名称',
                        key: 'roleName',
                        minWidth: 85,
                    },
                    {
                        title: '角色标识',
                        key: 'roleSign',
                        minWidth: 65,
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        minWidth: 65,
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        minWidth: 85,
                        render: (h, params) => {
                            var text = params.row.createTime ? params.row.createTime.replace("T", " ").split('.')[0] : ''
                            return h('span', {}, text)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 120,
                        align: 'center',
                        slot: 'action',
                        className: 'td_action'
                    }
                ],
                rmData: null,
                showDeleteBox: false, //是否显示删除弹窗
                multipleSelArr: [], //批量删除
                condition: {
                    list: [
                        {value: 'roleName', label: '请输入角色名称', type: 'input'}
                    ]
                },
                exportTypeKey: 'roleView',
			}
		},
		created(){
            
        },
		methods: {
            showAddModule(){
                this.$router.push({ name:this.$route.name + '_add' })
            },
            showEditModule(row){
                this.$router.push({ name:this.$route.name + '_edit', query: { id: row.roleId, nps: this.nps } })
            },
            showPermissionModule(row){
                this.$router.push({ name:this.$route.name + '_permission', query: { id: row.roleId, nps: this.nps } })
            },
            showDeleteModule(row){
                if(!row && !this.multipleSelArr.length){
                    this.$Message.error('请勾选需要删除的数据')
                    return
                }
                this.rmData = row || null
                this.showDeleteBox = true
            },
            fnDelete(){
                if(!this.rmData && !this.multipleSelArr.length){
                    this.$Message.info('请勾选需要删除的数据')
                    return
                }
                var rmArr = []
                rmArr = this.rmData ? [{roleId: this.rmData.roleId}] : this.multipleSelArr
                Interface[this.exportTypeKey].delete(rmArr).then(res=>{
                    if (res.status == 200) {
                        if(this.pager.pageNum> 1 && rmArr.length == this.pageListData.length){
                            this.pager.pageNum--
                        }
                        this.fnSearch()
                        this.fnCancelDelete()
                        this.$Message.success('删除成功!')
                    }else{
                        this.$Message.error(res.message)
                    }
                }).catch(err=>{
                    this.$Message.error(err.message);
                })
                
            },
            fnCancelDelete(){
                this.rmData = null
                this.showDeleteBox = false
            },
            getSel(selection){
                this.multipleSelArr = selection.map(item => { return {roleId: item.roleId} })
            },
			getPageListData(req){
				Interface[this.exportTypeKey].findpage(req).then(res=>{
					if (res.status == 200) {
                        this.loadData(res)
					}else{
                        this.$Message.error(res.message)
                    }
				}).catch(err=>{
                    this.pageNum = pageNum; // 出错 不切换分页
                    this.$Message.error(err.message)
                })
            },
        }
	}
</script>


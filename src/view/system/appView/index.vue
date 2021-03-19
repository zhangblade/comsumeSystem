<template>
        
    <Layout id="role" class="router_view">
        <Layout class="right_wrap">

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
                            <span class="btn_action" @click="fnAssignRole(row)">分配默认角色</span>
                            <Poptip class="delete_module" confirm @on-ok="fnRemove(row)" title="删除后不可恢复，确定要删除吗?" transfer placement="top-end">
                                <span class="btn_action" style="margin-right: 5px;">删除</span>
                            </Poptip>
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
                        title: 'Appid',
                        key: 'appId',
                        minWidth: 85,
                    },
                    {
                        title: '服务名称',
                        key: 'appName',
                        minWidth: 65,
                        render: (h, params) => {
                            var text = params.row.appName.split('(')[0]
                            return h('span', {}, text)
                        }
                    },
                    {
                        title: '服务代码',
                        key: 'productCode',
                        minWidth: 65,
                    },
                    {
                        title: '状态',
                        key: 'status',
                        minWidth: 65,
                        render: (h, params) => {
                            const status = {"0": '禁用', "1": '启用', '2': '删除'}
                            let text =  status[params.row.status]
                            return h('span', {}, text)
                        }
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
                        width: 160,
                        align: 'center',
                        slot: 'action',
                        className: 'td_action'
                    }
                ],
                condition: {
                    list: [
                        {value: 'appName', label: '请输入服务名称', type: 'input'}
                    ]
                },
                exportTypeKey: 'appView',
			}
		},
		created(){
            
        },
		methods: {
            fnAdd(){
                this.$router.push({ name: this.$route.name + '_add' })
            },
            fnEdit(row){
                this.$router.push({ name: this.$route.name + '_edit', query: { appId: row.appId, nps: this.nps } })
            },
            fnAssignRole(row){
                this.$router.push({ name: this.$route.name + '_assignRole', query: { appId: row.appId, deftRoleid: row.deftRoleid, nps: this.nps } })
            },
            fnRemove(row){
                var deleteItem = { appId: row.appId }
                Interface[this.exportTypeKey].delete(deleteItem).then(res=>{
                    if (res.status == 200) {
                        this.removeSuccessCallback()
                    }else{
                        this.$Message.error(res.message)
                    }
                }).catch(err=>{
                    this.$Message.error(err.message);
                })
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


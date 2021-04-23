<template>
        
    <Layout id="role" class="router_view">

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

                <!-- 表格数据 -->
                <Table ref="selection" :data="pageListData" :columns="tableHeader" >

                    <template slot-scope="{ row }" slot="action">

                        <span v-if="row.roleType == '2'" class="btn_action" @click="showEditModule(row)">编辑</span>
                        <span v-if="row.roleType == '2'" class="btn_action" @click="showPermissionModule(row)">权限</span>
                        <Poptip v-if="row.roleType == '2'" class="delete_module" confirm @on-ok="fnRemove(row)" title="删除后不可恢复，确定要删除吗?" transfer placement="top-end">
                            <span class="btn_action">删除</span>
                        </Poptip>
                        
                    </template>
                </Table>
                <!-- 分页器 -->
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
                    { title: '角色名称', key: 'roleName', minWidth: 85 },
                    { title: '角色标识', key: 'roleSign', minWidth: 65 },
                    { title: '备注', key: 'remark', minWidth: 110 },
                    { title: '角色类型', key: 'roleType', minWidth: 85,
                        render: (h, params) => {
                            var text = params.row.roleType == '2' ? '定制' : '通用'
                            return h('span', {}, text)
                        }
                    },
                    { title: '创建时间', key: 'createTime', minWidth: 85,
                        render: (h, params) => {
                            var text = params.row.createTime ? params.row.createTime.replace("T", " ").split('.')[0] : ''
                            return h('span', {}, text)
                        }
                    },
                    { title: '操作', key: 'action', width: 110, slot: 'action' }
                ],
                condition: {
                    list:[
                        {value: 'roleName', label: '角色名', type: 'input'},
                    ],
                },
                needWatchbCommid: false,
                exportTypeKey: 'role',
			}
		},
		created(){
            
        },
		methods: {
            showAddModule(){
                this.$router.push({ name: this.$route.name+"_add" })
            },
            showEditModule(row){
                this.$router.push({
                    name: this.$route.name+"_edit",
                    query: { id: row.roleId }
                })
            },
            showPermissionModule(row){
                this.$router.push({
                    name: this.$route.name + '_permission',
                    query: { id: row.roleId }
                })
            },
            fnRemove(row){
                var req = [{roleId: row.roleId}]
                Interface[this.exportTypeKey].delete(req).then(res=>{
                    if (res.status == 200) {
                        this.removeSuccessCallback(res)
                    }
                })
            },
        }
	}
</script>


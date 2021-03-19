<template>
        
    <Layout id="role" class="router_view">
        <Layout class="right_wrap">

            <div class="content_header">
                <h5>{{$route.meta.title}}</h5>
                <div class="head_right">
                    <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="showAddModule()">新增</Button>
                    <Button class="btn" @click="backPrevPage()">返回</Button>
                </div>

            </div>

            <div class="opt_box">
                <searchbox class="inline_block_space" @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>
            </div>
            
            <Content>
                <div class="table_box">
                    <!-- 表格数据 -->
                    <Table ref="selection" :data="pageListData" :columns="tableHeader">

                        <template slot-scope="{ row }" slot="action">
                            <Poptip class="delete_module" confirm @on-ok="fnRemove(row)" title="确认删除该角色?" transfer placement="top-end">
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

        <Drawer :width="375" :transfer="false" :inner="true" title="角色列表" v-model="roles.show" :styles="roles.styles">
            <div class="drawer_content">
                <CheckboxGroup v-model="roles.checkedList">
                    <div v-for="(item, index) in roles.list" :key="index" class="check_box">
                        <Checkbox :label="item.roleId">{{ item.roleName }}</Checkbox>
                    </div>
                </CheckboxGroup>
            </div>
            
            <div class="drawer_footer_fixed">
                <Button type="primary" v-if="roles.checkedList.length" @click="fnAddRoles()">添加</Button>
                <Button @click="cancelAdd()" style="margin-left:20px">取消</Button>
            </div>
        </Drawer>
        
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
                        type: 'curIndex',
                        title: '序号',
                        align: 'center',
                        width: 55,
                        render: (h, params) => {
                            var text = (this.pager.pageNum-1)*this.pager.pageSize + params.index+1
                            return h('span', {}, text)
                        }
                    },
                    {
                        title: '客户名称',
                        key: 'tenementName',
                        minWidth: 85,
                    },
                    {
                        title: '角色名称',
                        key: 'roleName',
                        minWidth: 85,
                    },
                    {
                        title: '角色类型',
                        key: 'roleTypeName',
                        minWidth: 85,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 55,
                        align: 'center',
                        slot: 'action',
                        className: 'td_action'
                    }
                ],
                condition: {
                    list: [
                        {value: 'roleName', label: '角色名称', type: 'input'},
                    ]
                },

                roles: {
                    show: false,
                    checkedList: [],
                    list: [],
                    
                    styles: {
                        height: 'calc(100% - 104px)',
                        overflow: 'auto',
                        position: 'static'
                    },
                },
                
                exportTypeKey: 'customerRoleView',
			}
		},
		created(){
            
        },
        computed: {
            baseParams () {
                return { tenementId: this.$route.query.bTenementid }
            }
        },
		methods: {
            showAddModule(){
                this.roles.show = true
                this.getRoleList()
            },
            showEditModule(row){
                this.$router.push({ name:this.$route.name + '_edit', query: { id: row.id } })
            },
            fnRemove(row){
                var deleteItem = {id: row.id}
                Interface[this.exportTypeKey].deleteRoles(deleteItem).then(res=>{
                    if (res.status == 200) {
                        this.removeSuccessCallback()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            getRoleList(){
                var req = {tenementId: this.$route.query.bTenementid}
                Interface[this.exportTypeKey].getRolesList(req).then(res=>{
                    if (res.status == 200) {
                        this.roles.checkedList = res.data.filter(i=>i.uHave).map(i=>i.roleId)
                        this.roles.list = res.data
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
                        this.$Message.error(res.message)
                    }
				})
            },
			fnAddRoles(){
                if(!this.roles.checkedList.length) return
                var req = {tenementId: this.$route.query.bTenementid, roleIds: this.roles.checkedList.join()}
				Interface[this.exportTypeKey].addRoles(req).then(res=>{
					if (res.status == 200) {
                        this.fnSearch()
                        this.roles.show = false
					}else{
                        this.$Message.error(res.message)
                    }
				})
            },
			cancelAdd(){
                this.roles.show = false
            },
            backPrevPage(){
                if(this.$route.query.nps){
                    this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
                }
                this.$router.go(-1)
            },
        }
	}
</script>
<style lang="less" scoped>
    .drawer_content{
        padding-bottom: 16px;
        .check_box{
            padding: 3px 0;
        }
    }
    .drawer_footer_fixed{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>


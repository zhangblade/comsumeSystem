<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            <div class="adapt_wrap">
                
                <Content>
                    <div class="table_box">
                        <Table ref="selection" :data="pageListData" :columns="tableHeader" @on-selection-change="getSel" ></Table>

                        <div class="pager_box" v-show="pager.totalSize">
                            <div class="pager">
                                <Page show-total show-sizer show-elevator :page-size="pager.pageSize" @on-page-size-change="changePageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <Button type="primary" @click="handleSubmit('itemData')">提交</Button>
                        <Button @click="backPrevPage()" style="margin-left:20px">取消</Button>
                    </div>
                </Content>
            </div>
        </Layout>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

	export default {
        name: 'add',
		data () {
            
			return {
                formRules: {
                    roleName: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                },
                itemData: {
                    appId: null,
                    roleName: '',
                    tenementId: this.$route.query.bTenementid,
                },
                tableHeader: [ // 表格  theader
					{
                        type: 'selection',
                        align: 'center',
                        width: 50,
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
                ],
                multipleSelArr: [],
                pageListData: [],
                pager: {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                    totalPages: 1,
                },

                exportTypeKey: 'customerRoleView',
			}
        },
        created(){
            this.getPageListData()
        },
		methods: {
            // 获取 select 下拉 option 数据
            getPageListData(){
                var req = {
                    pageNum: this.pager.pageNum,
                    pageSize: this.pager.pageSize,
                    params: {roleName: ''}
                }

                Interface.roleView.findpage(req).then(res=>{
                    if (res.status == 200) {
                        this.pageListData = res.data.content.map(i=>{
                            i.title = i.roleName
                            return i
                        })
                        this.pager.pageNum = res.data.pageNum
                        this.pager.pageSize = res.data.pageSize
                        this.pager.totalSize = res.data.totalSize
                        this.pager.totalPages = res.data.totalPages
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            getSel(selection){
                this.multipleSelArr = selection.map(item => { return {roleId: item.roleId} })
            },
            changePage (currentPage) {
                this.pager.pageNum = currentPage
                this.getPageListData()
            },
            changePageSize (pageSize) {
                this.pager.pageSize = pageSize
                if(this.pager.pageNum == 1){
                    this.getPageListData()
                }else{
                    this.pager.pageNum = 1
                }
            },
            handleSubmit(validInfo){

                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].add(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.backPrevPage()
                            }else{
                                this.$Message.error(res.message)
                            }
                        })
                    }
                })
                
            },
            backPrevPage(){
                if(this.$route.query.nps){
                    this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
                }
                this.$router.go(-1)
            },
        },
	}
</script>

<style lang="less" scoped>
</style>

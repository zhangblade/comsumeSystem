<template>
        
    <Layout id="tenementmanage" class="router_view">
        
        <Layout class="right_wrap">

            <div class="content_header">
                <h5>{{$route.meta.title}}</h5>
                <div class="head_right">
                    <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="showAddModule()">增加</Button>
                </div>

            </div>

            <div class="opt_box">
                <searchbox class="inline_block_space" @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>
            </div>
            <Content>
                <div class="table_box">
                    <Table ref="selection" :data="pageListData" :columns="tableHeader">
                        <template slot-scope="{ row }" slot="action">
                            <span :class="['btn_action', row.bTenemtype == '1' ? 'btn_action_disabled': '']" @click="showEditModule(row)">编辑</span>
                            <Poptip class="delete_module" :disabled="row.bTenemtype == '1' ? true: false" confirm @on-ok="fnRemove(row)" title="删除后不可恢复，确定要删除吗?" transfer placement="top-end">
                                <span :class="['btn_action', row.bTenemtype == '1' ? 'btn_action_disabled': '']" style="margin-right: 5px;">删除</span>
                            </Poptip>
                            <Poptip class="more_opts" trigger="click" transfer placement="bottom-end" padding="4px 0" v-if="row.bTenemtype != 1">
                                <span class="btn_action">更多<Icon type="md-arrow-dropdown" /></span>
                                <cellGroup slot="content">
                                    <p class="more_opt" v-if="row.bTenemtype == 2 && !row.userName" @click="fnCreateSupAdmin(row)"><span>创建管理员</span><Icon type="md-arrow-dropright" /></p>
                                    <p class="more_opt" v-if="row.bTenemtype == 2 && row.userName" @click="fnViewSupAdmin(row)"><span>超级管理员信息</span><Icon type="md-arrow-dropright" /></p>
                                    <p class="more_opt" v-if="row.bTenemtype == 2 && row.userName" @click="fnBuyService(row)"><span>开通服务</span><Icon type="md-arrow-dropright" /></p>
                                    <p class="more_opt" v-if="row.bTenemtype == 2 && row.userName" @click="fnViewRole(row)"><span>客户角色管理</span><Icon type="md-arrow-dropright" /></p>
                                </cellGroup>
                            </Poptip>
                        </template>
                    </Table>
                    <div class="pager_box" v-show="pager.totalSize">
                        <div class="pager">
                            <Page show-total show-sizer show-elevator :total="pager.totalSize" @on-page-size-change="changePageSize" :current="pager.pageNum" @on-change="changePage"></Page>
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
                        title: '公司全称',
                        key: 'bName',
                        minWidth: 86,
                    },
                    {
                        title: '公司简称',
                        key: 'bChsshortname',
                        minWidth: 86,
                    },
                    {
                        title: '公司类型',
                        key: 'bTenemtype',
                        minWidth: 76,
                        render: (h,params)=>{
                            var text = ''
                            if(params.row.bTenemtype == 1){
                                text = '平台运营公司'                                   
                            }
                            if(params.row.bTenemtype == 2){
                                text = '租用云平台服务的租户公司'                                   
                            }
                            if(params.row.bTenemtype >= 3){
                                text = '待扩展'                                   
                            }
                            return h('span',text)
                        }
                    },
                    {
                        title: '归属',
                        key: 'belongto',
                        minWidth: 76,
                        render: (h,params)=>{
                            var p = params.row
                            var text = ''
                            if(p.belongto == 1){
                                text = '企业'                                   
                            }
                            if(p.belongto == 2){
                                text = '党政机关'                                   
                            }
                            return h('span',text)
                        }
                    },
                    {
                        title: '公司性质',
                        key: 'bTenemattrib',
                        minWidth: 76,
                        render: (h,params)=>{
                            var text = ''
                            if(params.row.bTenemattrib == 1){
                                text = '非集团公司'                                   
                            }
                            if(params.row.bTenemattrib == 2){
                                text = '集团公司'                                   
                            }
                            return h('span',text)
                        }
                    },
                    {
                        title: '联系号码',
                        key: 'bTel',
                        minWidth: 76,
                    },
                    {
                        title: '公司地址',
                        key: 'baddr',
                        minWidth: 90,
                        render: (h,params)=>{
                            var text = params.row.bProvince + params.row.bCity + params.row.bDistrict + params.row.bAddress
                            return h('span',text)
                        }
                    },
                    {
                        title: '备注',
                        key: 'bRemark',
                        minWidth: 76,
                        ellipsis: true,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 110,
                        align: 'right',
                    }
                ],
                condition: {
                    list: [
                        {value: 'bName', label: '请输入公司全称', type: 'input'}
                    ]
                },
                exportTypeKey: 'customerView',
			}
        },
		created(){
            
        },
		methods: {
            showAddModule(){
                this.$router.push({ name: this.$route.name + '_add' })
            },
            showEditModule(row){
                if(row.bTenementid == 1) return
                this.$router.push({ name: this.$route.name + '_edit', query: { bTenementid: row.bTenementid, nps: this.nps } })
            },
            fnCreateSupAdmin(row){
                this.$router.push({ name: this.$route.name + '_createSupAdmin', query: { bTenementid: row.bTenementid, nps: this.nps} })
            },
            fnViewSupAdmin(row){
                this.$router.push({ name: this.$route.name + '_supAdmin', query: { bTenementid: row.bTenementid, nps: this.nps} })
            },
            fnViewRole(row){
                this.$router.push({ name: 'operate_customerRoleView', query: { bTenementid: row.bTenementid, nps: this.nps} })
            },
            fnBuyService(row){
                this.$router.push({ name: 'operate_buyServiceView', query: { bTenementid: row.bTenementid, nps: this.nps } })
            },
            fnRemove(row){
                Interface[this.exportTypeKey].delete({id:row.bTenementid}).then(res=>{
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
                        this.pageListData = []
                    }
				})
				
            },
        }
	}
</script>

<style lang="less" scoped>
    .boxed .inner {
        padding: 12px 20px;
        background-color: #ffffff;
        border-radius: 3px;
        box-shadow: 0px 3px 0px #dbdfe0;
        color: #7f95a9;
        overflow: hidden;
    }
    .boxed.no-padding .inner {
        padding: 0px;
    }
    .boxed .title-bar {
        background-color: #fafafa;
        padding: 10px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        overflow: hidden;
        border-bottom: 1px solid #eff2f7;
    }
    .boxed .title-bar.white {
        background-color: #fff;
    }
    .table-holder{
        padding: 0px 25px 20px 25px
    }
</style>


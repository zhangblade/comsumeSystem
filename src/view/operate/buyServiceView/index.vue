<template>
        
    <Layout id="role" class="router_view">
        <Layout class="right_wrap">

            <div class="content_header">
                <h5>{{$route.meta.title}}</h5>
                <div class="head_right">
                    <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="fnAdd()">新购服务</Button>
                    <Button class="btn" icon="ios-arrow-round-back" @click="backPrevPage()">返回</Button>
                </div>

            </div>
            
            <div class="opt_box">
                <Select v-model="appId" @on-change="changeApp" class="cus_width" placeholder="请选择服务">
                    <Option v-for="(item, index) in appList" :value="item.appId" :key="index">{{item.appName}}</Option>
                </Select>
            </div>
            
            <Content>
                <div class="table_box">
                    <Table ref="selection" :data="pageListData" :columns="tableHeader">
                        <template slot-scope="{ row }" slot="action">
                            <span class="btn_action" style="margin-right: 5px;" @click="fnRenew(row)">续费</span>
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
                        title: '社区名称',
                        key: 'bCommname',
                        minWidth: 85,
                    },
                    {
                        title: '实例详情',
                        key: 'detailsText',
                        minWidth: 65,
                    },
                    {
                        title: '起始时间',
                        key: 'beginTime',
                        minWidth: 85,
                    },
                    {
                        title: '到期时间',
                        key: 'expireTime',
                        minWidth: 85,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 75,
                        slot: 'action',
                    }
                ],
                orderType: [
                    {value: '1', label: '新购实例'},
                    {value: '2', label: '续费'},
                    {value: '3', label: '调整实例'},
                ],
                appId: '',
                appList: [],
                needInitData: false,

                exportTypeKey: 'customerView',
			}
		},
		created(){
            this.reporduceScene()
            this.getCanBuyList()
        },
		methods: {
            reporduceScene(){
                if(this.$route.params.appId){
                    this.appId = this.$route.params.appId
                }
            },
            fnAdd(){
                var query = Object.assign(this.$route.query, {nps: this.nps})
                this.$router.push({ name: this.$route.name + '_add', query: query })
            },
            fnRenew(row){
                this.$router.push({ name: this.$route.name + '_renew', query: { caseId: row.caseId, appId: row.appId, nps: this.nps } })
            },
            fnRemove(row){
                var deleteItem = { caseId: row.caseId, appId: row.appId }
                Interface[this.exportTypeKey].deleteService(deleteItem).then(res=>{
                    if (res.status == 200) {
                        if(this.pageListData.length == 1 && this.pager.pageNum > 1){
                            this.pager.pageNum--
                        }
                        this.getHasBuyService()
                        this.$Message.success('删除成功!')
                    }else{
                        this.$Message.error(res.message)
                    }
                }).catch(err=>{
                    this.$Message.error(err.message);
                })
            },
            getCanBuyList(){
                Interface[this.exportTypeKey].canBuyList().then(res=>{
                    if (res.status == 200) {
                        this.appList = res.data
                        if(this.appList.length){
                            this.appId = this.appId || this.appList[0].appId
                            this.getHasBuyService()
                        }else{
                            this.$Message.info('暂无服务')
                        }
                    }else{
                        this.$Message.error(res.message)
                    }
                }).catch(err=>{
                    this.$Message.error(err.message);
                })
            },
            changeApp(val){
                this.pager.pageNum = 1
                this.getHasBuyService()
            },
            getHasBuyService(){
                if(!this.$route.query.bTenementid){
                    this.$Message.info('暂未查到公司信息')
                    return
                }
                var req = {
                    pageNum: this.pager.pageNum,
                    pageSize: this.pager.pageSize,
                    params: {
                        tenementId: this.$route.query.bTenementid,
                        appId: this.appId,
                    }
                }
                Interface[this.exportTypeKey].hasBuyService(req).then(res=>{
                    if (res.status == 200) {
                        this.loadData(res)
                    }else{
                        this.pageListData = []
                        this.$Message.error(res.message);
                    }
                }).catch(err=>{
                    this.pageListData = []
                    this.$Message.error(err.message);
                })
            },
            changePage(page){
                this.pager.pageNum = page
                this.getHasBuyService()
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
    .cus_width{
        width: auto;
        min-width: 100px;
    }
</style>

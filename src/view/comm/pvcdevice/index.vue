<template>
        
    <Layout id="pvcdevice" class="router_view" v-loading="loadingTable">
        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
            <div class="head_right">
                
            </div>
        </div>

        <Content>
            <div class="opt_box jc_space_between">
                <div class="adapt_cell tree_select">
                    <treeselect v-model="extParams.bCommids" :multiple="true" :options="communityList" @close="fnChooseComm" placeholder="请选择社区" :limit="2" :limitText="fnLimitText" :flat="true" />
                </div>
                <div class="adapt_cell tree_select" v-if="extParams.bCommids.length">
                    <treeselect v-model="extParams.groupIds" :multiple="true" :options="groupList" @close="fnChooseGroup" placeholder="请选择群组" :limit="2" :limitText="fnLimitText" :flat="true" />
                </div>
                <div class="adapt_cell">
                    <searchbox class="dib" @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>
                </div>
            </div>

            <Table ref="selection" :data="pageListData" :columns="tableHeader"></Table>
            <div class="pager_box" v-show="pager.totalSize">
                <Page show-total show-sizer show-elevator :page-size="pager.pageSize" @on-page-size-change="changePageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
            </div>
            
        </Content>


    </Layout>
    
</template>

<script>

    
    import Interface from '@/api/data'
    
    import { recursionByFiled } from '@/libs/tools'

    import searchbox from '@/components/common/searchbox'

    import pageList from '@/mixin/pageList'

    // import the component
    import Treeselect from '@riophae/vue-treeselect'
    // import the styles
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

	export default {
        mixins: [ pageList ],
        components: { searchbox, Treeselect },
		data () {
            
			return {
                tableHeader: [
                    { title: '设备编号', key: 'devId', minWidth: 70, className: 'cus_td_pad',},
                    { title: '设备名称', key: 'devName', minWidth: 70, className: 'cus_td_pad'},
                    { title: '设备分类', key: 'devClassName', minWidth: 70, className: 'cus_td_pad'},
                    { title: '设备类型', key: 'devTypeName', minWidth: 70, className: 'cus_td_pad'},
                    { title: '设备位置', key: 'location', minWidth: 95, ellipsis: true, tooltip: true, className: 'cus_td_pad'},
                    { title: '设备状态', key: 'enable', width: 72, className: 'cus_td_pad',
                        render: (h, params)=>{
                            let text = params.row.enable == '0' ? '未启用' : '启用'
                            return h('span', text)
                        }
                    },
                ],

                condition: {
                    list:[
                        {value: 'devId', label: '设备编号', type: 'input'},
                        {value: 'devName', label: '设备名称', type: 'input'},
                    ],
                },
                extParams: {
                    bCommids: [],
                    groupIds: [],
                },
                
                communityList: [],
                groupList: [],
                
                loadingTable:false,
                exportTypeKey: 'pvcdevice',
                
			}
		},
		created(){
            this.getCommunityList()
        },
        mounted () {

        },
        computed: {
            
        },
		methods: {
			getPageListData(req){
                this.loadingTable = true
				Interface[this.exportTypeKey].findpage(req).then(res=>{
					if (res.status == 200) {
                        this.loadData(res)
					}else{
                        this.pageListData = []
                    }
                    this.loadingTable = false
				}).catch(err=>{
                    this.loadingTable = false
                })
            },
            getCommunityList(){
                Interface.common.getCommunityList().then(res=>{
                    if(res.status == 200 && res.data && res.data.length > 0){
                        this.communityList = res.data.map(i=>{
                            i.title = i.bCommname
                            i.label = i.bCommname
                            i.id = i.bCommid
                            return i
                        })
                    }else{
                        this.communityList = []
                    }
                })
            },
            getDevGroup(){
                let req = { bCommids: this.extParams.bCommids }
                Interface.common.getDevGroup(req).then(res=>{
                    if(res.status == 200 && res.data && res.data.length > 0){
                        let filed = { label: 'groupName', id: 'groupId' }
                        this.groupList = recursionByFiled(res.data, filed)
                    }else{
                        this.groupList = []
                    }
                })
            },
            fnChooseComm(value, instanceId){
                this.extParams.groupIds = []
                if(value.length){
                    this.getDevGroup()
                }
            },
            fnChooseGroup(value, instanceId){
            },
            fnLimitText(count){
                return '+'+count
            },
        },
        watch: {
            
        }
	}
</script>

<style lang="less" scoped>
    .uploadbtn{
        display: inline-block;
        margin-left: 20px;
    }
    .cus_upload_list{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .list_icon, .list_name{
            vertical-align: middle;
        }
    }
</style>
<style lang="less">

    .ivu-select.ivu-select-multiple.no_close_tag{
        .ivu-select-selection{
            .ivu-tag.ivu-tag-checked{
                .ivu-icon.ivu-icon-ios-close{
                    display: none;
                }
                .ivu-tag-text{
                    margin-right: 0;
                }
            }
        }
    }
    .nouploadlist .ivu-upload-list{
        display: none;
    }
    #personview .table_box .ivu-table .ivu-table-header .cus_action_padding .ivu-table-cell,
    #personview .table_box .ivu-table .ivu-table-body .cus_action_padding .ivu-table-cell{
        padding: 0 5px;
    }

    .cus_dib{
        width: auto;
        min-width: 80px;
        margin-right: 5px;
    }
    .cus_ipt{
        width: 80px;
        margin-right: 5px;
    }
    .connect_line{
        margin-right: 5px;
    }
    .large_tag{
        height: 32px;
        line-height: 32px;
        margin: 0 5px 0 0;
    }
    .icon_img{
        display: inline-block; cursor: pointer;width: 28px;height: 28px; font-size: 0; line-height: 1;
    }
    .smallPic_box{
        max-width: 200px;
        max-height: 300px;
    }
    .smallPic{
        display: block;
        max-width: 100%;
        max-height: 100%;
        margin: 0 auto;
    }
    .bigPicImg{
        max-width: 100%;
        max-height: 100%;
    }
    .form_item{
        margin-bottom: 20px;
        &:last-child{
            margin-bottom: 0;
        }
    }
    .custom_card_boxshadow{
        margin-bottom: 20px;
        .custom_card_cont{
            margin-top: 10px;
        }
    }
</style>
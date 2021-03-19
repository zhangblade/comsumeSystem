<template>
        
    <Layout id="personnel" class="router_view" v-loading="loadingTable">
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
                    <treeselect v-model="extParams.bGroupids" :multiple="true" :options="groupList" @close="fnChooseGroup" placeholder="请选择群组" :limit="2" :limitText="fnLimitText" :flat="true" />
                </div>
                <div class="adapt_cell">
                    <searchbox class="dib" @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current">
                        <div class="dib inline_block_space" slot="before">
                            <Select v-model="extParams.cardState" placeholder="请选择卡状态" clearable>
                                <Option v-for="item in cardStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                    </searchbox>
                </div>
            </div>
            <Table ref="selection" :data="pageListData" :columns="tableHeader">
                <template slot-scope="{ row, index }" slot="bPhoto">
                        <Poptip v-if="row.bPhoto" class="more_opts btn_action" trigger="hover" transfer placement="left-end" padding="4px 0">
                            <Icon style="cursor: pointer;" type="md-image" size="24" color="#5c6b77" @click="openBigPic(row, index)" />
                            <div class="smallPic_box" slot="content">
                                <img :src="row.bPhoto || lostPic" class="smallPic" />
                            </div>
                        </Poptip>
                        <span v-else class="">暂无</span>
                </template>
            </Table>
            <div class="pager_box" v-show="pager.totalSize">
                <Page show-total show-sizer show-elevator :page-size="pager.pageSize" @on-page-size-change="changePageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
            </div>
            
        </Content>

        <div v-show="showBigPicBox" class="bigPic fixed">
            <div class="mask" @click="closeBigPic"></div>
            <img id="bigPicImg" :src="bigPicSrc" alt="">
        </div>


    </Layout>
    
</template>

<script>

    
    import Interface from '@/api/data'
    
    import { recursionByFiled, getParentsId } from '@/libs/tools'
    
    import { cardStateList } from '@/components/common/selectList'

    import searchbox from '@/components/common/searchbox'

    import pageList from '@/mixin/pageList'

    // import the component
    import Treeselect from '@riophae/vue-treeselect'
    // import the styles
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    import iconPic from '@/assets/images/icon_pic.png'
    import lostPic from '@/assets/images/lostPic.png'

	export default {
        mixins: [ pageList ],
        components: { searchbox, Treeselect },
		data () {
            
			return {
                iconPic,
                lostPic,

                showBigPicBox: false,
                bigPicSrc: '',

                tableHeader: [
                    { title: '社区名称', key: 'bCommName', minWidth: 80, className: 'cus_td_pad' },
                    { title: '人员编号', key: 'bPerno', minWidth: 70, ellipsis: true, tooltip: true, className: 'cus_td_pad'},
                    { title: '人员名称', key: 'bPername', minWidth: 70, className: 'cus_td_pad'},
                    { title: '所在群组', key: 'bGroupName', minWidth: 95, ellipsis: true, tooltip: true, className: 'cus_td_pad'},
                    { title: '卡号', key: 'bCardno', minWidth: 72, className: 'cus_td_pad'},
                    { title: '卡类型', key: 'bCardtypeName', minWidth: 55, className: 'cus_td_pad'},
                    { title: '卡种类', key: 'bIsidicName', minWidth: 50, className: 'cus_td_pad'},
                    { title: '卡状态', key: 'bCardstateName', minWidth: 50, className: 'cus_td_pad'},
                    { title: '余额', key: 'bMoney', minWidth: 50, className: 'cus_td_pad'},
                    { title: '押金', key: 'bDeposit', minWidth: 50, className: 'cus_td_pad'},
                    { title: '性别', key: 'bSexName', width: 35, className: 'cus_td_pad'},
                    { title: '电话', key: 'bMobile', minWidth: 86, className: 'cus_td_pad'},
                    { title: '证件号', key: 'bIdcard', minWidth: 135, className: 'cus_td_pad'},
                    { title: '有效开始时间', key: 'bBegintime', minWidth: 125, className: 'cus_td_pad'},
                    { title: '有效结束时间', key: 'bEndtime', minWidth: 125, className: 'cus_td_pad'},
                    { title: '备注', key: 'bMemo', minWidth: 70, ellipsis: true, tooltip: true, className: 'cus_td_pad'},
                    { title: '人员照片', key: 'bPhoto', width: 60, slot: 'bPhoto', align: 'center', className: 'cus_td_pad' },
                ],// table当前表头

                condition: {
                    list:[
                        {value: 'bPerno', label: '人员编号', type: 'input'},
                        {value: 'bPername', label: '人员名称', type: 'input'},
                        {value: 'bCardno', label: '人员卡号', type: 'input'},
                    ],
                },
                extParams: {
                    groupId: '',
                    cardState: '',
                    bCommids: [],
                    bGroupids: [],
                },
                cardStateList,
                
                communityList: [],
                groupList: [],
                
                loadingTable:false,
                exportTypeKey: 'personnel',
                
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
            openBigPic (row, index) {
                if(!row.bPhoto){
                    this.$Message.info('照片已丢失')
                    return
                }
                this.bigPicSrc = row.bPhoto
                this.showBigPicBox = true
            },
            closeBigPic () {
                this.showBigPicBox = false
                this.bigPicSrc = ''
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
            getPersonGroup(){
                let req = { bCommids: this.extParams.bCommids }
                Interface.common.getPersonGroup(req).then(res=>{
                    if(res.status == 200 && res.data && res.data.length > 0){
                        let filed = { label: 'groupName', id: 'groupId' }
                        this.groupList = recursionByFiled(res.data, filed)
                    }else{
                        this.groupList = []
                    }
                })
            },
            fnChooseComm(value, instanceId){
                this.extParams.bGroupids = []
                if(value.length){
                    this.getPersonGroup()
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

<style lang="less">

    
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
</style>
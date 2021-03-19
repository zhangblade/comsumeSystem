<template>
        
    <Layout id="full_page_layout" class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
                <div class="head_right">
                    <Button class="btn" icon="ios-arrow-round-back" @click="backPrevPage()">返回</Button>
                </div>
            </div>
            
            <Content>
                <Card class="custom_card_boxshadow" shadow :bordered="false">
                    <h5 class="title">服务</h5>
                    <RadioGroup v-if="unBuyService.length" v-model="appId" @on-change="changeProduct">
                        <Radio class="server_item" :label="item.appId" v-for="(item, index) in unBuyService" :key="index">{{item.appName}}</Radio>
                    </RadioGroup>
                    <p class="" v-if="!unBuyService.length">暂无数据</p>
                </Card>
                <Card v-if="appId" class="custom_card_boxshadow" shadow :bordered="false">
                    <h5 class="title">社区</h5>
                    <div v-if="communityList.length">
                        <RadioGroup class="community_List" v-model="bCommid" @on-change="changeCommunity">
                            <Radio class="community_item" :label="item.bCommid" v-for="(item, index) in communityList" :key="index">{{item.bCommname}}</Radio>
                        </RadioGroup>
                        <div class="pager_box" v-show="pager.totalSize">
                            <div class="pager">
                                <Page simple  :page-size="pager.pageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
                            </div>
                        </div>
                    </div>
                    <p class="" v-if="!communityList.length">暂无数据</p>
                </Card>
                <Card v-if="appId && bCommid" class="custom_card_boxshadow" shadow :bordered="false">
                    <h5 class="title">服务属性</h5>
                    <div class="list" v-if="goodsList.length">
                        <div class="goods_item" v-for="(item, index) in goodsList" :key="index">
                            <span class="proName">{{item.proName}}</span>
                            <span class="proName">单价：{{item.proPrice}}</span>
                            购买数量<Input-number class="proNum" :min="0" v-model="item.proNum"></Input-number>个
                        </div>
                    </div>
                    <p class="" v-if="!goodsList.length">暂无数据</p>
                </Card>
                <Card v-if="appId && bCommid && goodsList.length" class="custom_card_boxshadow" shadow :bordered="false">
                    <h5 class="title">购买时长</h5>
                    <div class="">
                        <RadioGroup v-model="curSelectedExist" type="button">
                            <Radio :label="item.value" v-for="(item, index) in existTimeUnitList" :key="index">{{item.label}}</Radio>
                        </RadioGroup>
                        <div class="custom_time" v-if="curSelectedExist == 'custom'">
                            <Input-number :min="0" v-model="timeNum"></Input-number><span class="cus_letter_space">个</span>
                            <Select class="cus_select" v-model="timeUnit">
                                <Option v-for="item in timeUnitList" :value="item.value" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </div>
                    </div>
                </Card>
            </Content>
            
        </Layout>

        <div class="fix_footer">
            <div class="price_box"><span class="before">配置费用：</span><span class="price">{{totalPrice}}</span><span class="after">元</span></div>
            <div class="submit_box">
                <Button :disabled="disableSubmit" type="warning" @click="fnShowModel()">确认开通</Button>
            </div>
        </div>
        
        <Modal v-model="showModel" @on-ok="handleSubmit()" @on-cancel="cancelSubmit()" :title="'确认开通'" class-name="vertical-center-modal" width="300">
            <p>开通后方可使用，确认开通？</p>
        </Modal>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

	export default {
        name: 'add',
		data () {
            
			return {
                
                appId: '',
                bCommid: '',
                unBuyService: [],
                communityList: [],
                pager: {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                    totalPages: 1,
                },
                goodsList: [],
                curSelectedExist: '1',
                existTimeUnitList: [
                    {value: '1', label: '1个月'},
                    {value: '2', label: '2个月'},
                    {value: '3', label: '1季度'},
                    {value: '6', label: '2季度'},
                    {value: '12', label: '1年'},
                    {value: '24', label: '2年'},
                    {value: 'custom', label: '自定义'},
                ],
                timeNum: 1,
                timeUnit: '2',
                timeUnitList: [{value: '0', label: '年'}, {value: '1', label: '季度'}, {value: '2', label: '月'} ],

                showModel: false,

                exportTypeKey: 'customerView',
			}
        },
        created(){
            this.getUnBuyServiceList()
            this.$store.commit('setCusClassName', 'placeAnServer')
        },
        computed: {
            actTimeNum () {
                var num = 0
                if(this.curSelectedExist != 'custom'){
                    num = Number(this.curSelectedExist)
                }else{
                    if(this.timeUnit == '0') num = this.timeNum*12
                    else if(this.timeUnit == '1') num = this.timeNum*3
                    else num = this.timeNum
                }
                return num
            },
            totalPrice () {
                var totalPrice = 0
                var res = this.goodsList.map(i=>10000*i.proPrice*i.proNum).reduce((pre, cur) => pre + cur, 0)*this.actTimeNum/10000
                return res
            },
            disableSubmit(){
                var flag = (!this.appId || !this.bCommid || !this.goodsList.length || !this.actTimeNum) ? true : false
                return false
            }
        },
		methods: {
			getUnBuyServiceList(){
                var req = { pageNum: 1, pageSize: 10, params: this.$route.query }
				Interface[this.exportTypeKey].unBuyService(req).then(res=>{
					if (res.status == 200) {
                        this.unBuyService = res.data.content
                        if(this.unBuyService.length){
                            this.changeProduct(this.unBuyService[0].appId)
                        }
					}else{
                        this.$Message.error(res.message)
                    }
				}).catch(err=>{
                    this.$Message.error(err.message)
                })
            },
            changeProduct(appId){
                this.appId = appId
                this.pager.pageNum = 1
                this.getCommunityList()
            },
            getCommunityList(){
                var req = {
                    pageNum: this.pager.pageNum, pageSize: this.pager.pageSize,
                    params: {
                        appId: this.appId, tenementId: this.$route.query.bTenementid
                    }
                }
                Interface[this.exportTypeKey].getUnBuyServiceCommunity(req).then(res=>{
                    this.resetCommunityList()
                    if (res.status == 200) {
                        this.communityList = res.data.content
                        this.pager.pageNum = res.data.pageNum
                        this.pager.pageSize = res.data.pageSize
                        this.pager.totalSize = res.data.totalSize
                        this.pager.totalPages = res.data.totalPages
                        if(this.communityList.length){
                            this.changeCommunity(this.communityList[0].bCommid)
                        }
                    }else{
                        this.$Message.error(res.message)
                    }
                }).catch(err=>{
                    this.$Message.error(err.message)
                })
            },
            resetCommunityList(){
                this.bCommid = ''
                this.communityList = []
                this.pager.pageNum = 1
                this.pager.totalSize = 0
                this.pager.totalPages = 1
            },
            resetGoodsList(data){
                this.goodsList = []
            },
            resetTime(){
                this.curSelectedExist = '1'
                this.timeNum = 1
            },
            changePage (currentPage) {
                this.pager.pageNum = currentPage
                this.getCommunityList()
            },
            changeCommunity(bCommid){
                this.bCommid = bCommid
                this.getGoodsList()
            },
            getGoodsList(){
                var req = { appId: this.appId, bCommid: this.bCommid }
                Interface[this.exportTypeKey].getList(req).then(res=>{
                    if (res.status == 200) {
                        this.goodsList = res.data.map(i=>{
                            i.proNum = 1
                            return i
                        })
                    }else{
                        this.resetGoodsList()
                        this.resetTime()
                    }
                })
            },
            handleSubmit(){
                var orderDetails = this.goodsList.map(i=>{
                    var item = {
                        proId: i.proId,
                        proName: i.proName,
                        proPrice: i.proPrice,
                        proNum: i.proNum,
                        id: i.id,
                    }
                    return item
                })
                var req = {
                    appId: this.appId,
                    bCommid: this.bCommid,
                    timeUnit: '2',
                    timeNum: this.actTimeNum,
                    lastFee: this.totalPrice,
                    orderType: '1',
                    orderDetails: orderDetails,
                }
                Interface[this.exportTypeKey].placeAnOrder(req).then(res=>{
                    if (res.status == 200) {
                        this.$Message.success(res.message)
                        this.backPrevPage()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            fnShowModel(){
                this.showModel = true
            },
            cancelSubmit(){
                this.showModel = false
            },
            backPrevPage(){
                var par = Object.assign( this.$route.query, { appId: this.appId })
                if(this.$route.query.nps){
                    this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: par })
                }
                this.$router.go(-1)
            },
        },
        watch: {
            unBuyService: {
                handler(val){
                    if(!val.length){
                        this.resetCommunityList()
                    }
                },
            },
            communityList: {
                handler(val){
                    if(!val.length){
                        this.resetGoodsList()
                        this.resetTime()
                    }
                },
            },
        },
        beforeDestroy(){
            this.$store.commit('setCusClassName', '')
        }
	}
</script>

<style lang="less" scoped>
    .content_layout{
        display: flex;
        flex-direction: row;
        .list{
            width: 180px;
            min-width: 180px;
            margin-right: 16px;
            padding: 0 8px;
            box-sizing: border-box;
            .list_wrap{
                padding: 8px;
                box-sizing: border-box;
                box-shadow: 0 2px 12px rgba(0,0,0,.1);
                overflow: auto;
                max-height: 400px;
            }
        }
        .content_scroll_x{
            flex: auto;
            overflow-x: hidden;
        }
    }
    .overflow_auto{
        overflow: visible;
    }
    .cus_select{
        width: auto;
    }
    .custom_time{
        display: inline-block;
        vertical-align: middle;
        margin-left: 20px;
    }
    .title{
        font-size: 12px;
        font-weight: normal;
        color: #999999;
        line-height: 1.5;
        margin-bottom: 10px;
    }
    .pager_box{
        overflow: visible;
    }
    .goods_item{
        margin-bottom: 20px;
        &:last-child{
            margin-bottom: 0;
        }
        .proName{
            display: inline-block;
            vertical-align: middle;
            min-width: 150px;
        }
        .proNum{
            margin: 0 10px;
        }
    }
    .cus_letter_space{
        margin: 0 10px;
    }
    .community_item, .server_item{
        padding: 5px 10px;
        min-width: 150px;
    }
    #full_page_layout{
        position: relative;
        .fix_footer{
            border-top: 1px solid #eaeaea;
            width: 100%;
            margin: 0 auto;
            position: absolute;
            left: 0;
            bottom: 0;
            height: 70px;
            box-sizing: border-box;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            line-height: 70px;
            background-color: #fff;
            z-index: 9;
            .price_box{
                color: #333;
                letter-spacing: 2px;
                .before{
                    font-size: 16px;
                }
                .price{
                    color: #ff7c2c;
                    font-size: 28px;
                    font-weight: bold;
                }
                .after{
                    font-size: 12px;
                }
            }
            
        }
    }
</style>
<style lang="less">
    .placeAnServer{
        .routerview_container{
            overflow: hidden;
            padding: 0 !important;
        }
        #full_page_layout{
            height: 100%;
            overflow: hidden;
            .right_wrap{
                flex-grow: 0;
                height: calc(~"100% - 70px");
                padding: 16px;
                overflow: auto;
            }
        }
    }
    .ivu-card-shadow.custom_card_boxshadow{
        margin-bottom: 20px;
        box-shadow: 0px 0px 51px 0px rgba(142, 142, 142, 0.11);
        &:hover{
            box-shadow: 0px 0px 51px 0px rgba(142, 142, 142, 0.11);
        }
        &:last-child{
            margin-bottom: 0;
        }
    }
</style>

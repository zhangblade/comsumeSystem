<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
                <div class="head_right">
                    <Button class="btn" icon="ios-arrow-round-back" @click="backPrevPage()">返回</Button>
                </div>
            </div>
            
            <Content>
                <Card class="custom_card_boxshadow" shadow :bordered="false">
                    <h5 class="title">{{ itemData.caseName }}</h5>
                    <div class="server_cont">
                        <p class="cont_text">开通社区：{{ itemData.bCommname }}</p>
                        <p class="cont_text">已购数量：{{ itemData.detailsText }}</p>
                        <p class="cont_text">有效时长：{{ itemData.beginTime + '  ~  ' + itemData.expireTime }}</p>
                    </div>
                </Card>
                <Card class="custom_card_boxshadow" shadow :bordered="false">
                    <h5 class="title">续费时长</h5>
                    <div class="">
                        <RadioGroup v-model="curSelectedExist" type="button" @on-change="getRenewOrder">
                            <Radio :label="item.value" v-for="(item, index) in existTimeUnitList" :key="index">{{item.label}}</Radio>
                        </RadioGroup>
                        <div class="custom_time" v-if="curSelectedExist == 'custom'">
                            <Input-number :min="0" v-model="timeNum" @on-change="getRenewOrder"></Input-number><span class="cus_letter_space"></span>
                            <Select class="cus_select" v-model="timeUnit" @on-change="getRenewOrder">
                                <Option v-for="item in timeUnitList" :value="item.value" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </div>
                    </div>
                </Card>
            </Content>
            
        </Layout>

        <div class="fix_footer">
            <div class="price_box">
                <span class="before">配置费用：</span><span class="price">{{ lastFee }}</span><span class="after">元</span>
                <span class="renew_tips" v-if="renewExpireTime">续费到期时间：{{ renewExpireTime }}</span>
            </div>
            <div class="submit_box">
                <Button :loading="isLoading" :disabled="disableSubmit" type="warning" @click="fnShowModel()">确认续费</Button>
            </div>
        </div>
        
        <Modal v-model="showModel" @on-ok="handleSubmit()" @on-cancel="cancelSubmit()" :title="'确认续费'" class-name="vertical-center-modal" width="300">
            <p>续费后可延长使用时长，确认续费？</p>
        </Modal>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

	export default {
        name: 'add',
		data () {
            
			return {
                
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

                itemData: {
                    caseName: '',
                    bCommid: '',
                    bCommname: '',
                    detailsText: '',
                    beginTime: '',
                    expireTime: '',
                },
                lastFee: 0,
                renewExpireTime: '',

                isLoading: false,

                showModel: false,

                exportTypeKey: 'customerView',
			}
        },
        created(){
            this.getServerInfo()
            // 设置底部固定
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
            disableSubmit(){
                return !this.actTimeNum
            }
        },
		methods: {
			getServerInfo(){
                var req = this.$route.query
				Interface[this.exportTypeKey].getRenewInfo(req).then(res=>{
					if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
                        this.getRenewOrder()
					}else{
                        this.$Message.error(res.message)
                    }
				}).catch(err=>{
                    this.$Message.error(err.message)
                })
            },
			getRenewOrder(){
                var req = { caseId: this.$route.query.caseId, appId: this.$route.query.appId, timeNum: this.actTimeNum, timeUnit: '2' }
				Interface[this.exportTypeKey].getRenewOrder(req).then(res=>{
					if (res.status == 200) {
                        this.lastFee = res.data.lastFee
                        this.renewExpireTime = res.data.expireTime
					}else{
                        this.$Message.error(res.message)
                    }
				}).catch(err=>{
                    this.$Message.error(err.message)
                })
            },
            fillForm(beFilledItem, item){
                Object.keys(beFilledItem).forEach(key=>{
                    if(beFilledItem.hasOwnProperty(key)){
                        beFilledItem[key] = item[key]
                    }
                })
            },
            handleSubmit(){
                var req = {
                    appId: this.$route.query.appId,
                    bCommid: this.itemData.bCommid,
                    caseId: this.$route.query.caseId,
                    timeUnit: '2',
                    timeNum: this.actTimeNum,
                    lastFee: this.lastFee,
                    orderType: '2',
                }
                
                this.isLoading = true
                Interface[this.exportTypeKey].payRenewOrder(req).then(res=>{
                    if (res.status == 200) {
                        this.$Message.success(res.message)
                        this.backPrevPage()
                    }else{
                        this.$Message.error(res.message)
                    }
                    this.isLoading = false
                }).catch(err=>{
                    this.isLoading = false
                })
            },
            fnShowModel(){
                this.showModel = true
            },
            cancelSubmit(){
                this.showModel = false
            },
            backPrevPage(){
                if(this.$route.query.nps){
                    this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
                }
                this.$router.go(-1)
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
        font-size: 16px;
        font-weight: normal;
        color: #333333;
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
    .router_view{
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
                .renew_tips{
                    font-size: 14px;
                    color: #999;
                    margin-left: 20px;
                }
                .after{
                    font-size: 12px;
                }
            }
            
        }
    }
    .server_cont{
        .cont_text{
            line-height: 32px;

        }
    }
</style>
<style lang="less">
    .placeAnServer{
        .routerview_container{
            overflow: hidden;
            padding: 0 !important;
        }
        .router_view{
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

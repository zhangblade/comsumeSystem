<template>
        
    <Layout id="desc" class="router_view">
        
        <Content class="desc_wrap">
            <div class="flex_layout flex_row head_row">
                <div class="equal row_item">
                    <Card class="custom_card_boxshadow head_card" shadow :bordered="false">
                        <div class="">统计日期: {{descInfo.condate}}</div>
                    </Card>
                </div>
            </div>
            <div class="flex_layout flex_row">
                <div class="equal row_item">
                    <Card class="custom_card_boxshadow" shadow :bordered="false">
                        <p slot="title"><span class="title_text">社区</span></p>
                        <div class="chart_box" id="commChart"></div>
                    </Card>
                </div>
                <div class="equal row_item">
                    <Card class="custom_card_boxshadow" shadow :bordered="false">
                        <p slot="title"><span class="title_text">本周社区数据统计</span></p>
                        <ul class="group_list flex_layout fw_nowrap ai_center">
                            <li class="group_item blue"><i class="cus_icon icon_community"></i><p class="tt">社区总数</p><p class="cont"><count-to :end="descInfo.comInfo.commNum"></count-to></p></li>
                            <li class="group_item yellow"><i class="cus_icon icon_trading"></i><p class="tt">交易总量</p><p class="cont"><count-to :end="descInfo.comInfo.countnum"></count-to></p></li>
                            <li class="group_item red"><i class="cus_icon icon_consumption"></i><p class="tt">消费金额总量</p><p class="cont"><count-to :decimals='2' :end="descInfo.comInfo.countmoney"></count-to></p></li>
                            <li class="group_item orange"><i class="cus_icon icon_offers"></i><p class="tt">优惠金额总量</p><p class="cont"><count-to :decimals='2' :end="descInfo.comInfo.countdiscmoney"></count-to></p></li>
                            <li class="group_item green"><i class="cus_icon icon_cash"></i><p class="tt">现金支付金额总量</p><p class="cont"><count-to :decimals='2' :end="descInfo.comInfo.countcash"></count-to></p></li>
                            <li class="group_item blue"><i class="cus_icon icon_wallets"></i><p class="tt">补贴支付金额总量</p><p class="cont"><count-to :decimals='2' :end="descInfo.comInfo.countsubsidy"></count-to></p></li>
                        </ul>
                    </Card>
                </div>
            </div>
            <div class="flex_layout flex_row">
                <div class="equal row_item">
                    <Card class="custom_card_boxshadow" shadow :bordered="false">
                        <p slot="title"><span class="title_text">人员</span></p>
                        <div class="chart_box" id="personChart"></div>
                    </Card>
                </div>
                <div class="equal row_item">
                    <Card class="custom_card_boxshadow" shadow :bordered="false">
                        <p slot="title"><span class="title_text">本周人员数据统计</span></p>
                        <ul class="group_list flex_layout fw_nowrap ai_center">

                            <li class="group_item blue"><i class="cus_icon icon_people"></i><p class="tt">人员总数</p><p class="cont"><count-to :end="descInfo.perInfo.personnelNum"></count-to></p></li>
                            <li class="group_item yellow"><i class="cus_icon icon_trading"></i><p class="tt">每人次消费金额</p><p class="cont"><count-to :decimals='2' :end="descInfo.perInfo.moneyperperson"></count-to></p></li>
                            <li class="group_item red"><i class="cus_icon icon_consumption"></i><p class="tt">日均消费人数</p><p class="cont"><count-to :decimals='2' :end="descInfo.perInfo.dayAverageConsumeNum"></count-to></p></li>
                        </ul>
                    </Card>
                </div>
            </div>
            <div class="flex_layout flex_row">
                <div class="equal row_item">
                    <Card class="custom_card_boxshadow" shadow :bordered="false">
                        <p slot="title"><span class="title_text">设备</span></p>
                        <div class="chart_box" id="devChart"></div>
                    </Card>
                </div>
                <div class="equal row_item">
                    <Card class="custom_card_boxshadow" shadow :bordered="false">
                        <p slot="title"><span class="title_text">本周设备数据统计</span></p>
                        <ul class="group_list flex_layout fw_nowrap ai_center">

                            <li class="group_item blue"><i class="cus_icon icon_equipment"></i><p class="tt">设备总数</p><p class="cont"><count-to :end="descInfo.devInfo.devNum"></count-to></p></li>
                            <li class="group_item blue"><i class="cus_icon icon_equipment"></i><p class="tt">消费机总数</p><p class="cont"><count-to :end="descInfo.devInfo.consumeMachine"></count-to></p></li>
                            <li class="group_item blue"><i class="cus_icon icon_equipment"></i><p class="tt">自助机总数</p><p class="cont"><count-to :end="descInfo.devInfo.selefMachine"></count-to></p></li>
                        </ul>
                    </Card>
                </div>
            </div>
            
        </Content>
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    
    import CountTo from '_c/count-to'

    import echarts from 'echarts'
    
	export default {
        components: { CountTo },
		data () {
            
			return {

                exportTypeKey: 'desc',
                
                descInfo: {
                    condate: '',
                    comInfo: {
                        commNum: 0, //	True 	String	社区总数
                        countnum: 0, //	False	Int	交易总量
                        countmoney: 0, //	False	float	消费金额总量
                        countdiscmoney: 0, //	False	float	累计优惠金额总量
                        countcash: 0, //	False	float	累计现金钱包支付金额总量
                        countsubsidy: 0, //	False	float	累计补贴钱包支付金额总量
                        commDetail: [],
                    },
                    perInfo: {
                        personnelNum: 0, //	true	Int	人员总数
                        dayAverageConsumeNum: 0, //	true	float	日均消费人数
                        moneyperperson: 0, //	true	float	每人次消费金额
                        persConusmDetail: [],
                    },
                    devInfo: {
                        devNum: 0, //	true	Int	设备数目
                        consumeMachine: 0, //	true	Int	消费机
                        selefMachine: 0, //	true	Int	自助机
                        devConusmDetail: [],
                    },
                },
                chartList: {
                    commChart: {
                        cnList: {
                            num : '交易量',
                            sumcash : '现金支付金额',
                            sumdiscmoney : '优惠金额',
                            summoney : '消费金额',
                            sumsubsidy : '补贴支付金额',
                        },
                        colors: ['#ffc64d', '#ff5151', '#ff8003', '#08b030', '#4787f8'],
                        obj: null,
                    },
                    personChart: {
                        cnList: {
                            dayAverageSumMoney: '日人均消费金额',
                            dayConsumeNum: '每日消费人数',
                        },
                        colors: ['#4787f8', '#ffc64d', '#ff5151', '#ff8003', '#08b030'],
                        obj: null,
                    },
                    devChart: {
                        cnList: {
                            devAverageNum: '设备日消费笔数',
                            devAverageConsume: '设备日均产生消费金额',
                        },
                        colors: ['#ff5151', '#4787f8', '#ff8003', '#08b030', '#ffc64d'],
                        obj: null,
                    },
                },
                resizeChartTime: null,
			}
		},
		created(){
            this.getDescInfo()
        },
        mounted () {
            
            window.addEventListener('resize', this.resizeChart, false)
        },
        computed: {
            baseParams () {
                return { bCommid: this.$store.state.app.bCommid }
            }
        },
		methods: {
			getDescInfo(){
				Interface[this.exportTypeKey].findpage().then(res=>{
                    if(res.status == 200){
                        this.descInfo = res.data
                        this.fnDrawChart('commChart', this.descInfo.comInfo.commDetail)
                        this.fnDrawChart('personChart', this.descInfo.perInfo.persConusmDetail)
                        this.fnDrawChart('devChart', this.descInfo.devInfo.devConusmDetail)
                    }
				})
            },
            fnDrawChart(id, d){
                
                let seriesList = []
                let seriesItem = {type: 'bar', barWidth: 6, itemStyle: { barBorderRadius:[3, 3, 0, 0] } }
                
                let dimensions = ['product']
                Object.keys(d[0]).forEach((key, index)=>{
                    if(key != 'condate'){
                        dimensions.push(this.chartList[id].cnList[key])
                        seriesList.push(seriesItem)
                    }
                })
                let sourceList = d.map(item=>{
                    let arr = []
                    Object.keys(item).forEach(key=>{
                        if(key !== 'condate') arr.push(item[key])
                        else arr.unshift(item[key])
                    })
                    return arr
                })
                sourceList.unshift(dimensions)
                
                let option = {
                    color: this.chartList[id].colors,
                    legend: { itemWidth: 8, itemHeight: 3, textStyle: {color: '#999999'}, top: 10, right: 25 },
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                    dataset: { source: sourceList },
                    xAxis: {type: 'category', axisLine:{ lineStyle:{ color:'#999999' }}},
                    yAxis: { axisLine:{ lineStyle:{ color:'#999999' }}, splitLine: { show: false }, minInterval: 1 },
                    grid: {  left: 50, top: 40 , right: 25, bottom: 30 , },
                    series: seriesList
                };
                let ele = document.getElementById(id)
                this.chartList[id].obj = echarts.init(ele)
                this.chartList[id].obj.setOption(option)
            },
            resizeChart(){
                clearTimeout(this.resizeChartTime)
                this.resizeChartTime = setTimeout(()=>{
                    Object.keys(this.chartList).forEach(key =>{
                        if(this.chartList[key].obj){
                            this.chartList[key].obj.resize()
                        }
                    })
                }, 300)
            },
            clearChart(){
                Object.keys(this.chartList).forEach(key =>{
                    if(this.chartList[key].obj){
                        this.chartList[key].obj.clear()
                        this.chartList[key].obj = null
                    }
                })
            },
        },
        beforeDestroy () {
            this.clearChart()
            window.removeEventListener('resize', this.resizeChart, false)
        },
	}
</script>
<style lang="less">

    #desc{
        overflow: auto;
        position: absolute;
        left: 0;
        top: 0;
        padding: 16px;
        height: 100%;
        width: 100%;
        min-height: 800px;
        background-color: #f0f0f0;
        .desc_wrap{
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            .flex_row{
                height: 31%;
                .row_item{
                    box-sizing: border-box;
                    height: 100%;
                    padding-bottom: 14px;
                    &:first-child{
                        padding-right: 8px;
                    }
                    &:last-child{
                        padding-left: 8px;
                    }
                    .ivu-card.ivu-card-shadow.custom_card_boxshadow{
                        box-shadow: 0px 0px 45px 1px rgba(0, 0, 0, 0.04);
                        height: 100%;
                        .ivu-card-head{
                            padding: 11px 14px;
                            .custom_icon{
                                display: inline-block;
                                vertical-align: middle;
                                margin-right: 4px;
                            }
                            .title_text{
                                color: #333333;
                                font-size: 14px;
                                font-weight: normal;
                            }
                        }
                        .ivu-card-body{
                            height: 100%;
                            position: relative;
                            padding: 0 16px;
                        }
                        &.head_card .ivu-card-body{
                            display: flex;
                            align-items: center;
                        }
                        .ivu-card-head+.ivu-card-body{
                            height: ~"calc(100% - 45px)";
                            position: relative;
                        }
                    }
                }
                &.head_row{
                    height: 7%;
                    .row_item{
                        box-sizing: border-box;
                        height: 100%;
                        padding-bottom: 14px;
                        &:first-child{
                            padding-right: 0;
                        }
                        &:last-child{
                            padding-left: 0;
                        }
                    }
                }
                &:last-child{
                    .row_item{
                        padding-bottom: 0;
                    }
                }
            }
        }
    }
</style>
<style lang="less" scoped>
    
    @iconList: cash,community,consumption,equipment,offers,people,trading,wallets;
    .chart_box{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .group_list{
        height: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        li{
            list-style: none;
            &.red{ color: #ff5151; }
            &.yellow{ color: #ffc64d; }
            &.orange{ color: #ff8003; }
            &.green{ color: #08b030; }
            &.blue{ color: #4787f8; }
            .cus_icon{
                display: block;
                margin: 0 auto;
                width: 60px;
                height: 60px;
            }
            flex: 1;
            .loop(@data, @i: 1) when(@i =< length(@data)){
                @icon: extract(@data, @i);
                .cus_icon.icon_@{icon} {
                    background-image: url("../../../assets/images/desc/icon_@{icon}.png");
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    transition: opacity 0.2s ease;
                    &:hover{
                    opacity: .7;
                    }
                }
                .loop(@data, (@i + 1));
            }
            .loop(@iconList);
            p{
                text-align: center;
                font-weight: normal;
                font-stretch: normal;
                &.tt{
                    font-family: "PingFang-SC-Regular";
                    font-size: 14px;
                    line-height: 36px;
                    color: #999999;
                }
                &.cont{
                    font-family: "MicrosoftYaHei";
                    font-size: 30px;
                    line-height: 40px;
                }
            }
        }
    }
    
</style>


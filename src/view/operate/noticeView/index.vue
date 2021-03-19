<template>
        
    <Layout id="noticeView" class="router_view">

        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
            <div class="head_right">
                <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="fnAdd()">增加</Button>
            </div>
        </div>

        <div class="opt_box">
            
            <div class="inline_block_space"><DatePicker type="date" placeholder="请选择起始日期" @on-change="changeStartTime"></DatePicker></div>
            <div class="inline_block_space"><DatePicker type="date" placeholder="请选择结束日期" @on-change="changeEndTime"></DatePicker></div>
            <searchbox class="inline_block_space" @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>

            
        </div>
        <Content>
            <div class="table_box">
                <!-- 表格数据 -->
                <Table ref="selection" :data="pageListData" :columns="tableHeader">
                    <template slot-scope="{ row }" slot="action">
                        <span class="btn_action" v-if="row.state != 3" @click="fnEdit(row)">编辑</span>
                        <Poptip v-if="row.state == '0'" class="delete_module" confirm @on-ok="fnPublish(row)" title="确认发布？" transfer placement="top-end">
                            <span class="btn_action" style="margin-right: 5px;">发布</span>
                        </Poptip>
                        <Poptip v-if="row.state == '1'" class="delete_module" confirm @on-ok="fnUnPublish(row)" title="确认取消发布？" transfer placement="top-end">
                            <span class="btn_action" style="margin-right: 5px;">取消发布</span>
                        </Poptip>
                        <Poptip v-if="row.state == '2'" class="delete_module" confirm @on-ok="fnPublish(row)" title="确认发布？" transfer placement="top-end">
                            <span class="btn_action" style="margin-right: 5px;">重新发布</span>
                        </Poptip>
                        <Poptip v-if="row.state != 3" class="delete_module" confirm @on-ok="fnRemove(row)" title="删除后不可恢复，确定要删除吗?" transfer placement="top-end">
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
                        title: '编号',
                        key: 'id',
                        width: 60,
                    },
                    {
                        title: '标题',
                        key: 'title',
                        minWidth: 80,
                    },
                    {
                        title: '状态',
                        key: 'state',
                        minWidth: 80,
                        render: (h,params)=>{
                            const state = { '0': '待发布', '1': '已发布', '2': '被取消 ', '3': '被删除', '9': '发布到期' }
                            var text = state[params.row.state]
                            return h('span',text)
                        }
                    },
                    {
                        title: '接受对象',
                        key: 'receiverDesc',
                        minWidth: 80,
                    },
                    {
                        title: '发送方式',
                        key: 'sendWay',
                        minWidth: 80,
                        render: (h,params)=>{
                            // 1.(用户登录平台通过浏览网页和显示及时消息方式查看)  3.（需要用户关注公众号）
                            const sendWay = { '1': '平台浏览', '2': '短信', '3': '微信' }
                            var text = sendWay[params.row.sendWay]
                            return h('span',text)
                        }
                    },
                    {
                        title: '发送者',
                        key: 'senderName',
                        minWidth: 80,
                    },
                    {
                        title: '起始日期',
                        key: 'validStartTime',
                        minWidth: 80,
                    },
                    {
                        title: '终止日期',
                        key: 'validEndTime',
                        minWidth: 80,
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 130,
                        align: 'right',
                    }
                ],
                
                condition: {
                    list: [
                        {value: 'title', label: '标题', type: 'input'},
                    ]
                },
                queryStartTime: '',
                queryEndTime: '',
                exportTypeKey: 'noticeView',

			}
		},
		created(){
            
        },
        computed: {
            baseParams () {
                var req = {}
                if(this.queryStartTime){
                    req.queryStartTime = this.queryStartTime
                }
                if(this.queryEndTime){
                    req.queryEndTime = this.queryEndTime
                }
                return req
            }  
        },
		methods: {
            changeStartTime(val){
                this.queryStartTime = val
                this.fnSearch()
            },
            changeEndTime(val){
                this.queryEndTime = val
                this.fnSearch()
            },
            fnAdd(){
                this.$router.push({ name: this.$route.name + '_add'})
            },
            fnEdit(row){
                this.$router.push({ name: this.$route.name + '_edit', query: {id: row.id, nps: this.nps}})
            },
            fnRemove(row){
                var deleteItem = {id: row.id}
                Interface[this.exportTypeKey].delete(deleteItem).then(res=>{
                    if (res.status == 200) {
                        this.removeSuccessCallback()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            fnPublish(row){
                var req = {id: row.id}
                Interface[this.exportTypeKey].publish(req).then(res=>{
                    if (res.status == 200) {
                        this.$Message.success(res.message)
                        this.fnSearch()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            fnUnPublish(row){
                var req = {id: row.id}
                Interface[this.exportTypeKey].unPublish(req).then(res=>{
                    if (res.status == 200) {
                        this.$Message.success(res.message)
                        this.fnSearch()
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
                        this.pageListData = []
                        this.$Message.error(res.message)
                    }
				})
				
            },
        },
	}
</script>
<style lang="less">

    .custom_select_box{
        &.datetimerange{
            .suffix_right{
                font-size: 16px;
            }
        }
        padding: 0 24px 0 4px;
        box-sizing: border-box;
        outline: none;
        user-select: none;
        cursor: pointer;
        position: relative;
        background-color: #fff;
        border-radius: 0;
        border: 1px solid #dddddd;
        height: 32px;
        display: flex;
        align-items: center;
        .cur_time_range{
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .suffix_right{
            position: absolute;
            right: 0;
            top: 0;
            width: 24px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            font-size: 14px;
            transition: transform .2s;
            &.ani_rotate{
                transform: rotate(180deg);
            }
        }
    }
</style>


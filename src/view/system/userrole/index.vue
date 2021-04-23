<template>
        
    <Layout id="userView" class="router_view">

        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
            <div class="head_right">
                
            </div>
        </div>
        <Content>
            <div class="opt_box">
                <searchbox @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>
            </div>
            <div class="table_box">
                <Table ref="selection" :data="pageListData" :columns="tableHeader" >

                    <template slot-scope="{ row }" slot="action">
                        <span class="btn_action" @click="fnAssignRoles(row)">分配角色</span>
                    </template>
                </Table>
                <div class="pager_box" v-show="pager.totalSize">
                    <Page show-total show-sizer show-elevator :total="pager.totalSize" @on-page-size-change="changePageSize" :current="pager.pageNum" @on-change="changePage"></Page>
                </div>
            </div>
        </Content>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

    import searchbox from '@/components/common/searchbox'
    import pageList from '@/mixin/pageList'

    import { recursionByFiled } from '@/libs/tools'
    
	export default {
        mixins: [ pageList ],
        components: { searchbox },
		data () {
            
			return {
                tableHeader: [ // 表格  theader
                    { title: '用户名', key: 'userName', minWidth: 76 },
                    { title: '姓名', key: 'realName', minWidth: 86 },
                    { title: '手机号码', key: 'mobile', minWidth: 86 },
                    { title: '昵称', key: 'nickName', minWidth: 65 },
                    { title: '性别', key: 'sex', minWidth: 65,
                        render: (h, params) => {
                            var text = ''
                            if(params.row.sex == 0){
                                text = '女'
                            }else if(params.row.sex == 1){
                                text = '男'
                            }else{
                                text = '未知'
                            }
                            return h('span', {}, text)
                        }
                    },
                    { title: '兴趣爱好', key: 'hobby', minWidth: 86 },
                    { title: '住址', key: 'liveAddress', minWidth: 65 },
                    { title: '状态', key: 'status', minWidth: 65,
                        render: (h, params)=> {
                            let statusList = { '0': '停用', '1': '在用', '2': '已删除', '3': '待审核' }
                            var text = statusList[params.row.status]
                            return h('span', {}, text)
                        }
                    },
                    { title: '操作', slot: 'action', width: 70, align: 'center' }
                ],
                
                condition: {
                    list:[
                        {value: 'userName', label: '用户名', type: 'input'},
                        {value: 'realName', label: '姓名', type: 'input'},
                    ],
                },
                extParams: { 
                    
                },
                
                exportTypeKey: 'operator',
			}
        },
		created(){
            
        },
        computed: {
            
        },
		methods: {
            fnAssignRoles(row){
                this.$router.push({
                    name: this.$route.name + '_assignroles',
                    query: { id: row.userId }
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
        }
	}
</script>

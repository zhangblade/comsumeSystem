<template>
        
    <Layout id="pvcgroup" class="router_view" v-loading="loadingTable">

        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
            <div class="head_right">
                
            </div>
        </div>

        <div class="opt_box">
            <div class="adapt_cell tree_select">
                <treeselect v-model="extParams.bCommids" :multiple="true" :options="communityList" placeholder="请选择社区" :limit="2" :limitText="fnLimitText" :flat="true" />
            </div>
            <div class="adapt_cell">
                <searchbox @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :showSearchBtn="true" :condition='condition' :current="current"></searchbox>
            </div>
        </div>
        <Content>
            <div class="table_box">
                
                <el-table size="small" row-key="groupId" :data="pageListData" class="cus_element_table" cell-class-name="cus_element_table_cell"
                    header-cell-class-name="cus_element_table_cell" header-row-class-name="cus_header_row" :tree-props="{children: 'childGroup' }">
                    <el-table-column v-for="item in tableHeader" :key="item.key"
                    :prop="item.key" :label="item.title" :width="item.width||''" :min-width="item.width ? '': item.minWidth||'60px'">
                        <template slot-scope="scope">
                            <span class="">{{scope.row[item.key]}}</span>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </Content>

    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

    import searchbox from '@/components/common/searchbox'
    
    import pageList from '@/mixin/pageList'

    import { recursionByFiled } from '@/libs/tools'

    // import the component
    import Treeselect from '@riophae/vue-treeselect'
    // import the styles
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    
	export default {
        mixins: [ pageList ],
        components: { searchbox, Treeselect },
		data () {
            
			return {
                tableHeader: [ // 表格  theader
                    { title: '名称', key: 'groupName', minWidth: 120 },
                    { title: '排序', key: 'orderBy', minWidth: 120 },
                    { title: '描述', key: 'groupDesc', minWidth: 120 },
                ],

                condition: {
                    list: [
                        // {value: 'groupName', label: '群组名称', type: 'input'},
                    ]
                },
                communityList: [],
                extParams: {
                    bCommids: [],
                },
                needPager: false,
                loadingTable: false,
                
                exportTypeKey: 'pvcgroup',

			}
		},
		created(){
            this.getCommunityList()
        },
        computed: {
            
        },
		methods: {
            getPageListData(req){
                this.loadingTable = true
				Interface[this.exportTypeKey].findpage(req).then(res=>{
					if (res.status == 200 && res.data && res.data.length > 0) {
                        this.pageListData = res.data
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
        },
	}
</script>
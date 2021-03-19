<template>
        
    <Layout id="group" class="router_view">

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
                <searchbox @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>
            </div>
        </div>
        <Content>
            <div class="table_box">
                            
                <el-table id="Jtable" size="small" row-key="groupId" :data="pageListData" class="cus_element_table" cell-class-name="cus_element_table_cell"
                    header-cell-class-name="cus_element_table_cell" header-row-class-name="cus_header_row">
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
                    { title: '社区名称', key: 'bCommName', minWidth: 100 },
                    { title: '群组名称', key: 'groupName', minWidth: 100 },
                    { title: '排序', key: 'orderNum', minWidth: 100 },
                    { title: '联系人', key: 'leader', minWidth: 100 },
                    { title: '联系人电话', key: 'tel', minWidth: 100 },
                ],
                condition: {
                    list: [
                        {value: 'groupName', label: '群组名称', type: 'input'},
                    ]
                },
                extParams: {
                    bCommids: [],
                },
                communityList: [],
                needPager: false,
                exportTypeKey: 'group',
			}
		},
		created(){
            this.getCommunityList()
        },
        mounted () {
            
        },
        computed: {
            baseParams () {
                return { bCommid: this.$store.state.app.bCommid }
            }
        },
		methods: {
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
        beforeDestroy () {
            
        }
	}
</script>

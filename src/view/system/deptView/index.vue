<template>
        
    <Layout id="deptview" class="router_view">

        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
            <div class="head_right">
                <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="showAddModule()">增加</Button>
            </div>
        </div>

        <div class="opt_box">
            <searchbox class="inline_block_space" @fnSearch="fnSearch" @changeQueryKey="changeQueryKey" :condition='condition' :current="current"></searchbox>
        </div>

        <Content>
            <div class="table_box">
                
                <el-table class="cus_table" header-row-class-name="cus_table_header" size="small"
                    :data="pageListData" row-key="deptId" :tree-props="{children: 'children'}">

                    <el-table-column prop="name" label="部门名称"></el-table-column>
                    <el-table-column prop="fullName" label="完整名称"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1">{{ '在用' }}</span>
                            <span v-else-if="scope.row.status == 2">{{ '删除' }}</span>
                            <span v-else>{{ '停用' }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="130">
                        <template slot-scope="scope">
                            <span class="btn_action" @click="showEditModule(scope.row)">编辑</span>
                            <span class="btn_action" v-if="scope.row.type != 2" @click="showAddModule(scope.row)">增加下级</span>
                            <Poptip class="delete_module" v-if="!scope.row.children || !scope.row.children.length" confirm @on-ok="fnRemove(scope.row)" title="删除后不可恢复，确定要删除吗?" transfer placement="top-end">
                                <span class="btn_action">删除</span>
                            </Poptip>
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

	export default {
        
        mixins: [ pageList ],
        components: { searchbox },
		data () {
            
			return {
                tableHeader: [ // 表格  theader
                    {
                        title: '部门名称',
                        key: 'name',
                    },
                    {
                        title: '完整名称',
                        key: 'fullName',
                    },
                    {
                        title: '状态',
                        key: 'status',
                        template: 'status',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        template: 'action',
                        width: 130,
                    },
                ],
                condition: {
                    list: [
                        {value: 'name', label: '请输入部门名称', type: 'input'}
                    ]
                },
                needPager: false,
                exportTypeKey: 'deptView',
			}
		},
		created(){
            
        },
		methods: {
            showAddModule(row){
                this.$router.push({ name: this.$route.name+"_add", query: row ? { parentId: row.deptId, deptName: row.name } : { parentId: 0}})
            },
            showEditModule(row){
                this.$router.push({ name: this.$route.name+'_edit', query: { id: row.deptId } })
            },
            fnRemove(row){
                var deleteItem = {id: row.deptId}
                Interface[this.exportTypeKey].delete(deleteItem).then(res=>{
                    if (res.status == 200) {
                        this.removeSuccessCallback()
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
                        this.$Message.error(res.message)
                    }
				})
				
            },
            fnSearchByName(){
                this.getPageListData()
            }
        }
	}
</script>


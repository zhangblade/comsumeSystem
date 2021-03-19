<template>
        
    <Layout id="sysmenu" class="router_view">
        
        <Layout class="right_wrap">

            <div class="content_header">
                <h5>{{$route.meta.title}}</h5>
                <div class="head_right">
                    <Button class="btn" type="primary" icon="ios-add-circle-outline" @click="showAddModule()">增加</Button>
                </div>

            </div>
            
            <Content>
                <div class="table_box">

                    <el-table class="cus_table" header-row-class-name="cus_table_header" size="small"
                        :data="pageListData" row-key="menuId" :tree-props="{children: 'children'}">
                        <el-table-column prop="name" label="名称"></el-table-column>
                        <el-table-column prop="type" label="类型" width="70">
                            <template slot-scope="scope">
                                <span class="icon icon_direct" v-if="scope.row.type == 0">目录</span>
                                <span class="icon icon_menu" v-if="scope.row.type == 1">菜单</span>
                                <span class="icon icon_btn" v-if="scope.row.type == 2">功能</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="path" label="路径"></el-table-column>
                        <el-table-column prop="url" label="地址"></el-table-column>
                        <el-table-column prop="perms" label="权限标识"></el-table-column>
                        <el-table-column label="应用范围" width="70">
                            <template slot-scope="scope">
                                <span v-if="scope.row.scope == '0'">全部</span>
                                <span v-if="scope.row.scope == '1'">BUS</span>
                                <span v-if="scope.row.scope == '2'">CMS</span>
                                <span v-if="scope.row.scope == '3'">OCS</span>
                                <span v-if="scope.row.scope == '4'">VPS</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="130">
                            <template slot-scope="scope">
                                <span class="btn_action" @click="showEditModule(scope.row)">编辑</span>
                                <span class="btn_action" @click="handleDelete(scope.row)">删除</span>
                                <span class="btn_action" v-if="scope.row.type != 2" @click="showAddModule(scope.row)">增加下级</span>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>

            </Content>
            
        </Layout>

        <Modal v-model="showDeleteBox" @on-ok="fnRemove()" @on-cancel="cancelDelete()" :title="'确认删除'" class-name="vertical-center-modal" width="300">
            <p>确认删除后,被删除的数据将无法恢复!!!</p>
        </Modal>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'

    import pageList from '@/mixin/pageList'

	export default {
        mixins: [ pageList ],
        data () {
            return {
                Theader: [
                    {
                        title: '名称',
                        key: 'name',
                    },
                    {
                        title: '类型',
                        key: 'type',
                        type: 'template',
                        template: 'type',
                        width: 70,
                        textAlign: 'center',
                        headerAlign: 'center',
                    },
                    {
                        title: '路径',
                        key: 'path',
                    },
                    {
                        title: '地址',
                        key: 'url',
                    },
                    {
                        title: '权限标识',
                        key: 'perms',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        type: 'template',
                        template: 'action',
                        width: 140,
                    },
                ],
                
                rmData: null,
                showDeleteBox: false, //是否显示删除弹窗
                needPager: false,
                exportTypeKey: 'menuView',
            }
        },
        created(){
            
        },
		mounted(){

        },
		methods: {
            showEditModule(row){
                this.$router.push({ name: this.$route.name + '_edit', query: { id: row.menuId } })
            },
            showAddModule(row){
                this.$router.push({ name: this.$route.name + '_add', query: row ? { id: row.menuId } : {} })
            },
            fnRemove(){
                if(!this.rmData) return
                var req = [this.rmData.menuId]
                Interface[this.exportTypeKey].delete(req).then(res=>{
                    if (res.status == 200) {
                        this.getPageListData()
                    }else{
                        this.$Message.error(res.message)
                    }
                    this.cancelDelete()
                }).catch(err=>{
                    this.cancelDelete()
                })
            },
            getPageListData () {
                Interface[this.exportTypeKey].menu().then(res=>{
                    if(res.status == 200 ){
                        this.pageListData = res.data || []
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            handleDelete(row){
                this.rmData = row
                this.showDeleteBox = true
            },
            cancelDelete(){
                this.rmData = null
                this.showDeleteBox = false
            },
        }
	}
</script>

<style lang="less" scoped>
    .icon{
        padding: 3px 8px;
        border-radius: 3px;
        font-weight: bold;
        color: #fff;
        font-size: 10px;
        &.icon_btn{
            background-color: #f8ac59;
        }
        &.icon_menu{
            background-color: #1c84c6;
        }
        &.icon_direct{
            background-color: #1ab394;
        }
    }
    .table_box{
        margin: 20px 0;
    }
    .icon_list{
        &:after{
            content: '';
            display: table;
            clear: both;
        }
        i{
            width: 34px;
            height: 34px;
            padding: 5px;
            display: block;
            float: left;
            cursor: pointer;
        }
    }
</style>


<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">

            <div class="content_header">
                <h5>{{$route.meta.title}}</h5>
                <div class="head_right">
                    <Button class="btn" icon="ios-arrow-round-back" @click="backPrevPage()">返回</Button>
                </div>
            </div>
            <div>
                <Content>
                    <div class="permission">
                        <el-table class="cus_table" header-row-class-name="cus_table_header" size="small"
                            :data="pageListData" row-key="menuId" :tree-props="{children: 'children'}">
                            <el-table-column prop="name" label="角色"></el-table-column>
                            <el-table-column prop="path" label="路径"> </el-table-column>
                            <el-table-column prop="perms" label="权限标识"> </el-table-column>
                            <el-table-column label="操作" width="65">
                                <template slot-scope="scope">
                                    <customSwitch :switchStatus="scope.row.rHave" @toggleSwitchStatus="toggleSwitchStatus(scope.row)"></customSwitch>
                                </template>
                            </el-table-column>
                        </el-table>

                    </div>

                </Content>
            </div>
        </Layout>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    import qs from 'qs'
    import customSwitch from "@/components/common/custom_switch"

	export default {
        name: 'permisssion',
        components: { customSwitch },
		data () {
			return {
                Theader: [
                    {
                        title: '角色',
                        key: 'name',
                    },
                    {
                        title: '路径',
                        key: 'path',
                    },
                    {
                        title: '权限标识',
                        key: 'perms',
                    },
					{
                        title: '操作',
                        type: 'template',
                        template: 'action',
                        width: 80
                    },
                ],
                pageListData: [],
                exportTypeKey: 'roleView',
			}
        },
        created(){
            this.findRoleByUser()
        },
		methods: {
            findRoleByUser(){
                var req = { roleId: this.$route.query.id}
                Interface[this.exportTypeKey].findMenusByRole(req).then(res=>{
                    if(res.status == 200){
                        this.pageListData = res.data
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            toggleSwitchStatus(row) {
                var req = {
                    menuId: row.menuId,
                    roleId: this.$route.query.id,
                    isAdd: Number(!row.rHave),
                }
                Interface[this.exportTypeKey].saveRoleMenu(req).then(res=>{
                    if(res.status == 200){
                        this.findRoleByUser()
                        if(row.rHave){
                            this.$Message.success('关闭权限成功!')
                        }else{
                            this.$Message.success('开启权限成功!')
                        }
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            backPrevPage(){
                if(this.$route.query.nps){
                    this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
                }
                this.$router.go(-1)
            },
        }
	}
</script>

<style lang="less" scoped>
</style>
<style lang="less">
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
            top: 0;
        }
    }
</style>

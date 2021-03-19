<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            <div class="adapt_wrap">
                
                <Content>
                    <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">
                        <RadioGroup v-model="roleIds" vertical>
                            <Radio :label="Number(item.id)" v-for="(item,index) in appRoleList" :key="index">
                                <Icon></Icon><span>{{item.text}}</span>
                            </Radio>
                        </RadioGroup>
                        <div style="padding: 20px 0;">
                            <Button type="primary" @click="handleSubmit('itemData')">提交</Button>
                            <Button type="error" @click="backPrevPage()" style="margin-left:20px">取消</Button>
                        </div>

                    </Form>
                </Content>
            </div>
        </Layout>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    import { recursionByFiled } from "@/libs/tools"

	export default {
        name: 'assignRole',
		data () {
			return {
                formRules: {},
                itemData: {},
                appRoleList: [],
                appId: '',
                roleIds: '',
                exportTypeKey: 'appView',
			}
        },
        created(){
            this.appId = this.$route.query.appId
            this.roleIds = this.$route.query.deftRoleid
            this.getAppRole()
        },
		methods: {
            getAppRole(){
                var req = { appId: this.appId }
                Interface[this.exportTypeKey].getAppRole(req).then(res=>{
                    if(res.status == 200){
                        this.appRoleList = res.data.children.map(i=>{
                            i.id = Number(i.id)
                            return i
                        })
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            handleSubmit(){
                var req = { appId: this.appId, roleIds: this.roleIds }
                Interface[this.exportTypeKey].setAppRole(req).then(res=>{
                    if(res.status == 200){
                        this.$Message.success(res.message)
                        this.backPrevPage()
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
    .cus_padding{
        padding: 0 8px;
    }
</style>

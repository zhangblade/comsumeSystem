<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
            <Content>
                <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">
                    
                    <FormItem label="公司名称" prop="companyName">
                        <p>{{ companyName }}</p>
                    </FormItem>
                    
                    <FormItem label="部门" prop="deptId">
                        <Row>
                            <Input v-model="itemData.deptId" style="display: none;"></Input>
                            <span v-if="deptName" style="margin-right: 20px;">{{ deptName }}</span>
                            <Button type="warning" @click="fnShowDrawer()">选择部门</Button>
                        </Row>
                    </FormItem>

                    <FormItem label="用户名" prop="userName"><Input v-model="itemData.userName" placeholder="请输入用户名" :maxlength="20"></Input></FormItem>

                    <FormItem label="真实姓名" prop="realName"><Input v-model="itemData.realName" placeholder="请输入真实姓名" :maxlength="20"></Input></FormItem>

                    <FormItem label="昵称" prop="nickName"><Input v-model="itemData.nickName" placeholder="请输入昵称" :maxlength="20"></Input></FormItem>
                    
                    <FormItem label="密码" prop="password"><Input type="password" v-model="itemData.password" placeholder="请输入密码" :maxlength="16"></Input></FormItem>

                    <FormItem label="性别" prop="sex"><RadioGroup v-model="itemData.sex"><Radio label="1">男</Radio><Radio label="0">女</Radio></RadioGroup></FormItem>

                    <FormItem label="联系方式" prop="mobile"><Input v-model="itemData.mobile" placeholder="请输入联系方式" :maxlength="11" number></Input></FormItem>
                    
                    <FormItem label="居住地址" prop="liveAddress"><Input v-model="itemData.liveAddress" placeholder="请输入居住地址" :maxlength="50"></Input></FormItem>

                    <FormItem label="生日" prop="birth"><DatePicker type="date" placeholder="请选择您的生日" v-model="itemData.birth" @on-change="itemData.birth=$event"></DatePicker></FormItem>

                    <FormItem label="爱好" prop="hobby"><Input v-model="itemData.hobby" placeholder="请输入您的爱好" :maxlength="50"></Input></FormItem>

                    <FormItem label="状态" prop="status">
                        <RadioGroup v-model="itemData.status"><Radio label="1">启用</Radio><Radio label="0">禁用</Radio></RadioGroup>
                    </FormItem>

                    <FormItem label="多地登陆" prop="isAsynch">
                        <RadioGroup v-model="itemData.isAsynch"><Radio :label="0">不允许</Radio><Radio :label="1">允许</Radio></RadioGroup>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleSubmit('itemData')">提交</Button>
                        <Button type="default" style="margin-left: 20px;" @click="backPrevPage()">取消</Button>
                    </FormItem>

                </Form>
            </Content>
        </div>

        <Drawer :width="375" :transfer="false" :inner="true" :title="'部门列表'" v-model="showDrawer">
            <div class="list">
                <Tree ref="tree" :data="departmentList" :render="renderContent"></Tree>
            </div>
        </Drawer>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    import { validCondition } from '@/components/common/util'
    import areaList from '@/components/common/region'
    import mixin_opt from './mixin_opt'

	export default {
        name: 'add',
        mixins: [ mixin_opt ],
		data () {
            
			return {
                itemData: {
                    tenementId: this.$route.query.bTenementid,
                    userName: '',
                    deptId: '',
                    realName: '',
                    nickName: '',
                    password: '',
                    liveAddress: '',
                    mobile: '',
                    birth: '',
                    hobby: '',
                    sex: '1',
                    status: '1',
                    isAsynch: 0,
                },
                companyName: '',
                exportTypeKey: 'customerView',
			}
        },
        mounted(){
            this.getCompanyInfo()
            this.getDepartmentList()
        },
		methods: {
            getCompanyInfo(){
                let req = { tenementId: this.$route.query.bTenementid } 
                Interface[this.exportTypeKey].findById(req).then(res=>{
                    if (res.status == 200) {
                        this.companyName = res.data.bName
                    }else{
                        this.$Message.error(res.message)
                    }
                }).catch(err=>{
                    this.$Message.error(err.message)
                })
            },
            handleSubmit(validInfo){

                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].addSupAdmin(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.backPrevPage()
                            }else{
                                this.$Message.error(res.message)
                            }
                        }).catch(err=>{
                            this.$Message.error(err.message)
                        })
                    }
                })
                
            },
            backPrevPage(){
                if(this.$route.query.nps){
                    this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
                }
                this.$router.go(-1)
            },
        },
	}
</script>

<style lang="less" scoped>
</style>

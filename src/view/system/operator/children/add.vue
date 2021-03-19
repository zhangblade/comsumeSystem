<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
            <Content>
                <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">

                    <FormItem label="用户名" prop="userName"><Input v-model="itemData.userName" placeholder="请输入用户名" :maxlength="50"></Input></FormItem>

                    <FormItem label="真实姓名" prop="realName"><Input v-model="itemData.realName" placeholder="请输入真实姓名" :maxlength="50"></Input></FormItem>

                    <FormItem label="昵称" prop="nickName"><Input v-model="itemData.nickName" placeholder="请输入昵称" :maxlength="50"></Input></FormItem>
                    
                    <FormItem label="密码" prop="password"><Input type="password" v-model="itemData.password" placeholder="请输入密码" :maxlength="50" autocomplete="new-password"></Input></FormItem>

                    <FormItem label="性别" prop="sex"><RadioGroup v-model="itemData.sex"><Radio label="1">男</Radio><Radio label="0">女</Radio></RadioGroup></FormItem>

                    <FormItem label="联系方式" prop="mobile"><Input v-model="itemData.mobile" placeholder="请输入联系方式" :maxlength="11" number></Input></FormItem>
                    
                    <FormItem label="居住地址" prop="liveAddress"><Input v-model="itemData.liveAddress" placeholder="请输入居住地址"></Input></FormItem>

                    <FormItem label="生日" prop="birth"><DatePicker type="date" placeholder="请选择您的生日" v-model="itemData.birth" @on-change="itemData.birth=$event"></DatePicker></FormItem>

                    <FormItem label="爱好" prop="hobby"><Input v-model="itemData.hobby" placeholder="请输入您的爱好"></Input></FormItem>

                    <FormItem label="状态" prop="status">
                        <RadioGroup v-model="itemData.status"><Radio label="1">启用</Radio><Radio label="0">禁用</Radio></RadioGroup>
                    </FormItem>

                    <FormItem label="数据权限">
                        <ButtonGroup>
                            <Button :type="itemData.dataAuth == '0' ? 'primary' : 'default'" @click="changeDataAuth('0')">管理全部社区</Button>
                            <Button :type="itemData.dataAuth == '1' ? 'primary' : 'default'" @click="changeDataAuth('1')">管理选中社区</Button>
                        </ButtonGroup>
                    </FormItem>

                    <FormItem label="用户角色" prop="roleId">
                        <div class="dib">
                            <Select v-model="itemData.roleId" placeholder="请选择用户角色">
                                <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                    </FormItem>

                    <FormItem label="多地登陆" prop="isAsynch">
                        <RadioGroup v-model="itemData.isAsynch"><Radio :label="0">不允许</Radio><Radio :label="1">允许</Radio></RadioGroup>
                    </FormItem>
                    
                    <FormItem class="btns_form_item">
                        <Button type="primary" @click="handleSubmit('itemData')">提交</Button>
                        <Button type="default" style="margin-left: 20px;" @click="backPrevPage()">取消</Button>
                    </FormItem>

                </Form>
            </Content>
        </div>

        <Drawer :width="375" :transfer="false" :inner="true" :title="'选择社区'" v-model="drawer.show" @on-close="closeDrawer()" class-name="drawer_fix_footer">
            <div class="content_layout">
                <Tree ref="tree" show-checkbox check-directly :data="drawer.list" @on-check-change="onCheckChange"></Tree>
            </div>
            <div class="drawer_footer">
                <Button type="primary" @click="setBcomm()">提交</Button>
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
                formRules: {
                    userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                    realName: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
                    nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
                    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
                    mobile: [{ required: true, validator: this.mobileValid, trigger: 'blur' }],
                    roleId: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
                },
                itemData: {
                    userName: '',
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
                    dataAuth: '0',
                    datapriviList: [],
                    roleId: '',
                },
                roleList: [],
                drawer: {
                    show: false,
                    list: [],
                    selAll:false,
                },
                exportTypeKey: 'operator',
			}
        },
        created(){
            this.getRoleSubdominant()
        },
		methods: {
            getRoleSubdominant(){
                Interface[this.exportTypeKey].findRoleByUser().then(res=>{
                    if (res.status == 200) {
                        let arr = []
                        Object.keys(res.data).forEach(key=>{
                            let item = {}
                            item.value = key
                            item.label = res.data[key]
                            arr.push(item)
                        })
                        this.roleList = arr
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
                        if(this.itemData.dataAuth == '1' && !this.itemData.datapriviList.length){
                            this.$Message.info('请选择数据权限')
                            return
                        }
                        Interface[this.exportTypeKey].add(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success('增加成功')
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
            fnShowDrawer(){
                this.drawer.show = true
                if(!this.drawer.list.length) this.getCommunityList()
            },
            closeDrawer(){
                this.drawer.show = false
            },
            getCommunityList(){
                Interface.common.getCommunityList().then(res=>{
                    if(res.status == 200 && res.data && res.data.length > 0){
                        this.drawer.list = res.data.map(i=>{
                            i.title = i.bCommname
                            return i
                        })
                    }else{
                        this.drawer.list = []
                    }
                })
            },
            onCheckChange(arr, item){
                if(arr.length == this.drawer.list.length){
                    this.drawer.selAll = true
                }else{
                    this.drawer.selAll = false
                }
            },
            setBcomm(){
                this.itemData.datapriviList = this.$refs.tree.getCheckedNodes().map(i=>{
                    let item = {}
                    item.privalue = i.bCommid
                    return item
                })
                this.closeDrawer()
            },
            changeDataAuth(val){
                this.itemData.dataAuth = val
                if(val == '1'){
                    this.fnShowDrawer()
                }else{
                    this.itemData.datapriviList = []
                }
            }
        },
        watch: {
            
        }
	}
</script>
<style lang="less" scoped>
    .btns_form_item{
        margin-bottom: 0;
    }
</style>
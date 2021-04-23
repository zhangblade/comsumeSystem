<template>
        
    <Layout class="router_view">
            
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
            <Content>
                <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">

                    <FormItem label="用户名"><p>{{ itemData.userName }}</p></FormItem>

                    <FormItem label="真实姓名" prop="realName"><Input v-model="itemData.realName" placeholder="请输入真实姓名" /></FormItem>

                    <FormItem label="昵称" prop="nickName"><Input v-model="itemData.nickName" placeholder="请输入昵称" /></FormItem>
                    
                    <FormItem label="修改密码" prop="password">
                        <Input type="password" :disabled="!editPass" v-model="itemData.password" placeholder="请输入新密码" autocomplete="new-password" :maxlength="16">
                            <Button slot="append" @click="openEditPassIpt()">{{editPassTxt}}</Button>
                        </Input>
                    </FormItem>

                    <FormItem label="性别" prop="sex"><RadioGroup v-model="itemData.sex"><Radio label="1">男</Radio><Radio label="0">女</Radio></RadioGroup></FormItem>

                    <FormItem label="联系方式" prop="mobile"><Input v-model="itemData.mobile" placeholder="请输入联系方式" :maxlength="11" number /></FormItem>
                    
                    <FormItem label="居住地址" prop="liveAddress"><Input v-model="itemData.liveAddress" placeholder="请输入居住地址" /></FormItem>

                    <FormItem label="生日" prop="birth"><DatePicker type="date" placeholder="请选择您的生日" :value="itemData.birth" @on-change="itemData.birth=$event"></DatePicker></FormItem>

                    <FormItem label="爱好" prop="hobby"><Input v-model="itemData.hobby" placeholder="请输入您的爱好" /></FormItem>

                    <FormItem label="状态" prop="status">
                        <RadioGroup v-model="itemData.status"><Radio label="1">启用</Radio><Radio label="0">禁用</Radio></RadioGroup>
                    </FormItem>

                    <FormItem label="数据权限">
                        <ButtonGroup>
                            <Button :type="itemData.dataAuth == '0' ? 'primary' : 'default'" @click="changeDataAuth('0')">管理全部社区</Button>
                            <Button :type="itemData.dataAuth == '1' ? 'primary' : 'default'" @click="changeDataAuth('1')">管理选中社区</Button>
                        </ButtonGroup>
                    </FormItem>

                    <FormItem label="用户角色">
                        <p>{{userRoleName}}</p>
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
    import mixin_opt from './mixin_opt'
    import {encryptedData, publicKey} from '@/libs/util'
    
	export default {
        name: 'edit',
        mixins: [ mixin_opt],
		data () {
            
			return {
                editPass: false,
                editPassTxt: '重置密码',
                itemData: {
                    password: '12345678', //简易处理,单纯为了显示...
                    userName: '',
                    userId: '',
                    realName: '',
                    nickName: '',
                    liveAddress: '',
                    mobile: '',
                    birth: '',
                    hobby: '',
                    sex: '',
                    status: '',
                    isAsynch: null,
                    dataAuth: '0',
                    datapriviList: [],
                },
                userRoleName: '',
                
                drawer: {
                    show: false,
                    list: [],
                    selAll:false,
                },
                exportTypeKey: 'operator',
                
			}
        },
		created(){
            this.formRules.password[0].required = this.editPass
            if(this.$route.query.userId){
                this.getEditItemData()
            }
        },
        computed: {
            
        },
		methods: {
            getEditItemData(){
                var req = {userId: this.$route.query.userId}
				Interface[this.exportTypeKey].findById(req).then(res=>{
					if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
                        this.userRoleName = res.data.userRoleName
					}else{
                        this.$Message.error(res.message)
                    }
				}).catch(err=>{
                    this.$Message.error(err.message)
                })
            },
            fillForm(beFilledItem, item){
                Object.keys(beFilledItem).forEach(key=>{
                    if(beFilledItem.hasOwnProperty(key) && item.hasOwnProperty(key) && item[key] != null){
                        beFilledItem[key] = item[key]
                    }
                })
            },
            handleSubmit (validInfo) {
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        if(this.itemData.dataAuth == '1' && !this.itemData.datapriviList.length){
                            this.$Message.info('请选择数据权限')
                            return
                        }
                        let req = JSON.parse(JSON.stringify(this.itemData))
                        if(this.editPass){
                            req.password = encryptedData(publicKey,  req.password)
                        }
                        console.log(req);
                        return
                        Interface[this.exportTypeKey].edit(JSON.stringify(req)).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success('保存成功!')
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
            openEditPassIpt() {
                this.editPass = !this.editPass
                this.itemData.password = this.editPass ? '' : '12345678'
                this.editPassTxt = this.editPass ? '取消重置' : '重置密码'
                this.formRules.password[0].required = this.editPass
            },
            fnShowDrawer(){
                if(!this.drawer.list.length) this.getCommunityList()
                this.drawer.show = true
            },
            closeDrawer(){
                this.drawer.show = false
            },
            getCommunityList(){
                Interface.common.getCommunityList().then(res=>{
                    if(res.status == 200 && res.data && res.data.length > 0){
                        this.drawer.list = res.data.map(i=>{
                            i.title = i.bCommname
                            let checkedList = this.itemData.datapriviList.map(i=>i.privalue)
                            if(checkedList.indexOf(i.bCommid) != -1){
                                i.checked = true
                            }
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
                    this.drawer.list.forEach(i=>{
                        i.checked = false
                    })
                    this.drawer.list = JSON.parse(JSON.stringify(this.drawer.list))
                }
            }
        },
	}
</script>

<style lang="less" scoped>
    .btns_form_item{
        margin-bottom: 0;
    }
</style>

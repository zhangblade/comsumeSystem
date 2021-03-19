<template>
        
    <Layout id="tenementmanage" class="router_view">

        <div class="content_header">
            <h5>{{$route.meta.title}}</h5>
            <div class="head_right">
                <Button class="btn" icon="ios-arrow-round-back" @click="backPrevPage()">返回</Button>
            </div>
        </div>

        <Content style="padding-left: 10px;">
            <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules" style="max-width:1200px;">

                <FormItem class="companyInfo" label="公司全称：" prop="tenementName">
                    <p>{{ itemData.tenementName }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="部门：" prop="deptName">
                    <Input v-show="isEdit" disabled v-model="itemData.deptName" placeholder="选择部门" >
                        <Button slot="append" @click="fnShowDrawer()">选择部门</Button>
                    </Input>
                    <p v-show="!isEdit">{{ itemData.deptName }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="用户名：" prop="userName">
                    <Input v-show="isEdit" v-model="itemData.userName" placeholder="请输入用户名"  :maxlength="20"/>
                    <p v-show="!isEdit">{{ itemData.userName }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="真实姓名：" prop="realName">
                    <Input v-show="isEdit" v-model="itemData.realName" placeholder="请输入真实姓名" :maxlength="20"></Input>
                    <p v-show="!isEdit">{{ itemData.realName }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="昵称：" prop="nickName">
                    <Input v-show="isEdit" v-model="itemData.nickName" placeholder="请输入昵称" :maxlength="20"></Input>
                    <p v-show="!isEdit">{{ itemData.nickName }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="密码：">
                    <Input :type="isShowPass ? 'text': 'password'" :maxlength="16" v-show="isEdit" v-model="itemData.password" placeholder="请输入新密码，如不填则不修改密码">
                        <Button slot="append" @click="isShowPass = !isShowPass" :icon="isShowPass ? 'md-eye-off': 'md-eye'"></Button>
                    </Input>
                    <p v-show="!isEdit">{{ itemData.password }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="性别" prop="sex">
                    <RadioGroup v-show="isEdit" v-model="itemData.sex"><Radio label="1">男</Radio><Radio label="0">女</Radio></RadioGroup>
                    <p v-show="!isEdit">{{ sexName[itemData.sex] }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="联系方式" prop="mobile">
                    <Input v-show="isEdit" v-model="itemData.mobile" placeholder="请输入联系方式" :maxlength="11" number></Input>
                    <p v-show="!isEdit">{{ itemData.mobile }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="居住地址" prop="liveAddress">
                    <Input v-show="isEdit" v-model="itemData.liveAddress" placeholder="请输入居住地址" :maxlength="50"></Input>
                    <p v-show="!isEdit">{{ itemData.liveAddress }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="生日" prop="birth">
                    <DatePicker v-show="isEdit" format="yyyy-MM-dd" type="date" placeholder="请选择您的生日" v-model="itemData.birth" @on-change="itemData.birth=$event"></DatePicker>
                    <p v-show="!isEdit">{{ plainTextBrith }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="爱好" prop="hobby">
                    <Input v-show="isEdit" v-model="itemData.hobby" placeholder="请输入爱好" :maxlength="50"></Input>
                    <p v-show="!isEdit">{{ itemData.hobby }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="状态" prop="status">
                    <RadioGroup v-show="isEdit" v-model="itemData.status"><Radio label="1">{{statusName[1]}}</Radio><Radio label="0">{{statusName[0]}}</Radio></RadioGroup>
                    <p v-show="!isEdit">{{ statusName[itemData.status] }}</p>
                </FormItem>

                <FormItem class="companyInfo" label="多地登陆" prop="isAsynch">
                    <RadioGroup v-show="isEdit" v-model="itemData.isAsynch"><Radio :label="0">{{isAsynchName[0]}}</Radio><Radio :label="1">{{isAsynchName[1]}}</Radio></RadioGroup>
                    <p v-show="!isEdit">{{ isAsynchName[itemData.isAsynch] }}</p>
                </FormItem>
                
                <FormItem class="companyInfo">
                    <Button v-show="isEdit" type="primary" @click="handleSubmit('itemData')">保存</Button>
                    <Button v-show="isEdit" type="default" @click="cancel()" style="margin-left:20px;">取消</Button>
                    <Button v-show="!isEdit" type="primary" @click="fnEdit()">编辑</Button>
                </FormItem>
            </Form>
        </Content>

        <Drawer :width="375" :transfer="false" :inner="true" :title="'部门列表'" v-model="showDrawer">
            <div class="list">
                <Tree ref="tree" :data="departmentList" :render="renderContent"></Tree>
            </div>
        </Drawer>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    import mixin_opt from './mixin_opt'

	export default {
        mixins: [ mixin_opt ],
		data () {

			return {
                formRules: {
                    userName: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                    realName: [
                        { required: true, message: '真实姓名不能为空', trigger: 'blur' }
                    ],
                    nickName: [
                        { required: true, message: '昵称不能为空', trigger: 'blur' }
                    ],
                },
                itemData: {
                    tenementId: "null",
                    tenementName: '',
                    deptId: null,
                    deptName: '',
                    nickName: "",
                    realName: "",
                    userName: "",
                    sex: "",
                    mobile: "",
                    liveAddress: "",
                    birth: "",
                    hobby: "",
                    isAsynch: null,
                    status: "",
                    statusName: '',
                    userId: null,
                    userType: "",
                    password: '',
                },
                plainTextBrith: '',
                isShowPass: false,
                sexName: { '0': '女', '1': '男', '2': '未知' },
                isAsynchName: { '0': '禁用', '1': '启用' },
                statusName: { '0': '不允许', '1': '允许' },
                isEdit: false,
                exportTypeKey: 'customerView'
			}
        },
        created(){
            
        },
		mounted(){
            this.getSupAdmin()
        },
        computed: {
            
        },
		methods: {
            fillForm(beFilledItem, item){
                Object.keys(beFilledItem).forEach(key=>{
                    if(item[key]){
                        beFilledItem[key] = item[key]
                    }
                })
            },
			getSupAdmin(){
                var req = { tenementId: this.$route.query.bTenementid }
				Interface[this.exportTypeKey].getSupAdmin(req).then(res=>{
					if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
                        this.plainTextBrith = res.data.birth
                        this.itemData.isAsynch = Number(res.data.isAsynch)
					}else{
                        this.$Message.error(res.message)
                    }
				}).catch(e=>{
                    this.$Message.error(e.message)
                })
            },
            handleSubmit (validInfo) {
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        if(this.itemData.password.length && this.itemData.password.length <6 ){
                            this.$Message.info('请输入6位以上有效密码')
                            return
                        }
                        Interface[this.exportTypeKey].editSupAdmin(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.isEdit = false
                            }else{
                                this.$Message.error(res.message)
                            }
                        }).catch(err=>{
                            this.$Message.error('修改失败!')
                        })
                    }
                })
            },
            fnEdit(){
                this.isEdit = true
            },
            cancel(){
                this.isEdit = false
                this.getSupAdmin()
            },
            chooseDepartment(item) {
                this.itemData.deptId = item.id.split('_')[1]
                this.itemData.deptName = item.title
                this.showDrawer = false
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
    h6{
        font-size: 14px;
        line-height: 34px;
        font-weight: 500;
    }
    .companyInfo{
        margin-left: 15px;
        max-width: 700px;
        height: 32px;
    }
    p{
        text-indent: 7px;
        vertical-align: top;
        line-height: 32px;
    }
</style>




<template>
  
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit" class="login_form">
    <FormItem prop="userName">
      <Input class="cus_input_size" v-model="form.userName" placeholder="请输入用户名">
        <span class="cus_icon cus_icon_user" slot="prefix"></span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input class="cus_input_size" type="password" v-model="form.password" placeholder="请输入密码">
        <span class="cus_icon cus_icon_pass" slot="prefix"></span>
      </Input>
    </FormItem>
    <FormItem prop="securityCode" class="securityCode" v-show="showCode">
      <Input class="cus_input_size" ref="securityCodeIpt"  v-model="form.securityCode" placeholder="请输入验证码" :maxlength="4" v-bind:autofocus='showCode'>
        <span class="cus_icon cus_icon_authcode" slot="prefix"></span>
      </Input>
      <SIdentify class="securityCode-box" :contentHeight="50" :contentWidth="110" :identifyCode="identifyCode" @updateCode="getCode"></SIdentify>
    </FormItem>
    <FormItem>
      <Button class="cus_btn_submit" @click="handleSubmit" type="primary" long :loading="isLogin">立即登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import SIdentify from '../common/identify'
import {getIdentifyCode} from '@/api/data'
export default {
  name: 'LoginForm',
  components:{
    SIdentify //验证码
  },
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          //{ validator:this.test2, trigger: 'blur' }
        ]
      }
    },
    // securityCodeRules:{
    //   type: Array,
    //   default: () => {
    //     return [
    //       { required: true, message: '验证码不能为空', trigger: 'blur' }
    //     ]
    //   }
    // },
    propCode:{
      type: String,
      default: () => {
        return "7895"
      }
    },
    isLogin: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      form: {
        // userName: 'system',
        // password: 'Bosiny20160919',
        userName: '',
        password: '',
        securityCode: '',
      },
      aaa:"5555",
      securityCodeRules:[],
      myPasswordRules:[
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator:this.pwdTest, trigger: 'blur' }
      ],
      showCode: false,
      show: false,
      identifyCode:"",// 验证码
	    codeStatus:0,//验证转态 0正确 1密码错误 2验证码错误
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        //password: this.passwordRules,
        password: this.myPasswordRules,
        securityCode: this.securityCodeRules
      }
    },
    // identifyCode(){
    //   return this.propCode;
    // }
  },
  methods: {
    handleSubmit () {
      if(this.isLogin) return
      this.$emit('changeLoginStatus', true)
      if(this.showCode){
        this.confrimLogin();
      }else{
		    this.getCode();
      }
    },
    pwdTest(rule, value, callback) {//密码表单验证
      if (this.codeStatus == '1') {
          callback(new Error('密码错误'));
      } else {
          callback();
      }
    },
    codeTest(rule, value, callback) {//验证码表单验证
      if (this.codeStatus == '2') {
          callback(new Error('验证码错误'));
      } else {
          callback();
      }
    },
    confrimLogin(){
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            identifyCode: this.form.securityCode
          })
        }else{
          this.$emit('changeLoginStatus', false)
        }
      })
    },
    updateCode () {
      // 更新验证码
    },
    test(){
      this.$Message.error('密码错误'); 
    },
    getCode(){//获取验证码
      getIdentifyCode({userName: this.form.userName}).then(res => {
        if(res.status== 200){
          if(res.data && res.data.identifyCode){//需要验证码
            this.showCode = true;
            this.securityCodeRules = [{ required: true, message: '验证码不能为空', trigger: 'blur' },{ validator:this.pwdTest, trigger: 'blur' }],
            this.identifyCode = res.data.identifyCode+"";
            this.$emit('changeLoginStatus', false)
          }else{//不需要验证码
            this.securityCodeRules = [],
            this.showCode = false;
            this.confrimLogin();
          }
        }else{
          this.$emit('changeLoginStatus', false)
          this.$Message.error(res.message)
        }
      }).catch(err=>{
        this.$emit('changeLoginStatus', false)
      });
    }
  }
}
</script>
<style>
.login .ivu-form-item.securityCode{

}
.login .ivu-form-item.securityCode .securityCode-box{
  float: right;
  margin-top: 1px;
}
.login .ivu-form-item.securityCode .securityCode-box:hover{
  cursor: pointer;
}
.login .ivu-form-item.securityCode .ivu-input-wrapper{
  width: 50%;
}
</style>

<style lang="less">
.login_form{
  width: 480px;
  margin: 0 auto;
}
.login .ivu-form-item.securityCode{
  &::before, &::after{
    display: none;
  }
}
.login .ivu-form-item.securityCode .securityCode-box{
  float: right;
  margin-top: 1px;
}
.login .ivu-form-item.securityCode .securityCode-box:hover{
  cursor: pointer;
}
.login .ivu-form-item.securityCode .ivu-input-wrapper{
  width: 70%;
}
.cus_input_size{
  .ivu-input-prefix{
    width: 46px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .cus_icon{
      width: 100%;
      height: 22px;
      background-size: auto 100%;
      background-position: center center;
      background-repeat: no-repeat;
      &_user{
        background-image: url("../../assets/images/login/user.png");
      }
      &_pass{
        background-image: url("../../assets/images/login/phone.png");
      }
      &_authcode{
        height: 21px;
        background-image: url("../../assets/images/login/authcode.png");
      }
    }
  }
  .ivu-input-inner-container{
    .ivu-input{
      height: 50px;
      font-size: 12px;
      color: #999999;
      font-family: 'PingFang-SC-Regular';
      padding: 4px 10px 4px 46px;
    }
  }
}
.cus_btn_submit{
	width: 480px;
	height: 64px;
	background-image: linear-gradient(90deg, #f88b45 0%, #ff7d29 58%, #e77023 100%), linear-gradient(#3381ff, #3381ff);
  background-size: 200%;
	background-blend-mode: normal, normal;
  border-radius: 2px;
  border: none;
  transition: all 2s;
  transition: background-position .5s;
  outline: none;
  box-sizing: border-box;
  &:hover {
    background-position: 100% 0;
    border: none;
    outline: none;
  }
  span{
    font-family: 'PingFang-SC-Regular';
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    letter-spacing: 2px;
    color: #ffffff;
  }
}
</style>

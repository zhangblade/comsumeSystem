<style lang="less">
  @import './login.less';
</style>

<template>

  <div class="login">
    <div class="login_wrap">
      <div class="login-con">
        <h3 class="login_title"><img :src="loginTitle" alt="ACS出入口控制云平台" /></h3>
        <div class="form-con">
          <login-form ref="loginForm" @on-success-valid="handleSubmit" :isLogin="isLogin" @changeLoginStatus="changeLoginStatus"></login-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import LoginForm from '_c/login-form'
import loginTitle from '@/assets/images/login/title.png'
import { mapActions } from 'vuex'
import { log } from 'util';
export default {
  data () {
    return {
      loginTitle,
      isLogin: false
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password ,identifyCode}) {
      this.handleLogin({ userName, password ,identifyCode}).then(res => {
        if(res.status == "200"){
          this.$router.replace({
            name: this.$config.homeName
          })
        }else if(res.status == 1004){//验证码错误
          this.$Message.error(res.message);
          this.resetCode()
        }else if(res.status == 500 && res.message == "验证码错误"){
          this.$Message.error(res.message);
          this.resetCode()
        }else{
          this.$Message.error(res.message);
        }
        this.isLogin = false
      }).catch(err=>{
        this.isLogin = false
      })
    },
    changeLoginStatus(status){
      this.isLogin = status
    }
  }
}
</script>

<style>

</style>

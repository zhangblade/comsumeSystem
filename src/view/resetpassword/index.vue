<style lang="less">
  @import './index.less';
</style>

<template>
  <div class="password">
    <div class="password_wrap">
      <div class="password-con">
        <h3 class="password_title">修改密码</h3>
        <div class="form-con">
          <Form ref="formCustom" :model="formCustom" :rules="formRules" @keydown.enter.native="handleSubmit('formCustom')">
            <FormItem prop="userName">
              <Input class="cus_ipt_size" v-model="formCustom.userName" placeholder="请输入用户名">
                <span class="cus_icon cus_icon_user" slot="prefix"></span>
              </Input>
            </FormItem>
            <FormItem prop="oldPwd">
              <Input class="cus_ipt_size" autocomplete="new-password" type="password" :maxlength="16" v-model="formCustom.oldPwd" placeholder="请输入旧密码">
                <span class="cus_icon cus_icon_pass" slot="prefix"></span>
              </Input>
            </FormItem>
            <FormItem prop="newPwd">
              <Input class="cus_ipt_size" autocomplete="new-password" type="password" :maxlength="16" v-model="formCustom.newPwd" placeholder="请输入新密码">
                <span class="cus_icon cus_icon_pass" slot="prefix"></span>
              </Input>
            </FormItem>
            <FormItem prop="comfirmPwd">
              <Input class="cus_ipt_size" autocomplete="new-password" type="password" :maxlength="16" v-model="formCustom.comfirmPwd" placeholder="请确认新密码">
                <span class="cus_icon cus_icon_pass" slot="prefix"></span>
              </Input>
            </FormItem>
            
            <Button class="cus_btn_submit" type="primary" long :loading="isSubmitting" @click="handleSubmit('formCustom')">提交</Button>

          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Interface from '@/api/data'
import Cookies from 'js-cookie'

import {encryptedData, publicKey} from '@/libs/util'

export default {
  data () {
    return {
      
			formRules: {
				userName: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
				],
				oldPwd: [
					{ required: true, message: '请输入旧密码', trigger: 'blur' },
					{ type: 'string', min: 8, message: '密码至少为8位', trigger: 'blur' }
				],
				newPwd: [
					{ required: true, validator: this.validatePass, trigger: 'blur' },
				],
				comfirmPwd: [
					{ required: true, validator: this.validatePassCheck, trigger: 'blur' }
				],
			},
			formCustom: {
				oldPwd: '',
				newPwd: '',
				comfirmPwd: '',
			},
      
      isSubmitting: false,
    }
  },
  methods: {
    handleSubmit (validInfo) {
      this.$refs[validInfo].validate((valid) => {
          if(valid){
            let req = {}
            req.userName = this.formCustom.userName
            req.oldPwd = encryptedData(publicKey, this.formCustom.oldPwd)
            req.newPwd = encryptedData(publicKey, this.formCustom.newPwd)
            this.isSubmitting = true
            Interface.common.forceresetpwd(req).then(res=>{
              if(res.status == 200){
                Cookies.remove('token')
                this.$Message.success({
                  content: '修改成功',
                  onClose: ()=>{
                    this.$router.push({name: 'login', query: {userName: this.formCustom.userName}})
                  }
                })
              }else{
                this.$refs.formCustom.resetFields()
                this.$Message.error(res.message)
              }
              this.isSubmitting = false
            }).catch(err=>{
              this.isSubmitting = false
            })
          }
      })
    },
		validatePass(rule, value, callback){
        let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,20}$/
        if(!value || !reg.test(value)){
          callback(new Error('请输入8位以上,16位以下的数字+字母+特殊符号(!@#$%^&*_+)3种以上组成的密码'))
        } else {
          if (this.formCustom.comfirmPwd !== '') {
            this.$refs.formCustom.validateField('comfirmPwd');
          }
          callback();
        }
		},
		validatePassCheck(rule, value, callback){
			if (value === '') {
				callback(new Error('请输入密码'));
			} else if (value !== this.formCustom.newPwd) {
				callback(new Error('两次输入的密码不匹配!'));
			} else {
				callback();
			}
		},
  }
}
</script>

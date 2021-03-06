
import Interface from '@/api/data'
import {recursionByFiled} from '@/libs/tools'

export default {
    data () {
        
        return {
            formRules: {
                userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                realName: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
                nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
                password: [{ required: true, validator: this.pwdValid, trigger: 'blur' }],
                mobile: [{ required: true, validator: this.mobileValid, trigger: 'blur' }],
            },
            
            exportTypeKey: 'operator',
        }
    },
    created(){
        
    },
    methods: {
        mobileValid(rule, value, callback){
            if(!value){
              callback(new Error('请输入手机号'))
            }else if (!/^(13|14|15|17|18)\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号'))
            } else {
                callback()
            }
        },
        pwdValid(rule, value, callback){
            let reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,20}$/
            if(!value || !reg.test(value)){
              callback(new Error('请输入8位以上,16位以下的数字+字母+特殊符号(!@#$%^&*_+)3种以上组成的密码'))
            } else {
                callback()
            }
        },
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                beFilledItem[key] = item[key]
            })
        },
        handleReset(validInfo) {
            this.$refs[validInfo].resetFields()
        },
        backPrevPage(){
            if(this.$route.query.nps){
                this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
            }
            this.$router.go(-1)
        },
    }
}
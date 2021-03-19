
import Interface from '@/api/data'
import {recursionByFiled} from '@/libs/tools'

export default {
    data () {
        const mobileValid = (rule, value, callback)=> {
          if(!value){
            callback(new Error('请输入手机号'))
          }else if (!/^(13|14|15|17|18)\d{9}$/.test(value)) {
              callback(new Error('请输入正确的手机号'))
          } else {
              callback()
          }
        }
        
        return {
            formRules: {
                userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                deptId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
                realName: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
                nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
                password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
                mobile: [{ required: true, validator: mobileValid, trigger: 'blur' }],
            },
            deptName: '',
            showDrawer: false,
            departmentList: [],
        }
    },
    
    methods: {
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                beFilledItem[key] = item[key]
            })
        },
        handleReset(validInfo) {
            this.$refs[validInfo].resetFields()
        },
        fnShowDrawer() {
            if(!this.departmentList.length){
                this.getDepartmentList()
            }
            this.showDrawer = true
        },
        getDepartmentList() {
            let req = { tenementId: this.$route.query.bTenementid }
            Interface.userView.getDeptTree(req).then(res=>{
                if (res.status == 200) {
                    this.departmentList = recursionByFiled([res.data], 'title', 'text')
                }else{
                    this.$Message.error(res.message)
                }
            })
        },
        chooseDepartment(item) {
            this.itemData.deptId = item.id.split('_')[1]
            this.deptName = item.title
            this.showDrawer = false
        },
        renderContent (h, { root, node, data }) {
            var companyIcon = ""
            var select = ''
            if(data.parentId){
                select = h('span', {
                        style: {
                            marginRight: '20px',
                            float: 'right',
                            lineHeight: '24px',
                            color: '#2d8cf0',
                            cursor: 'pointer',
                        },
                        on: {
                            click: () => { this.chooseDepartment(data) }
                        }
                    }, '选择')
            }
            return h('div', {
                style: {
                    display: 'inline-block',
                    width: '100%',
                }
            }, [
                companyIcon,
                h('span',{
                    style: {
                        lineHeight: '24px'
                    },
                }, data.title),
                select
            ])
        },
        backPrevPage(){
            if(this.$route.query.nps){
                this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
            }
            this.$router.go(-1)
        },
    }
}
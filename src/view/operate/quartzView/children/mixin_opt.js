
import Interface from '@/api/data'

export default {
    data () {
        
        return {
            formRules: {
                jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
                jobGroup: [{ required: true, message: '任务分组不能为空', trigger: 'blur' }],
                beanClass: [{ required: true, message: '调用目标类不能为空', trigger: 'blur' }],
                cronExpression: [{ required: true, message: '执行表达式不能为空', trigger: 'blur' }],
                jobStatus: [{ required: true, message: '任务状态不能为空', trigger: 'change' }],
            },

            jobStatusList: [
                {label: '正在运行', value: '1'},
                {label: '关闭', value: '0'},
            ],
            
            exportTypeKey: 'quartzView',
        }
    },
    computed: {
        
    },
    
    methods: {
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                if(item.hasOwnProperty(key) && item[key]){
                    beFilledItem[key] = item[key]
                }
            })
        },
        handleRemove ( filed, item, index) {
            if(item.id){
                let req = {id: item.id}
                Interface[this.exportTypeKey].deleteImg(req).then(res=>{
                    if (res.status == 200) {
                        this[filed].splice(index, 1)
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            }else{
                this[filed].splice(index, 1)
            }
        },
        backPrevPage(){
            if(this.$route.query.nps){
                this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
            }
            this.$router.go(-1)
        },
    }
}
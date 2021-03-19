
export default {
    data () {
        return {
            formRules: {
                bCommname: [{ required: true, message: '请输入社区名称', trigger: 'blur' }],
            },

            isSubmitting: false,
            exportTypeKey: 'community',
        }
    },
    methods: {
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                if(beFilledItem.hasOwnProperty(key) && item.hasOwnProperty(key) && item[key]){
                    beFilledItem[key] = item[key]
                }
            })
        },
        cancel(validInfo){
            this.$router.go(-1)
        },
        handleReset(validInfo) {
            this.$refs[validInfo].resetFields()
        },
    }
}
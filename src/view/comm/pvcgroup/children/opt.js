
import Interface from '@/api/data'

export default {
    data () {
        return {
            formRules: {
                groupName: [
                    { required: true, message: '组别名称不能为空', trigger: 'blur' }
                ],
            },
            parentName: '',
            itemData: {
                bCommid: '',
                // groupNo: '', //新增子级 需要
                groupName: '',
                groupDesc: '',
                orderBy: null,
            },
            isSubmitting: false,
            exportTypeKey: 'access_groupView',
        }
    },
    created(){
        this.itemData.bCommid = this.$store.state.app.bCommid
    },
    methods: {
        
    },
}
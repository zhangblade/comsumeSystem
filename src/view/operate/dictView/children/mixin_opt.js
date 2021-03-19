
import Interface from '@/api/data'
import {recursionByFiled} from '@/libs/tools'

export default {
    data () {
        
        return {
            formRules: {
                name: [{ required: true, message: '标签名不能为空', trigger: 'blur' }],
                value: [{ required: true, message: '数据值不能为空', trigger: 'blur' }],
                type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
                description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
            },
            
            itemData: {
                parentId: '',
                name: '',
                value: '',
                type: '',
                description: '',
                sort: 0,
                remarks: '',
            },

            pager: {
                pageNum: 1,  //当前页
                pageSize: 10,  //每页显示数量
                totalPages: 1,  //总页数
                totalSize: 0,  //总数量
            },
            
            exportTypeKey: 'dictView',
        }
    },
    methods: {
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                if(item.hasOwnProperty(key) && item[key]){
                    beFilledItem[key] = item[key]
                }
            })
        },
        changePage(curPage){
            this.getDepartmentList(curPage)
        },
        backPrevPage(){
            if(this.$route.query.nps){
                this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
            }
            this.$router.go(-1)
        },
    }
}
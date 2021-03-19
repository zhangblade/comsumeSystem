
import Interface from '@/api/data'

export default {
    data () {
        const proIdValid = (rule, value, callback)=>{
            let reg = /^[a-zA-Z]+$/
            if(!reg.test(value)){
                callback(new Error('商品id需由纯英文字母'));
            }else{
                callback();
            }
        }
        return {
            formRules: {
                proId: [{required: true, validator: proIdValid, trigger: 'blur'}],
                proName: [{required: true, message: '商品名称不能为空', trigger: 'blur'}],
            },
            appIdList: [],
            loadedRemoteCondition: false,
            timeUnitList: [
                { value: '2', label: '月', multiple: 1 },
                { value: '1', label: '季度', multiple: 3 },
                { value: '0', label: '年', multiple: 12 },
            ],
            
            exportTypeKey: 'productView',
        }
    },
    computed: {
        
    },
    
    methods: {
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                if(beFilledItem.hasOwnProperty(key) && item.hasOwnProperty(key)){
                    beFilledItem[key] = item[key]
                }
            })
        },
        backPrevPage(){
            if(this.$route.query.nps){
                this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
            }
            this.$router.go(-1)
        },
    }
}
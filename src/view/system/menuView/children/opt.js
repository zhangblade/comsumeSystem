
import Interface from '@/api/data'

export default {
    name: 'add',
    data () {
        const orderNumValid =  (rule, value, callback)=> {
            if(!value){
                callback(new Error('排序号不能为空'))
            }else{
                callback()
            }
        }
        return {
            formRules: {
                type: [
                    { required: true, message: '请选择菜单类型', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '菜单名称不能为空', trigger: 'blur' }
                ],
                path: [
                    { required: true, message: '路径不能为空', trigger: 'blur' }
                ],
                orderNum: [
                    { required: true, type:"number", message: '排序号不能为空', trigger: 'blur' }
                ],
            },
            itemData: {
                parentId: 0,
                name: '',
                url: '',
                perms: '',
                type: '1',
                icon: '',
                orderNum: null,
                path: '',
            },
            scope: 2,
            productList: [],
            appId: '',
            menuTypeList: [
                {label: '目录', value: '0', disable: false },
                {label: '菜单', value: '1', disable: false },
                {label: '功能', value: '2', disable: false },
            ],
            scopeList: [
                {label: '全部', value: '0'},
                {label: 'BUS', value: '1'},
                {label: 'CMS', value: '2'},
                {label: 'OCS', value: '3'},
                {label: 'VPS', value: '4'},
            ],
            showIconDrawer: false,
            iconList: ['icon1', 'icon2', 'icon3', 'icon4', 'icon5', 'icon6'],
            curIcon: '',

            exportTypeKey: 'menuView',
        }
    },
    created(){
        if(this.$route.query.id){
            this.itemData.parentId = this.$route.query.id
        }else{
            this.getProduct()
        }
    },
    methods: {
        disableMenuType(){
            var disabledVal = this.itemData.parentId == 0 ? '2' : '0'
            this.menuTypeList.forEach(i=>{
                if( i.value == disabledVal ) i.disabled = true
            })
        },
        getProduct(){
            Interface.appView.list({}).then(res=>{
                if (res.status == 200) {
                    this.productList = res.data || []
                    if(this.$route.name.indexOf('_edit') == -1 && res.data.length){
                        this.appId = res.data[0].appId
                    }
                }else{
                    this.$Message.error(res.message)
                }
            })
        },
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                if(beFilledItem.hasOwnProperty(key) && item.hasOwnProperty(key)){
                    beFilledItem[key] = item[key]
                }
            })
        },
        toggleIconBox(){
            this.showIconDrawer = !this.showIconDrawer
        },
        chooseIcon(item){
            this.itemData.icon = item
            this.showIconDrawer = false
        },
        changeType(type){
            if(!this.itemData.path || this.itemData.path == 'default'){
                this.itemData.path = type == '2' ? 'default' : ''
            }
        },
        backPrevPage(){
            if(this.$route.query.nps){
                this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
            }
            this.$router.go(-1)
        },
    },
}
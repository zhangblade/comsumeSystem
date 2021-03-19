
import Interface from '@/api/data'
import {recursionByFiled} from '@/libs/tools'

export default {
    data () {
        const validDate =  (rule, value, callback) => {
            if(!value){
                callback(new Error('有效时间不能为空'))
            }else{
                callback()
            }
        }
        
        return {
            formRules: {
                title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
                // content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
                TimeRange: [{ required: true, validator: validDate, trigger: 'change' }],
            },
            showDrawer: false,
            departmentList: [],

            companyList: [],

            previewList: [], //图片预览

            contentType: [
                {value: '1', label: '文本'},
            ],
            sendWay: [
                {value: '1', label: '平台浏览'},
            ],
            receiptFlag: [
                {value: '0', label: '不需要'},
                {value: '1', label: '需要'},
            ],
            receiverType: [
                {value: '0', label: '所有'},
                {value: '1', label: '公司管理员', filed: 'admin'},
                {value: '2', label: '公司所有人', filed: 'alluser'},
            ],

            pager: {
                pageNum: 1,  //当前页
                pageSize: 10,  //每页显示数量
                totalPages: 1,  //总页数
                totalSize: 0,  //总数量
            },
            
            exportTypeKey: 'noticeView',
        }
    },
    computed: {
        chooseList(){
            return this.companyList.map(i=>i.tenementName).join()
        }
    },
    
    methods: {
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                if(item[key]){
                    beFilledItem[key] = item[key]
                }
            })
        },
        fnShowDrawer() {
            if(!this.departmentList.length){
                this.getDepartmentList()
            }
            this.showDrawer = true
        },
        fnHideDrawer() {
            this.showDrawer = false
        },
        getDepartmentList(pageNum, pageSize) {
            var req = {
                pageNum: pageNum || this.pager.pageNum,
                pageSize: pageSize || this.pager.pageSize,
                params: { "bTenemtype": "2" }
            }
            Interface.customerView.findpage(req).then(res=>{
                if (res.status == 200) {
                    this.departmentList = res.data.content
                    this.pager.pageNum = res.data.pageNum
                    this.pager.pageSize = res.data.pageSize
                    this.pager.totalPages = res.data.totalPages
                    this.pager.totalSize = res.data.totalSize
                }else{
                    this.$Message.error(res.message)
                }
            })
        },
        chooseCompany(item) {
            var role = this.receiverType.filter(i=>i.value == this.itemData.receiverType)[0].filed
            let filterItem = { role: role, tenementId: item.bTenementid, tenementName: item.bName }
            this.companyList.push(filterItem)
            this.itemData.receiver = JSON.stringify(this.companyList)
        },
        handleClose(event, name){
            let index = this.companyList.findIndex(i=>i.tenementName == name)
            this.companyList.splice(index,1)
            this.itemData.receiver = JSON.stringify(this.companyList)
            
        },
        changePage(curPage){
            this.getDepartmentList(curPage)
        },
        changeReceiver(val){
            if(val == '0'){
                this.itemData.receiver = null
            }else{
                if(this.itemData.receiver){
                    var role = this.receiverType.filter(i=>i.value == val)[0].filed
                    var receiver = JSON.parse(this.itemData.receiver).map(i=>{
                        i.role = role
                        return i
                    })
                    this.itemData.receiver = JSON.stringify(receiver)
                }
            }
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
        // 读取本地上传图片
        readImg (file) {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = e => {
                var _dom = this.$refs['preview'+(this.previewList.length-1)][0]
                var Img = new Image()
                Img.src = this.arrayBufferToBase64(reader.result)
                Img.onload = e => {
                    var _H = Img.height, _W = Img.width
                    if(_W<64 || _H < 32){
                        this.$Message.info('图片尺寸太小,请选择合适图片')
                    }else if(_W>1600 || _H >1000){
                        this.$Message.info('图片尺寸太大,请选择合适图片')
                    }else{
                        
                        this.previewList[this.previewList.length-1].imageBuffer = new FormData()
                        this.previewList[this.previewList.length-1].imageBuffer.append('file', file)
                        
                        this.previewList[this.previewList.length-1].url = this.arrayBufferToBase64(reader.result)
                        _dom.src = this.arrayBufferToBase64(reader.result)
                        Img = null
                    }
                }
            }
            reader.onerror = e => { this.$Message.error('文件读取出错') }
        },
        arrayBufferToBase64(buffer) {
            let _base64 = 'data:image/png;base64,' + btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
            return _base64
        },
        handleBeforeUpload (file) {
            if(file.type !== 'image/jpg' && file.type !== 'image/jpeg'){
                this.$Message.warning('请选择jpg格式的图片')
                return
            }
            if(file.size > 2*1024*1024){
                this.$Message.warning('文件大小不能超过2M')
                return
            }
            let item = { url: '', name: file.name, percentage: 0 }
            this.previewList.push(item)

            this.readImg(file)
            
            return false
        },
        handleUpload (item, index) {
            var req = item.imageBuffer
            
            var updateProgress = (progressEvent)=>{
                let complete = (progressEvent.loaded / progressEvent.total ).toFixed(2) * 100
                this.previewList[index].percentage = complete
            }
            
            Interface[this.exportTypeKey].import(req, updateProgress).then(res=>{
                if(res.status == 200 && res.data.status == 200){
                    item.url = res.data.data.uri
                    item.name = res.data.data.originalFilename
                    item.id = res.data.data.id
                }else{
                    
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
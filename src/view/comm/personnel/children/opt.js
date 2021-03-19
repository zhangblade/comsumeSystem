import Interface from '@/api/data'
import { recursionByFiled } from '@/libs/tools'

export default {
    data () {
        return {
            formRules: {
                bGroupid: [{ required: true, type: 'number', message: '请选择群组', trigger: 'change' }],
                bPerno: [{ required: true, message: '人员编号不能为空', trigger: 'blur' }],
                bPername: [{ required: true, message: '人员名称不能为空', trigger: 'blur' }],
                bBegintime: [{ required: true, message: '有效期开始时间不能为空', trigger: 'blur', pattern: /.+/ }],
                bEndtime: [{ required: true, message: '有效期结束时间不能为空', trigger: 'blur', pattern: /.+/ }],
            },
            itemData: {
                bCommid: this.$store.state.app.bCommid,
                bGroupid: '',
                bPerno: null,
                bPername: '',
                bBirthday: '',
                bMobile: '',
                bCardno: '',
                bPhoto: '',
                bPhotoList: '',
                bSex: '1',
                bIdcard: '',
                bMemo: '',
                bReglimitPc: 'RegPc',
                bReglimitWx: 'RegWx',
                bReglimitApp: 'RegApp',
                bBegintime: '',
                bEndtime : '',
                bTypeid: '',
            },
            bPhotoArr: [],
            
            // 群组
            groups: {
                show: false,
                list: [],
                name: '',
            },
            pertypes: {
                show: false,
                list: [],
                name: '',
            },

            // 截图框信息
            showModal: false,
            
            cropperImg: {
                sourceImgSrc: '', // 原始图片
                imgSrc: '', //经过处理符合要求的图片
                file: null, //上传的图片
                fileName: '', //上传图片名称
                fileSize: 0, //图片大小
                imgWidth: 0, //图片宽
                imgHeight: 0, //图片高
                previewImg: '', // 处理后的预览

                outputType: 'jpeg',
                size: 1,//输出截图质量
                canMove: true,//能否移动图片
                canScale: true,//能否滚轮缩放
                full: false,//输出原图比例
                original: false,//上传图片是否按照原始比列渲染
                fixedBox: false,//固定截图框大小 不允许改变
                canMoveBox: true,//能否移动截图框
                // 只有自动截图开启 宽度高度才生效
                autoCrop: true,
                autoCropWidth: 600,
                autoCropHeight: 600,
                centerBox: true,//截图框限制在图片里
                high: true,
                fixed: false,
                fixedNumber: [1, 1],
                max: 99999,
                
                cropperedSize: 0,
                cropperedWidth: 0,
                cropperedHeight: 0,
            },

            fileAcceptList: ['.jpg', '.jpeg'],
            disableEnlarge: false,
            disableNarrow: false,

            isFaceRecognition: false,
            isSubmitting: false,
            exportTypeKey: 'personView',
        }
    },
    created(){
        
    },
    computed: {
        defIndex(){
            return this.bPhotoArr.indexOf(this.itemData.bPhoto)
        },
        fileAccept(){
            return this.fileAcceptList.join()
        }
    },
    methods: {
        cancel(validInfo){
            this.backList()
        },
        fnShowDrawer(drawerName) {
            this[drawerName].show = true
            if(drawerName == 'groups'){
                this.getGroupList()
            }else if(drawerName == 'pertypes'){
                this.getpertypeList()
            }
        },
        /** 获取群组列表 */
        getGroupList(){
            var req = {bCommid: this.$store.state.app.bCommid }
            Interface.groupView.findpage(req).then(res=>{
                if (res.status == 200 && res.data && res.data.length) {
                    let filedObj = { 'title': 'groupName' }
                    var temp = recursionByFiled(res.data, filedObj)
                    this.groups.list = temp.map(item=>{ 
                        item.isCompany = true
                        item.expand = true
                        return item
                    })
                }else{
                    this.groups.list = []
                }
            }).catch(err=>{
                this.groups.list = []
            })
        },
        chooseItem(item) {
            let Drawer = item.hasOwnProperty('bTypeid') ? 'pertypes' : 'groups'
            if(Drawer == 'groups'){
                this.itemData.bGroupid = item.groupId
            }else if(Drawer == 'pertypes'){
                this.itemData.bTypeid = item.bTypeid
            }
            this[Drawer].name = item.title
            this[Drawer].show = false
            this.$refs[Drawer].focus()
        },
        renderContent (h, { root, node, data }) {
            var select = ''
            select = h('span', {
                    style: { marginRight: '20px', float: 'right', lineHeight: '24px', color: '#2d8cf0', cursor: 'pointer' },
                    on: {
                        click: () => { this.chooseItem(data) }
                    }
                }, '选择')
            return h('div', {
                style: { display: 'inline-block', width: '100%' }
            }, [
                h('span',{
                    style: { lineHeight: '24px' },
                }, data.title),
                select
            ])
        },
        /** 获取人员类别列表 */
        getpertypeList(){
            var req = {bCommid: this.$store.state.app.bCommid }
            Interface[this.exportTypeKey].pertypeList(req).then(res=>{
                if (res.status == 200 && res.data && res.data.length) {
                    this.pertypes.list = res.data.map(item=>{
                        item.title = item.bTypename
                        return item
                    })
                }else{
                    this.pertypes.list = []
                }
            }).catch(err=>{
                this.pertypes.list = []
            })
        },
        fnUploadImage(){
            this.fnResetUpload()
        },
        fnResetUpload(){
            this.upload.file = null
            this.upload.loading = false
        },
        // 上传照片前
        handleBeforeUpload (file) {
            const fileExt = file.name.split('.').pop().toLocaleLowerCase()
            if (this.fileAccept.indexOf(fileExt) == -1) {
                this.$Notice.warning({ title: '文件类型错误', desc: '请选择后缀为'+fileAccept+'的文件。' })
                return
            }
            this.readFile(file, this.uploadSuccessCB)
            
            return false
        },
        // 上传成功之后
        uploadSuccessCB(file, e){
            if (typeof e.target.result === 'object') {
                // 把Array Buffer转化为blob 如果是base64不需要
                this.cropperImg.sourceImgSrc = window.URL.createObjectURL(new Blob([e.target.result]))
            } else {
                this.cropperImg.sourceImgSrc = e.target.result
            }
            // 处理图片，文件尺寸控制，设置白底
            let img = document.getElementById('beforePrev')
            img.src = this.cropperImg.sourceImgSrc
            img.onload = (e) =>{
                let w = img.width, h = img.height
                let relate = w > h ? w : h
                let isRelateW = w > h ? true : false
                let canvasW = 0, canvasH = 0
                if(relate < 100){
                    this.$Message.info('上传图片分辨率小于100*100，请重新选择图片')
                    return
                }else if(relate > 600 || relate <= 300){
                    canvasW = isRelateW ? 600 : Math.floor(w/h*600)
                    canvasH = isRelateW ? Math.floor(h/w*600) : 600
                }else{
                    canvasW = w
                    canvasH = h
                }
                this.$nextTick(() => {
                    var canvas= document.getElementById("dbCropCanvas")
                    canvas.width = canvasW
                    canvas.height = canvasH
                    var ctx=canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvasW, canvasH)
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, canvasW, canvasH)
                    ctx.drawImage(img, 0, 0, canvasW, canvasH)
                    canvas.toBlob(blob=>{
                        this.cropperImg.file = new File([blob], file.name, {type:"image/jpeg"});
                        this.cropperImg.imgSrc = window.URL.createObjectURL(blob)
                    }, "image/jpeg", 1)
                })
                this.cropperImg.imgWidth = w
                this.cropperImg.imgHeight = h
                this.cropperImg.fileName = file.name.substring(0, file.name.lastIndexOf('.'))
                this.cropperImg.fileSize = Math.ceil(file.size/1024)
                this.showModal = true
            }
        },
        changeScale(num){
            this.$refs.cropper.changeScale(num)
        },
        // 截图框内图片加载完毕
        imgLoad(msg) {
            let tips = '', Crop = this.$refs.cropper
            if(msg == 'success'){
                if(Crop.trueWidth< 100 || Crop.trueHeight < 100) tips = '上传图片分辨率小于100*100，请重新选择图片'
            }else { tips = '图片加载失败' }
            if(tips){
                this.$Message.info({
                    content: tips,
                    onClose: ()=>{
                        this.showModal = false
                        this.resetCropper()
                    }
                })
            }
        },
        // 实时预览函数
        realTime(data) {
            this.$refs.cropper.getCropBlob((blob) => {
                var img= new Image();
                img.src= window.URL.createObjectURL(blob)
                img.onload=(e)=>{
                    this.cropperImg.cropperedWidth = img.width
                    this.cropperImg.cropperedHeight = img.height
                    this.cropperImg.cropperedSize = Math.floor(blob.size/1024)
                    this.cropperImg.previewImg = window.URL.createObjectURL(blob)
                }
            })
        },
        // 重置裁剪组件
        resetCropper(){
            this.showModal = false
            
            this.resetUploadImgInfo()
            this.resetCroppredInfo()
            this.disabledCropper(false)
            
        },
        // 重置上传图片信息
        resetUploadImgInfo(){
            this.cropperImg.sourceImgSrc =  '' // 原始图片
            this.cropperImg.imgSrc =  '' //经过处理符合要求的图片
            this.cropperImg.file =  null //上传的图片
            this.cropperImg.fileName =  '' //上传图片名称
            this.cropperImg.fileSize =  0 //图片大小
            this.cropperImg.imgWidth =  0 //图片宽
            this.cropperImg.imgHeight =  0 //图片高
        },
        // 重置截图信息
        resetCroppredInfo(){
            this.cropperImg.previewImg =  ''
            this.cropperImg.cropperedSize =  0
            this.cropperImg.cropperedWidth =  0
            this.cropperImg.cropperedHeight =  0
        },
        setDefaultImg(img, index){
            this.itemData.bPhoto = img
        },
        deleteImg(img, index){
            this.bPhotoArr.splice(index, 1)
        },
        // 人脸识别 --start
        fnFaceRecognition(){
            this.isFaceRecognition = true
            this.disabledCropper(true)
            this.readFile(this.cropperImg.file, this.afterFaceRecognition, this.resetSubmitStatus)
        },
        // 是否禁止操作裁剪框
        disabledCropper(bool){
            this.cropperImg.fixedBox = bool
            this.cropperImg.canMove = !bool
            this.cropperImg.canScale = !bool
            this.cropperImg.canMoveBox = !bool
        },
        afterFaceRecognition(file, e){
            var req = new FormData()
            req.append('file', file)
            Interface[this.exportTypeKey].faceRecognition(req).then(res=>{
                if (res.status == 200){
                    
                    // 人脸识别返回人脸位置 是眉毛到下巴 两边没有耳朵 需要适当加点距离 (要考虑超出范围)
                    
                    // 返回结果左边距和上边距
                    let d = res.data.data
                    let dLeft = Math.ceil(d.left)
                    let dTop = Math.ceil(d.top)

                    // 图片宽高
                    let imgW = this.$refs.cropper.trueWidth
                    let imgH = this.$refs.cropper.trueHeight

                    //返回结果宽高(人脸位置或有点偏差 防止截图框超出图片范围)
                    let dW = Math.ceil(d.width) + dLeft > imgW ? imgW - dLeft : Math.ceil(d.width)
                    let dH = Math.ceil(d.height) + dTop > imgH ? imgH - dTop : Math.ceil(d.height)

                    // 定义需要加的宽高比咧
                    let X = 1/4, YT = 7/12, YB = 1/7
                    let addX = Math.floor(dW*X)
                    let addYTop = Math.floor(dH*YT)
                    let addYBottom = Math.floor(dH*YB)

                    // 图片宽高以及左边和上边距离,缩放比例（超出截图框范围还原初始比例）
                    // 截图框外框元素
                    let JCropper = document.getElementById('JCropper')
                    let JCW = JCropper.offsetWidth
                    let JCH = JCropper.offsetHeight
                    // 人脸识别之前图片的缩放比例(取整)
                    let oldimgScale = Math.floor(this.$refs.cropper.scale*10000)
                    
                    let imgRelate = imgW > imgH ? imgW : imgH
                    let JCpoffset = imgW > imgH ? JCW : JCH
                    // 缩放后图片超出截图外框缩放到截图框大小
                    if(imgRelate*oldimgScale/10000>JCpoffset){
                        this.$refs.cropper.scale = JCpoffset/imgRelate
                    }

                    let imgScale = Math.floor(this.$refs.cropper.scale*10000)
                    // 还原到图片默认相对外框的左边距和上边距以避免截图框超出外框
                    let defaultLeft = (JCropper.offsetWidth - imgW)/2
                    let defaultTop = (JCropper.offsetHeight - imgH)/2
                    this.$refs.cropper.x = defaultLeft
                    this.$refs.cropper.y = defaultTop
                    let imgOffsetLeft = (JCropper.offsetWidth - imgW*imgScale/10000)/2
                    let imgOffsetTop = (JCropper.offsetHeight - imgH*imgScale/10000)/2


                    // 计算宽高以及左上边距
                    let addL = addX > dLeft ? dLeft : addX
                    let dRight = imgW - dW - dLeft
                    let addR = dRight > addX ? addX : dRight
                    let totalW = Math.floor(addL+dW+addR)*imgScale/10000
                    let cropOffsetLeft = imgOffsetLeft + Math.floor(dLeft - addL)*imgScale/10000
                    
                    let addT = addYTop > dTop ? dTop : addYTop
                    let dBottom = imgH - dH - dTop
                    let addB = dBottom > addYBottom ? addYBottom : dBottom
                    let totalH = Math.floor(addT + dH + addB)*imgScale/10000
                    let cropOffsetTop = imgOffsetTop + Math.floor(dTop - addT)*imgScale/10000
                    
                    // 设置截图框大小
                    this.$refs.cropper.cropW = totalW
                    this.$refs.cropper.cropH = totalH
                    // 设置截图框位置
                    this.$refs.cropper.cropOffsertX = cropOffsetLeft
                    this.$refs.cropper.cropOffsertY = cropOffsetTop
                }
                
                this.resetSubmitStatus()
            }).catch(err=>{
                this.resetSubmitStatus()
            })
        },
        resetSubmitStatus(){
            this.isFaceRecognition = false
            this.disabledCropper(false)
        },
        // 人脸识别 --end
        
        handleOk(){
            // 修改文件名称并上传
            this.$refs.cropper.getCropBlob((data) => {
                let fileName = this.cropperImg.fileName+'_'+new Date().getTime()+'.jpg';
                var file = new File([data], fileName, {type:"image/jpeg"});
                
                // 截图过小 文件过小或者文件过大 return
                if(this.$refs.cropper.cropW< 200 || this.$refs.cropper.cropH< 200){
                    this.$Message.info('所截图的尺寸小于200*200,请重新截取图片')
                    return
                }
                if(file.size < 10* 1024 || file.size > 500*1024){
                    this.$Message.info('上传的图片大小必须为10K-500K之间')
                    return
                }
                this.isSubmitting = true
                this.disabledCropper(true)
                const readErr = ()=>{
                    this.disabledCropper(false)
                    this.isSubmitting = false
                }
                this.readFile(file, this.uploadImg, readErr)
            })
        },
        uploadImg(file){
            var req = new FormData()
            req.append('file', file)
            Interface[this.exportTypeKey].uploadImg(req).then(res=>{
                if(res.status == 200 && res.data.status == 200 && res.data.data){
                    this.bPhotoArr.push(res.data.data)
                }else{
                    this.$Message.error(res.data.message)
                }
                this.resetCropper()
                this.isSubmitting = false
            }).catch(err=>{
                this.$Message.error('连接超时')
                this.isSubmitting = false
            })
        },
        handleCancel(){
            this.showModal = false
            this.isSubmitting = false
            this.resetCropper()
        },
        // 读取文件
        readFile (file, loadedFn, errFn) {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onerror = e => {
                this.$Message.error('文件读取出错')
                errFn && errFn()
            }
            reader.onload = e => {
                loadedFn && loadedFn(file, e)
            }
        },
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                if(beFilledItem.hasOwnProperty(key) && item.hasOwnProperty(key) && item[key]){
                    beFilledItem[key] = item[key]
                }
            })
        },
        validDateRange(){
            let s = new Date(this.itemData.bBegintime).getTime(),
                e = new Date(this.itemData.bEndtime).getTime()
            return e >= s
        },
        backList(id){
            let listPage = this.$route.name.substring(0, this.$route.name.lastIndexOf('_'))
            let query = {}
            if(id || this.$route.query.groupId) query.groupId = id || this.$route.query.groupId
            this.$router.replace({ name: listPage, query: query })
        },

    },
    watch: {
        bPhotoArr: {
            handler(val){
                this.itemData.bPhotoList = this.bPhotoArr.join(',');
                if(!this.bPhotoArr.length){
                    this.itemData.bPhoto = ''
                }else{
                    if(this.bPhotoArr.indexOf(this.itemData.bPhoto) == -1){
                        this.itemData.bPhoto = this.bPhotoArr[0]
                    }
                }
            },
            deep: true,
            immediate: true
        }
    }
}
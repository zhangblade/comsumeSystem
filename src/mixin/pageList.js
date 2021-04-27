import Interface from '@/api/data'

export default {
    data () {    
        return {
            // baseParams: {}, // 接口除分页外的必传参数
            // extParams: {}, // 多个搜索条件的额外参数
            searchParams: {}, // 搜索参数

            pager: {
                pageNum: 1,  //当前页
                pageSize: 10,  //每页显示数量
                totalPages: 1,  //总页数
                totalSize: 0,  //总数量
            },
            pageSizeOpt: [10, 20, 30, 40], //分页数量
            initPager: { // 原始分页数据
                pageNum: 1,  //当前页
                pageSize: 10,  //每页显示数量
            },
            pageListData: [],

            // 当前选择搜索条件
            current: {
                index: 0,
                key: '', // 当前下拉列表的键
                val: '', // 搜索框的值 或者下拉列表option的值
                label: '', // 当前下拉列表显示的文字
                type: '',
            },
            loadingTable: false,
            needPager: true,//列表是否需要分页
            needInitData: true, // 进入页面即加载数据
        }
    },
    created(){
        this.beforecreatedFn()
        this.createdFn()
    },
    computed: {
        nps(){
            return this.$route.name + '|' + this.pager.pageNum + "|" + this.pager.pageSize
        },
        tni(){
            return this.tSelName + '|' + this.tSelId
        },
    },
    methods: {
        beforecreatedFn(){},
        createdFn(){
            if(this.needInitData){
                this.fnInitPage()
            }else{
                this.initCondition()
            }
        },
        /**
         * 列表数据编辑或者其他操作后回到之前页面记录页面页数
         */
        reproduceLastPageStatus(){
            if(this.$route.params.tni){
                this.tSelName= this.$route.params.tni.split('|')[0]
                this.tSelId = this.$route.params.tni.split('|')[1]
            }
            if(this.$route.params.nps){
                this.pager.pageNum = Number(this.$route.params.nps.split('|')[1])
                this.pager.pageSize = Number(this.$route.params.nps.split('|')[2])
            }
        },
        initCondition(){
            // 原始分页每页数量
            this.initPager.pageSize = this.pageSizeOpt[0]
            // 重置分页页数和每页数量
            this.pager.pageNum = this.initPager.pageNum
            this.pager.pageSize = this.initPager.pageSize
            
            this.reproduceLastPageStatus()
            // 设置搜索条件默认值
            if(this.condition && this.condition.list.length){
                this.changeQueryKey(this.condition.list[this.current.index], this.current.index)
            }
        },
        fnInitPage(){
            this.initCondition() // 根据是否需要分页设置请求参数请求列表数据
            this.mergeParams() // 合并参数
            
        },
        /** 设置搜索参数 */
        setSearchParams(){
            var params = {}
            if(this.current.val !== ''){
                params[this.current.key] = this.current.val
            }
            this.searchParams = params
        },
        /**
         * 重置页数为第一页，提取搜索字段和值 ， 搜索
         */
        fnSearch(){
            this.setSearchParams() //设置搜索字段和值
            if(this.needPager){
                this.changePage(1)
            }else{
                this.setNoPagerRequestParams()
            }
        },
        mergeParams(){
            if(this.needPager){
                this.setRequestParams()
            }else{
                this.setNoPagerRequestParams()
            }
        },
        setRequestParams(pageNum, pageSize){
            var req = {
                pageNum: pageNum || this.pager.pageNum,
                pageSize: pageSize || this.pager.pageSize,
                params: {}
            }

            if(this.extParams){ // 其他页面所需额外的参数
                Object.assign(req.params, this.extParams)
            }
            if(this.searchParams){ // 搜索参数
                Object.assign(req.params, this.searchParams)
            }
            if(this.baseParams){ // 页面必穿参数
                Object.assign(req.params, this.baseParams)
            }
            this.getPageListData(req)
        },
        setNoPagerRequestParams(){
            var req = {}
            if(this.extParams){ // 其他页面所需额外的参数
                Object.assign(req, this.extParams)
            }
            if(this.searchParams){ // 搜索参数
                Object.assign(req, this.searchParams)
            }
            if(this.baseParams){ // 页面必穿参数
                Object.assign(req, this.baseParams)
            }
            this.getPageListData(req)
        },
        changeQueryKey (option, index) { //更改搜索字段
            this.current.index = index
            this.current.key = option.value
            this.current.type = option.type
            this.current.label = option.label
            this.resetQueryVal()
        },
        resetQueryVal(){
            // 重置 input 和 select
            if(this.current.type == 'input'){
                this.current.val = ''
            }
            if(this.current.type == 'select'){
                if(this.condition[this.current.key] && this.condition[this.current.key].length){
                    this.current.val = this.condition[this.current.key][0].value
                }else{
                    this.current.val = 'all'
                }
            }
        },
        /**
         * 
         * @param {number} pageSize 切换一页显示数量
         */
        changePageSize (pageSize) {
            if(this.pager.pageNum == this.initPager.pageNum){
                pageSize && this.setRequestParams( this.initPager.pageNum, pageSize )
            }else{
                this.pager.pageSize = pageSize
                this.pager.pageNum = pageNum
            }
        },
        changePage (currentPage) {
            this.setRequestParams(currentPage)
        },
        getPageListData(req){
            Interface[this.exportTypeKey].findpage(req).then(res=>{
                if (res.status == 200) {
                    this.loadData(res)
                }else{
                    this.pageListData = []
                    this.$Message.error(res.message)
                }
            })
        },
        /**
         * 
         * @param {object} res 返回数据
         * @param {function} filter 过滤函数(预留)
         */
        loadData(res, filter){
            if(this.needPager){
                if(res.data && res.data.content && res.data.content.length){
                    
                    this.pageListData = res.data.content
                    this.pager.totalSize = res.data.totalSize
                    this.pager.pageSize = res.data.pageSize
                    this.pager.totalPages = res.data.totalPages
                    this.pager.pageNum = res.data.pageNum
                }else{
                    this.pageListData = []
                    this.pager.totalSize = res.data.totalSize || 0
                    this.pager.pageSize = res.data.pageSize || 10
                    this.pager.totalPages = res.data.totalPages || 1
                    this.pager.pageNum = res.data.pageNum || 1
                    this.$Message.info('暂无数据')
                }
            }else{
                if(res.data && res.data.length){
                    this.pageListData = res.data
                }else{
                    this.pageListData = []
                    this.$Message.info('暂无数据')
                }
            }
        },
        removeSuccessCallback(res){
            let message = res ? res.message : '删除成功'
            this.$Message.success(message)
            if(this.needPager){
                if(this.pageListData.length == 1 && this.pager.pageNum > 1){
                    this.pager.pageNum--
                }
                this.setRequestParams()
            }else{
                this.setNoPagerRequestParams()
            }
        },
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                if(beFilledItem.hasOwnProperty(key) && item.hasOwnProperty(key)){
                    beFilledItem[key] = item[key]
                }
            })
        },
        fnLimitText(count){
            return '+'+count
        },
    },
    watch: {
        'pager.pageNum': {
            handler(newVal){
                // this.getPageListData()
            }
        },
    }
}
  
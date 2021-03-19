export default {
    
    data () {
        
        return {
            searchParams: '', //搜索角色信息
            pager: {
                pageNum: 1,  //当前页
                totalPages: 1,  //总页数
                pageSize: 10,  //每页显示数量
                totalSize: 0,  //总数量
            },
            showDeleteBox: false, //是否显示删除弹窗
            pageListData: [], // 列表信息
            rmData: '',
            multipleSelArr: [], //批量删除
        }
    },
    methods: {
        showDeleteModule(row){
            if(row){ //删除单个
                this.rmData = row
                this.showDeleteBox = true
            }else{ //批量删除
                if(!this.multipleSelArr.length){
                    this.$Message.error('请勾选需要删除的数据')
                }else{
                    this.showDeleteBox = true
                }
            }
        },
        resetForm(item){
            Object.keys(item).forEach(key=>{
                item[key] = ''
            })
        },
        fillForm(beFilledItem, item){
            Object.keys(beFilledItem).forEach(key=>{
                if(beFilledItem.hasOwnProperty(key) && item.hasOwnProperty(key)){
                    beFilledItem[key] = item[key]
                }
            })
        },
        changePageSize(pageSize){
            this.pager.pageSize = pageSize
            this.getPageListData(this.pager.pageNum,this.pager.pageSize,this.searchParams)
        },
    }
  }
  
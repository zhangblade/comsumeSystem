import Interface from '@/api/data'
import config from '@/config'

export default {
    data () {    
        return {
            

            downloadUrl: '/consume/forms/download',
            Export: {
                isShow: false,
                exporting: false,
            },
        }
    },
    created(){
        
    },
    methods: {
        // 是否满足导出条件（没有附加条件默认允许）
        canExport(){ return true },
        // 导出
        fnExport () {
            if(this.Export.exporting){
                this.$Message.info("正在导出中,请勿重复点击!")
                return false
            }
            
            if(!this.canExport()) return
            
            if(!this.pageListData.length){
                this.$Message.info('暂无数据')
                return
            }
            this.Export.exporting = true
            var params = Object.assign(this.searchParams, this.extParams, this.baseParams)
            if(this.needPager){
                var req = {
                    pageNum: this.pager.pageNum,  //当前页
                    pageSize: this.pager.pageSize,
                    params: params
                }
            }else{
                var req = params
            }
            Interface[this.exportTypeKey].export(req).then(res=>{
                if(res.status == 200){
                    this.$Message.success(res.message)
                }else{
                    this.$Message.info(res.message)
                }
                this.Export.exporting = false
            }).catch(err=>{
                this.Export.exporting = false
            })
        },
        fnDld(){
            // 先查询导出状态
            let req = {type: this.extParams.type}
            Interface[this.exportTypeKey].getExportStatus(req).then(res=>{
                if(res.status == 200 && res.data){
                    this.fnDownload(res.data)
                }else{
                    this.$Message.error(res.message)
                }
            })
        },
        fnDownload(path){
            const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
            var url = baseUrl + this.downloadUrl + '?path=' + encodeURIComponent(path)
            let link = document.createElement('a')
            link.style.display = 'none';
            link.href = url
            link.target = "_blank"
            link.click(); // 触发下载
            URL.revokeObjectURL(link.href); // 释放通过 URL.createObjectURL() 创建的 URL
        },
    },
}
  
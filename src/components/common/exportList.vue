<template>
    <Drawer :width="375" :transfer="false" :inner="true" title="导出列表" v-model="showDrawer">
        <div class="" v-show="!loadingTable">
            
            <Table ref="selection" :data="pageListData" :columns="tableHeader">
                <template slot-scope="{ row }" slot="action">
                    <span class="btn_action" @click="fnDld(row)">下载</span>
                    <span class="btn_action" @click="fnRemove(row)">删除</span>
                </template>
            </Table>
            <div class="pager_box" v-show="pager.totalSize">
                <Page size="small" show-total :page-size="pager.pageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
            </div>
        </div>
        <div class="spin_box" v-show="loadingTable"><Spin fix class="cus_loading"><Icon type="ios-loading" size=18></Icon><div class="text_loading">Loading</div></Spin></div>
    </Drawer>
    
</template>

<script>

import Interface from '@/api/data'

import pageList from '@/mixin/pageList'
    
import { downLoadFile } from '@/components/common/util'
// import { exportType } from '@/components/common/selectList'
import config from '@/config'

export default {
    name: 'exportList',
    mixins: [ pageList ],
    data () {
        return {
            showDrawer: false,
            tableHeader: [
                {
                    title: '文件名称',
                    key: 'url',
                    render: (h, params)=>{
                        var arr = params.row.url.split(/\//g)
                        var text = decodeURIComponent(arr[arr.length-1])
                        return h('span',text)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 90,
                    align: 'center',
                    slot: 'action',
                }
            ],
            needInitData: false,
            needWatchbCommid: false, //是否需要监听社区id变化重新加载数据
        }
    },
    props: {
        exportTypeKey: {
            type: String,
            default: '',
        },
        exportType: {
            type: Number,
            default: null,
        },
    },
    created() {
        
    },
    computed: {
        baseParams () {
            let type = this.exportType || exportType[this.exportTypeKey]
            return { type: type }
        }
    },
    methods: {
        fnShowDldDrawer () {
            this.showDrawer = true
            this.fnInitPage()
        },
        getPageListData(req){
            this.loadingTable = true
            Interface.common.getExportList(req).then(res=>{
                this.loadingTable = false
                if (res.status == 200) {
                    this.loadData(res)
                }else{
                    this.pageListData = []
                }
            }).catch(err=>{
                this.loadingTable = false
            })
        },
        fnDld (row) {
            const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
            var url = baseUrl + '/sysfile/download?id=' + row.id
            window.open(url, '_blank')
        },
        fnRemove (row) {
            var req = { id : row.id }
            Interface.common.delete(req).then(res=>{
                if(res.status == 200){
                    this.removeSuccessCallback(res)
                }
            })
        },
        
    }
}
</script>
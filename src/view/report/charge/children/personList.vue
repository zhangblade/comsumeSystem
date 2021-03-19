<template>
    <div class="table_box">
        <Table ref="selection" :data="pageListData" :columns="tableHeader" @on-selection-change="onSelectionChange"></Table>
        <div class="pager_box" v-show="pager.totalSize">
            <Page show-total size="small" :page-size="pager.pageSize" :total="pager.totalSize" :current="pager.pageNum" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>

    import Interface from '@/api/data'

    import searchbox from '@/components/common/searchbox'

    import pageList from '@/mixin/pageList'

	export default {
        mixins: [ pageList ],
		data () {
            
			return {
                tableHeader: [
                    { type: 'selection', width: 50, align: 'center', className: 'cus_action_padding' },
                    { title: '人员编号', key: 'bPerno', minWidth: 100, className: 'cus_action_padding' },
                    { title: '人员名称', key: 'bPername', minWidth: 85, className: 'cus_action_padding' },
                    { title: '卡号', key: 'bCardno', minWidth: 100, className: 'cus_action_padding' },
                    { title: '有效开始日期', key: 'bBegintime', minWidth: 110, className: 'cus_action_padding' },
                    { title: '有效结束日期', key: 'bEndtime', minWidth: 110, className: 'cus_action_padding' },
                ],
                needInitData: false,
			}
		},
		created(){
            
        },
        props: {
            bCommids: {
                type: Array,
                default: ()=>[]
            },
            bGroupids: {
                type: Array,
                default: ()=>[]
            },
        },
        computed: {
            baseParams(){
                return {bCommids: this.bCommids, bGroupids: this.bGroupids}
            }
        },
		methods: {
			getPageListData(req){
				Interface.common.getPersonByGroup(req).then(res=>{
					if (res.status == 200) {
                        this.loadData(res)
					}else{
                        this.$Message.error(res.message)
                    }
				}).catch(err=>{
                    this.pageNum = pageNum; // 出错 不切换分页
                    this.$Message.error(err.message)
                })
            },
            onSelectionChange(selection){
                this.$emit('changeChecked', selection)
            }
        }
	}
</script>
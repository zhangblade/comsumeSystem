<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            <div class="adapt_wrap">
                
                <Content>
                    <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">

                        <FormItem label="服务名称" prop="appId">
                            <Select v-model="itemData.appId">
                                <Option v-for="(item, index) in appIdList" :value="item.value" :key="index">{{item.label}}</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="商品ID" prop="proId"><Input v-model="itemData.proId" placeholder="请输入商品ID"></Input></FormItem>

                        <FormItem label="商品名称" prop="proName"><Input v-model="itemData.proName" placeholder="请输入商品名称"></Input></FormItem>

                        <FormItem label="价格" prop="proPrice"><Input-number class="dblock" :min="0" v-model="itemData.proPrice"></Input-number></FormItem>

                        <FormItem label="时间单位" prop="timeUnit">
                            <Select v-model="itemData.timeUnit">
                                <Option v-for="(item, index) in timeUnitList" :value="item.value" :key="index">{{item.label}}</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="商品描述" prop="proDesc"><Input v-model="itemData.proDesc" placeholder="请输入商品描述"></Input></FormItem>
                        
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('itemData')">提交</Button>
                            <Button @click="backPrevPage()" style="margin-left:20px">取消</Button>
                        </FormItem>
                        
                    </Form>
                </Content>
            </div>
        </Layout>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    
    import mx_opt from './mixin_opt'

	export default {
        name: 'edit',
        mixins: [ mx_opt ],
		data () {
			return {
                itemData: {
                    id: Number(this.$route.query.id),
                    appId: '',
                    proId: '',
                    proName: '',
                    proPrice: 0,
                    timeUnit: '0',
                    proDesc: '',
                },

			}
        },
        created(){
            this.getAppList()
            this.getEditItemData()
        },
        mounted () {
            
        },
		methods: {
            // 获取 select 下拉 option 数据
            getAppList(){
                Interface.appView.list({}).then(res=>{
                    if (res.status == 200) {
                        this.appIdList = res.data.map(item=>{
                            item.label = item.appName;
                            item.value = item.appId;
                            return item
                        })
                        this.itemData.appId = this.appIdList[0].value
                    }else{
                        this.$Message.error(res.message)
                    }
                    this.loadedRemoteCondition = true
                })
            },
            getEditItemData(){
                let req = {id: Number(this.$route.query.id)}
                Interface[this.exportTypeKey].findById(req).then(res=>{
                    if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
                    }else{
                        this.$Message.error(res.message)
                    }
                })
            },
            handleSubmit(validInfo){
                
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].edit(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.backPrevPage()
                            }else{
                                this.$Message.error(res.message)
                            }
                        })
                    }
                })
                
            },
        },
	}
</script>

<style lang="less" scoped>
    .dblock{
        display: block;
        width: 100%;
    }
</style>

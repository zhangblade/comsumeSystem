<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
            <Content>
                <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">
                    
                    <FormItem label="上级名称" prop="parentName" v-if="parentName"><Input disabled v-model="parentName" placeholder="请输入上级名称"></Input></FormItem>

                    <FormItem label="组别名称" prop="groupName"><Input v-model="itemData.groupName" placeholder="请输入组别名称"></Input></FormItem>

                    <FormItem label="组别描述" prop="groupDesc"><Input v-model="itemData.groupDesc" placeholder="请输入组别描述"></Input></FormItem>

                    <FormItem label="排序" prop="orderBy"><Input type="number" v-model="itemData.orderBy" placeholder="请输入排序"></Input></FormItem>

                    <FormItem>
                        <Button :loading="isSubmitting" type="primary" @click="handleSubmit('itemData')">提交</Button>
                        <Button style="margin-left: 20px;" @click="cancel('itemData')">取消</Button>
                    </FormItem>

                </Form>
            </Content>
        </div>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    import opt from './opt.js'

	export default {
        name: 'edit',
        mixins: [ opt ],
		data () {
			return {
                
			}
        },
		created(){
            this.getEditItemData()
        },
		methods: {
            getEditItemData(){
                var req = { groupId: this.$route.query.groupId, bCommid: this.$store.state.app.bCommid }
				Interface[this.exportTypeKey].findById(req).then(res=>{
					if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
                        this.itemData.groupId = res.data.groupId
					}
				})
            },
            fillForm(beFilled, origin){
                Object.keys(beFilled).forEach(key=>{
                    if (origin[key]) { beFilled[key] = origin[key] }
                })
            },
            handleSubmit(validInfo){

                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        Interface[this.exportTypeKey].edit(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.$router.go(-1)
                            }
                        })
                    }
                })
                
            },
            cancel(validInfo){
                this.handleReset(validInfo)
                this.$router.go(-1)
            },
            handleReset(validInfo) {
                this.$refs[validInfo].resetFields()
            }
        },
	}
</script>

<style lang="less" scoped>
</style>

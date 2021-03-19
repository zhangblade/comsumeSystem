<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            <div class="adapt_wrap">
                <Content>
                    <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">

                        <FormItem label="标签名" prop="name"><Input v-model="itemData.name" placeholder="请输入标签名"></Input></FormItem>

                        <FormItem label="数据值" prop="value"><Input v-model="itemData.value" placeholder="请输入数据值"></Input></FormItem>

                        <FormItem label="类型" prop="type"><Input v-model="itemData.type" placeholder="请输入类型"></Input></FormItem>

                        <FormItem label="描述" prop="description"><Input v-model="itemData.description" placeholder="请输入描述"></Input></FormItem>

                        <FormItem label="父级编号" prop="parentId"><Input v-model="itemData.parentId" placeholder="请输入父级编号"></Input></FormItem>

                        <FormItem label="排序号" prop="sort"><Input-number class="dblock" :min="0" v-model="itemData.sort"></Input-number></FormItem>

                        <FormItem label="备注" prop="remarks"><Input v-model="itemData.remarks" placeholder="请输入备注信息"></Input></FormItem>
                        
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
        name: 'add',
        mixins: [ mx_opt ],
		data () {
			return {

			}
        },
        created(){
            
        },
        mounted () {
            
        },
		methods: {
            handleSubmit(validInfo){
                
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        
                        Interface[this.exportTypeKey].add(this.itemData).then(res=>{
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
        width: 100%;
    }
</style>

<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
                    
            <Content>
                <Form ref="itemData" :model="itemData" :label-width="120" :rules="formRules">

                    <FormItem label="社区名称" prop="bCommname"><Input v-model="itemData.bCommname" placeholder="请输入社区名称" :maxlength="40"></Input></FormItem>

                    <FormItem label="联系人" prop="bCommcontactn"><Input v-model="itemData.bCommcontactn" placeholder="请输入联系人" :maxlength="10"></Input></FormItem>

                    <FormItem label="手机号码" prop="bCommcontactt"><Input v-model="itemData.bCommcontactt" placeholder="请输入手机号码" :maxlength="11"></Input></FormItem>

                    <FormItem label="电话号码" prop="bCommcontactp"><Input v-model="itemData.bCommcontactp" placeholder="请输入电话号码" :maxlength="11"></Input></FormItem>

                    <FormItem label="备注" prop="bCommremark"><Input v-model="itemData.bCommremark" placeholder="请输入备注"></Input></FormItem>

                    <FormItem>
                        <Button type="primary" :loading="isSubmitting" @click="handleSubmit('itemData')">提交</Button>
                        <Button type="default" @click="cancel('itemData')" style="margin-left: 20px;">取消</Button>
                    </FormItem>

                </Form>
            </Content>
        </div>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    import mixin_opt from "./mixin_opt";

	export default {
        name: 'add',
        mixins: [ mixin_opt],
		data () {
			return {
                itemData: {
                    bCommcontactp: '',
                    bCommcontactn: '',
                    bCommcontactt: '',
                    
                    bCommremark: '',
                },
			}
        },
		methods: {
            handleSubmit(validInfo){

                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        this.isSubmitting = true
                        Interface[this.exportTypeKey].add(this.itemData).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.$router.go(-1)
                            }
                            this.isSubmitting = false
                        }).catch(err =>{
                            this.isSubmitting = false
                        })
                    }
                })
                
            },
        },
	}
</script>
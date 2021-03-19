<template>
        
    <Layout class="router_view">
        
        <Layout class="right_wrap">
            <div class="content_header">
                <h5 class="ml">{{$route.meta.title}}</h5>
            </div>
            <div class="adapt_wrap">
                
                <Content>
                    <!-- 增加角色 -->
                    <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">

                        <FormItem label="类型" placeholder="请选择" prop="type">
                            <RadioGroup v-model="itemData.type" @on-change="changeType">
                                <Radio v-for="(item, index) in menuTypeList" :key="index" :label="item.value" :disabled="item.disabled">{{item.label}}</Radio>
                            </RadioGroup>
                        </FormItem>

                        <FormItem v-if="!itemData.parentId" label="所属产品" placeholder="请选择" prop="appId">
                            <Select v-model="appId">
                                <Option v-for="item in productList" :value="item.appId" :key="item.appId">{{item.appName}}</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="菜单名称" prop="name"><Input v-model="itemData.name" placeholder="请输入菜单名称" :maxlength="50"></Input></FormItem>

                        <FormItem label="链接地址" prop="url"><Input v-model="itemData.url" placeholder="请输入链接地址" :maxlength="50"></Input></FormItem>

                        <FormItem label="路径" prop="path"><Input v-model="itemData.path" placeholder="请输入路径" :maxlength="50"></Input></FormItem>

                        <FormItem label="权限标识" prop="perms"><Input v-model="itemData.perms" placeholder="请输入权限标识" :maxlength="50"></Input></FormItem>

                        <FormItem label="排序号" prop="orderNum"><Input-number class="dblock" v-model="itemData.orderNum" placeholder="请输入排序号"></Input-number></FormItem>

                        <FormItem label="图标" prop="icon">
                            <Input v-model="itemData.icon" placeholder="请输入图标 例如: fa fa-circle-o" :maxlength="50">
                                <Button slot="append" @click="toggleIconBox()">选择图标</Button>
                            </Input>
                        </FormItem>

                        <FormItem v-if="!itemData.parentId" label="应用范围" placeholder="请选择" prop="scope">
                            <Select v-model="scope">
                                <Option v-for="item in scopeList" :value="Number(item.value)" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </FormItem>
                        
                        <FormItem>
                            <Button type="primary" @click="fnSubmit('itemData')">提交</Button>
                            <Button type="error" @click="backPrevPage()" style="margin-left:20px">取消</Button>
                        </FormItem>

                    </Form>
                </Content>
            </div>
        </Layout>
            
        <Drawer :width="375" :transfer="false" :inner="true" :title="'图标列表'" v-model="showIconDrawer">
            <div class="icon_list">
                <i v-for="(item,index) in iconList" :key="index" @click="chooseIcon(item)">{{item}}</i>
            </div>
        </Drawer>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    import mx_opt from "./opt";

	export default {
        name: 'add',
        mixins: [mx_opt],
		data () {
			return {
                
			}
        },
        created(){
            this.disableMenuType()
        },
		methods: {
            toggleIconBox(){
                this.showIconDrawer = !this.showIconDrawer
            },
            chooseIcon(item){
                this.itemData.icon = item
                this.showIconDrawer = false
            },
            fnSubmit(validInfo){

                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        this.itemData.path = this.itemData.path.trim()
                        var req = this.itemData
                        if(!this.itemData.parentId){
                            req.appId = this.appId
                            req.scope = this.scope
                        }
                        Interface[this.exportTypeKey].add(req).then(res=>{
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

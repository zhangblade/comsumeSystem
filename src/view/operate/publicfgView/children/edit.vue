<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
            <Content>
                <!-- 增加角色 -->
                <Form ref="itemData" :model="itemData" :label-width="110" :rules="formRules">

                    <FormItem label="社区id" prop="bCommid"><Input v-model="itemData.bCommid" placeholder="社区id(如00000086)"></Input></FormItem>

                    <FormItem label="配置信息" prop="cfgItem"><Input v-model="itemData.cfgItem" placeholder="配置信息"></Input></FormItem>
                    
                    <FormItem label="配置项描述" prop="cfgDesc"><Input v-model="itemData.cfgDesc" placeholder="请输入配置项描述"></Input></FormItem>
                    
                    <FormItem label="类别" prop="cfgType">
                        <RadioGroup v-model="itemData.cfgType" @on-change='changeType'>
                            <Radio v-for="(item, index) in cfgTypeList" :key="index" :label="item.value">{{item.label}}</Radio>
                        </RadioGroup>
                    </FormItem>
                    
                    <FormItem label="分类名称" prop="cataTitle"><Input v-model="itemData.cataTitle" placeholder="请输入分类名称" /></FormItem>

                    <FormItem label="分类id" prop="cataId"><Input v-model="itemData.cataId" placeholder="对配置项进行分类，如01_wechat, 02_alipay(其中01是分组顺序)"></Input></FormItem>
                    
                    <FormItem label="参数值类型" prop="inputType">
                        <RadioGroup v-model="itemData.inputType" @on-change='changeType'>
                            <Radio label="1">输入框</Radio>
                            <Radio label="2">下拉列表</Radio>
                        </RadioGroup>
                    </FormItem>
                    
                    <FormItem v-show="itemData.inputType == '1'" label="输入框参数值" prop="cfgValue"><Input v-model="itemData.cfgValue" placeholder="输入框参数值(比如名称)"></Input></FormItem>

                    <FormItem label="新增下拉选项" v-show="itemData.inputType == '2'">
                        <Input v-model="currentOptionVal" placeholder="请输入下拉选项值" :maxlength="11" @on-enter="fnAddOption"><Button slot="append" @click="fnAddOption">新增选项</Button></Input>
                    </FormItem>

                    <FormItem label="设置默认值" v-if="itemData.inputType == '2' && addSelect.length">
                        <Select v-model="itemData.cfgValue">
                            <Option v-for="(item, index) in addSelect" :value="item.value" :label="item.label" :key="index" class="flex_layout jc_space_between">
                                <span class="">{{ item.label }}</span>
                                <span class="" @click.stop="deleteOption(index)">删除该选项</span>
                            </Option>
                        </Select>
                    </FormItem>
                    
                    <FormItem label="排序" prop="orderNum"><InputNumber class="dblock" :min="0" v-model="itemData.orderNum" placeholder="请输入排序"></InputNumber></FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleSubmit('itemData')" :loading="isSubmitting">提交</Button>
                        <Button type="default" @click="cancel('itemData')" style="margin-left: 20px;">取消</Button>
                    </FormItem>

                </Form>
            </Content>
        </div>
    </Layout>
    
</template>

<script>
    import Interface from '@/api/data'
	export default {
        name: 'add',
		data () {
            
			return {
                formRules: {
                    bCommid: [ { required: true, message: '社区id不能为空', trigger: 'blur' }],
                    cfgItem: [ { required: true, message: '配置信息不能为空', trigger: 'blur' }],
                    cfgDesc: [ { required: true, message: '配置项描述不能为空', trigger: 'blur' }],
                    cfgType: [ { required: true, message: '类别不能为空', trigger: 'change' }],
                    cataTitle: [ { required: true, message: '分类名称不能为空', trigger: 'blur' }],
                    cataId: [ { required: true, message: '分类id不能为空', trigger: 'blur' }],
                    orderNum: [ { required: true, type: 'number', message: '排序号不能为空', trigger: 'blur' }],
                },
                itemData: {
                    bCommid: '',
                    cfgDesc: '',
                    cfgItem: '',
                    cfgType: '0',
                    inputType: '1',
                    cfgValue: '',
                    cataId: '',
                    cataTitle: '',
                    orderNum: null,
                },
                cfgTypeList: [
                    { value: '0', label: '普通配置' },
                    { value: '1', label: '固定配置(不可删除)' },
                    { value: '2', label: '其它' },
                ],
                addSelect: [],
                currentOptionVal: '',
                isSubmitting: false,
                exportTypeKey: 'publicfgView',
			}
        },
        created(){
            this.getEditItemData()
        },
        computed: {
            selectDesc () {
                return this.addSelect.map((el,i)=>i+':'+el.label).join()
            },
            selectVal () {
                return this.addSelect.map((el,i)=>i).join()
            },
        },
		methods: {
            getEditItemData(){
                let req = this.$route.query
                Interface[this.exportTypeKey].findById(req).then(res=>{
                    if (res.status == 200) {
                        this.fillForm(this.itemData, res.data)
                        if(res.data.inputType == '2' && res.data.selectDesc.split(',').length > 0){
                            this.addSelect = res.data.selectDesc.split(',').map(i=>{
                                return {
                                    label: i.split(':')[1],
                                    value: i.split(':')[0],
                                }
                            })
                        }
                    }
                })
                
            },
            fillForm(beFilledItem, item){
                Object.keys(beFilledItem).forEach(key=>{
                    if(item.hasOwnProperty(key) && item[key] !== '' && item[key] !== null){
                        beFilledItem[key] = item[key]
                    }
                })
            },
            fnAddOption () {
                if(!this.currentOptionVal){
                    this.$Message.info('请输入选项值')
                }else if (this.addSelect.indexOf(this.currentOptionVal) != -1){
                    this.$Message.info('已添加该选项')
                }else{
                    let indexKey = this.addSelect.length
                    this.addSelect.push({ value: indexKey, label: this.currentOptionVal })
                    this.currentOptionVal = ''
                }
            },
            deleteOption (index) {
                this.addSelect.splice(index, 1)
            },
            changeType(type){
                this.itemData.cfgValue = ''
            },
            handleSubmit(validInfo){
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        if (this.itemData.inputType == '2') {
                            if(!this.addSelect.length){
                                this.$Message.info('请添加下拉框选项')
                                return
                            }
                            if(!this.itemData.cfgValue || this.itemData.cfgValue>=this.addSelect.length){
                                this.$Message.info('请设置下拉框选项默认值')
                                return
                            }
                            
                            this.itemData.selectDesc = this.selectDesc
                            this.itemData.selectVal = this.selectVal
                        }
                        this.isSubmitting = true
                        Interface[this.exportTypeKey].edit(this.itemData).then(res=>{

                            if (res.status == 200) {
                                this.$Message.success(res.message)
                                this.backPrevPage()
                            }else{
                                this.$Message.error(res.message)
                            }
                            this.isSubmitting = false
                        }).catch(err=>{
                            this.isSubmitting = false
                        })
                    }
                })
                
            },
            cancel(validInfo){
                this.backPrevPage()
            },
            handleReset(validInfo) {
                this.$refs[validInfo].resetFields()
            },
            backPrevPage(){
                if(this.$route.query.nps){
                    this.$router.replace({ name: this.$route.query.nps.split('|')[0], params: this.$route.query })
                }
                this.$router.go(-1)
            },
        },
	}
</script>
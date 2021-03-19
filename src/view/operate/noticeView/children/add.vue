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

                        <FormItem label="标题" prop="title"><Input v-model="itemData.title" placeholder="请输入标题"></Input></FormItem>

                        <FormItem label="正文类型" prop="contentType">
                            <Select v-model="itemData.contentType">
                                <Option v-for="(item, index) in contentType" :value="item.value" :key="index">{{item.label}}</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="推送方式" prop="sendWay">
                            <Select v-model="itemData.sendWay">
                                <Option v-for="(item, index) in sendWay" :value="item.value" :key="index">{{item.label}}</Option>
                            </Select>
                        </FormItem>

                        <!-- <FormItem label="是否需要回执" prop="receiptFlag">
                            <!-- <Select v-model="itemData.receiptFlag"> -->
                                <!-- <Option v-for="(item, index) in receiptFlag" :value="item.value" :key="index">{{item.label}}</Option> -->
                            </Select>
                        </FormItem> -->

                        <FormItem label="正文" prop="content">
                            <Input :rows="4" v-model="itemData.content" type="textarea" placeholder="请输入正文" />
                        </FormItem>

                        <FormItem label="有效时间" prop="TimeRange">
                            <DatePicker type="datetimerange" placement="bottom-start" placeholder="请选择时间范围" :value="itemData.TimeRange" @on-change="itemData.TimeRange=$event" style="width: 100%;"></DatePicker>
                        </FormItem>

                        <FormItem label="接收对象" prop="receiverType">
                            <Select v-model="itemData.receiverType" @on-change="changeReceiver">
                                <Option v-for="(item, index) in receiverType" :value="item.value" :key="index">{{item.label}}</Option>
                            </Select>
                        </FormItem>
                    
                        <FormItem label="选择公司" v-if="itemData.receiverType !== '0'">
                            <div class="company_list">
                                <span class="nodata" v-if="!companyList.length">请选择公司</span>
                                <div class="tag_list" v-else>
                                    <Tag v-for="(item, index) in companyList" :key="index" :name="item.tenementName" closable @on-close="handleClose">{{ item.tenementName }}</Tag>
                                </div>
                                <Button class="append_btn" @click="fnShowDrawer()">选择公司</Button>
                            </div>
                        </FormItem>
                    
                        <FormItem label="图片上传">
                            <div class="upload_opts_box">
                                <Upload :show-upload-list="false" class="upload_box dis_inline_block" ref="upload" accept=".jpg, .jpeg" :max-size="2048" :before-upload="handleBeforeUpload" action="">
                                    <Button icon="md-add">选择图片</Button>
                                </Upload>
                                <!-- <Button icon="ios-cloud-upload-outline" @click="batchUpload">开始上传</Button> -->
                                <!-- <Button icon="md-trash">删除任务</Button> -->
                            </div>
                            <div class="img_box preview_list">
                                <div class="img_item" v-show="item.url" v-for="(item, index) in previewList" :key="index">
                                    <div :class="['col_u dis_inline_block vam img_unit']"><img :ref="'preview'+index" class="adapthw vam" :src="item.url"></div>
                                    <span class="col_u name vam">{{item.name}}</span>
                                    <Progress class="col_u mw_300" :percent="item.percentage" hide-info></Progress>
                                    <span class="col_u btn_act btn_upload vam" v-if="!item.id" @click="handleUpload(item, index)">上传</span>
                                    <span class="col_u btn_act btn_delete vam" @click="handleRemove( 'previewList', item, index)">删除</span>
                                </div>
                            </div>
                        </FormItem>
                        
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('itemData')">提交</Button>
                            <Button @click="backPrevPage()" style="margin-left:20px">取消</Button>
                        </FormItem>
                        
                    </Form>
                </Content>
            </div>
        </Layout>

        <Drawer :width="375" :transfer="false" :inner="true" :title="'公司列表'" v-model="showDrawer">
            <ul class="list">
                <li class="list_item" v-for="(item, index) in departmentList" :key="index">
                    <span class="tt">{{item.bName}}</span>
                    <span class="cus_btn" @click="chooseCompany(item)">选择</span>
                </li>
            </ul>
            <div class="pager">
                <Page :total="pager.totalSize" size="small" show-elevator @on-change="changePage" />
            </div>
            <div class="opts">
                <Button type="primary" @click="fnHideDrawer()">完成</Button>
            </div>
        </Drawer>
        
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
                itemData: {
                    title: '',
                    content: '',
                    contentType: '1',
                    sendWay: '1',
                    // receiptFlag: '1',
                    TimeRange: [],
                    // validStartTime: '',
                    // validEndTime: '',
                    // imageUrls: '',
                    receiverType: '0',
                    receiver: '',
                },

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
                        var req = {}, imgs = []
                        this.previewList.forEach(el=>{
                            el.id && imgs.push({ url: el.url, name: el.name, id: el.id, percentage: el.percentage }) 
                        })
                        req.imageUrls = JSON.stringify(imgs)
                        if(this.itemData.TimeRange.length){
                            req.validStartTime = this.itemData.TimeRange[0]
                            req.validEndTime = this.itemData.TimeRange[1]
                        }
                        
                        if(this.itemData.receiverType != '0'){
                            if(!this.itemData.receiver || !this.itemData.receiver){
                                this.$Message.info('请选择接收对象')
                                return
                            }
                        }
                        Object.assign(req, this.itemData)
                        
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
    .img_box{
        .img_item{
            margin-bottom: 10px;
            .showpic{
                visibility: visible;
            }
            .hidepic{
                visibility: hidden;
            }
            .wid{
                img{
                    width: 100%;
                }
            }
            .hei{
                img{
                    height: 100%;
                }
            }
        }
    }
    .img_unit{
        width: 60px;
        height: 60px;
        line-height: 60px;
        font-size: 0;
        text-align: center;
    }
    .col_u{
        margin-right: 10px;
    }
    .dis_inline_block{
        display: inline-block;
    }
    .vam{
        vertical-align: middle;
    }
    .mw_300{
        max-width: 300px;
    }
    .adapthw{
        max-width: 100%;
        max-height: 100%;
    }
    .btn_act{
        cursor: pointer;
        color: #0099cc;
    }
    .name{
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .upload_opts_box{
        padding: 0 0 10px 0;
    }
    .upload_box{
        margin-right: 10px;
    }
    
    .pager{
        display: flex;
        flex-direction: row-reverse;
    }
    .list, .pager, .hasChooseList{
        margin-bottom: 10px;
    }
    .list{
        .list_item{
            list-style: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .cus_btn{
                padding: 5px 0;
                cursor: pointer;
                color: #2d8cf0;
            }
        }
    }
    .company_list{
        box-sizing: border-box;
        width: 100%;
        border: 1px solid #dcdee2;
        position: relative;
        .nodata{
            padding-left: 10px;
        }
        .tag_list{
            width: 100%;
            padding-right: 90px;
            padding-left: 10px;
        }
        .append_btn{
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            border-color: transparent;
            border-left-color: #dcdee2;
        }
    }
</style>

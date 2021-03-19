<template>
        
    <Layout class="router_view">
        <div class="content_header">
            <h5 class="ml">{{$route.meta.title}}</h5>
        </div>
        <div class="adapt_wrap">
                    
            <Content>
                <Form ref="itemData" :model="itemData" :label-width="120" :rules="formRules">
                    
                    <FormItem label="人员编号" prop="bPerno"><Input v-model="itemData.bPerno" placeholder="请输入人员编号" :maxlength="20" /></FormItem>
                    
                    <FormItem label="人员名称" prop="bPername"><Input v-model="itemData.bPername" placeholder="请输入人员名称" :maxlength="20" /></FormItem>
                    
                    <FormItem label="群组" prop="bGroupid">
                        <Input ref="groups" v-model="groups.name" placeholder="请选择群组" disabled>
                            <Button slot="append" @click="fnShowDrawer('groups')">选择群组</Button>
                        </Input>
                    </FormItem>
                    
                    <FormItem label="人员类别" prop="bTypeid">
                        <Input ref="pertypes" v-model="pertypes.name" placeholder="请选择人员类别" disabled>
                            <Button slot="append" @click="fnShowDrawer('pertypes')">选择人员类别</Button>
                        </Input>
                    </FormItem>
                    
                    <FormItem label="有效期开始时间" prop="bBegintime">
                        <DatePicker type="date" placeholder="请输入发行开始日期" :value="itemData.bBegintime" @on-change="itemData.bBegintime=$event"></DatePicker>
                    </FormItem>
                    
                    <FormItem label="有效期结束时间" prop="bEndtime">
                        <DatePicker type="date" placeholder="请输入有效期结束时间" :value="itemData.bEndtime" @on-change="itemData.bEndtime=$event"></DatePicker>
                    </FormItem>
                    
                    <FormItem label="手机号" prop="bMobile"><Input v-model="itemData.bMobile" placeholder="请输入手机号" :maxlength="11" /></FormItem>

                    <FormItem label="证件号码" prop="bIdcard"><Input v-model="itemData.bIdcard" placeholder="请输入证件号码" :maxlength="18"/></FormItem>

                    <FormItem label="性别" prop="bSex">
                        <RadioGroup v-model="itemData.bSex"><Radio label="1">男</Radio><Radio label="0">女</Radio></RadioGroup>
                    </FormItem>
                    
                    <FormItem label="出生日期" prop="bBirthday">
                        <DatePicker type="date" placeholder="请输入出生日期" v-model="itemData.bBirthday" @on-change="itemData.bBirthday=$event"></DatePicker>
                    </FormItem>
                    
                    <FormItem label="选择照片" prop="bPhoto">
                        <div class="uploadedImg_box flex_layout">
                            <div :class="['uploadedImg_item', defIndex == index ? 'default' : '']" v-for="(img, index) in bPhotoArr" :key="index">
                                <div class="upimg"><img :src="img" class="uploadedImg" /></div>
                                <span v-if="defIndex == index" class="text_default">主图</span>
                                <div v-else class="btn_setdefault" @click="setDefaultImg(img, index)"><span class="">设为主图</span></div>
                                <div class="btn_close" @click="deleteImg(img, index)"><Icon class="icon_close" size="20" type="md-close" /></div>
                            </div>

                            <Upload v-if="bPhotoArr.length<5" class="uploadedImg_item btn_upload" ref="upload" :show-upload-list="false" :accept="fileAccept" :before-upload="handleBeforeUpload" action="">
                                <Icon class="icon_upload" size="50" type="md-add" />
                            </Upload>
                        </div>
                        
                    </FormItem>
                    
                    <FormItem label="注册方式">
                        <div><Checkbox v-model="itemData.bReglimitPc" true-value="RegPc" false-value="">允许用户在PC端注册</Checkbox></div>
                        <div><Checkbox v-model="itemData.bReglimitWx" true-value="RegWx" false-value="">允许用户在微信端注册</Checkbox></div>
                        <div><Checkbox v-model="itemData.bReglimitApp" true-value="RegApp" false-value="">允许用户在APP端注册</Checkbox></div>
                    </FormItem>

                    <FormItem label="备注"><Input v-model="itemData.bMemo" placeholder="请输入备注" /></FormItem>

                    <FormItem>
                        <Button type="primary" :loading="isSubmitting" @click="handleSubmit('itemData')">提交</Button>
                        <Button type="default" @click="cancel('itemData')" style="margin-left: 20px;">取消</Button>
                    </FormItem>

                </Form>
            </Content>
        </div>

        <Drawer :width="375" :transfer="false" :inner="true" :title="'群组列表'" v-model="groups.show">
            <div class="list">
                <Tree ref="tree" :data="groups.list" :render="renderContent"></Tree>
            </div>
        </Drawer>

        <Drawer :width="375" :transfer="false" :inner="true" :title="'人员类别列表'" v-model="pertypes.show">
            <div class="list">
                <Tree ref="tree" :data="pertypes.list" :render="renderContent"></Tree>
            </div>
        </Drawer>

        <Modal v-model="showModal" title="图片裁剪" class-name="vertical-center-modal" :mask-closable="false" :width="873">
            <div class="cropper_module">
                <div class="cropper_box">
                    <VueCropper id="JCropper" ref="cropper" :img="cropperImg.imgSrc" :output-size="cropperImg.size" :output-type="cropperImg.outputType" :info="true" :full="cropperImg.full" :fixed="cropperImg.fixed" :fixed-number="cropperImg.fixedNumber"
                        :can-move="cropperImg.canMove" :can-move-box="cropperImg.canMoveBox" :fixed-box="cropperImg.fixedBox" :original="cropperImg.original" :canScale="cropperImg.canScale"
                        :auto-crop="cropperImg.autoCrop" :auto-crop-width="cropperImg.autoCropWidth" :auto-crop-height="cropperImg.autoCropHeight" :centerBox="cropperImg.centerBox"
                        @real-time="realTime" :infoTrue="true" :high="cropperImg.high"
                        @img-load="imgLoad" mode="contain" :max-img-size="cropperImg.max">
                    </VueCropper>
                </div>

                <div class="cropper_preview">
                    <h5>原图{{`大小:${cropperImg.fileSize}k(${cropperImg.imgWidth}*${cropperImg.imgHeight})`}}</h5>
                    <div class="preview_body">
                        <div class="preview_wrap">
                            <img id="sourceImg" v-if="cropperImg.sourceImgSrc" :src="cropperImg.sourceImgSrc" alt="Cropped Image" />
                        </div>
                    </div>
                    <div class="preview_info">
                        <h5>截图{{`大小:${cropperImg.cropperedSize}k(${cropperImg.cropperedWidth}*${cropperImg.cropperedHeight})`}}</h5>
                        <div class="preview_body">
                            <div class="preview_wrap">
                                <img id="cropImgPrev" v-if="cropperImg.previewImg" :src="cropperImg.previewImg" alt="Cropped Image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="options">
                <Upload class="dib" ref="upload" :show-upload-list="false" :accept="fileAccept" :before-upload="handleBeforeUpload" action="">
                    <Button :disabled="isFaceRecognition || isSubmitting" class="cus_btn">重新选图</Button>
                </Upload>
                <Button class="cus_btn" :disabled="isSubmitting" :loading="isFaceRecognition" @click="fnFaceRecognition()">人脸识别</Button>
                <Button class="cus_btn" :disabled="isFaceRecognition || disableEnlarge || isSubmitting" @click="changeScale(1)">放大</Button>
                <Button class="cus_btn" :disabled="isFaceRecognition || disableNarrow || isSubmitting" @click="changeScale(-1)">缩小</Button>
            </div>
            <div slot="footer">
                <Button type="text" :disabled="isFaceRecognition" @click="handleCancel()">取消</Button>
                <Button type="primary" :disabled="isFaceRecognition" :loading="isSubmitting" @click="handleOk()" style="margin-left: 8px;">确认</Button>
            </div>
            
        </Modal>
        
        <div class="hidden">
            <img id="beforePrev" alt="Cropped Image" />
            <canvas id='dbCropCanvas'></canvas>
        </div>
        
    </Layout>
    
</template>

<script>

    import Interface from '@/api/data'
    import opt from './opt'

    import { VueCropper }  from 'vue-cropper'

    export default {
        name: 'add',
        mixins: [opt],
        components: {VueCropper},
		data () {
			return {

			}
        },
        created() {
            this.setDefaultDay()
        },
		methods: {
            
            getHandledValue (num){
                return num < 10 ? '0' + num : num
            },
            setDefaultDay (){
                const d = new Date()
                const year = d.getFullYear()
                const month = this.getHandledValue(d.getMonth() + 1)
                const date = this.getHandledValue(d.getDate())
                this.itemData.bBegintime = year + '-' + month + '-' + date
                this.itemData.bEndtime = '2099-01-01'
            },
            handleSubmit(validInfo){
                this.$refs[validInfo].validate((valid) => {
                    if (valid) {
                        if(!this.validDateRange()){
                            this.$Message.info('结束日期不能早于开始日期')
                            return
                        }
                        var req = this.itemData
                        req.bBegintime = this.itemData.bBegintime.split(' 00:00:00')[0] + ' 00:00:00'
                        req.bEndtime = this.itemData.bEndtime.split(' 00:00:00')[0] + ' 00:00:00'
                        
                        this.isSubmitting = true
                        Interface[this.exportTypeKey].add(req).then(res=>{
                            if (res.status == 200) {
                                this.$Message.success('增加成功')
                                this.backList()
                            }
                            this.isSubmitting = false
                        }).catch(err=>{
                            this.isSubmitting = false
                        })

                    }
                })
            },
        },
	}
</script>

<style lang="less" scoped>
    .uploadedImg_box{
        .uploadedImg_item{
            box-sizing: border-box;
            width: 100px;
            height: 100px;
            border: 1px solid #ccc;
            background: #fff;
            position: relative;
            margin-right: 10px;
            .upimg{
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    display: block;
                    max-width: 100%;
                    max-height: 100%;
                    margin: auto;
                }
            }
            .btn_close{
                display: none;
                width: 20px;
                height: 20px;
                position: absolute;
                right: 0;
                top: 0;
                transition: all 0.5s;
                cursor: pointer;
                .icon_close{
                    display: block;
                }
                &:hover{
                    color: #0099cc;
                }
            }
            .text_default{
                display: block;
                background-color: #0099cc;
                color: #fff;
                border-radius: 2px;
                line-height: 1;
                position: absolute;
                left: 5px;
                top: 5px;
                padding: 3px;
                font-size: 12px;
            }
            .btn_setdefault{
                display: none;
                position: absolute;
                background-color: #0099cc;
                color: #fff;
                border-radius: 2px;
                line-height: 1;
                position: absolute;
                left: 5px;
                top: 5px;
                padding: 3px;
                font-size: 12px;
                cursor: pointer;
            }
            &.btn_upload{
                cursor: pointer;
                text-align: center;
                line-height: 100px;
                transition: all 0.5s;
                margin-right: 0;
                &:hover{
                    color: #0099cc;
                    border: 1px solid #0099cc;
                }
            }
            &:hover .btn_close, &:hover .btn_setdefault{
                display: block;
            }
        }
    }
    .cropper_module{
        margin-bottom: 10px;
    }
    .cropper_box{
        box-sizing: border-box;
        display: inline-block;
        vertical-align: top;
        width: 600px+21px;
        height: 600px;
        padding-right: 20px;
        border-right: 1px dashed #ccc;
        margin-right: 20px;
    }
    .cropper_preview{
        display: inline-block;
        vertical-align: top;
        h5{
            text-align: left;
            font-size: 14px;
            margin-bottom: 6px;
            color: #333;
        }
    }
    .preview_info{
        margin-top: 20px;
    }
    .preview_body{
        border: 1px solid #ccc;
        overflow: hidden;
        width: 200px;
        height: 200px;
        .preview_wrap{
            width: 100%;height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                max-width: 100%;
                max-height: 100%;
            }
        }
        #cropImgPrev{
            max-width: 100%;
            max-height: 100%;
        }
    }
    .hidden{
        width: 0;
        height: 0;
        z-index: -1;
        overflow: hidden;
    }
    .options{
        .cus_btn{
            margin-right: 10px;
        }
    }
</style>

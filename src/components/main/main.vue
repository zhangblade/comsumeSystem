<template>
    <Layout :class="['layout_container', $store.state.app.customClass]">
      <div class="closeautocomplete" style="width: 0;height: 0;overflow: hidden;">
        <input type="password"/>
        <input type="text" autocomplete="off"/>
        <input id="password" class="form-control" type="password" name="tradePassword" autocomplete="new-password">
      </div>
      
      <Header class="layout_header">
          <header-bar>
              <user ref="userCom" class="cus_space" @fnShowDrawer="fnShowDrawer" :message-unread-count="unreadCount" :user-avatar="userAvatar"/>
              <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
          </header-bar>
      </Header>
      <div class="container_wrap">
          <Layout class="layout_main">

              <Content class="layout_main_content">
                
                <leftSubMenu v-if="!$route.meta.hideInMenu" ref="leftSubMenu" :subMenu="subMenu" @toggleSubMenu="toggleSubMenu"></leftSubMenu>

                <Content class="routerview_container">
                  <keep-alive :include="cacheList">
                    <router-view/>
                  </keep-alive>
                </Content>
                
                <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
              </Content>
              <!-- 修改密码 -->
              <Drawer :width="375" :transfer="false" :inner="true" title="修改密码" v-model="pwdDrawer.show" @on-close="closeDrawer('pwdDrawer')">
                  <Form ref="formCustom" :model="formCustom" :label-width="95" :rules="formRules">
                    <FormItem label="旧密码" prop="oldPwd">
                      <Input autocomplete="new-password" :type="pwdDrawer.showOld ? 'text': 'password'" :maxlength="16" v-model="formCustom.oldPwd" placeholder="请输入旧密码">
                        <Button :icon="pwdDrawer.showOld ? 'md-eye' : 'md-eye-off'" slot="append" @click="pwdDrawer.showOld = !pwdDrawer.showOld"></Button>
                      </Input>
                    </FormItem>
                    <FormItem label="新密码" prop="newPwd">
                      <Input autocomplete="new-password" :type="pwdDrawer.showNew ? 'text': 'password'" :maxlength="16" v-model="formCustom.newPwd" placeholder="请输入新密码">
                        <Button :icon="pwdDrawer.showNew ? 'md-eye' : 'md-eye-off'" slot="append" @click="pwdDrawer.showNew = !pwdDrawer.showNew"></Button>
                      </Input>
                    </FormItem>
                    <FormItem label="二次确认" prop="comfirmPwd">
                      <Input autocomplete="new-password" :type="pwdDrawer.showConfirm ? 'text': 'password'" :maxlength="16" v-model="formCustom.comfirmPwd" placeholder="请确认新密码">
                        <Button :icon="pwdDrawer.showConfirm ? 'md-eye' : 'md-eye-off'" slot="append" @click="pwdDrawer.showConfirm = !pwdDrawer.showConfirm"></Button>
                      </Input>
                    </FormItem>
                    
                    <FormItem>
                      <Button type="primary" :loading="pwdDrawer.isSubmitting" @click="fnChangePassword('formCustom')">提交</Button>
                      <Button type="default" style="margin-left: 20px;" @click="closeDrawer('pwdDrawer')">取消</Button>
                    </FormItem>

                  </Form>
              </Drawer>
          </Layout>
      </div>

    </Layout>
</template>
<script>
/* eslint-disable */
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual ,getMenuByData, showTitle } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import defaultLogo from '@/assets/images/profile-60x60.jpg'
import './main.less'
import { getMuneDate } from '@/api/data'
import commonIcon from '../common-icon/common-icon'

import Interface from '@/api/data'

import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'

import leftSubMenu from '@/components/common/leftSubMenu'
import mixin_leftSubMenu from '@/mixin/mixin_leftSubMenu'

import {encryptedData, publicKey} from '@/libs/util'

export default {
  name: 'Main',
  components: {
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop,
    commonIcon,
		leftSubMenu,
	},
	mixins: [ mixin_leftSubMenu ],
  data () {
    return {
      minLogo,
      maxLogo,
      defaultLogo,
      isFullscreen: false,
      homeMunueList:[],
      
			formRules: {
				oldPwd: [
					{ required: true, message: '请输入旧密码', trigger: 'blur' },
					{ type: 'string', min: 6, message: '密码至少为6位', trigger: 'blur' }
				],
				newPwd: [
					{ required: true, validator: this.validatePass, trigger: 'blur' },
				],
				comfirmPwd: [
					{ required: true, validator: this.validatePassCheck, trigger: 'blur' }
				],
			},
			formCustom: {
				oldPwd: '111111',
				newPwd: '123456',
				comfirmPwd: '123456',
			},
			pwdDrawer: {
				show: false,
				showOld: false,
				showNew: false,
				showConfirm: false,
				isSubmitting: false,
			},
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    },


  },
  
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      'getUnreadMessageCount'
    ]),
    // getMuneDate,
    turnToPage (route) {
      
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    showTitle (item) {
      return showTitle(item, this)
    },
    mobileTurnToPage(item){
      this.turnToPage(item)
    },
    getMenuList(callback){
      var userName = Cookies.get('userName')
      getMuneDate(userName).then(res => {
        if(res.status == "200"){
					this.$store.commit('setMainMenuList', getMenuByData(res.data))
					callback && callback()
        }
      })
    },
    handleupdateOpenName(name){
        this.$nextTick(()=>{
          if(this.$refs.leftSubMenu && this.$refs.leftSubMenu.$refs.side_menu && this.$refs.leftSubMenu.$refs.side_menu.updateOpenName){
            this.$refs.leftSubMenu.$refs.side_menu.updateOpenName(name)
          }
        })
    },
		validatePass(rule, value, callback){
			if (value === '') {
				callback(new Error('请输入密码'));
			} else if (value.length < 6 || value.length > 16) {
				callback(new Error('请输入6-16位密码'))
			} else {
				if (this.formCustom.comfirmPwd !== '') {
					this.$refs.formCustom.validateField('comfirmPwd');
				}
				callback();
			}
		},
		validatePassCheck(rule, value, callback){
			if (value === '') {
				callback(new Error('请输入密码'));
			} else if (value !== this.formCustom.newPwd) {
				callback(new Error('两次输入的密码不匹配!'));
			} else {
				callback();
			}
		},
		fnShowDrawer(drawerName){
			this[drawerName].show = true
		},
		closeDrawer(drawerName){
			this.pwdDrawer.show = false
			if(drawerName == 'pwdDrawer'){
				this.formCustom = {
					oldPwd: '',
					newPwd: '',
					comfirmPwd: '',
				}
				this.$refs.formCustom.resetFields()
			}
		},
		fnChangePassword(name){
			this.$refs[name].validate((valid) => {
				if (valid) {
					let req = {
						oldPwd: encryptedData(publicKey, this.formCustom.oldPwd),
						newPwd: encryptedData(publicKey, this.formCustom.newPwd),
					}
					this.pwdDrawer.isSubmitting = true
					Interface.common.resetPassword(req).then(res=>{
						this.closeDrawer('pwdDrawer')
						if (res.status == 200) {
							this.$Message.success('修改成功,请重新登录!')
							Cookies.remove(TOKEN_KEY)
							sessionStorage.clear()
							this.$router.push({name: 'login', query: { account: this.$store.state.user.userName }})
						}else{
              this.$Message.error(res.message)
            }
						this.pwdDrawer.isSubmitting = false
					}).catch(err=>{
						this.pwdDrawer.isSubmitting = false
					})
				}
			})
		},
  },
  watch: {
    $route: {
      handler(newRoute) {
        const { name, query, params, meta } = newRoute
        this.addTag({
          route: { name, query, params, meta },
          type: 'push'
        })
        this.setTagNavList(getNewTagList(this.tagNavList, newRoute))

        this.handleupdateOpenName(name)
      },
      deep: true,
			immediate: true,
    }
    
  },
  mounted () {
    this.getMenuList()
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    // this.setBreadCrumb(this.$route)
    // 设置初始语言
    // this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.replace({
        name: this.$config.homeName
      })
    }
    // 更新侧边栏展开状态
    this.handleupdateOpenName(name)
    

  }
}
</script>

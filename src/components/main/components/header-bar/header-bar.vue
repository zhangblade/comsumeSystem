<template>
  <div class="header-bar">
    <!-- 切换侧边栏菜单按钮 -->
    <!-- <a @click="handleCollpasedChange" type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']"><Icon :type="icon" :size="size" /></a> -->
    
    <!-- logo -->
    <router-link tag="div" class="logo" to="/"><img :src="defaultLogo" alt="logo"></router-link>
    <!-- 面包屑导航 -->
    <!-- <div class="custom-bread-crumb" style="margin-left: 30px;">
      <Breadcrumb :style="{fontSize: `${fontSize}px`}">
        <BreadcrumbItem v-for="item in breadCrumbList" :to="item.to" :key="`bread-crumb-${item.name}`">
          <CommonIcon style="margin-right: 4px;" :type="item.icon || ''"/>
          {{ showTitle(item) }}
        </BreadcrumbItem>
      </Breadcrumb>
    </div> -->
    
    <!-- 登录框、全屏按钮 -->
    <div class="custom-content-con">
      <slot></slot>
    </div>
    
  </div>
</template>
<script>
import { showTitle } from '@/libs/util'
import defaultLogo from '@/assets/images/logo-min.jpg'
import CommonIcon from '_c/common-icon'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    CommonIcon
  },
  data(){
    return {
      icon: 'md-menu',
      size: 26,
      defaultLogo: defaultLogo
    }
  },
  props: {
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    // collapsed: Boolean
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    },
    isCustomIcon (iconName) {
      this.showIcon = iconName.indexOf('_') == 0
    },
    getCustomIconName (iconName) {
      return iconName.slice(1)
    }
  }
}
</script>


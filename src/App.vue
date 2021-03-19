<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // 页面载入前恢复本地数据到store
    this.getDate();
    // 页面关闭时保存 store数据到本地 
    window.addEventListener("beforeunload", this.saveDate)
  },
  methods:{
    getDate(){
      if (localStorage.getItem("store")) {
        this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(localStorage.getItem("store"))))
      }
      // if (localStorage.getItem("routeParams")) {
      //   this.$store.replaceState(Object.assign({},JSON.parse(localStorage.getItem("routeParams"))))
      // }
    },
    saveDate(){
      localStorage.setItem("store",JSON.stringify(this.$store.state))
      // localStorage.setItem("routeParams",JSON.stringify(this.$route.params))
    }
  }
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  margin: 0;
  padding: 0;
  overflow: auto;
  // font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-family: 'Lato', sans-serif;
}
#app {
  .size;
}
// 框架风格样式修改
@import url('./components/common/common.less');
</style>
